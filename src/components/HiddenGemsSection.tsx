import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { athletes } from "@/data/mockData";
import AthleteCard from "./AthleteCard";

const HiddenGemsSection = () => {
  const gems = athletes.filter((a) => a.underdogScore >= 80).sort((a, b) => b.underdogScore - a.underdogScore);

  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Hidden Gems</h2>
            <p className="text-sm text-muted-foreground">AI-discovered high-potential athletes from underserved regions</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gems.map((athlete, i) => (
            <AthleteCard key={athlete.id} athlete={athlete} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HiddenGemsSection;
