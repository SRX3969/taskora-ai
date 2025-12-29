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
  Users,
  Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  time: string;
  completed: boolean;
}

interface Event {
  id: number;
  title: string;
  time: string;
  attendees: number;
}

interface Message {
  id: number;
  channel: string;
  message: string;
  time: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
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
      description: "Opening AI Assistant...",
    });
    navigate("/ai-assistant");
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Welcome to Proddy" 
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
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{events.length > 0 ? "Events scheduled" : "No meetings"}</span>
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
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-info" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>Start chatting</span>
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
                  <p className="text-sm text-muted-foreground">AI Assistant</p>
                  <p className="text-2xl font-bold">Ready</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-primary">
                <span>Ask anything</span>
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
              <CardTitle className="text-base">AI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">Your intelligent workspace companion</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {tasks.length === 0 && events.length === 0 
                ? "Welcome! Start by creating tasks, scheduling events, or chatting with the AI assistant to get personalized insights about your productivity."
                : `You have ${tasks.length} tasks and ${events.length} events today. Ask me anything about your workspace!`
              }
            </p>
            <Button variant="outline" size="sm" onClick={viewFullSummary}>
              Chat with AI
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
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No tasks yet</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Create Task
                  </Button>
                </div>
              ) : (
                tasks.map((task) => (
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
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="animate-fade-up animation-delay-600">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No events scheduled</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              ) : (
                events.map((event) => (
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
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="animate-fade-up animation-delay-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/messaging")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No messages yet</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/messaging")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Start Chat
                  </Button>
                </div>
              ) : (
                messages.map((msg) => (
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
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
