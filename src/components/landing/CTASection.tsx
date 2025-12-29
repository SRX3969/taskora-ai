import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-accent p-px">
          <div className="bg-card rounded-3xl p-8 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Stop Switching Apps.{" "}
                <span className="gradient-text">Start Getting Work Done.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of teams who've simplified their workflow with Proddy. 
                Free forever for individuals, powerful plans for teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/auth">
                    Start for Free
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl">
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
