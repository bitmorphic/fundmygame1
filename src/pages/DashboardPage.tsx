import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, IndianRupee, Trophy, Eye, Heart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { athletes } from "@/data/mockData";

const dashboardStats = [
  { label: "Total Athletes", value: "12,847", icon: Users, change: "+12%" },
  { label: "Funds Distributed", value: "₹42.5L", icon: IndianRupee, change: "+28%" },
  { label: "Active Sponsors", value: "856", icon: Trophy, change: "+8%" },
  { label: "Profile Views", value: "1.2M", icon: Eye, change: "+45%" },
];

const topAthletes = athletes.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 5);

const DashboardPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container pt-24 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Platform analytics and performance overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium text-primary">{stat.change}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trending Athletes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Trending Athletes
          </h2>
          <div className="space-y-3">
            {topAthletes.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <span className="font-display font-bold text-muted-foreground w-6 text-center">#{i + 1}</span>
                <img src={a.avatar} alt={a.name} className="h-9 w-9 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.sport} · {a.state}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Star className="h-3 w-3" /> {a.trendingScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" /> Impact Stories
          </h2>
          <div className="space-y-4">
            {[
              { text: "Your ₹500 helped Priya reach district finals", amount: "₹500", athlete: "Priya Sharma", result: "District Finals" },
              { text: "₹2,000 funded Arjun's first professional bow", amount: "₹2,000", athlete: "Arjun Meena", result: "Equipment Upgrade" },
              { text: "₹1,000 sponsored Kavitha's national travel", amount: "₹1,000", athlete: "Kavitha Devi", result: "National Bronze" },
            ].map((impact, i) => (
              <div key={i} className="p-4 rounded-xl bg-secondary/30 border-l-2 border-primary">
                <p className="text-sm text-foreground mb-1">{impact.text}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-primary font-medium">{impact.amount}</span>
                  <span>→</span>
                  <span className="text-accent font-medium">{impact.result}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Engagement chart placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-2">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Monthly Engagement
          </h2>
          <div className="flex items-end gap-2 h-40">
            {[45, 62, 38, 71, 55, 88, 76, 92, 68, 85, 95, 78].map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex-1 rounded-t-md"
                style={{
                  background: `linear-gradient(to top, hsl(160 60% 35%), hsl(160 60% ${35 + val * 0.2}%))`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default DashboardPage;
