import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Flame, TrendingUp, MapPin, Trophy, Heart, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import { athletes, fundingTiers } from "@/data/mockData";
import { toast } from "sonner";

const AthleteProfilePage = () => {
  const { id } = useParams();
  const athlete = athletes.find((a) => a.id === id);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<typeof fundingTiers[0] | null>(null);

  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Athlete not found.</p>
      </div>
    );
  }

  const fundingPercent = Math.round((athlete.fundsReceived / athlete.fundingGoal) * 100);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-12">
        <Link to="/discover" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Discover
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main profile */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <div className="flex items-start gap-5 mb-6">
                <img src={athlete.avatar} alt={athlete.name} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/30" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-display text-2xl font-bold">{athlete.name}</h1>
                    {athlete.underdogScore >= 85 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        <Flame className="h-3 w-3" /> Hidden Gem
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{athlete.sport} · Age {athlete.age}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {athlete.city}, {athlete.state}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{athlete.bio}</p>

              {/* Score cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Athlete Score", value: athlete.athleteScore, icon: Star, color: "text-primary" },
                  { label: "Underdog Score", value: athlete.underdogScore, icon: Flame, color: "text-accent" },
                  { label: "Trending", value: athlete.trendingScore, icon: TrendingUp, color: "text-primary" },
                  { label: "Impact", value: athlete.impactScore, icon: Heart, color: "text-accent" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/50 p-3 text-center">
                    <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                    <p className="font-display text-xl font-bold">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" /> Performance Stats
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {athlete.stats.map((s) => (
                  <div key={s.label} className="rounded-xl bg-secondary/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                    <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" /> Achievements
              </h2>
              <div className="flex flex-wrap gap-2">
                {athlete.achievements.map((a) => (
                  <span key={a} className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm text-foreground">{a}</span>
                ))}
              </div>
            </motion.div>

            {/* Journey Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-6">Journey Timeline</h2>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
                {athlete.timeline.map((t, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <p className="text-xs text-muted-foreground font-medium">{t.year}</p>
                    <p className="text-sm text-foreground">{t.event}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Growth Prediction */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> AI Growth Prediction
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="font-display text-2xl font-bold text-primary">+{athlete.growthPrediction}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on current trajectory, training access, and competition history, our AI predicts a{" "}
                  <span className="text-primary font-medium">{athlete.growthPrediction}% performance improvement</span> over the next 12 months with proper funding.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 sticky top-24">
              <h2 className="font-display font-semibold text-lg mb-4">Fund This Athlete</h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-semibold text-primary">₹{athlete.fundsReceived.toLocaleString()}</span>
                </div>
                <Progress value={fundingPercent} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground text-right">{fundingPercent}% of ₹{athlete.fundingGoal.toLocaleString()}</p>
              </div>

              <div className="space-y-2 mb-4">
                {fundingTiers.map((tier) => (
                    <button
                      key={tier.amount}
                      onClick={() => {
                        setSelectedTier(tier);
                        setPaymentOpen(true);
                      }}
                      className="w-full flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{tier.emoji}</span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{tier.label}</p>
                        <p className="text-xs text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">₹{tier.amount}</span>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => toast.success("Share link copied!")}
                variant="outline"
                className="w-full border-border text-muted-foreground hover:text-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Profile
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        athleteId={athlete.id}
        athleteName={athlete.name}
        tier={selectedTier}
      />
      <Footer />
    </div>
  );
};

export default AthleteProfilePage;
