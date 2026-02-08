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
  Plus,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { useMessages } from "@/hooks/useMessages";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { messages, isLoading: messagesLoading } = useMessages();
  const { events, isLoading: eventsLoading } = useCalendarEvents();
  
  const isLoading = tasksLoading || messagesLoading || eventsLoading;
  const completedCount = tasks.filter(t => t.status === "done").length;
  const todaysTasks = tasks.filter(t => t.status !== "done").slice(0, 5);
  const recentMessages = messages.slice(-5).reverse();
  const upcomingEvents = events.slice(0, 5);

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
        title="Welcome to Taskora AI" 
        subtitle="Here's what's happening today"
      />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card 
            variant="elevated" 
            className="animate-fade-up cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/tasks")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length - completedCount}</p>
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
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{events.length > 0 ? "Events scheduled" : "No events"}</span>
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
                <span>{messages.length > 0 ? "Active conversations" : "Start chatting"}</span>
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
                : `You have ${tasks.length - completedCount} active tasks and ${events.length} events scheduled. Ask me anything about your workspace!`
              }
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/ai-assistant")}>
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
              <CardTitle className="text-base">Active Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No active tasks</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Create Task
                  </Button>
                </div>
              ) : (
                todaysTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/tasks")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(task.created_at), "MMM d")}
                      </p>
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
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No events scheduled</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/calendar")}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${event.color}20` }}
                    >
                      <Calendar className="w-5 h-5" style={{ color: event.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.start_time), "MMM d, h:mm a")}
                      </p>
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
              {recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No messages yet</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/messaging")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Start Chat
                  </Button>
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/messaging")}
                  >
                    <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary">#{msg.channel}</p>
                      <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(msg.created_at), "h:mm a")}
                    </span>
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
