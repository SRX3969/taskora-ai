import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  { icon: Sparkles, text: "Summarize today's activity" },
  { icon: FileText, text: "What are my pending tasks?" },
  { icon: Calendar, text: "What meetings do I have this week?" },
  { icon: MessageSquare, text: "Summarize unread messages" },
];

const initialConversation: Message[] = [
  {
    role: "assistant",
    content: "Hello! I'm your AI assistant. I can help you with tasks, summarize meetings, find information across your workspace, and much more. What would you like to know?"
  }
];

const aiResponses: Record<string, string> = {
  "schedule": "Based on your calendar, here's your schedule for today:\n\n**10:00 AM** - Design Review (1 hour)\n• Attendees: Sarah, Jordan, Alex\n\n**11:00 AM** - Team Standup (30 min)\n• Daily sync with the engineering team\n\n**2:00 PM** - Sprint Planning (2 hours)\n\nYou have 3 hours of focus time available. Would you like me to suggest tasks to prioritize?",
  "tasks": "You have **8 pending tasks**:\n\n**High Priority:**\n• Review Q4 marketing strategy (Due today)\n• Fix dashboard loading issue (Due today)\n\n**Medium Priority:**\n• Update product roadmap (Due tomorrow)\n• Write API documentation (Due Friday)\n\n**Low Priority:**\n• Prepare team demo (Due Friday)\n\nWould you like me to help you prioritize these?",
  "messages": "Here's a summary of your unread messages:\n\n**#design (3 unread)**\n• Sarah shared new dashboard mockups and is waiting for feedback\n\n**#engineering (12 unread)**\n• The deployment was successful\n• Jordan fixed the login bug\n• Discussion about API documentation\n\n**#random (5 unread)**\n• Team lunch plans for Friday\n\nWould you like me to open any of these channels?",
  "summarize": "Here's your daily summary:\n\n**Completed Today:**\n• 3 tasks finished\n• 2 meetings attended\n\n**In Progress:**\n• Dashboard redesign (in review)\n• Messaging feature (80% complete)\n\n**Key Updates:**\n• Design team needs feedback on mockups\n• Sprint planning at 2 PM\n• 12 unread messages in #engineering\n\n**Suggestions:**\n• Block 1 hour for design review feedback\n• Prioritize Q4 marketing strategy review",
  "default": "I understand you're asking about that. Let me help you!\n\nBased on your workspace data, I can see relevant information across your tasks, calendar, messages, and notes. Here are some things I can help with:\n\n• **Tasks**: Create, prioritize, or summarize your tasks\n• **Calendar**: Check your schedule or find free time\n• **Messages**: Summarize channel discussions\n• **Notes**: Search or create notes\n\nWhat specifically would you like to know more about?"
};

export default function AIAssistant() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialConversation);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate response based on keywords
    let response = aiResponses.default;
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("schedule") || lowerText.includes("calendar") || lowerText.includes("meeting")) {
      response = aiResponses.schedule;
    } else if (lowerText.includes("task") || lowerText.includes("pending") || lowerText.includes("todo")) {
      response = aiResponses.tasks;
    } else if (lowerText.includes("message") || lowerText.includes("unread") || lowerText.includes("channel")) {
      response = aiResponses.messages;
    } else if (lowerText.includes("summarize") || lowerText.includes("summary") || lowerText.includes("today")) {
      response = aiResponses.summarize;
    }

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
