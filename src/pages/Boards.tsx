import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, GripVertical, X, Layout, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useBoards, useBoardColumns } from "@/hooks/useBoards";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tagColors: Record<string, string> = {
  "design": "bg-purple-500/10 text-purple-500",
  "engineering": "bg-blue-500/10 text-blue-500",
  "marketing": "bg-pink-500/10 text-pink-500",
  "research": "bg-green-500/10 text-green-500",
  "docs": "bg-orange-500/10 text-orange-500",
  "ux": "bg-indigo-500/10 text-indigo-500",
  "bug": "bg-red-500/10 text-red-500",
  "feature": "bg-cyan-500/10 text-cyan-500",
};

export default function Boards() {
  const { toast } = useToast();
  const { boards, boardsLoading, createBoard } = useBoards();
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const { columns, isLoading, createColumn, createCard, deleteCard, moveCard } = useBoardColumns(currentBoardId);
  
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Create default board if none exists
  useEffect(() => {
    if (!boardsLoading && boards.length === 0) {
      createBoard.mutate("My First Board");
    } else if (boards.length > 0 && !currentBoardId) {
      setCurrentBoardId(boards[0].id);
    }
  }, [boards, boardsLoading, currentBoardId]);

  // Create default columns if none exist
  useEffect(() => {
    if (currentBoardId && !isLoading && columns.length === 0) {
      const defaultColumns = [
        { title: "To Do", position: 0 },
        { title: "In Progress", position: 1 },
        { title: "Done", position: 2 },
      ];
      defaultColumns.forEach(col => createColumn.mutate(col));
    }
  }, [currentBoardId, isLoading, columns.length]);

  const addCard = () => {
    if (!newCardTitle.trim() || !activeColumnId) return;
    
    const column = columns.find(c => c.id === activeColumnId);
    const position = column ? column.cards.length : 0;
    
    createCard.mutate({ columnId: activeColumnId, title: newCardTitle, position });
    setNewCardTitle("");
    setIsCardDialogOpen(false);
    setActiveColumnId(null);
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    createColumn.mutate({ title: newColumnTitle, position: columns.length });
    setNewColumnTitle("");
    setIsColumnDialogOpen(false);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard.mutate(cardId);
  };

  const handleMoveCard = (cardId: string, fromColumnId: string, direction: 'left' | 'right') => {
    const fromIndex = columns.findIndex(c => c.id === fromColumnId);
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= columns.length) return;
    
    const targetColumn = columns[toIndex];
    moveCard.mutate({ cardId, newColumnId: targetColumn.id, newPosition: targetColumn.cards.length });
  };

  const openAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setIsCardDialogOpen(true);
  };

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  if (boardsLoading || isLoading) {
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
        title="Boards" 
        subtitle="Organize your projects visually"
        action={
          <Button variant="hero" size="sm" onClick={() => setIsCardDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Card
          </Button>
        }
      />
      
      <div className="p-4 md:p-6 overflow-x-auto">
        {totalCards === 0 && columns.length <= 3 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layout className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">Your board is empty</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Start by adding cards to organize your work. Click on "Add card" in any column to get started.
            </p>
            <Button variant="outline" onClick={() => columns[0] && openAddCard(columns[0].id)}>
              <Plus className="w-4 h-4 mr-1" />
              Add your first card
            </Button>
          </div>
        ) : (
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
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      colIdx === 0 ? "bg-muted-foreground" : colIdx === 1 ? "bg-info" : "bg-success"
                    )} />
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
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium mb-2">{card.title}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 -mt-1 -mr-1"
                                onClick={() => handleDeleteCard(card.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1 flex-wrap">
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                  tagColors["feature"]
                                )}>
                                  feature
                                </span>
                              </div>
                              <Avatar className="w-6 h-6">
                                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                                <AvatarFallback>Y</AvatarFallback>
                              </Avatar>
                            </div>
                            {/* Move buttons */}
                            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {colIdx > 0 && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 text-xs px-2"
                                  onClick={() => handleMoveCard(card.id, column.id, 'left')}
                                >
                                  ← {columns[colIdx - 1].title}
                                </Button>
                              )}
                              {colIdx < columns.length - 1 && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-6 text-xs px-2"
                                  onClick={() => handleMoveCard(card.id, column.id, 'right')}
                                >
                                  {columns[colIdx + 1].title} →
                                </Button>
                              )}
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
                    onClick={() => openAddCard(column.id)}
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
                onClick={() => setIsColumnDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Column
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Card Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cardTitle">Card Title</Label>
              <Input 
                id="cardTitle" 
                placeholder="Enter card title..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCard()}
              />
            </div>
            {!activeColumnId && (
              <div className="space-y-2">
                <Label>Select Column</Label>
                <div className="flex flex-wrap gap-2">
                  {columns.map(col => (
                    <Button
                      key={col.id}
                      variant={activeColumnId === col.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveColumnId(col.id)}
                    >
                      {col.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={addCard} 
              disabled={!newCardTitle.trim() || !activeColumnId || createCard.isPending}
            >
              {createCard.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Column Dialog */}
      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="columnTitle">Column Title</Label>
              <Input 
                id="columnTitle" 
                placeholder="Enter column title..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addColumn()}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={addColumn} 
              disabled={!newColumnTitle.trim() || createColumn.isPending}
            >
              {createColumn.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add Column
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
