import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Filter, 
  MoreVertical,
  Calendar,
  CheckCircle2,
  Circle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
  {
    id: 1,
    title: "Review Q4 marketing strategy",
    description: "Go through the presentation and provide feedback",
    status: "in-progress",
    priority: "high",
    dueDate: "Today",
    assignee: { name: "Alex", avatar: "alex" }
  },
  {
    id: 2,
    title: "Update product roadmap",
    description: "Add new features from last sprint planning",
    status: "todo",
    priority: "medium",
    dueDate: "Tomorrow",
    assignee: { name: "Sarah", avatar: "sarah" }
  },
  {
    id: 3,
    title: "Fix dashboard loading issue",
    description: "Investigate slow loading times on the main dashboard",
    status: "in-progress",
    priority: "high",
    dueDate: "Today",
    assignee: { name: "Jordan", avatar: "jordan" }
  },
  {
    id: 4,
    title: "Prepare team demo",
    description: "Create slides for the weekly team demo",
    status: "todo",
    priority: "low",
    dueDate: "Friday",
    assignee: { name: "Alex", avatar: "alex" }
  },
  {
    id: 5,
    title: "Write API documentation",
    description: "Document new endpoints for the messaging feature",
    status: "done",
    priority: "medium",
    dueDate: "Yesterday",
    assignee: { name: "Sarah", avatar: "sarah" }
  },
];

const statusConfig = {
  "todo": { label: "To Do", color: "bg-muted", icon: Circle },
  "in-progress": { label: "In Progress", color: "bg-info", icon: Clock },
  "done": { label: "Done", color: "bg-success", icon: CheckCircle2 },
};

const priorityConfig = {
  "high": { label: "High", variant: "destructive" as const },
  "medium": { label: "Medium", variant: "warning" as const },
  "low": { label: "Low", variant: "ghost" as const },
};

export default function Tasks() {
  return (
    <AppLayout>
      <AppHeader 
        title="Tasks" 
        subtitle="Manage your work and track progress"
        action={
          <Button variant="hero" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Task
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
          <div className="flex gap-1">
            {Object.entries(statusConfig).map(([key, config]) => (
              <Button key={key} variant="ghost" size="sm" className="text-muted-foreground">
                <config.icon className="w-4 h-4 mr-1" />
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const status = statusConfig[task.status as keyof typeof statusConfig];
            const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
            
            return (
              <Card 
                key={task.id} 
                variant="interactive"
                className={cn(
                  "animate-fade-up",
                  task.status === "done" && "opacity-60"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button className="mt-1">
                      <status.icon 
                        className={cn(
                          "w-5 h-5",
                          task.status === "done" ? "text-success" : 
                          task.status === "in-progress" ? "text-info" : 
                          "text-muted-foreground"
                        )} 
                      />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={cn(
                            "font-medium",
                            task.status === "done" && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant={priority.variant}>
                          {priority.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.avatar}`} />
                          <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
