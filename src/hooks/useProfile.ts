 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { useToast } from "@/hooks/use-toast";
 
 export interface Profile {
   id: string;
   user_id: string;
   full_name: string | null;
   avatar_url: string | null;
   theme_preference: string | null;
   created_at: string;
   updated_at: string;
 }
 
 export function useProfile() {
   const { user } = useAuth();
   const { toast } = useToast();
   const [profile, setProfile] = useState<Profile | null>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     if (user) {
       fetchProfile();
     } else {
       setProfile(null);
       setLoading(false);
     }
   }, [user]);
 
   const fetchProfile = async () => {
     if (!user) return;
     
     try {
       const { data, error } = await supabase
         .from("profiles")
         .select("*")
         .eq("user_id", user.id)
         .single();
 
       if (error && error.code !== "PGRST116") {
         throw error;
       }
 
       setProfile(data);
     } catch (error) {
       console.error("Error fetching profile:", error);
     } finally {
       setLoading(false);
     }
   };
 
   const updateProfile = async (updates: Partial<Profile>) => {
     if (!user) return { error: new Error("No user") };
 
     try {
       const { data, error } = await supabase
         .from("profiles")
         .update({ ...updates, updated_at: new Date().toISOString() })
         .eq("user_id", user.id)
         .select()
         .single();
 
       if (error) throw error;
 
       setProfile(data);
       toast({ title: "Profile updated", description: "Your changes have been saved." });
       return { error: null };
     } catch (error) {
       console.error("Error updating profile:", error);
       toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
       return { error };
     }
   };
 
   const uploadAvatar = async (file: File) => {
     if (!user) return { error: new Error("No user"), url: null };
 
     try {
       const fileExt = file.name.split(".").pop();
       const fileName = `${user.id}/avatar.${fileExt}`;
 
       // Delete old avatar if exists
       await supabase.storage.from("avatars").remove([fileName]);
 
       // Upload new avatar
       const { error: uploadError } = await supabase.storage
         .from("avatars")
         .upload(fileName, file, { upsert: true });
 
       if (uploadError) throw uploadError;
 
       // Get public URL
       const { data: { publicUrl } } = supabase.storage
         .from("avatars")
         .getPublicUrl(fileName);
 
       // Add cache buster to URL
       const avatarUrl = `${publicUrl}?t=${Date.now()}`;
 
       // Update profile with new avatar URL
       await updateProfile({ avatar_url: avatarUrl });
 
       return { error: null, url: avatarUrl };
     } catch (error) {
       console.error("Error uploading avatar:", error);
       toast({ title: "Error", description: "Failed to upload avatar.", variant: "destructive" });
       return { error, url: null };
     }
   };
 
   return {
     profile,
     loading,
     updateProfile,
     uploadAvatar,
     refetch: fetchProfile,
   };
 }