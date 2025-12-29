import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Bot,
  ArrowRight,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const initialTasks = [
  { id: 1, title: "Review Q4 marketing strategy", priority: "high", time: "10:00 AM", completed: false },
  { id: 2, title: "Team standup meeting", priority: "medium", time: "11:00 AM", completed: false },
  { id: 3, title: "Update product roadmap", priority: "low", time: "2:00 PM", completed: false },
];

const upcomingEvents = [
  { id: 1, title: "Design Review", time: "Today, 3:00 PM", attendees: 4 },
  { id: 2, title: "Sprint Planning", time: "Tomorrow, 10:00 AM", attendees: 8 },
];

const recentMessages = [
  { id: 1, channel: "#design", message: "New mockups ready for review", time: "5 min ago" },
  { id: 2, channel: "#engineering", message: "Deployment complete", time: "1 hour ago" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState(initialTasks);
  const completedCount = tasks.filter(t => t.completed).length;

  const toggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    toast({
      title: task?.completed ? "Task uncompleted" : "Task completed!",
      description: task?.title,
    });
  };

  const viewFullSummary = () => {
    toast({
      title: "AI Summary",
      description: "Opening full daily summary...",
    });
    navigate("/ai-assistant");
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Good morning, Alex" 
        subtitle="Here's what's happening today"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card 
            variant="elevated" 
            className="animate-fade-up cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/tasks")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Due Today</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{completedCount} completed</span>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="elevated" 
            className="animate-fade-up animation-delay-100 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/calendar")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Meetings</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Next in 2 hours</span>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="elevated" 
            className="animate-fade-up animation-delay-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/messaging")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-info" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>3 channels</span>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            variant="elevated" 
            className="animate-fade-up animation-delay-300 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/ai-assistant")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Suggestions</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-primary">
                <span>View insights</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Daily Summary */}
        <Card variant="feature" className="animate-fade-up animation-delay-400">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">AI Daily Summary</CardTitle>
              <p className="text-sm text-muted-foreground">Updated 10 minutes ago</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Today you have <span className="text-foreground font-medium">{tasks.length} tasks</span> due and{" "}
              <span className="text-foreground font-medium">4 meetings</span> scheduled. 
              The design team shared new mockups in #design that need your review. 
              Consider prioritizing the Q4 marketing strategy review before your 11 AM standup.
            </p>
            <Button variant="outline" size="sm" onClick={viewFullSummary}>
              View Full Summary
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card className="animate-fade-up animation-delay-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Today's Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-border cursor-pointer" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{task.time}</p>
                  </div>
                  <Badge 
                    variant={
                      task.priority === "high" ? "destructive" : 
                      task.priority === "medium" ? "warning" : "ghost"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="animate-fade-up animation-delay-600">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    toast({ title: "Event Details", description: `Opening ${event.title}...` });
                    navigate("/calendar");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {event.attendees}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="animate-fade-up animation-delay-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/messaging")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    toast({ title: "Opening Channel", description: msg.channel });
                    navigate("/messaging");
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary">{msg.channel}</p>
                    <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
