 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { useToast } from "@/hooks/use-toast";
 
 export interface AIMessage {
   id: string;
   conversation_id: string;
   role: "user" | "assistant";
   content: string;
   created_at: string;
 }
 
 export interface AIConversation {
   id: string;
   title: string;
   created_at: string;
   updated_at: string;
 }
 
 export function useAIChat() {
   const { user } = useAuth();
   const { toast } = useToast();
   const queryClient = useQueryClient();
 
   const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
     queryKey: ["ai_conversations", user?.id],
     queryFn: async () => {
       if (!user) return [];
       const { data, error } = await supabase
         .from("ai_conversations")
         .select("*")
         .eq("user_id", user.id)
         .order("updated_at", { ascending: false });
       if (error) throw error;
       return data as AIConversation[];
     },
     enabled: !!user,
   });
 
   const createConversation = useMutation({
     mutationFn: async (title: string = "New Chat") => {
       if (!user) throw new Error("Not authenticated");
       const { data, error } = await supabase
         .from("ai_conversations")
         .insert({
           user_id: user.id,
           title,
         })
         .select()
         .single();
       if (error) throw error;
       return data as AIConversation;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["ai_conversations"] });
     },
     onError: (err: Error) => {
       toast({ title: "Error", description: err.message, variant: "destructive" });
     },
   });
 
   const updateConversationTitle = useMutation({
     mutationFn: async ({ id, title }: { id: string; title: string }) => {
       if (!user) throw new Error("Not authenticated");
       const { data, error } = await supabase
         .from("ai_conversations")
         .update({ title })
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["ai_conversations"] });
     },
   });
 
   const deleteConversation = useMutation({
     mutationFn: async (id: string) => {
       if (!user) throw new Error("Not authenticated");
       const { error } = await supabase
         .from("ai_conversations")
         .delete()
         .eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["ai_conversations"] });
     },
     onError: (err: Error) => {
       toast({ title: "Error", description: err.message, variant: "destructive" });
     },
   });
 
   const addMessage = useMutation({
     mutationFn: async ({ conversationId, role, content }: { conversationId: string; role: "user" | "assistant"; content: string }) => {
       const { data, error } = await supabase
         .from("ai_messages")
         .insert({
           conversation_id: conversationId,
           role,
           content,
         })
         .select()
         .single();
       if (error) throw error;
       
       // Update conversation updated_at
       await supabase
         .from("ai_conversations")
         .update({ updated_at: new Date().toISOString() })
         .eq("id", conversationId);
       
       return data as AIMessage;
     },
     onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: ["ai_messages", variables.conversationId] });
       queryClient.invalidateQueries({ queryKey: ["ai_conversations"] });
     },
   });
 
   const fetchMessages = async (conversationId: string) => {
     const { data, error } = await supabase
       .from("ai_messages")
       .select("*")
       .eq("conversation_id", conversationId)
       .order("created_at", { ascending: true });
     if (error) throw error;
     return data as AIMessage[];
   };
 
   return { 
     conversations, 
     conversationsLoading, 
     fetchMessages,
     createConversation, 
     updateConversationTitle,
     deleteConversation, 
     addMessage 
   };
 }