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
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex@proddy.com",
    role: "Product Manager"
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

  const saveProfile = () => {
    toast({ title: "Profile saved", description: "Your changes have been saved successfully." });
  };

  const saveNotifications = () => {
    toast({ title: "Notifications updated", description: "Your notification preferences have been saved." });
  };

  const saveAISettings = () => {
    toast({ title: "AI preferences updated", description: "Your AI settings have been saved." });
  };

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
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                        onClick={() => toast({ title: "Upload avatar", description: "Avatar upload coming soon!" })}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium">Profile Picture</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={profile.role}
                        onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button onClick={saveProfile}>
                    <Check className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
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
                      <Button variant="outline" onClick={() => toast({ title: "Theme", description: "Light mode active" })}>
                        Light
                      </Button>
                      <Button variant="outline" onClick={() => toast({ title: "Theme", description: "Dark mode coming soon!" })}>
                        Dark
                      </Button>
                      <Button variant="outline" onClick={() => toast({ title: "Theme", description: "System preference will be used" })}>
                        System
                      </Button>
                    </div>
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
