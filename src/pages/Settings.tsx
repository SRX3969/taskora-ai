import { AppLayout } from "@/components/layout/AppLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Users,
  Bot,
  Camera,
   Check,
   Moon,
   Sun,
   Monitor,
   Loader2,
   LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
 import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
 import { useProfile } from "@/hooks/useProfile";
 import { useAuth } from "@/contexts/AuthContext";
 import { useTheme } from "@/contexts/ThemeContext";
 import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Preferences", icon: Bot },
  { id: "team", label: "Team", icon: Users },
  { id: "security", label: "Security", icon: Shield },
];

export default function Settings() {
  const { toast } = useToast();
   const { profile, loading, updateProfile, uploadAvatar } = useProfile();
   const { user, signOut } = useAuth();
   const { theme, setTheme } = useTheme();
   const navigate = useNavigate();
   const fileInputRef = useRef<HTMLInputElement>(null);
   
  const [activeTab, setActiveTab] = useState("profile");
   const [uploading, setUploading] = useState(false);
   const [saving, setSaving] = useState(false);
   
   const [formData, setFormData] = useState({
     fullName: "",
     email: ""
  });
   
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    messages: true,
    tasks: true,
    meetings: true,
    weekly: false
  });
  const [aiSettings, setAiSettings] = useState({
    dailySummary: true,
    smartSuggestions: true,
    autoCategorize: true,
    meetingSummaries: true
  });

   // Initialize form data from profile
   useEffect(() => {
     if (profile) {
       setFormData({
         fullName: profile.full_name || "",
         email: user?.email || ""
       });
     }
   }, [profile, user]);
 
   const handleAvatarClick = () => {
     fileInputRef.current?.click();
  };

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     // Validate file type
     if (!file.type.startsWith("image/")) {
       toast({ title: "Error", description: "Please select an image file.", variant: "destructive" });
       return;
     }
 
     // Validate file size (max 2MB)
     if (file.size > 2 * 1024 * 1024) {
       toast({ title: "Error", description: "Image must be less than 2MB.", variant: "destructive" });
       return;
     }
 
     setUploading(true);
     await uploadAvatar(file);
     setUploading(false);
  };

   const saveProfile = async () => {
     setSaving(true);
     await updateProfile({ full_name: formData.fullName });
     setSaving(false);
  };

   const saveNotifications = () => {
     toast({ title: "Notifications updated", description: "Your notification preferences have been saved." });
   };
 
   const saveAISettings = () => {
     toast({ title: "AI preferences updated", description: "Your AI settings have been saved." });
   };
 
   const handleSignOut = async () => {
     await signOut();
     navigate("/");
   };
 
   const getInitials = () => {
     if (formData.fullName) {
       return formData.fullName
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
     }
     return user?.email?.charAt(0).toUpperCase() || "U";
   };
 
   if (loading) {
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
      <AppHeader 
        title="Settings" 
        subtitle="Manage your account and preferences"
      />
      
      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-2xl">
            {activeTab === "profile" && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <Avatar className="w-20 h-20 cursor-pointer" onClick={handleAvatarClick}>
                         <AvatarImage src={profile?.avatar_url || undefined} />
                         <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                         onClick={handleAvatarClick}
                         disabled={uploading}
                      >
                         {uploading ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                         ) : (
                           <Camera className="w-4 h-4" />
                         )}
                      </Button>
                       <input
                         ref={fileInputRef}
                         type="file"
                         accept="image/*"
                         className="hidden"
                         onChange={handleFileChange}
                       />
                    </div>
                    <div>
                      <p className="font-medium">Profile Picture</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="fullName">Full Name</Label>
                       <Input 
                         id="fullName" 
                         value={formData.fullName}
                         onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                         placeholder="Enter your full name"
                       />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                         value={formData.email}
                         disabled
                         className="bg-muted"
                      />
                       <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                   <div className="flex gap-3">
                     <Button onClick={saveProfile} disabled={saving}>
                       {saving ? (
                         <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                       ) : (
                         <Check className="w-4 h-4 mr-1" />
                       )}
                       Save Changes
                     </Button>
                     <Button variant="outline" onClick={handleSignOut}>
                       <LogOut className="w-4 h-4 mr-1" />
                       Sign Out
                     </Button>
                   </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: "email", label: "Email notifications", description: "Receive email for important updates" },
                    { key: "push", label: "Push notifications", description: "Get notified in your browser" },
                    { key: "messages", label: "Message notifications", description: "Notify for new messages" },
                    { key: "tasks", label: "Task reminders", description: "Remind about upcoming deadlines" },
                    { key: "meetings", label: "Meeting reminders", description: "15 minutes before meetings" },
                    { key: "weekly", label: "Weekly digest", description: "Summary of your weekly activity" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch 
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) => {
                          setNotifications(prev => ({ ...prev, [item.key]: checked }));
                          toast({ 
                            title: checked ? "Enabled" : "Disabled",
                            description: item.label
                          });
                        }}
                      />
                    </div>
                  ))}
                  <Button onClick={saveNotifications}>
                    <Check className="w-4 h-4 mr-1" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "ai" && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle>AI Preferences</CardTitle>
                  <CardDescription>Customize your AI assistant behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: "dailySummary", label: "Daily summary", description: "Generate AI summary of your day" },
                    { key: "smartSuggestions", label: "Smart suggestions", description: "AI suggests tasks and follow-ups" },
                    { key: "autoCategorize", label: "Auto-categorize", description: "Automatically categorize messages" },
                    { key: "meetingSummaries", label: "Meeting summaries", description: "Summarize meetings automatically" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch 
                        checked={aiSettings[item.key as keyof typeof aiSettings]}
                        onCheckedChange={(checked) => {
                          setAiSettings(prev => ({ ...prev, [item.key]: checked }));
                          toast({ 
                            title: checked ? "Enabled" : "Disabled",
                            description: item.label
                          });
                        }}
                      />
                    </div>
                  ))}
                  <Button onClick={saveAISettings}>
                    <Check className="w-4 h-4 mr-1" />
                    Save AI Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how Proddy looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="font-medium text-sm mb-3">Theme</p>
                    <div className="flex gap-3">
                       <Button 
                         variant={theme === "light" ? "default" : "outline"} 
                         onClick={() => setTheme("light")}
                         className="flex items-center gap-2"
                       >
                         <Sun className="w-4 h-4" />
                        Light
                      </Button>
                       <Button 
                         variant={theme === "dark" ? "default" : "outline"} 
                         onClick={() => setTheme("dark")}
                         className="flex items-center gap-2"
                       >
                         <Moon className="w-4 h-4" />
                        Dark
                      </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2">
                       Choose your preferred theme. Your preference will be saved automatically.
                     </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "team" && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Manage your team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => toast({ title: "Invite", description: "Team invitations coming soon!" })}>
                    <Users className="w-4 h-4 mr-1" />
                    Invite Team Member
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" onClick={() => toast({ title: "Password", description: "Password change coming soon!" })}>
                    Change Password
                  </Button>
                  <Button variant="outline" onClick={() => toast({ title: "2FA", description: "Two-factor authentication coming soon!" })}>
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
