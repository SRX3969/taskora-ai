import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { 
  TrendingUp, 
  CheckSquare, 
  Calendar, 
  MessageSquare,
  Clock,
  Target,
  Users,
  Download,
  BarChart3,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useReports } from "@/hooks/useReports";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

type DateRangeType = "this_week" | "last_week" | "this_month" | "custom";
type DetailType = "tasks" | "meetings" | "messages" | null;

export default function Reports() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<DateRangeType>("this_week");
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [detailType, setDetailType] = useState<DetailType>(null);
  
  const { stats, weeklyData, isLoading } = useReports(
    timeRange, 
    customDateRange.from, 
    customDateRange.to
  );

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case "this_week":
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case "last_week":
        const lastWeek = subWeeks(now, 1);
        return { start: startOfWeek(lastWeek, { weekStartsOn: 1 }), end: endOfWeek(lastWeek, { weekStartsOn: 1 }) };
      case "this_month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "custom":
        return { start: customDateRange.from || now, end: customDateRange.to || now };
      default:
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    }
  };

  const { start, end } = getDateRange();

  // Fetch completed tasks for the date range
  const { data: completedTasks = [] } = useQuery({
    queryKey: ["completed_tasks", user?.id, timeRange, start, end],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("completed_at", start.toISOString())
        .lte("completed_at", end.toISOString())
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && detailType === "tasks",
  });

  // Fetch meetings (calendar events) for the date range
  const { data: meetings = [] } = useQuery({
    queryKey: ["meetings", user?.id, timeRange, start, end],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_time", start.toISOString())
        .lte("start_time", end.toISOString())
        .order("start_time", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && detailType === "meetings",
  });

  // Fetch messages for the date range
  const { data: messages = [] } = useQuery({
    queryKey: ["messages_report", user?.id, timeRange, start, end],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && detailType === "messages",
  });

  const statCards = [
    {
      title: "Tasks Completed",
      value: stats.tasksCompleted.toString(),
      icon: CheckSquare,
      color: "text-success",
      type: "tasks" as const,
      clickable: true
    },
    {
      title: "Meetings Attended",
      value: stats.meetingsAttended.toString(),
      icon: Calendar,
      color: "text-accent",
      type: "meetings" as const,
      clickable: true
    },
    {
      title: "Messages Sent",
      value: stats.messagesSent.toString(),
      icon: MessageSquare,
      color: "text-info",
      type: "messages" as const,
      clickable: true
    },
    {
      title: "Focus Hours",
      value: `${stats.focusHours}h`,
      icon: Clock,
      color: "text-primary",
      type: null,
      clickable: false
    },
  ];

  const handleExport = () => {
    const reportData = {
      dateRange: timeRange,
      stats,
      weeklyData,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskora-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ 
      title: "Report exported", 
      description: "Your report has been downloaded" 
    });
  };

  const hasData = stats.tasksCompleted > 0 || stats.messagesSent > 0 || 
                  stats.meetingsAttended > 0 || stats.focusHours > 0;

  const timeRanges = [
    { id: "this_week" as const, label: "This Week" },
    { id: "last_week" as const, label: "Last Week" },
    { id: "this_month" as const, label: "This Month" },
    { id: "custom" as const, label: "Custom" },
  ];

  const getDialogTitle = () => {
    switch (detailType) {
      case "tasks": return "Completed Tasks";
      case "meetings": return "Meetings Attended";
      case "messages": return "Messages Sent";
      default: return "";
    }
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Reports" 
        subtitle="Productivity insights and analytics"
        action={
          <Button variant="outline" size="sm" onClick={handleExport} disabled={!hasData}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-2 items-center">
          {timeRanges.map(range => (
            <Button 
              key={range.id}
              variant={timeRange === range.id ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange(range.id)}
            >
              {range.label}
            </Button>
          ))}
          
          {timeRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {customDateRange.from && customDateRange.to 
                    ? `${format(customDateRange.from, 'MMM d')} - ${format(customDateRange.to, 'MMM d, yyyy')}`
                    : "Select dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{ from: customDateRange.from, to: customDateRange.to }}
                  onSelect={(range) => setCustomDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <Card 
                  key={stat.title} 
                  variant="elevated"
                  className={cn(
                    "animate-fade-up",
                    stat.clickable && parseInt(stat.value) > 0 && "cursor-pointer hover:border-primary/50 transition-colors"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    if (stat.clickable && stat.type && parseInt(stat.value) > 0) {
                      setDetailType(stat.type);
                    }
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                      {stat.clickable && parseInt(stat.value) > 0 && (
                        <span className="text-xs text-muted-foreground">Click to view</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!hasData ? (
              <Card className="animate-fade-up">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No data yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Start using Taskora AI to track tasks, schedule events, and send messages. 
                    Your productivity insights will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Weekly Overview Chart */}
                <Card className="animate-fade-up animation-delay-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Activity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {weeklyData.length > 0 ? (
                      <>
                        <div className="flex items-end gap-2 h-48">
                          {weeklyData.map((day, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full flex flex-col gap-1">
                                <div 
                                  className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                                  style={{ height: `${Math.max(day.tasks * 20, 4)}px` }}
                                  title={`${day.tasks} tasks`}
                                />
                                <div 
                                  className="w-full bg-accent/50 transition-all hover:opacity-80"
                                  style={{ height: `${Math.max(day.meetings * 20, 4)}px` }}
                                  title={`${day.meetings} meetings`}
                                />
                                <div 
                                  className="w-full bg-info/50 rounded-b transition-all hover:opacity-80"
                                  style={{ height: `${Math.max(day.messages * 2, 4)}px` }}
                                  title={`${day.messages} messages`}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{day.day}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded" />
                            <span className="text-xs text-muted-foreground">Tasks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-accent/50 rounded" />
                            <span className="text-xs text-muted-foreground">Meetings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-info/50 rounded" />
                            <span className="text-xs text-muted-foreground">Messages</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <p className="text-sm text-muted-foreground">No daily breakdown available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary Card */}
                <Card className="animate-fade-up animation-delay-300">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg bg-muted/50",
                          stats.tasksCompleted > 0 && "cursor-pointer hover:bg-muted transition-colors"
                        )}
                        onClick={() => stats.tasksCompleted > 0 && setDetailType("tasks")}
                      >
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-4 h-4 text-success" />
                          <span className="text-sm">Total Tasks Completed</span>
                        </div>
                        <span className="font-semibold">{stats.tasksCompleted}</span>
                      </div>
                      <div 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg bg-muted/50",
                          stats.meetingsAttended > 0 && "cursor-pointer hover:bg-muted transition-colors"
                        )}
                        onClick={() => stats.meetingsAttended > 0 && setDetailType("meetings")}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span className="text-sm">Meetings Attended</span>
                        </div>
                        <span className="font-semibold">{stats.meetingsAttended}</span>
                      </div>
                      <div 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg bg-muted/50",
                          stats.messagesSent > 0 && "cursor-pointer hover:bg-muted transition-colors"
                        )}
                        onClick={() => stats.messagesSent > 0 && setDetailType("messages")}
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-info" />
                          <span className="text-sm">Messages Sent</span>
                        </div>
                        <span className="font-semibold">{stats.messagesSent}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">Focus Hours</span>
                        </div>
                        <span className="font-semibold">{stats.focusHours}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Insights */}
            <Card variant="feature" className="animate-fade-up animation-delay-400">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Insights</CardTitle>
                  <p className="text-sm text-muted-foreground">Personalized recommendations</p>
                </div>
              </CardHeader>
              <CardContent>
                {hasData ? (
                  <ul className="space-y-2 text-sm">
                    {stats.tasksCompleted > 5 && (
                      <li className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span>Great productivity! You've completed {stats.tasksCompleted} tasks this period.</span>
                      </li>
                    )}
                    {stats.focusHours > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>You've logged {stats.focusHours} hours of focus time. Keep it up!</span>
                      </li>
                    )}
                    {stats.meetingsAttended > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>You attended {stats.meetingsAttended} meetings. Consider blocking focus time between meetings.</span>
                      </li>
                    )}
                    {stats.tasksCompleted === 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-info">•</span>
                        <span>Try breaking down larger projects into smaller tasks to boost your completion rate.</span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete tasks, attend meetings, and use the platform regularly to receive AI-powered insights 
                    about your productivity patterns and recommendations for improvement.
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailType !== null} onOpenChange={(open) => !open && setDetailType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailType === "tasks" && <CheckSquare className="w-5 h-5 text-success" />}
              {detailType === "meetings" && <Calendar className="w-5 h-5 text-accent" />}
              {detailType === "messages" && <MessageSquare className="w-5 h-5 text-info" />}
              {getDialogTitle()}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-4">
              {detailType === "tasks" && completedTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                      )}
                    </div>
                    {task.priority && (
                      <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  {task.completed_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Completed {format(new Date(task.completed_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                </div>
              ))}

              {detailType === "meetings" && meetings.map((meeting) => (
                <div key={meeting.id} className="p-3 rounded-lg border bg-card">
                  <p className="font-medium">{meeting.title}</p>
                  {meeting.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{meeting.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(meeting.start_time), 'MMM d, yyyy h:mm a')} - {format(new Date(meeting.end_time), 'h:mm a')}
                  </p>
                </div>
              ))}

              {detailType === "messages" && messages.map((message) => (
                <div key={message.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{message.channel}</Badge>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}

              {detailType === "tasks" && completedTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No completed tasks in this period</p>
              )}
              {detailType === "meetings" && meetings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No meetings in this period</p>
              )}
              {detailType === "messages" && messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No messages in this period</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
