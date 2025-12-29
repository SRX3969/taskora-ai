import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Hash, 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Plus,
  Search,
  Bot,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  user: { name: string; avatar: string };
  content: string;
  time: string;
  reactions: { emoji: string; count: number }[];
}

interface Channel {
  id: number;
  name: string;
  unread: number;
}

export default function Messaging() {
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "general", unread: 0 },
  ]);
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      user: { name: "You", avatar: "user" },
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");
    toast({ title: "Message sent", description: `To #${selectedChannel}` });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const selectChannel = (channelName: string) => {
    setSelectedChannel(channelName);
    setChannels(prev => prev.map(ch => 
      ch.name === channelName ? { ...ch, unread: 0 } : ch
    ));
  };

  const createChannel = () => {
    if (!newChannelName.trim()) {
      toast({ title: "Error", description: "Please enter a channel name", variant: "destructive" });
      return;
    }
    
    const newChannel: Channel = {
      id: Date.now(),
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      unread: 0
    };
    
    setChannels(prev => [...prev, newChannel]);
    setNewChannelName("");
    setIsChannelDialogOpen(false);
    setSelectedChannel(newChannel.name);
    toast({ title: "Channel created", description: `#${newChannel.name}` });
  };

  const summarizeChannel = () => {
    if (messages.length === 0) {
      toast({ 
        title: "No messages", 
        description: "Start a conversation to get AI summaries" 
      });
      return;
    }
    toast({ 
      title: "AI Summary", 
      description: `This channel has ${messages.length} messages. Key topics discussed include: ${messages.slice(0, 3).map(m => m.content.slice(0, 20)).join(", ")}...` 
    });
  };

  const filteredChannels = channels.filter(ch => 
    ch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Channels</span>
              <Dialog open={isChannelDialogOpen} onOpenChange={setIsChannelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="channelName">Channel Name</Label>
                      <Input 
                        id="channelName" 
                        placeholder="e.g., announcements"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createChannel()}
                      />
                    </div>
                    <Button className="w-full" onClick={createChannel}>Create Channel</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <ul className="space-y-0.5">
              {filteredChannels.map((channel) => (
                <li key={channel.id}>
                  <button
                    onClick={() => selectChannel(channel.name)}
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
              <Button variant="outline" size="sm" onClick={summarizeChannel}>
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
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Start the conversation in #{selectedChannel}. Send a message below to get started.
                </p>
              </div>
            ) : (
              messages.map((message) => (
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
                    <div className="flex gap-1 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          onClick={() => addReaction(message.id, reaction.emoji)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs hover:bg-secondary/80 transition-colors"
                        >
                          {reaction.emoji}
                          <span className="text-muted-foreground">{reaction.count}</span>
                        </button>
                      ))}
                      <button 
                        onClick={() => addReaction(message.id, "👍")}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-xs hover:bg-secondary transition-all"
                      >
                        <Smile className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-card/50">
            <div className="flex items-center gap-2 p-2 rounded-xl border bg-background">
              <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => toast({ title: "Attach file", description: "File upload coming soon!" })}>
                <Paperclip className="w-5 h-5" />
              </Button>
              <input
                type="text"
                placeholder={`Message #${selectedChannel}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => toast({ title: "Emoji picker", description: "Emoji picker coming soon!" })}>
                <Smile className="w-5 h-5" />
              </Button>
              <Button size="icon" className="flex-shrink-0" onClick={sendMessage} disabled={!messageInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
