import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  FileText, 
  MoreVertical,
  Star,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const notes = [
  {
    id: 1,
    title: "Q4 Marketing Strategy",
    preview: "Key objectives for Q4 include expanding our reach in the enterprise market...",
    updated: "2 hours ago",
    starred: true,
    tags: ["marketing", "strategy"]
  },
  {
    id: 2,
    title: "Product Roadmap 2024",
    preview: "Core features planned for H1: messaging improvements, AI assistant v2...",
    updated: "Yesterday",
    starred: true,
    tags: ["product", "planning"]
  },
  {
    id: 3,
    title: "Meeting Notes - Design Review",
    preview: "Discussed new dashboard layout, feedback on card components...",
    updated: "2 days ago",
    starred: false,
    tags: ["design", "meeting"]
  },
  {
    id: 4,
    title: "API Documentation Draft",
    preview: "Endpoints for the messaging feature including channels, messages...",
    updated: "3 days ago",
    starred: false,
    tags: ["engineering", "docs"]
  },
  {
    id: 5,
    title: "Sprint 12 Retro",
    preview: "What went well: improved deployment times. What to improve...",
    updated: "1 week ago",
    starred: false,
    tags: ["engineering", "retro"]
  },
  {
    id: 6,
    title: "Brand Guidelines Update",
    preview: "Updated color palette, typography guidelines, and logo usage...",
    updated: "1 week ago",
    starred: false,
    tags: ["design", "brand"]
  },
];

const tagColors: Record<string, string> = {
  "marketing": "bg-pink-500/10 text-pink-500",
  "strategy": "bg-blue-500/10 text-blue-500",
  "product": "bg-purple-500/10 text-purple-500",
  "planning": "bg-indigo-500/10 text-indigo-500",
  "design": "bg-orange-500/10 text-orange-500",
  "meeting": "bg-green-500/10 text-green-500",
  "engineering": "bg-cyan-500/10 text-cyan-500",
  "docs": "bg-amber-500/10 text-amber-500",
  "retro": "bg-teal-500/10 text-teal-500",
  "brand": "bg-rose-500/10 text-rose-500",
};

export default function Notes() {
  return (
    <AppLayout>
      <AppHeader 
        title="Notes" 
        subtitle="Capture and organize your ideas"
        action={
          <Button variant="hero" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Note
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-1" />
            Starred
          </Button>
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, index) => (
            <Card 
              key={note.id} 
              variant="interactive"
              className="animate-fade-up group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "w-7 h-7",
                        note.starred ? "text-warning" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <Star className={cn("w-4 h-4", note.starred && "fill-current")} />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {note.preview}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {note.tags.map((tag) => (
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {note.updated}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
