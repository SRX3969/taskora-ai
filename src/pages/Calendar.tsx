import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  X,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

interface Event {
  id: number;
  title: string;
  time: string;
  duration: number;
  color: string;
  day: number;
}

const eventColors = [
  { label: "Primary", value: "bg-primary" },
  { label: "Accent", value: "bg-accent" },
  { label: "Info", value: "bg-info" },
  { label: "Success", value: "bg-success" },
  { label: "Warning", value: "bg-warning" },
];

export default function CalendarPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "9:00 AM",
    duration: 1,
    day: 1,
    color: "bg-primary"
  });

  const baseDate = 23 + weekOffset * 7;

  const goToToday = () => {
    setWeekOffset(0);
    toast({ title: "Calendar", description: "Navigated to current week" });
  };

  const createEvent = () => {
    if (!newEvent.title.trim()) {
      toast({ title: "Error", description: "Please enter an event title", variant: "destructive" });
      return;
    }

    const event: Event = {
      id: Date.now(),
      title: newEvent.title,
      time: newEvent.time,
      duration: newEvent.duration,
      day: newEvent.day,
      color: newEvent.color
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ title: "", time: "9:00 AM", duration: 1, day: 1, color: "bg-primary" });
    setIsDialogOpen(false);
    toast({ title: "Event created", description: newEvent.title });
  };

  const deleteEvent = (eventId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const event = events.find(ev => ev.id === eventId);
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
    toast({ title: "Event deleted", description: event?.title });
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Calendar" 
        subtitle={`December 2024${weekOffset !== 0 ? ` (Week ${weekOffset > 0 ? '+' : ''}${weekOffset})` : ''}`}
        action={
          <Button variant="hero" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            New Event
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
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
                onClick={() => {
                  setView(v);
                  toast({ title: `${v.charAt(0).toUpperCase() + v.slice(1)} view` });
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Week View */}
        <div className="border rounded-xl overflow-hidden bg-card">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-3 text-center text-sm text-muted-foreground border-r" />
            {days.map((day, idx) => {
              const date = baseDate + idx;
              const isToday = idx === 1 && weekOffset === 0;
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
                    {date > 31 ? date - 31 : date}
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
                    {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                  </span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {days.map((day, dayIdx) => {
              const isToday = dayIdx === 1 && weekOffset === 0;
              const dayEvents = events.filter(e => e.day === dayIdx);
              
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
                          time: hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`
                        }));
                        setIsDialogOpen(true);
                      }}
                    />
                  ))}
                  
                  {/* Events */}
                  {dayEvents.map((event) => {
                    const startHour = parseInt(event.time.split(":")[0]);
                    const isPM = event.time.includes("PM");
                    const hourOffset = (isPM && startHour !== 12 ? startHour + 12 : startHour) - 8;
                    
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute left-1 right-1 rounded-md p-2 text-xs text-white cursor-pointer hover:opacity-90 transition-opacity group",
                          event.color
                        )}
                        style={{
                          top: `${hourOffset * 64 + 4}px`,
                          height: `${event.duration * 64 - 8}px`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => deleteEvent(event.id, e)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="opacity-80">{event.time}</p>
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
                  placeholder="9:00 AM"
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
                      color.value,
                      newEvent.color === color.value && "ring-2 ring-offset-2 ring-primary"
                    )}
                    onClick={() => setNewEvent(prev => ({ ...prev, color: color.value }))}
                  />
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={createEvent}>Create Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
