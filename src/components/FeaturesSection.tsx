import { motion } from "framer-motion";
import { Brain, MapPin, Target, TrendingUp, Sparkles, Share2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Underdog Discovery",
    description: "AI identifies high-potential athletes from underrepresented regions with our proprietary scoring engine.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Target,
    title: "Sponsor Match AI",
    description: "Smart matching connects brands with the perfect athletes based on budget, sport, and audience fit.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: MapPin,
    title: "Talent Heatmap",
    description: "Visual map showing athlete density across India. Discover talent hotspots in every state.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: TrendingUp,
    title: "Growth Prediction",
    description: "ML-powered forecasting predicts athlete trajectory, helping sponsors invest early in rising stars.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Sparkles,
    title: "AI Pitch Generator",
    description: "Automatically creates compelling sponsorship pitches for athletes to share with potential backers.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Share2,
    title: "Viral Share Cards",
    description: "Beautiful, shareable profile cards that athletes can post on social media to attract supporters.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const FeaturesSection = () => (
  <section className="py-24 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(160_60%_15%/0.08),_transparent_60%)]" />
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-medium text-primary">AI-Powered Platform</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2 mb-4">
          Built Different for <span className="gradient-text-primary">Real Impact</span>
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Every feature is designed to find, fund, and elevate athletes who deserve a chance.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.bg} mb-4`}>
              <f.icon className={`h-5 w-5 ${f.color}`} />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
