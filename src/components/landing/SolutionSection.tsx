import { 
  Combine, 
  Brain, 
  Zap 
} from "lucide-react";

const solutions = [
  {
    icon: Combine,
    title: "One Unified Workspace",
    description: "Everything you need in one place. Chat, tasks, calendar, notes, and more - all connected seamlessly."
  },
  {
    icon: Brain,
    title: "AI That Understands Your Work",
    description: "Our AI learns your patterns, summarizes discussions, and proactively helps you stay on top of everything."
  },
  {
    icon: Zap,
    title: "Everything Connected",
    description: "Link messages to tasks, tasks to calendar events, notes to projects. Context travels with you."
  }
];

export function SolutionSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            There's a Better Way
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proddy brings all your work together in one intelligent platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {solutions.map((solution, index) => (
            <div 
              key={solution.title} 
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                <solution.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-3">{solution.title}</h3>
              <p className="text-muted-foreground">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
