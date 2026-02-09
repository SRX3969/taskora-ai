import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";
import { useToast } from "@/hooks/use-toast";

export function HeroSection() {
  const { toast } = useToast();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
      
      {/* Floating shapes */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-300" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 animate-fade-up">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Productivity
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up animation-delay-100">
            Your AI-Powered{" "}
            <span className="gradient-text">Productivity</span>{" "}
            Workspace
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up animation-delay-200 text-balance">
            Stop switching between apps. Taskora AI combines messaging, tasks, calendar, notes, and AI assistance into one intelligent workspace that understands your work.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button 
              variant="hero-outline" 
              size="xl"
              onClick={() => toast({ title: "Coming soon", description: "Demo video is being prepared. Sign up to get notified!" })}
            >
              <Play className="w-5 h-5 mr-1" />
              Watch Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 animate-fade-up animation-delay-400">
            Free forever for individuals • No credit card required
          </p>
        </div>
        
        {/* Hero Image */}
        <div className="mt-16 relative animate-fade-up animation-delay-500">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            <img 
              src={heroImage} 
              alt="Taskora AI Dashboard Preview" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
    </svg>
  );
}