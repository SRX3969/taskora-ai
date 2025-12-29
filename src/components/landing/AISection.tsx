import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MessageCircle, 
  Search, 
  FileText, 
  Lightbulb,
  Wand2
} from "lucide-react";

const aiFeatures = [
  {
    icon: Sparkles,
    title: "Daily Recaps",
    description: "Get AI-generated summaries of what happened while you were away."
  },
  {
    icon: MessageCircle,
    title: "Smart Replies",
    description: "AI suggests contextual responses to messages, saving you time."
  },
  {
    icon: Search,
    title: "Contextual Search",
    description: "Ask questions in natural language across all your workspace data."
  },
  {
    icon: Wand2,
    title: "Text-to-Diagram",
    description: "Describe what you want and let AI create flowcharts and diagrams."
  },
  {
    icon: FileText,
    title: "Auto Summaries",
    description: "Long threads and documents automatically summarized for quick reading."
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description: "AI proactively suggests tasks, follow-ups, and next actions."
  }
];

export function AISection() {
  return (
    <section id="ai" className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="accent" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-First
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI That Works <span className="gradient-text">For You</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI assistant understands your work context and helps you stay productive without the overhead.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {aiFeatures.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="feature"
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
