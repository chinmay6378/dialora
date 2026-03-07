import { Button } from "@/components/ui/button";
import { Check, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  { name: "Starter", credits: "100", price: "1,599", description: "Perfect for testing the waters", features: ["100 AI call credits", "5 campaigns", "1 knowledge doc", "Email support", "Basic analytics"], popular: false },
  { name: "Growth", credits: "500", price: "3,999", description: "For growing sales teams", features: ["500 AI call credits", "Unlimited campaigns", "10 knowledge docs", "Priority support", "Advanced analytics", "Custom AI scripts"], popular: true },
  { name: "Scale", credits: "1000", price: "6,999", description: "For high-volume outreach", features: ["1,000 AI call credits", "Unlimited campaigns", "Unlimited docs", "Dedicated support", "Full analytics suite", "API access", "Team seats"], popular: false },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Simple, credit-based pricing</h2>
          <p className="text-xl text-muted-foreground">No subscriptions. Buy credits, use them anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? "gradient-primary text-primary-foreground shadow-2xl scale-105 btn-glow"
                  : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background text-foreground text-xs font-semibold border border-border">
                  Most Popular
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className={`text-sm mt-1 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <IndianRupee className="w-6 h-6" />
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={`text-sm ml-2 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    / {plan.credits} credits
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-xl py-6 ${
                    plan.popular
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "gradient-primary border-0 btn-glow"
                  }`}
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
