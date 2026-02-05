import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Square, 
  Circle, 
  Type, 
  Minus, 
  MousePointer2,
  Pencil,
  Eraser,
  Undo,
  Redo,
  Download,
  Plus,
  Trash2,
  Loader2,
  StickyNote,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback, useEffect } from "react";
import { useCanvas, CanvasElement } from "@/hooks/useCanvas";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
  { id: "text", icon: Type, label: "Text" },
  { id: "sticky", icon: StickyNote, label: "Sticky Note" },
  { id: "line", icon: Minus, label: "Line" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
];

const colors = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#000000",
];

const stickyColors = [
  "#fef08a", // yellow
  "#bfdbfe", // blue
  "#bbf7d0", // green
  "#fecaca", // red
  "#e9d5ff", // purple
  "#fed7aa", // orange
];

export default function Canvas() {
  const { toast } = useToast();
  const { canvases, isLoading, createCanvas, updateCanvas, deleteCanvas } = useCanvas();
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPenPath, setCurrentPenPath] = useState<{ x: number; y: number }[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newCanvasTitle, setNewCanvasTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedCanvas = canvases.find(c => c.id === selectedCanvasId);

  // Load canvas on selection
  useEffect(() => {
    if (selectedCanvas?.data && typeof selectedCanvas.data === 'object' && !Array.isArray(selectedCanvas.data) && 'elements' in selectedCanvas.data) {
      const canvasElements = (selectedCanvas.data as unknown as { elements: CanvasElement[] }).elements;
      setElements(canvasElements);
      setHistory([canvasElements]);
      setHistoryIndex(0);
    } else {
      setElements([]);
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, [selectedCanvasId, selectedCanvas?.data]);

  // Auto-select first canvas if none selected
  useEffect(() => {
    if (!selectedCanvasId && canvases.length > 0) {
      setSelectedCanvasId(canvases[0].id);
    }
  }, [canvases, selectedCanvasId]);
 
   // Auto-create canvas if none exists
   useEffect(() => {
     if (!isLoading && canvases.length === 0 && !createCanvas.isPending) {
       createCanvas.mutate("My Canvas", {
         onSuccess: (data) => {
           setSelectedCanvasId(data.id);
         }
       });
     }
   }, [isLoading, canvases.length, createCanvas.isPending]);
 
   // Auto-save on element changes (debounced)
   useEffect(() => {
     if (!selectedCanvasId || elements.length === 0) return;
     
     const timeoutId = setTimeout(() => {
       updateCanvas.mutate({ 
         id: selectedCanvasId, 
         data: { elements }
       });
     }, 2000); // 2 second debounce
     
     return () => clearTimeout(timeoutId);
   }, [elements, selectedCanvasId]);

  const pushToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    
    if (selectedTool === "select") {
      // Check if clicking on an element
      const clickedElement = [...elements].reverse().find(el => {
        if (el.type === "pen" && el.points) {
          return el.points.some(p => 
            Math.abs(p.x - coords.x) < 10 && Math.abs(p.y - coords.y) < 10
          );
        }
        const width = el.width || 100;
        const height = el.height || 100;
        return (
          coords.x >= el.x && coords.x <= el.x + width &&
          coords.y >= el.y && coords.y <= el.y + height
        );
      });
      
      if (clickedElement) {
        setSelectedElementId(clickedElement.id);
        setDragOffset({ x: coords.x - clickedElement.x, y: coords.y - clickedElement.y });
        setIsDrawing(true);
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    if (selectedTool === "eraser") {
      const clickedElement = [...elements].reverse().find(el => {
        if (el.type === "pen" && el.points) {
          return el.points.some(p => 
            Math.abs(p.x - coords.x) < 10 && Math.abs(p.y - coords.y) < 10
          );
        }
        const width = el.width || 100;
        const height = el.height || 100;
        return (
          coords.x >= el.x && coords.x <= el.x + width &&
          coords.y >= el.y && coords.y <= el.y + height
        );
      });
      
      if (clickedElement) {
        const newElements = elements.filter(el => el.id !== clickedElement.id);
        setElements(newElements);
        pushToHistory(newElements);
      }
      return;
    }

    setIsDrawing(true);

    if (selectedTool === "pen") {
      setCurrentPenPath([coords]);
      return;
    }

    let newElement: CanvasElement | null = null;

    switch (selectedTool) {
      case "sticky":
        newElement = {
          id: generateId(),
          type: "sticky",
          x: coords.x,
          y: coords.y,
          width: 150,
          height: 100,
          color: stickyColors[Math.floor(Math.random() * stickyColors.length)],
          content: "New note...",
        };
        break;
      case "rectangle":
        newElement = {
          id: generateId(),
          type: "rectangle",
          x: coords.x,
          y: coords.y,
          width: 100,
          height: 80,
          color: selectedColor,
        };
        break;
      case "circle":
        newElement = {
          id: generateId(),
          type: "circle",
          x: coords.x,
          y: coords.y,
          width: 80,
          height: 80,
          color: selectedColor,
        };
        break;
      case "line":
        newElement = {
          id: generateId(),
          type: "line",
          x: coords.x,
          y: coords.y,
          width: 100,
          height: 2,
          color: selectedColor,
        };
        break;
      case "text":
        newElement = {
          id: generateId(),
          type: "text",
          x: coords.x,
          y: coords.y,
          width: 150,
          height: 30,
          color: selectedColor,
          content: "Text",
        };
        break;
    }

    if (newElement) {
      const newElements = [...elements, newElement];
      setElements(newElements);
      pushToHistory(newElements);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);

    if (selectedTool === "pen") {
      setCurrentPenPath(prev => [...prev, coords]);
      return;
    }

    if (selectedTool === "select" && selectedElementId) {
      const newElements = elements.map(el => 
        el.id === selectedElementId 
          ? { ...el, x: coords.x - dragOffset.x, y: coords.y - dragOffset.y }
          : el
      );
      setElements(newElements);
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === "pen" && currentPenPath.length > 1) {
      const newElement: CanvasElement = {
        id: generateId(),
        type: "pen",
        x: Math.min(...currentPenPath.map(p => p.x)),
        y: Math.min(...currentPenPath.map(p => p.y)),
        color: selectedColor,
        points: currentPenPath,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      pushToHistory(newElements);
      setCurrentPenPath([]);
    }

    if (selectedTool === "select" && isDrawing && selectedElementId) {
      pushToHistory(elements);
    }

    setIsDrawing(false);
  };

  const handleCreateCanvas = () => {
    if (!newCanvasTitle.trim()) {
      toast({ title: "Error", description: "Please enter a canvas title", variant: "destructive" });
      return;
    }
    createCanvas.mutate(newCanvasTitle, {
      onSuccess: (data) => {
        setSelectedCanvasId(data.id);
        setNewCanvasTitle("");
        setIsDialogOpen(false);
      }
    });
  };

  const handleSave = () => {
    if (!selectedCanvasId) return;
    updateCanvas.mutate({ 
      id: selectedCanvasId, 
      data: { elements }
    }, {
      onSuccess: () => {
        toast({ title: "Saved", description: "Canvas saved successfully." });
      }
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ elements }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportName = `${selectedCanvas?.title || 'canvas'}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  const handleTextEdit = (elementId: string, newContent: string) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, content: newContent } : el
    );
    setElements(newElements);
  };

  const handleTextBlur = (elementId: string) => {
    setEditingTextId(null);
    pushToHistory(elements);
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
      {/* Canvas Toolbar */}
      <div className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Canvas Selector */}
          <select 
            className="h-8 px-2 text-sm border rounded-md bg-background"
            value={selectedCanvasId || ""}
            onChange={(e) => setSelectedCanvasId(e.target.value)}
          >
            {canvases.map(canvas => (
              <option key={canvas.id} value={canvas.id}>{canvas.title}</option>
            ))}
          </select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Canvas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="canvasTitle">Canvas Name</Label>
                  <Input 
                    id="canvasTitle" 
                    placeholder="My Canvas"
                    value={newCanvasTitle}
                    onChange={(e) => setNewCanvasTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateCanvas()}
                  />
                </div>
                <Button className="w-full" onClick={handleCreateCanvas} disabled={createCanvas.isPending}>
                  {createCanvas.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Canvas
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {selectedCanvasId && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 text-destructive"
              onClick={() => {
                deleteCanvas.mutate(selectedCanvasId);
                setSelectedCanvasId(canvases.filter(c => c.id !== selectedCanvasId)[0]?.id || null);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <div className="w-px h-6 bg-border mx-2" />
          
          {/* Tool Selection */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="icon"
                className="w-8 h-8"
                onClick={() => setSelectedTool(tool.id)}
                title={tool.label}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-border mx-2" />
          
          {/* Color Selection */}
          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-6 h-6 rounded-full transition-transform hover:scale-110",
                  selectedColor === color && "ring-2 ring-offset-2 ring-primary"
                )}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!selectedCanvasId}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="icon" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 bg-[#f5f5f5] dark:bg-sidebar relative overflow-hidden cursor-crosshair" 
        style={{ height: "calc(100vh - 56px)" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e5e5 1px, transparent 1px),
              linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px"
          }}
        />
        
        {/* Render Elements */}
        {elements.map((el) => {
          if (el.type === "sticky") {
            return (
              <div
                key={el.id}
                className={cn(
                  "absolute p-3 rounded shadow-md cursor-move",
                  selectedElementId === el.id && "ring-2 ring-primary"
                )}
                style={{ 
                  left: el.x, 
                  top: el.y, 
                  width: el.width, 
                  minHeight: el.height,
                  backgroundColor: el.color,
                }}
                onDoubleClick={() => setEditingTextId(el.id)}
              >
                {editingTextId === el.id ? (
                  <textarea
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-sm"
                    value={el.content}
                    onChange={(e) => handleTextEdit(el.id, e.target.value)}
                    onBlur={() => handleTextBlur(el.id)}
                    autoFocus
                  />
                ) : (
                  <p className="text-sm text-gray-800">{el.content}</p>
                )}
              </div>
            );
          }
          
          if (el.type === "rectangle") {
            return (
              <div
                key={el.id}
                className={cn(
                  "absolute border-2 rounded cursor-move",
                  selectedElementId === el.id && "ring-2 ring-primary"
                )}
                style={{ 
                  left: el.x, 
                  top: el.y, 
                  width: el.width, 
                  height: el.height,
                  borderColor: el.color,
                  backgroundColor: `${el.color}20`,
                }}
              />
            );
          }
          
          if (el.type === "circle") {
            return (
              <div
                key={el.id}
                className={cn(
                  "absolute border-2 rounded-full cursor-move",
                  selectedElementId === el.id && "ring-2 ring-primary"
                )}
                style={{ 
                  left: el.x, 
                  top: el.y, 
                  width: el.width, 
                  height: el.height,
                  borderColor: el.color,
                  backgroundColor: `${el.color}20`,
                }}
              />
            );
          }
          
          if (el.type === "line") {
            return (
              <div
                key={el.id}
                className={cn(
                  "absolute cursor-move",
                  selectedElementId === el.id && "ring-2 ring-primary"
                )}
                style={{ 
                  left: el.x, 
                  top: el.y, 
                  width: el.width, 
                  height: 3,
                  backgroundColor: el.color,
                }}
              />
            );
          }
          
          if (el.type === "text") {
            return (
              <div
                key={el.id}
                className={cn(
                  "absolute cursor-move",
                  selectedElementId === el.id && "ring-2 ring-primary"
                )}
                style={{ left: el.x, top: el.y, color: el.color }}
                onDoubleClick={() => setEditingTextId(el.id)}
              >
                {editingTextId === el.id ? (
                  <input
                    className="bg-transparent border-none outline-none text-lg font-medium"
                    value={el.content}
                    onChange={(e) => handleTextEdit(el.id, e.target.value)}
                    onBlur={() => handleTextBlur(el.id)}
                    autoFocus
                  />
                ) : (
                  <p className="text-lg font-medium">{el.content}</p>
                )}
              </div>
            );
          }
          
          if (el.type === "pen" && el.points) {
            return (
              <svg
                key={el.id}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ overflow: "visible" }}
              >
                <polyline
                  points={el.points.map(p => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={el.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            );
          }
          
          return null;
        })}
        
        {/* Current Pen Path */}
        {currentPenPath.length > 1 && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <polyline
              points={currentPenPath.map(p => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={selectedColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        
        {/* Empty State */}
        {elements.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-muted-foreground text-lg mb-2">
                {selectedCanvasId ? "Start creating!" : "Create a canvas to get started"}
              </p>
              <p className="text-muted-foreground text-sm">
                {selectedCanvasId ? "Select a tool and click on the canvas to add elements" : "Click the + button above"}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
