import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
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
  Share2,
  Bot,
  StickyNote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  "#6366f1", // primary
  "#f97316", // accent
  "#22c55e", // success
  "#ef4444", // destructive
  "#3b82f6", // info
  "#000000", // black
];

export default function Canvas() {
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <AppLayout>
      {/* Canvas Toolbar */}
      <div className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
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
          
          {/* Separator */}
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
          <Button variant="ghost" size="icon">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Redo className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button variant="outline" size="sm">
            <Bot className="w-4 h-4 mr-1" />
            AI Generate
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="default" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 bg-[#f5f5f5] dark:bg-sidebar relative overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e5e5 1px, transparent 1px),
              linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px"
          }}
        />
        
        {/* Example Elements */}
        <div className="absolute top-20 left-20 p-4 bg-yellow-200 rounded shadow-md rotate-2 animate-fade-up">
          <p className="text-sm font-medium text-yellow-900">Brainstorm Ideas</p>
          <p className="text-xs text-yellow-800 mt-1">AI assistant integration</p>
        </div>
        
        <div className="absolute top-20 left-60 p-4 bg-blue-200 rounded shadow-md -rotate-1 animate-fade-up animation-delay-100">
          <p className="text-sm font-medium text-blue-900">User Flow</p>
          <p className="text-xs text-blue-800 mt-1">Onboarding → Dashboard</p>
        </div>
        
        <div className="absolute top-20 left-[400px] p-4 bg-green-200 rounded shadow-md rotate-1 animate-fade-up animation-delay-200">
          <p className="text-sm font-medium text-green-900">Design System</p>
          <p className="text-xs text-green-800 mt-1">Colors, typography, spacing</p>
        </div>
        
        {/* Flow Diagram Elements */}
        <div className="absolute top-60 left-40 animate-fade-up animation-delay-300">
          <div className="w-32 h-16 bg-card rounded-lg border-2 border-primary shadow-md flex items-center justify-center">
            <p className="text-sm font-medium">Start</p>
          </div>
        </div>
        
        <div className="absolute top-60 left-80 animate-fade-up animation-delay-400">
          <div className="w-4 h-0.5 bg-muted-foreground" style={{ marginTop: "30px" }} />
        </div>
        
        <div className="absolute top-60 left-[340px] animate-fade-up animation-delay-500">
          <div className="w-32 h-16 bg-card rounded-lg border shadow-md flex items-center justify-center">
            <p className="text-sm font-medium">Process</p>
          </div>
        </div>
        
        {/* Empty State Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center animate-fade-up animation-delay-500">
          <p className="text-muted-foreground text-sm">
            Click and drag to start drawing, or use the AI Generate button to create diagrams from text
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
