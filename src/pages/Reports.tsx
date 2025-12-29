import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  CheckSquare, 
  Calendar, 
  MessageSquare,
  Clock,
  Target,
  Users,
  Download,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("this-week");

  // In a real app, these would come from actual data
  const stats = [
    {
      title: "Tasks Completed",
      value: "0",
      change: "0%",
      trend: "neutral",
      icon: CheckSquare,
      color: "text-success"
    },
    {
      title: "Meetings Attended",
      value: "0",
      change: "0%",
      trend: "neutral",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Messages Sent",
      value: "0",
      change: "0%",
      trend: "neutral",
      icon: MessageSquare,
      color: "text-info"
    },
    {
      title: "Focus Hours",
      value: "0h",
      change: "0%",
      trend: "neutral",
      icon: Clock,
      color: "text-primary"
    },
  ];

  const weeklyData = [
    { day: "Mon", tasks: 0, hours: 0 },
    { day: "Tue", tasks: 0, hours: 0 },
    { day: "Wed", tasks: 0, hours: 0 },
    { day: "Thu", tasks: 0, hours: 0 },
    { day: "Fri", tasks: 0, hours: 0 },
  ];

  const handleExport = () => {
    toast({ 
      title: "Export started", 
      description: "Your report will be downloaded shortly" 
    });
  };

  const hasData = stats.some(s => s.value !== "0" && s.value !== "0h");

  return (
    <AppLayout>
      <AppHeader 
        title="Reports" 
        subtitle="Productivity insights and analytics"
        action={
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[
            { id: "this-week", label: "This Week" },
            { id: "last-week", label: "Last Week" },
            { id: "this-month", label: "This Month" },
            { id: "custom", label: "Custom" },
          ].map(range => (
            <Button 
              key={range.id}
              variant={timeRange === range.id ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange(range.id)}
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              variant="elevated"
              className="animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    stat.trend === "up" ? "text-success" : 
                    stat.trend === "down" ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : stat.trend === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {stat.change}
                  </div>
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
                Start using Proddy to track tasks, schedule events, and send messages. 
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
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 h-48">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col gap-1">
                        <div 
                          className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                          style={{ height: `${Math.max(day.tasks * 10, 4)}px` }}
                          title={`${day.tasks} tasks`}
                        />
                        <div 
                          className="w-full bg-accent/50 rounded-b transition-all hover:opacity-80"
                          style={{ height: `${Math.max(day.hours * 12, 4)}px` }}
                          title={`${day.hours}h focus time`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span className="text-xs text-muted-foreground">Tasks Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent/50 rounded" />
                    <span className="text-xs text-muted-foreground">Focus Hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Activity */}
            <Card className="animate-fade-up animation-delay-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-sm text-muted-foreground">No team activity yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Invite team members to see their activity</p>
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
                <li className="flex items-start gap-2">
                  <span className="text-info">•</span>
                  <span>Start tracking your tasks and activities to receive personalized productivity insights.</span>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete tasks, attend meetings, and use the platform regularly to receive AI-powered insights 
                about your productivity patterns and recommendations for improvement.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
