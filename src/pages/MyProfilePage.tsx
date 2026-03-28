import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Save, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MyProfilePage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Athlete fields
  const [sport, setSport] = useState("");
  const [age, setAge] = useState("");
  const [achievements, setAchievements] = useState<string[]>([""]);
  const [fundingGoal, setFundingGoal] = useState("");

  // Sponsor fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (profile) {
        setFullName(profile.full_name || "");
        setBio(profile.bio || "");
        setCity(profile.city || "");
        setState(profile.state || "");
      }

      if (role === "athlete") {
        const { data } = await supabase.from("athlete_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (data) {
          setSport(data.sport || "");
          setAge(data.age?.toString() || "");
          setAchievements(data.achievements?.length ? data.achievements : [""]);
          setFundingGoal(data.funding_goal?.toString() || "");
        }
      } else if (role === "sponsor") {
        const { data } = await supabase.from("sponsor_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (data) {
          setCompanyName(data.company_name || "");
          setIndustry(data.industry || "");
          setBudgetMin(data.budget_min?.toString() || "");
          setBudgetMax(data.budget_max?.toString() || "");
        }
      }
    };
    load();
  }, [user, role]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    await supabase.from("profiles").update({
      full_name: fullName, bio, city, state,
    }).eq("user_id", user.id);

    if (role === "athlete") {
      await supabase.from("athlete_profiles").update({
        sport,
        age: age ? parseInt(age) : null,
        achievements: achievements.filter(Boolean),
        funding_goal: fundingGoal ? parseInt(fundingGoal) : 100000,
      }).eq("user_id", user.id);
    } else if (role === "sponsor") {
      await supabase.from("sponsor_profiles").update({
        company_name: companyName,
        industry,
        budget_min: budgetMin ? parseInt(budgetMin) : 0,
        budget_max: budgetMax ? parseInt(budgetMax) : 0,
      }).eq("user_id", user.id);
    }

    toast.success("Profile saved!");
    setLoading(false);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground mb-8">
            {role === "athlete" ? "Set up your athlete profile" : role === "sponsor" ? "Set up your sponsor profile" : "Edit your profile"}
          </p>

          <div className="space-y-6">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display font-semibold text-lg">Basic Info</h2>
              <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-secondary border-border" />
              <Textarea placeholder="Bio – tell your story..." value={bio} onChange={(e) => setBio(e.target.value)} className="bg-secondary border-border min-h-[100px]" />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="bg-secondary border-border" />
                <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="bg-secondary border-border" />
              </div>
            </div>

            {role === "athlete" && (
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display font-semibold text-lg">Athlete Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Sport" value={sport} onChange={(e) => setSport(e.target.value)} className="bg-secondary border-border" />
                  <Input placeholder="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="bg-secondary border-border" />
                </div>
                <Input placeholder="Funding Goal (₹)" type="number" value={fundingGoal} onChange={(e) => setFundingGoal(e.target.value)} className="bg-secondary border-border" />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Achievements</p>
                  {achievements.map((a, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        placeholder="e.g. State Gold Medal 2024"
                        value={a}
                        onChange={(e) => {
                          const copy = [...achievements];
                          copy[i] = e.target.value;
                          setAchievements(copy);
                        }}
                        className="bg-secondary border-border"
                      />
                      {achievements.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => setAchievements(achievements.filter((_, j) => j !== i))}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setAchievements([...achievements, ""])} className="border-border text-muted-foreground">
                    <Plus className="h-3 w-3 mr-1" /> Add Achievement
                  </Button>
                </div>
              </div>
            )}

            {role === "sponsor" && (
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display font-semibold text-lg">Company Details</h2>
                <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-secondary border-border" />
                <Input placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="bg-secondary border-border" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Min Budget (₹)" type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} className="bg-secondary border-border" />
                  <Input placeholder="Max Budget (₹)" type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} className="bg-secondary border-border" />
                </div>
              </div>
            )}

            <Button onClick={handleSave} disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary gap-2">
              <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProfilePage;
