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
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignee: { name: string; avatar: string };
}

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
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string; priority: "high" | "medium" | "low" }>({ title: "", description: "", priority: "medium" });

  const filteredTasks = filter 
    ? tasks.filter(task => task.status === filter)
    : tasks;

  const toggleTaskStatus = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "done" ? "todo" : 
                         task.status === "todo" ? "in-progress" : "done";
        toast({
          title: "Task updated",
          description: `"${task.title}" moved to ${statusConfig[newStatus].label}`,
        });
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({ title: "Error", description: "Please enter a task title", variant: "destructive" });
      return;
    }
    
    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description || "No description",
      status: "todo",
      priority: newTask.priority,
      dueDate: "Today",
      assignee: { name: "You", avatar: "user" }
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: "", description: "", priority: "medium" });
    setIsDialogOpen(false);
    toast({ title: "Task created", description: `"${task.title}" has been added` });
  };

  const deleteTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({ title: "Task deleted", description: `"${task?.title}" has been removed` });
  };

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
                <Button className="w-full" onClick={addTask}>Create Task</Button>
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
                onClick={() => toggleTaskStatus(task.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <button className="mt-1" onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task.id); }}>
                      <status.icon 
                        className={cn(
                          "w-5 h-5 transition-colors",
                          task.status === "done" ? "text-success" : 
                          task.status === "in-progress" ? "text-info" : 
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
                          <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="flex-shrink-0"
                          onClick={(e) => deleteTask(task.id, e)}
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
