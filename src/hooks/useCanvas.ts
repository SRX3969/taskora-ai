import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface CanvasElement {
  id: string;
  type: "sticky" | "rectangle" | "circle" | "line" | "text" | "pen";
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  content?: string;
  points?: { x: number; y: number }[];
  rotation?: number;
}

export interface Canvas {
  id: string;
  title: string;
  data: Json | null;
  created_at: string;
  updated_at: string;
}

export function useCanvas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: canvases = [], isLoading } = useQuery({
    queryKey: ["canvases", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("canvases")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Canvas[];
    },
    enabled: !!user,
  });

  const createCanvas = useMutation({
    mutationFn: async (title: string = "Untitled Canvas") => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("canvases")
        .insert({
          user_id: user.id,
          title,
          data: { elements: [] } as unknown as Json,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Canvas;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canvases"] });
      toast({ title: "Canvas created", description: "Your new canvas is ready." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateCanvas = useMutation({
    mutationFn: async ({ id, data, title }: { id: string; data?: { elements: CanvasElement[] }; title?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const updates: { data?: Json; title?: string } = {};
      if (data) updates.data = data as unknown as Json;
      if (title) updates.title = title;
      
      const { data: result, error } = await supabase
        .from("canvases")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      return result as Canvas;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canvases"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteCanvas = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("canvases")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canvases"] });
      toast({ title: "Canvas deleted", description: "Your canvas has been removed." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return { canvases, isLoading, createCanvas, updateCanvas, deleteCanvas };
}
