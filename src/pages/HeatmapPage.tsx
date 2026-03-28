import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { stateAthleteCount } from "@/data/mockData";

const sortedStates = Object.entries(stateAthleteCount).sort(([, a], [, b]) => b - a);
const maxCount = sortedStates[0][1];

const HeatmapPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container pt-24 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="h-7 w-7 text-primary" /> Talent Heatmap
        </h1>
        <p className="text-muted-foreground">Discover where India's hidden sporting talent is concentrated</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedStates.map(([state, count], i) => {
          const intensity = count / maxCount;
          return (
            <motion.div
              key={state}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-4 group hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-foreground">{state}</h3>
                <span className="text-sm font-bold text-primary">{count.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${intensity * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.03 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(160 60% 35%), hsl(160 60% ${35 + intensity * 25}%))`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {intensity > 0.7 ? "🔥 Talent Hotspot" : intensity > 0.4 ? "⚡ Growing Region" : "🌱 Emerging"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
    <Footer />
  </div>
);

export default HeatmapPage;
