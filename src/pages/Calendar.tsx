import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  X,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek, addWeeks } from "date-fns";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const eventColors = [
  { label: "Primary", value: "#4F46E5" },
  { label: "Accent", value: "#F59E0B" },
  { label: "Info", value: "#3B82F6" },
  { label: "Success", value: "#10B981" },
  { label: "Warning", value: "#EF4444" },
];

export default function CalendarPage() {
  const { events, isLoading, createEvent, deleteEvent } = useCalendarEvents();
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "09:00",
    duration: 1,
    day: 1,
    color: "#4F46E5"
  });

  const baseDate = addWeeks(startOfWeek(new Date()), weekOffset);

  const goToToday = () => {
    setWeekOffset(0);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return;

    const eventDate = addDays(baseDate, newEvent.day);
    const [hours, minutes] = newEvent.time.split(':').map(Number);
    
    const startTime = new Date(eventDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + newEvent.duration);

    createEvent.mutate({
      title: newEvent.title,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      color: newEvent.color,
    });

    setNewEvent({ title: "", time: "09:00", duration: 1, day: 1, color: "#4F46E5" });
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent.mutate(eventId);
  };

  const getEventsForDay = (dayIndex: number) => {
    const dayDate = addDays(baseDate, dayIndex);
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppHeader 
        title="Calendar" 
        subtitle={format(baseDate, "MMMM yyyy")}
        action={
          <Button variant="hero" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Event
          </Button>
        }
      />
      
      <div className="p-4 md:p-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekOffset(prev => prev - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setWeekOffset(prev => prev + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
          </div>
          <div className="flex gap-1">
            {(['day', 'week', 'month'] as const).map((v) => (
              <Button
                key={v}
                variant={view === v ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Week View */}
        <div className="border rounded-xl overflow-x-auto bg-card">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-3 text-center text-sm text-muted-foreground border-r" />
            {days.map((day, idx) => {
              const date = addDays(baseDate, idx);
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div 
                  key={day} 
                  className={cn(
                    "p-3 text-center border-r last:border-r-0 cursor-pointer hover:bg-secondary/50 transition-colors",
                    isToday && "bg-primary/5"
                  )}
                  onClick={() => {
                    setNewEvent(prev => ({ ...prev, day: idx }));
                    setIsDialogOpen(true);
                  }}
                >
                  <p className="text-sm text-muted-foreground">{day}</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    isToday && "text-primary"
                  )}>
                    {format(date, "d")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-8">
            {/* Time Column */}
            <div className="border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b last:border-b-0 px-2 py-1">
                  <span className="text-xs text-muted-foreground">
                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {days.map((day, dayIdx) => {
              const date = addDays(baseDate, dayIdx);
              const isToday = date.toDateString() === new Date().toDateString();
              const dayEvents = getEventsForDay(dayIdx);
              
              return (
                <div 
                  key={day} 
                  className={cn(
                    "relative border-r last:border-r-0",
                    isToday && "bg-primary/5"
                  )}
                >
                  {hours.map((hour) => (
                    <div 
                      key={hour} 
                      className="h-16 border-b last:border-b-0 hover:bg-secondary/30 cursor-pointer transition-colors"
                      onClick={() => {
                        setNewEvent(prev => ({ 
                          ...prev, 
                          day: dayIdx,
                          time: `${hour.toString().padStart(2, '0')}:00`
                        }));
                        setIsDialogOpen(true);
                      }}
                    />
                  ))}
                  
                  {/* Events */}
                  {dayEvents.map((event) => {
                    const startTime = new Date(event.start_time);
                    const endTime = new Date(event.end_time);
                    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                    const hourOffset = startHour - 8;
                    
                    if (hourOffset < 0 || hourOffset >= 12) return null;
                    
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-md p-2 text-xs text-white cursor-pointer hover:opacity-90 transition-opacity group"
                        style={{
                          backgroundColor: event.color,
                          top: `${hourOffset * 64 + 4}px`,
                          height: `${Math.min(duration, 12 - hourOffset) * 64 - 8}px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteEvent(event.id, e)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="opacity-80">{format(startTime, "h:mm a")}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground mb-2">No events scheduled</p>
            <p className="text-xs text-muted-foreground">Click on any time slot to create an event</p>
          </div>
        )}
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Title</Label>
              <Input 
                id="eventTitle" 
                placeholder="Event title..."
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <div className="flex flex-wrap gap-1">
                  {days.map((day, idx) => (
                    <Button
                      key={day}
                      variant={newEvent.day === idx ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewEvent(prev => ({ ...prev, day: idx }))}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime">Time</Label>
                <Input 
                  id="eventTime" 
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {eventColors.map(color => (
                  <button
                    key={color.value}
                    className={cn(
                      "w-8 h-8 rounded-full transition-transform hover:scale-110",
                      newEvent.color === color.value && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewEvent(prev => ({ ...prev, color: color.value }))}
                  />
                ))}
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCreateEvent}
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
