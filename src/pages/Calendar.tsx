import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

const events = [
  { id: 1, title: "Design Review", time: "10:00 AM", duration: 1, color: "bg-primary", day: 1 },
  { id: 2, title: "Sprint Planning", time: "2:00 PM", duration: 2, color: "bg-accent", day: 2 },
  { id: 3, title: "Team Standup", time: "9:00 AM", duration: 0.5, color: "bg-info", day: 1 },
  { id: 4, title: "Team Standup", time: "9:00 AM", duration: 0.5, color: "bg-info", day: 3 },
  { id: 5, title: "Client Call", time: "3:00 PM", duration: 1, color: "bg-success", day: 4 },
];

export default function CalendarPage() {
  return (
    <AppLayout>
      <AppHeader 
        title="Calendar" 
        subtitle="December 2024"
        action={
          <Button variant="hero" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Event
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">Today</Button>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">Day</Button>
            <Button variant="secondary" size="sm">Week</Button>
            <Button variant="ghost" size="sm">Month</Button>
          </div>
        </div>

        {/* Week View */}
        <div className="border rounded-xl overflow-hidden bg-card">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-3 text-center text-sm text-muted-foreground border-r" />
            {days.map((day, idx) => {
              const date = 23 + idx; // Example dates
              const isToday = idx === 1;
              return (
                <div 
                  key={day} 
                  className={cn(
                    "p-3 text-center border-r last:border-r-0",
                    isToday && "bg-primary/5"
                  )}
                >
                  <p className="text-sm text-muted-foreground">{day}</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    isToday && "text-primary"
                  )}>
                    {date}
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
              const isToday = dayIdx === 1;
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
                    <div key={hour} className="h-16 border-b last:border-b-0" />
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
                          "absolute left-1 right-1 rounded-md p-2 text-xs text-white cursor-pointer hover:opacity-90 transition-opacity",
                          event.color
                        )}
                        style={{
                          top: `${hourOffset * 64 + 4}px`,
                          height: `${event.duration * 64 - 8}px`,
                        }}
                      >
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
      </div>
    </AppLayout>
  );
}
