import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { icon: Users, value: "12,000+", label: "Athletes" },
  { icon: Trophy, value: "₹4.2Cr", label: "Funded" },
  { icon: TrendingUp, value: "850+", label: "Sponsors" },
];

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
    {/* Background effects */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(160_60%_20%/0.15),_transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(42_90%_40%/0.08),_transparent_50%)]" />
    <div className="absolute top-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[100px] animate-pulse-glow" />

    <div className="container relative z-10">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Athlete Discovery
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          Discover.{" "}
          <span className="gradient-text-primary">Fund.</span>
          <br />
          <span className="gradient-text-accent">Champion</span> Athletes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-xl mb-8"
        >
          AI finds the hidden gems in sports. Sponsors connect. Fans fund.
          Every athlete deserves a shot — we make it happen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-16"
        >
          <Link to="/discover">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary gap-2 text-base px-8">
              Discover Athletes <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/sponsors">
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-2 text-base px-8">
              I'm a Sponsor
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex gap-8 sm:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
