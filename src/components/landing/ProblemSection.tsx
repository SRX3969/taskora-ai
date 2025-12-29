import { Card, CardContent } from "@/components/ui/card";
import { 
  Layers, 
  RefreshCw, 
  BellOff, 
  Users 
} from "lucide-react";

const problems = [
  {
    icon: Layers,
    title: "Too Many Tools",
    description: "Juggling between 10+ apps for basic work tasks drains your energy and focus."
  },
  {
    icon: RefreshCw,
    title: "Context Switching",
    description: "Constantly switching between apps breaks your flow and kills productivity."
  },
  {
    icon: BellOff,
    title: "Missed Updates",
    description: "Important messages and tasks get buried across disconnected platforms."
  },
  {
    icon: Users,
    title: "Poor Collaboration",
    description: "Team communication scattered across channels makes alignment impossible."
  }
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sound Familiar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modern work is fragmented. Your tools should bring clarity, not chaos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <Card 
              key={problem.title} 
              variant="glass"
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
