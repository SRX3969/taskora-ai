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
  MessageSquare,
  Loader2
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/useMessages";
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
import { format } from "date-fns";

export default function Messaging() {
  const { toast } = useToast();
  const { messages, isLoading, sendMessage } = useMessages();
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [customChannels, setCustomChannels] = useState<string[]>([]);

  // Get unique channels from messages
  const channels = useMemo(() => {
    const messageChannels = [...new Set(messages.map(m => m.channel))];
    const allChannels = ["general", ...customChannels, ...messageChannels.filter(c => c !== "general" && !customChannels.includes(c))];
    return [...new Set(allChannels)];
  }, [messages, customChannels]);

  const channelMessages = useMemo(() => 
    messages.filter(m => m.channel === selectedChannel),
    [messages, selectedChannel]
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    sendMessage.mutate({ channel: selectedChannel, content: messageInput });
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createChannel = () => {
    if (!newChannelName.trim()) {
      toast({ title: "Error", description: "Please enter a channel name", variant: "destructive" });
      return;
    }
    
    const formattedName = newChannelName.toLowerCase().replace(/\s+/g, '-');
    setCustomChannels(prev => [...prev, formattedName]);
    setNewChannelName("");
    setIsChannelDialogOpen(false);
    setSelectedChannel(formattedName);
    toast({ title: "Channel created", description: `#${formattedName}` });
  };

  const summarizeChannel = () => {
    if (channelMessages.length === 0) {
      toast({ 
        title: "No messages", 
        description: "Start a conversation to get AI summaries" 
      });
      return;
    }
    toast({ 
      title: "AI Summary", 
      description: `This channel has ${channelMessages.length} messages. Key topics discussed include: ${channelMessages.slice(0, 3).map(m => m.content.slice(0, 20)).join(", ")}...` 
    });
  };

  const filteredChannels = channels.filter(ch => 
    ch.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {filteredChannels.map((channel) => {
                const unreadCount = messages.filter(m => m.channel === channel).length;
                return (
                  <li key={channel}>
                    <button
                      onClick={() => setSelectedChannel(channel)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors",
                        selectedChannel === channel
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Hash className="w-4 h-4" />
                      <span className="flex-1 text-left">{channel}</span>
                      {unreadCount > 0 && selectedChannel !== channel && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
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
            {channelMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Start the conversation in #{selectedChannel}. Send a message below to get started.
                </p>
              </div>
            ) : (
              channelMessages.map((message) => (
                <div key={message.id} className="flex gap-3 group hover:bg-secondary/30 p-2 rounded-lg -mx-2 transition-colors">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">You</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at), "h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 mt-0.5">{message.content}</p>
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
              <Button 
                size="icon" 
                className="flex-shrink-0" 
                onClick={handleSendMessage} 
                disabled={!messageInput.trim() || sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
