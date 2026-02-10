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
  Loader2,
  Sparkles,
  Lightbulb,
  Zap,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "@/hooks/useTasks";
import { useMessages } from "@/hooks/useMessages";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useProfile } from "@/hooks/useProfile";
import { format, isToday, isTomorrow } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { messages, isLoading: messagesLoading } = useMessages();
  const { events, isLoading: eventsLoading } = useCalendarEvents();
  const { profile } = useProfile();

  const isLoading = tasksLoading || messagesLoading || eventsLoading;
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const activeTasks = tasks.filter((t) => t.status !== "done");
  const highPriorityTasks = activeTasks.filter((t) => t.priority === "high");
  const todaysTasks = activeTasks.slice(0, 5);
  const recentMessages = messages.slice(-5).reverse();
  const upcomingEvents = events.slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const userName = profile?.full_name?.split(" ")[0] || "there";

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
        title={`${getGreeting()}, ${userName}`}
        subtitle={format(new Date(), "EEEE, MMMM d, yyyy")}
      />

      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card
            variant="interactive"
            className="animate-fade-up group"
            onClick={() => navigate("/tasks")}
          >
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <CheckSquare className="w-5 h-5 text-primary" />
                </div>
                {highPriorityTasks.length > 0 && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    {highPriorityTasks.length} urgent
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active tasks</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{completedCount} done</span>
              </div>
            </CardContent>
          </Card>

          <Card
            variant="interactive"
            className="animate-fade-up animation-delay-100 group"
            onClick={() => navigate("/calendar")}
          >
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
              </div>
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upcoming events</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{events.length > 0 ? "Scheduled" : "None yet"}</span>
              </div>
            </CardContent>
          </Card>

          <Card
            variant="interactive"
            className="animate-fade-up animation-delay-200 group"
            onClick={() => navigate("/messaging")}
          >
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info/15 transition-colors">
                  <MessageSquare className="w-5 h-5 text-info" />
                </div>
              </div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Messages</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{messages.length > 0 ? "Active" : "Start chatting"}</span>
              </div>
            </CardContent>
          </Card>

          <Card
            variant="interactive"
            className="animate-fade-up animation-delay-300 group"
            onClick={() => navigate("/reports")}
          >
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/15 transition-colors">
                  <BarChart3 className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Completion rate</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                <Zap className="w-3 h-3" />
                <span>View reports</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Daily Recap + AI Suggestions row */}
        <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
          {/* Daily Recap - wider */}
          <Card variant="feature" className="lg:col-span-3 animate-fade-up animation-delay-400 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <CardHeader className="flex flex-row items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">Daily Recap</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">AI-generated summary of your day</p>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="bg-secondary/40 rounded-xl p-4 mb-4 border border-border/30">
                {tasks.length === 0 && events.length === 0 && messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Welcome to Taskora AI! Start by creating tasks, scheduling events, or chatting with your team. Your daily recap will appear here with AI-powered insights.
                  </p>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      📊 You have <span className="font-semibold text-primary">{activeTasks.length} active tasks</span>
                      {highPriorityTasks.length > 0 && (
                        <>, with <span className="font-semibold text-destructive">{highPriorityTasks.length} high priority</span></>
                      )}
                      . {completedCount > 0 && <><span className="font-semibold text-success">{completedCount} tasks</span> completed so far.</>}
                    </p>
                    {events.length > 0 && (
                      <p className="text-foreground">
                        📅 <span className="font-semibold">{events.length} events</span> on your calendar.
                      </p>
                    )}
                    {messages.length > 0 && (
                      <p className="text-foreground">
                        💬 <span className="font-semibold">{messages.length} messages</span> across your channels.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/ai-assistant")} className="gap-2">
                <Bot className="w-4 h-4" />
                Ask AI for details
                <ArrowRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="lg:col-span-2 animate-fade-up animation-delay-500 overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <CardHeader className="flex flex-row items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">AI Suggestions</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Recommended next actions</p>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-2.5">
              {activeTasks.length === 0 ? (
                <button
                  onClick={() => navigate("/tasks")}
                  className="w-full flex items-start gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors text-left border border-border/30"
                >
                  <Plus className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Create your first task</p>
                    <p className="text-xs text-muted-foreground">Get started with your productivity journey</p>
                  </div>
                </button>
              ) : (
                <>
                  {highPriorityTasks.length > 0 && (
                    <button
                      onClick={() => navigate("/tasks")}
                      className="w-full flex items-start gap-3 p-3 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors text-left border border-destructive/10"
                    >
                      <Zap className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Focus on urgent tasks</p>
                        <p className="text-xs text-muted-foreground">{highPriorityTasks.length} high-priority task{highPriorityTasks.length > 1 ? "s" : ""} need attention</p>
                      </div>
                    </button>
                  )}
                  {events.length === 0 && (
                    <button
                      onClick={() => navigate("/calendar")}
                      className="w-full flex items-start gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors text-left border border-border/30"
                    >
                      <Calendar className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Schedule your week</p>
                        <p className="text-xs text-muted-foreground">Add events to stay organized</p>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/ai-assistant")}
                    className="w-full flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-left border border-primary/10"
                  >
                    <Bot className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Get AI productivity tips</p>
                      <p className="text-xs text-muted-foreground">Let AI analyze your workflow</p>
                    </div>
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Task Overview + Events + Messages */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Task Overview */}
          <Card className="animate-fade-up">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Task Overview</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")} className="text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {todaysTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">All caught up!</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                    <Plus className="w-4 h-4 mr-1" />
                    New Task
                  </Button>
                </div>
              ) : (
                todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    onClick={() => navigate("/tasks")}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.due_date
                          ? isToday(new Date(task.due_date))
                            ? "Due today"
                            : isTomorrow(new Date(task.due_date))
                              ? "Due tomorrow"
                              : format(new Date(task.due_date), "MMM d")
                          : format(new Date(task.created_at), "MMM d")}
                      </p>
                    </div>
                    <Badge
                      variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "warning" : "ghost"}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="animate-fade-up animation-delay-100">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <CardTitle className="text-base">Upcoming Events</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")} className="text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No upcoming events</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    onClick={() => navigate("/calendar")}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${event.color || "hsl(var(--accent))"}20` }}
                    >
                      <Calendar className="w-4 h-4" style={{ color: event.color || "hsl(var(--accent))" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{event.title}</p>
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
          <Card className="animate-fade-up animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-info" />
                <CardTitle className="text-base">Recent Messages</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/messaging")} className="text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
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
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    onClick={() => navigate("/messaging")}
                  >
                    <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary">#{msg.channel}</p>
                      <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
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
