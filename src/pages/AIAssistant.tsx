import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  Sparkles,
  FileText,
  Calendar,
  MessageSquare,
  Lightbulb,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  { icon: Sparkles, text: "How can you help me?" },
  { icon: FileText, text: "What features do you have?" },
  { icon: Calendar, text: "Help me plan my day" },
  { icon: MessageSquare, text: "Tips for staying productive" },
];

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you with tasks, summarize meetings, find information across your workspace, and much more. What would you like to know?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("help") || lowerMessage.includes("features")) {
      return "I can help you with:\n\n• **Task Management** - Create, organize, and track your tasks\n• **Calendar** - Schedule events and manage your time\n• **Notes** - Capture and organize your ideas\n• **Messaging** - Communicate with your team\n• **Boards** - Visualize your projects with Kanban boards\n• **Reports** - Track your productivity\n\nWhat would you like to explore?";
    }
    
    if (lowerMessage.includes("plan") || lowerMessage.includes("day") || lowerMessage.includes("schedule")) {
      return "To plan your day effectively:\n\n1. **Review your tasks** - Check what's due today in the Tasks section\n2. **Block time** - Use the Calendar to schedule focus blocks\n3. **Prioritize** - Focus on high-priority items first\n4. **Take breaks** - Schedule short breaks to stay refreshed\n\nWould you like me to help you create a task or schedule an event?";
    }
    
    if (lowerMessage.includes("productive") || lowerMessage.includes("tips")) {
      return "Here are some productivity tips:\n\n• **Time blocking** - Dedicate specific hours to specific tasks\n• **2-minute rule** - If it takes less than 2 minutes, do it now\n• **Batch similar tasks** - Group similar activities together\n• **Minimize distractions** - Use focus mode during deep work\n• **Regular reviews** - Check your Reports to understand patterns\n\nWant to start with any of these strategies?";
    }
    
    if (lowerMessage.includes("task")) {
      return "I can help you with tasks! Here's what you can do:\n\n• Create new tasks with priorities and due dates\n• Track task status (To Do → In Progress → Done)\n• Filter tasks by status or priority\n• View tasks in the Dashboard or Tasks page\n\nHead to the **Tasks** section to get started!";
    }
    
    if (lowerMessage.includes("calendar") || lowerMessage.includes("event") || lowerMessage.includes("meeting")) {
      return "The Calendar helps you manage your schedule:\n\n• Click any time slot to create an event\n• Choose different colors to categorize events\n• Navigate between weeks using the arrows\n• Switch between day, week, and month views\n\nGo to the **Calendar** to schedule your events!";
    }
    
    return "I understand! Here are some things I can help with:\n\n• **Tasks** - Create and manage your to-do list\n• **Calendar** - Schedule events and meetings\n• **Notes** - Capture your ideas\n• **Boards** - Organize projects visually\n• **Reports** - Track your productivity\n\nTry asking me about any of these, or let me know what specific help you need!";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = generateResponse(text);
    const assistantMessage: Message = { role: "assistant", content: response };
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const useSuggestion = (text: string) => {
    sendMessage(text);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        <div className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Your intelligent workspace companion</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex gap-3 animate-fade-up",
                  message.role === "user" && "flex-row-reverse"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
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
            
            {isTyping && (
              <div className="flex gap-3 animate-fade-up">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-secondary/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
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
                  onClick={() => useSuggestion(suggestion.text)}
                  disabled={isTyping}
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
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1 bg-transparent border-none outline-none text-sm px-2"
              />
              <Button 
                size="icon" 
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
              >
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
