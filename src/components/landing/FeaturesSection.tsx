import { Bot, FileSpreadsheet, Brain, BarChart3, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Voice Agents",
    description: "Human-like AI agents that handle conversations naturally, qualify leads, and book meetings.",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel Lead Upload",
    description: "Simply upload your lead sheets and let the AI call through your entire list automatically.",
  },
  {
    icon: Brain,
    title: "Knowledge Training",
    description: "Upload your company docs — the AI learns your products, pricing, and objection handling.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track every call, see summaries, measure interest, and optimize your campaigns live.",
  },
  {
    icon: CreditCard,
    title: "Pay-as-you-go",
    description: "Simple credit-based pricing. Only pay for the calls you make, no monthly minimums.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC2 compliant, encrypted data, multi-tenant isolation. Your data stays yours.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold">Everything you need to automate outreach</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From lead upload to call analytics, VoiceAI Pro handles the entire outbound pipeline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl glass hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
