import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface BoardCard {
  id: string;
  title: string;
  description: string | null;
  column_id: string;
  position: number;
  created_at: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  board_id: string;
  position: number;
  created_at: string;
  cards: BoardCard[];
}

export interface Board {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useBoards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all boards
  const { data: boards = [], isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Board[];
    },
    enabled: !!user,
  });

  // Create default board if none exists
  const createBoard = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("boards")
        .insert({ user_id: user.id, title })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  return { boards, boardsLoading, createBoard };
}

export function useBoardColumns(boardId: string | null) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch columns with cards
  const { data: columns = [], isLoading } = useQuery({
    queryKey: ["board_columns", boardId],
    queryFn: async () => {
      if (!boardId) return [];
      
      const { data: columnsData, error: columnsError } = await supabase
        .from("board_columns")
        .select("*")
        .eq("board_id", boardId)
        .order("position", { ascending: true });
      
      if (columnsError) throw columnsError;

      const { data: cardsData, error: cardsError } = await supabase
        .from("board_cards")
        .select("*")
        .in("column_id", columnsData.map(c => c.id))
        .order("position", { ascending: true });

      if (cardsError) throw cardsError;

      return columnsData.map(col => ({
        ...col,
        cards: cardsData.filter(card => card.column_id === col.id),
      })) as BoardColumn[];
    },
    enabled: !!boardId,
  });

  const createColumn = useMutation({
    mutationFn: async ({ title, position }: { title: string; position: number }) => {
      if (!boardId) throw new Error("No board selected");
      const { data, error } = await supabase
        .from("board_columns")
        .insert({ board_id: boardId, title, position })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_columns"] });
      toast({ title: "Column added" });
    },
  });

  const createCard = useMutation({
    mutationFn: async ({ columnId, title, position }: { columnId: string; title: string; position: number }) => {
      const { data, error } = await supabase
        .from("board_cards")
        .insert({ column_id: columnId, title, position })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_columns"] });
      toast({ title: "Card added" });
    },
  });

  const updateCard = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BoardCard> & { id: string }) => {
      const { data, error } = await supabase
        .from("board_cards")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_columns"] });
    },
  });

  const deleteCard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("board_cards")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_columns"] });
      toast({ title: "Card deleted" });
    },
  });

  const moveCard = useMutation({
    mutationFn: async ({ cardId, newColumnId, newPosition }: { cardId: string; newColumnId: string; newPosition: number }) => {
      const { error } = await supabase
        .from("board_cards")
        .update({ column_id: newColumnId, position: newPosition })
        .eq("id", cardId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board_columns"] });
      toast({ title: "Card moved" });
    },
  });

  return { columns, isLoading, createColumn, createCard, updateCard, deleteCard, moveCard };
}
