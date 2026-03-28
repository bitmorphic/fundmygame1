import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Flame, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AthleteCard from "@/components/AthleteCard";
import { athletes } from "@/data/mockData";

const sports = ["All", "Boxing", "Archery", "Weightlifting", "Wrestling", "Athletics", "Hockey"];
const sortOptions = [
  { label: "Athlete Score", icon: Star, key: "athleteScore" },
  { label: "Underdog Score", icon: Flame, key: "underdogScore" },
  { label: "Trending", icon: TrendingUp, key: "trendingScore" },
] as const;

const DiscoverPage = () => {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [sortBy, setSortBy] = useState<string>("athleteScore");

  const filtered = athletes
    .filter((a) => (sportFilter === "All" || a.sport === sportFilter))
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.sport.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b as any)[sortBy] - (a as any)[sortBy]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Discover Athletes</h1>
          <p className="text-muted-foreground">Find and support the next generation of champions</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes, sports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            {sortOptions.map((opt) => (
              <Button
                key={opt.key}
                variant={sortBy === opt.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(opt.key)}
                className={sortBy === opt.key ? "bg-primary text-primary-foreground" : "border-border text-muted-foreground"}
              >
                <opt.icon className="h-3.5 w-3.5 mr-1.5" />
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {sports.map((sport) => (
            <Badge
              key={sport}
              variant={sportFilter === sport ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                sportFilter === sport
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border text-muted-foreground hover:bg-secondary"
              }`}
              onClick={() => setSportFilter(sport)}
            >
              {sport}
            </Badge>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((athlete, i) => (
            <AthleteCard key={athlete.id} athlete={athlete} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Filter className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No athletes found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DiscoverPage;
