import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Hash, 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Plus,
  Search,
  Bot
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const channels = [
  { id: 1, name: "general", unread: 3 },
  { id: 2, name: "design", unread: 0 },
  { id: 3, name: "engineering", unread: 12 },
  { id: 4, name: "marketing", unread: 0 },
  { id: 5, name: "random", unread: 5 },
];

const messages = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "sarah" },
    content: "Hey team! Just uploaded the new mockups for the dashboard. Would love your feedback 🎨",
    time: "10:30 AM",
    reactions: [{ emoji: "👍", count: 3 }, { emoji: "🔥", count: 2 }]
  },
  {
    id: 2,
    user: { name: "Alex Morgan", avatar: "alex" },
    content: "These look amazing! I especially like the new card layout. Quick question - are we going with the gradient headers or solid colors?",
    time: "10:35 AM",
    reactions: []
  },
  {
    id: 3,
    user: { name: "Sarah Chen", avatar: "sarah" },
    content: "Great question! I'm leaning towards subtle gradients for feature cards and solid colors for stats. What do you think?",
    time: "10:38 AM",
    reactions: [{ emoji: "💯", count: 1 }]
  },
  {
    id: 4,
    user: { name: "Jordan Lee", avatar: "jordan" },
    content: "Love the direction! The AI summary card at the top is a nice touch. It really emphasizes the AI-first approach we're going for.",
    time: "10:42 AM",
    reactions: [{ emoji: "❤️", count: 2 }, { emoji: "✨", count: 1 }]
  },
];

export default function Messaging() {
  const [selectedChannel, setSelectedChannel] = useState("design");
  const [messageInput, setMessageInput] = useState("");

  return (
    <AppLayout>
      <div className="flex h-screen">
        {/* Channels Sidebar */}
        <div className="w-64 border-r bg-secondary/20 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Channels</span>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <ul className="space-y-0.5">
              {channels.map((channel) => (
                <li key={channel.id}>
                  <button
                    onClick={() => setSelectedChannel(channel.name)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors",
                      selectedChannel === channel.name
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Hash className="w-4 h-4" />
                    <span className="flex-1 text-left">{channel.name}</span>
                    {channel.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {channel.unread}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="h-14 border-b px-4 flex items-center justify-between bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">{selectedChannel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bot className="w-4 h-4 mr-1" />
                AI Summary
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 group hover:bg-secondary/30 p-2 rounded-lg -mx-2 transition-colors">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.user.avatar}`} />
                  <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5">{message.content}</p>
                  {message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs hover:bg-secondary/80 transition-colors"
                        >
                          {reaction.emoji}
                          <span className="text-muted-foreground">{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-card/50">
            <div className="flex items-center gap-2 p-2 rounded-xl border bg-background">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <input
                type="text"
                placeholder={`Message #${selectedChannel}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Smile className="w-5 h-5" />
              </Button>
              <Button size="icon" className="flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
