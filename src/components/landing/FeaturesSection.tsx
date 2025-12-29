import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  Layout, 
  FileText, 
  Palette, 
  Bot, 
  BarChart3 
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Messaging",
    description: "Team channels, DMs, threads, and AI-powered summaries.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: CheckSquare,
    title: "Tasks",
    description: "Create, assign, and track tasks with priorities and due dates.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Calendar,
    title: "Calendar",
    description: "Schedule meetings, deadlines, and sync with your team.",
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: Layout,
    title: "Boards",
    description: "Kanban-style project boards for visual tracking.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "Notes",
    description: "Rich documents with collaboration and AI formatting.",
    color: "from-indigo-500 to-violet-500"
  },
  {
    icon: Palette,
    title: "Canvas",
    description: "Visual whiteboard for brainstorming and diagrams.",
    color: "from-rose-500 to-red-500"
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Your smart helper for recaps, search, and automation.",
    color: "from-primary to-purple-500"
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Productivity insights and team analytics.",
    color: "from-teal-500 to-cyan-500"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit for modern work, designed to work together seamlessly.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="interactive"
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
