import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTasks, Task } from "@/hooks/useTasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

const statusConfig = {
  "todo": { label: "To Do", color: "bg-muted", icon: Circle },
  "in_progress": { label: "In Progress", color: "bg-info", icon: Clock },
  "done": { label: "Done", color: "bg-success", icon: CheckCircle2 },
};

const priorityConfig = {
  "high": { label: "High", variant: "destructive" as const },
  "medium": { label: "Medium", variant: "warning" as const },
  "low": { label: "Low", variant: "ghost" as const },
};

export default function Tasks() {
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string; priority: "high" | "medium" | "low" }>({ 
    title: "", 
    description: "", 
    priority: "medium" 
  });

  const filteredTasks = filter 
    ? tasks.filter(task => task.status === filter)
    : tasks;

  const toggleTaskStatus = (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : 
                     task.status === "todo" ? "in_progress" : "done";
    updateTask.mutate({ id: task.id, status: newStatus });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    createTask.mutate({
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
    });
    
    setNewTask({ title: "", description: "", priority: "medium" });
    setIsDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask.mutate(taskId);
  };

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
        title="Tasks" 
        subtitle="Manage your work and track progress"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Task description..."
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <Button
                        key={p}
                        variant={newTask.priority === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewTask(prev => ({ ...prev, priority: p }))}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddTask}
                  disabled={createTask.isPending}
                >
                  {createTask.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant={filter === null ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setFilter(null)}
          >
            <Filter className="w-4 h-4 mr-1" />
            All ({tasks.length})
          </Button>
          <div className="flex gap-1">
            {Object.entries(statusConfig).map(([key, config]) => (
              <Button 
                key={key} 
                variant={filter === key ? "secondary" : "ghost"} 
                size="sm" 
                className="text-muted-foreground"
                onClick={() => setFilter(filter === key ? null : key)}
              >
                <config.icon className="w-4 h-4 mr-1" />
                {config.label} ({tasks.filter(t => t.status === key).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((task, index) => {
            const status = statusConfig[task.status];
            const priority = priorityConfig[task.priority];
            
            return (
              <Card 
                key={task.id} 
                variant="interactive"
                className={cn(
                  "animate-fade-up",
                  task.status === "done" && "opacity-60"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => toggleTaskStatus(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button className="mt-1" onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task); }}>
                      <status.icon 
                        className={cn(
                          "w-5 h-5 transition-colors",
                          task.status === "done" ? "text-success" : 
                          task.status === "in_progress" ? "text-info" : 
                          "text-muted-foreground hover:text-primary"
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
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {task.description || "No description"}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="flex-shrink-0"
                          onClick={(e) => handleDeleteTask(task.id, e)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant={priority.variant}>
                          {priority.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {task.due_date 
                            ? format(new Date(task.due_date), "MMM d") 
                            : format(new Date(task.created_at), "MMM d")}
                        </div>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">{filter ? "No tasks match this filter" : "No tasks yet"}</p>
              <p className="text-sm mb-4">Create your first task to get started</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Create your first task
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
