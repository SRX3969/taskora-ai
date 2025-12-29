import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  FileText, 
  Star,
  Clock,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: number;
  title: string;
  preview: string;
  updated: string;
  starred: boolean;
  tags: string[];
}

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
  "notes": "bg-slate-500/10 text-slate-500",
};

export default function Notes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const filteredNotes = notes
    .filter(note => showStarredOnly ? note.starred : true)
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleStar = (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ));
    const note = notes.find(n => n.id === noteId);
    toast({ 
      title: note?.starred ? "Removed from starred" : "Added to starred",
      description: note?.title
    });
  };

  const deleteNote = (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const note = notes.find(n => n.id === noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
    toast({ title: "Note deleted", description: note?.title });
  };

  const createNote = () => {
    if (!newNote.title.trim()) {
      toast({ title: "Error", description: "Please enter a note title", variant: "destructive" });
      return;
    }
    
    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      preview: newNote.content || "No content yet...",
      updated: "Just now",
      starred: false,
      tags: ["notes"]
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote({ title: "", content: "" });
    setIsDialogOpen(false);
    toast({ title: "Note created", description: note.title });
  };

  const openNote = (note: Note) => {
    toast({ title: "Opening note", description: note.title });
  };

  return (
    <AppLayout>
      <AppHeader 
        title="Notes" 
        subtitle="Capture and organize your ideas"
        action={
          <Button variant="hero" size="sm" onClick={() => setIsDialogOpen(true)}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          <Button 
            variant={showStarredOnly ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowStarredOnly(!showStarredOnly)}
          >
            <Star className={cn("w-4 h-4 mr-1", showStarredOnly && "fill-current")} />
            Starred ({notes.filter(n => n.starred).length})
          </Button>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Create your first note to start capturing ideas, meeting notes, and more.
            </p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note, index) => (
              <Card 
                key={note.id} 
                variant="interactive"
                className="animate-fade-up group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => openNote(note)}
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
                        onClick={(e) => toggleStar(note.id, e)}
                      >
                        <Star className={cn("w-4 h-4", note.starred && "fill-current")} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-7 h-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => deleteNote(note.id, e)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
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
        )}

        {notes.length > 0 && filteredNotes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No matching notes found</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setShowStarredOnly(false);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Create Note Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="noteTitle">Title</Label>
              <Input 
                id="noteTitle" 
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noteContent">Content</Label>
              <Textarea 
                id="noteContent" 
                placeholder="Start writing..."
                rows={5}
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            <Button className="w-full" onClick={createNote}>Create Note</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
