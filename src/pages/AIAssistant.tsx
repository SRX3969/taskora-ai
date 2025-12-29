import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  Sparkles,
  FileText,
  Calendar,
  CheckSquare,
  MessageSquare,
  Lightbulb
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const suggestions = [
  { icon: Sparkles, text: "Summarize today's activity" },
  { icon: FileText, text: "What are my pending tasks?" },
  { icon: Calendar, text: "What meetings do I have this week?" },
  { icon: MessageSquare, text: "Summarize unread messages" },
];

const conversation = [
  {
    role: "assistant",
    content: "Hello! I'm your AI assistant. I can help you with tasks, summarize meetings, find information across your workspace, and much more. What would you like to know?"
  },
  {
    role: "user",
    content: "What's my schedule looking like today?"
  },
  {
    role: "assistant",
    content: "Based on your calendar, here's your schedule for today:\n\n**10:00 AM** - Design Review (1 hour)\n• Attendees: Sarah, Jordan, Alex\n• Location: Virtual\n\n**11:00 AM** - Team Standup (30 min)\n• Daily sync with the engineering team\n\n**2:00 PM** - Sprint Planning (2 hours)\n• Review and plan next sprint tasks\n\nYou have 3 hours of focus time available between meetings. Would you like me to suggest what tasks to prioritize during that time?"
  },
  {
    role: "user",
    content: "Yes, what should I focus on?"
  },
  {
    role: "assistant",
    content: "Based on your task priorities and deadlines, I recommend focusing on:\n\n1. **Review Q4 marketing strategy** (High priority, due today)\n   • This has been on your list for 2 days\n   • Sarah mentioned she needs your feedback before EOD\n\n2. **Respond to unread messages** (12 messages across 3 channels)\n   • #design has 3 messages about new mockups\n   • #engineering has updates on the dashboard fix\n\n3. **Update product roadmap** (Medium priority, due tomorrow)\n   • You could draft this during your afternoon focus time\n\nWould you like me to create a focused time block in your calendar for these tasks?"
  }
];

export default function AIAssistant() {
  const [input, setInput] = useState("");

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        <AppHeader 
          title="AI Assistant" 
          subtitle="Your intelligent workspace companion"
        />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {conversation.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex gap-3 animate-fade-up",
                  message.role === "user" && "flex-row-reverse"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                ) : (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={cn(
                    "max-w-2xl rounded-2xl px-4 py-3",
                    message.role === "assistant" 
                      ? "bg-secondary/50" 
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="px-6 py-3 border-t bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Suggestions</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((suggestion, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => setInput(suggestion.text)}
                >
                  <suggestion.icon className="w-3 h-3 mr-1" />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-card/50">
            <div className="flex items-center gap-2 p-2 rounded-xl border bg-background max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Ask me anything about your workspace..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm px-2"
              />
              <Button size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
