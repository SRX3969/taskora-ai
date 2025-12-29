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
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Preferences", icon: Bot },
  { id: "team", label: "Team", icon: Users },
  { id: "security", label: "Security", icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

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
                        <Input id="firstName" defaultValue="Alex" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Morgan" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alex@proddy.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue="Product Manager" />
                    </div>
                  </div>

                  <Button>Save Changes</Button>
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
                    { label: "Email notifications", description: "Receive email for important updates" },
                    { label: "Push notifications", description: "Get notified in your browser" },
                    { label: "Message notifications", description: "Notify for new messages" },
                    { label: "Task reminders", description: "Remind about upcoming deadlines" },
                    { label: "Meeting reminders", description: "15 minutes before meetings" },
                    { label: "Weekly digest", description: "Summary of your weekly activity" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked={index < 4} />
                    </div>
                  ))}
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
                    { label: "Daily summary", description: "Generate AI summary of your day" },
                    { label: "Smart suggestions", description: "AI suggests tasks and follow-ups" },
                    { label: "Auto-categorize", description: "Automatically categorize messages" },
                    { label: "Meeting summaries", description: "Summarize meetings automatically" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
