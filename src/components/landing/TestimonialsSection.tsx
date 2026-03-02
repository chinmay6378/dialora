const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP Sales, TechFlow",
    quote: "VoiceAI Pro replaced 3 SDRs and increased our qualified pipeline by 240%. The AI sounds incredibly natural.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Founder, GrowthLab",
    quote: "We uploaded our leads on Monday, launched Tuesday, and had 47 interested prospects by Friday. Game changer.",
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Growth, Scaleup.io",
    quote: "The knowledge training feature is brilliant. Our AI agent handles objections better than most reps.",
    avatar: "ER",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold">Loved by sales teams</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="p-8 rounded-2xl glass hover:shadow-lg transition-all duration-300">
              <p className="text-foreground/90 leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
