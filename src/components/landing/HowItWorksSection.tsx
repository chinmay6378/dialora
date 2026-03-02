import { Upload, Cpu, PhoneCall } from "lucide-react";

const steps = [
  { icon: Upload, step: "01", title: "Upload Your Data", description: "Upload your company knowledge docs and Excel lead sheet with phone numbers." },
  { icon: Cpu, step: "02", title: "Train Your AI Agent", description: "The AI learns your products, services, and talking points from your documents." },
  { icon: PhoneCall, step: "03", title: "Launch Campaigns", description: "Start your campaign and let the AI call, qualify, and report back on every lead." },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Three steps to automated outreach</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center space-y-6">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}
              <div className="w-24 h-24 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-lg btn-glow">
                <s.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {s.step}</span>
              <h3 className="text-2xl font-semibold text-foreground">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
