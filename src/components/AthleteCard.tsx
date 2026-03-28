import { motion } from "framer-motion";
import { TrendingUp, Flame, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Athlete } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

const AthleteCard = ({ athlete, index = 0 }: { athlete: Athlete; index?: number }) => {
  const fundingPercent = Math.round((athlete.fundsReceived / athlete.fundingGoal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/athlete/${athlete.id}`} className="block group">
        <div className="glass-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-10px_hsl(160_60%_45%/0.2)]">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={athlete.avatar}
              alt={athlete.name}
              className="h-14 w-14 rounded-xl object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">{athlete.name}</h3>
              <p className="text-sm text-muted-foreground">{athlete.sport}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                {athlete.city}, {athlete.state}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-xs font-medium text-primary">
                <Star className="h-3 w-3" /> {athlete.athleteScore}
              </div>
              {athlete.underdogScore >= 85 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                  <Flame className="h-3 w-3" /> Hidden Gem
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {athlete.stats.slice(0, 3).map((s) => (
              <div key={s.label} className="rounded-lg bg-secondary/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Funded</span>
              <span className="font-medium text-primary">₹{(athlete.fundsReceived / 1000).toFixed(0)}k / ₹{(athlete.fundingGoal / 1000).toFixed(0)}k</span>
            </div>
            <Progress value={fundingPercent} className="h-1.5 bg-secondary" />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span>+{athlete.growthPrediction}% growth predicted</span>
            </div>
            <span className="text-xs font-medium text-primary group-hover:underline">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AthleteCard;
