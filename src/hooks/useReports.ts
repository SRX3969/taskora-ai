import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, format } from "date-fns";

export interface ActivityStats {
  tasksCompleted: number;
  messagesSent: number;
  meetingsAttended: number;
  focusHours: number;
}

export function useReports(dateRange: "this_week" | "last_week" | "this_month" | "custom" = "this_week", customStart?: Date, customEnd?: Date) {
  const { user } = useAuth();

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "this_week":
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case "last_week":
        const lastWeek = subWeeks(now, 1);
        return { start: startOfWeek(lastWeek, { weekStartsOn: 1 }), end: endOfWeek(lastWeek, { weekStartsOn: 1 }) };
      case "this_month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "custom":
        return { start: customStart || now, end: customEnd || now };
      default:
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    }
  };

  const { start, end } = getDateRange();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["reports", user?.id, dateRange, start, end],
    queryFn: async (): Promise<ActivityStats> => {
      if (!user) return { tasksCompleted: 0, messagesSent: 0, meetingsAttended: 0, focusHours: 0 };

      const { data, error } = await supabase
        .from("user_activity")
        .select("activity_type, value")
        .eq("user_id", user.id)
        .gte("activity_date", format(start, "yyyy-MM-dd"))
        .lte("activity_date", format(end, "yyyy-MM-dd"));

      if (error) throw error;

      const stats: ActivityStats = {
        tasksCompleted: 0,
        messagesSent: 0,
        meetingsAttended: 0,
        focusHours: 0,
      };

      data?.forEach((activity) => {
        switch (activity.activity_type) {
          case "task_completed":
            stats.tasksCompleted += activity.value || 0;
            break;
          case "message_sent":
            stats.messagesSent += activity.value || 0;
            break;
          case "meeting_attended":
            stats.meetingsAttended += activity.value || 0;
            break;
          case "focus_time":
            stats.focusHours += activity.value || 0;
            break;
        }
      });

      return stats;
    },
    enabled: !!user,
  });

  const { data: weeklyData = [] } = useQuery({
    queryKey: ["reports_weekly", user?.id, dateRange, start, end],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_activity")
        .select("activity_type, value, activity_date")
        .eq("user_id", user.id)
        .gte("activity_date", format(start, "yyyy-MM-dd"))
        .lte("activity_date", format(end, "yyyy-MM-dd"))
        .order("activity_date");

      if (error) throw error;

      // Group by date
      const grouped: Record<string, { tasks: number; meetings: number; messages: number }> = {};
      
      data?.forEach((activity) => {
        const date = activity.activity_date;
        if (!grouped[date]) {
          grouped[date] = { tasks: 0, meetings: 0, messages: 0 };
        }
        
        switch (activity.activity_type) {
          case "task_completed":
            grouped[date].tasks += activity.value || 0;
            break;
          case "meeting_attended":
            grouped[date].meetings += activity.value || 0;
            break;
          case "message_sent":
            grouped[date].messages += activity.value || 0;
            break;
        }
      });

      return Object.entries(grouped).map(([date, values]) => ({
        day: format(new Date(date), "EEE"),
        ...values,
      }));
    },
    enabled: !!user,
  });

  return { stats: stats || { tasksCompleted: 0, messagesSent: 0, meetingsAttended: 0, focusHours: 0 }, weeklyData, isLoading };
}
