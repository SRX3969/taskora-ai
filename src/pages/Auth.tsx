import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = authSchema.safeParse({ email, password, name: isLogin ? undefined : name });
      if (!validation.success) {
        toast({ title: "Validation Error", description: validation.error.errors[0].message, variant: "destructive" });
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message === "Invalid login credentials" ? "Invalid email or password." : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Welcome back!", description: "You've successfully signed in." });
          navigate("/dashboard");
        }
      } else {
        if (!name.trim()) {
          toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            title: error.message.includes("already registered") ? "Account Exists" : "Sign Up Failed",
            description: error.message.includes("already registered") ? "This email is already registered." : error.message,
            variant: "destructive",
          });
        } else {
          toast({ title: "Account Created!", description: "Welcome to Taskora AI." });
          navigate("/dashboard");
        }
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding / Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
        {/* Floating orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse-slow" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-primary-foreground">
          <div className="mb-8 animate-fade-up">
            <Sparkles className="w-16 h-16 mb-6 opacity-80" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center animate-fade-up animation-delay-100">
            Your AI-Powered Workspace
          </h2>
          <p className="text-lg opacity-80 text-center max-w-md animate-fade-up animation-delay-200">
            Messaging, tasks, calendar, notes, and AI — all in one place. Focus on what matters.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-10 justify-center animate-fade-up animation-delay-300">
            {["Smart Tasks", "AI Recap", "Team Chat", "Canvas"].map((f) => (
              <span key={f} className="px-4 py-1.5 rounded-full bg-primary-foreground/15 text-sm font-medium backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        {/* Subtle background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-10 animate-fade-up">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <Logo size="lg" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Sign in to continue to your workspace" : "Start your productivity journey today"}
            </p>
          </div>

          <Card className="shadow-xl border-border/50 animate-fade-up animation-delay-100">
            <CardContent className="pt-8 pb-8 px-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="name" placeholder="Alex Morgan" className="pl-10 h-11" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="alex@example.com" className="pl-10 h-11" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-11" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="hero" className="flex-1 h-11" type="submit" disabled={loading}>
                    {loading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isLogin ? "Signing In..." : "Creating..."}</>
                    ) : (
                      <>{isLogin ? "Sign In" : "Create Account"}<ArrowRight className="w-4 h-4 ml-1" /></>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-up animation-delay-200">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-semibold" disabled={loading}>
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
