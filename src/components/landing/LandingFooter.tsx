import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

export function LandingFooter() {
  const { toast } = useToast();

  const handleComingSoon = (label: string) => {
    toast({ title: label, description: "This page is coming soon!" });
  };

  return (
    <footer className="py-12 border-t bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your AI-powered productivity workspace for modern teams.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => { const el = document.getElementById("features"); el?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-foreground transition-colors">Features</button></li>
              <li><button onClick={() => handleComingSoon("Pricing")} className="hover:text-foreground transition-colors">Pricing</button></li>
              <li><button onClick={() => handleComingSoon("Integrations")} className="hover:text-foreground transition-colors">Integrations</button></li>
              <li><button onClick={() => handleComingSoon("Changelog")} className="hover:text-foreground transition-colors">Changelog</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => handleComingSoon("About")} className="hover:text-foreground transition-colors">About</button></li>
              <li><button onClick={() => handleComingSoon("Blog")} className="hover:text-foreground transition-colors">Blog</button></li>
              <li><button onClick={() => handleComingSoon("Careers")} className="hover:text-foreground transition-colors">Careers</button></li>
              <li><button onClick={() => handleComingSoon("Contact")} className="hover:text-foreground transition-colors">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => handleComingSoon("Privacy Policy")} className="hover:text-foreground transition-colors">Privacy</button></li>
              <li><button onClick={() => handleComingSoon("Terms of Service")} className="hover:text-foreground transition-colors">Terms</button></li>
              <li><button onClick={() => handleComingSoon("Security")} className="hover:text-foreground transition-colors">Security</button></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Taskora AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}