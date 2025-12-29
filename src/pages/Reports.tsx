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
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Tasks Completed",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: CheckSquare,
    color: "text-success"
  },
  {
    title: "Meetings Attended",
    value: "18",
    change: "-5%",
    trend: "down",
    icon: Calendar,
    color: "text-accent"
  },
  {
    title: "Messages Sent",
    value: "234",
    change: "+28%",
    trend: "up",
    icon: MessageSquare,
    color: "text-info"
  },
  {
    title: "Focus Hours",
    value: "32h",
    change: "+8%",
    trend: "up",
    icon: Clock,
    color: "text-primary"
  },
];

const weeklyData = [
  { day: "Mon", tasks: 8, hours: 6 },
  { day: "Tue", tasks: 12, hours: 7 },
  { day: "Wed", tasks: 6, hours: 5 },
  { day: "Thu", tasks: 10, hours: 8 },
  { day: "Fri", tasks: 11, hours: 6 },
];

const teamActivity = [
  { name: "Sarah Chen", tasks: 24, avatar: "sarah" },
  { name: "Jordan Lee", tasks: 21, avatar: "jordan" },
  { name: "Alex Morgan", tasks: 18, avatar: "alex" },
  { name: "Taylor Kim", tasks: 15, avatar: "taylor" },
];

export default function Reports() {
  return (
    <AppLayout>
      <AppHeader 
        title="Reports" 
        subtitle="Productivity insights and analytics"
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">This Week</Button>
          <Button variant="ghost" size="sm">Last Week</Button>
          <Button variant="ghost" size="sm">This Month</Button>
          <Button variant="ghost" size="sm">Custom</Button>
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
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  )}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

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
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1">
                      <div 
                        className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                        style={{ height: `${day.tasks * 10}px` }}
                        title={`${day.tasks} tasks`}
                      />
                      <div 
                        className="w-full bg-accent/50 rounded-b transition-all hover:opacity-80"
                        style={{ height: `${day.hours * 12}px` }}
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
              <div className="space-y-4">
                {teamActivity.map((member, index) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{member.name}</span>
                        <span className="text-sm text-muted-foreground">{member.tasks} tasks</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all"
                          style={{ width: `${(member.tasks / 24) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card variant="feature" className="animate-fade-up animation-delay-400">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">AI Insights</CardTitle>
              <p className="text-sm text-muted-foreground">Based on your activity this week</p>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-success">•</span>
                <span>Your task completion rate improved by 12% compared to last week. Great job!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning">•</span>
                <span>Wednesday had lower productivity. Consider blocking focus time on Wednesdays.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info">•</span>
                <span>You're most productive between 9-11 AM. Schedule complex tasks during this time.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
