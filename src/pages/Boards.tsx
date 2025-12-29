import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  {
    id: "backlog",
    title: "Backlog",
    color: "bg-muted-foreground",
    cards: [
      { id: 1, title: "Research competitor pricing", tags: ["research"], assignee: "alex" },
      { id: 2, title: "Update brand guidelines", tags: ["design"], assignee: "sarah" },
    ]
  },
  {
    id: "todo",
    title: "To Do",
    color: "bg-info",
    cards: [
      { id: 3, title: "Design new onboarding flow", tags: ["design", "ux"], assignee: "sarah" },
      { id: 4, title: "Write API documentation", tags: ["docs"], assignee: "jordan" },
      { id: 5, title: "Set up analytics tracking", tags: ["engineering"], assignee: "alex" },
    ]
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-warning",
    cards: [
      { id: 6, title: "Implement messaging feature", tags: ["engineering"], assignee: "jordan" },
      { id: 7, title: "Create marketing assets", tags: ["marketing"], assignee: "sarah" },
    ]
  },
  {
    id: "review",
    title: "Review",
    color: "bg-primary",
    cards: [
      { id: 8, title: "Dashboard redesign", tags: ["design"], assignee: "sarah" },
    ]
  },
  {
    id: "done",
    title: "Done",
    color: "bg-success",
    cards: [
      { id: 9, title: "Landing page updates", tags: ["design"], assignee: "alex" },
      { id: 10, title: "Fix login bug", tags: ["bug"], assignee: "jordan" },
    ]
  },
];

const tagColors: Record<string, string> = {
  "design": "bg-purple-500/10 text-purple-500",
  "engineering": "bg-blue-500/10 text-blue-500",
  "marketing": "bg-pink-500/10 text-pink-500",
  "research": "bg-green-500/10 text-green-500",
  "docs": "bg-orange-500/10 text-orange-500",
  "ux": "bg-indigo-500/10 text-indigo-500",
  "bug": "bg-red-500/10 text-red-500",
};

export default function Boards() {
  return (
    <AppLayout>
      <AppHeader 
        title="Boards" 
        subtitle="Product Development Sprint 12"
        action={
          <Button variant="hero" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Card
          </Button>
        }
      />
      
      <div className="p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {columns.map((column, colIdx) => (
            <div 
              key={column.id} 
              className="w-72 flex-shrink-0 animate-fade-up"
              style={{ animationDelay: `${colIdx * 100}ms` }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", column.color)} />
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                  <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                    {column.cards.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="w-7 h-7">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Cards */}
              <div className="space-y-2">
                {column.cards.map((card, cardIdx) => (
                  <Card 
                    key={card.id} 
                    variant="interactive"
                    className="group animate-scale-in"
                    style={{ animationDelay: `${(colIdx * 100) + (cardIdx * 50)}ms` }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-2">{card.title}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1 flex-wrap">
                              {card.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                    tagColors[tag] || "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${card.assignee}`} />
                              <AvatarFallback>{card.assignee[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add Card Button */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add card
                </Button>
              </div>
            </div>
          ))}
          
          {/* Add Column */}
          <div className="w-72 flex-shrink-0">
            <Button 
              variant="outline" 
              className="w-full h-10 border-dashed"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Column
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
