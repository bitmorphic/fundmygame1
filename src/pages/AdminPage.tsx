import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, IndianRupee, MessageCircle, Trophy, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, athletes: 0, payments: 0, totalFunds: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, role, authLoading]);

  useEffect(() => {
    if (!user || role !== "admin") return;
    loadData();
  }, [user, role]);

  const loadData = async () => {
    setLoading(true);
    const [profilesRes, athletesRes, paymentsRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("athlete_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

    const profilesList = profilesRes.data || [];
    const athletesList = athletesRes.data || [];
    const paymentsList = paymentsRes.data || [];
    const rolesList = rolesRes.data || [];

    // Merge roles into profiles
    const usersWithRoles = profilesList.map((p) => ({
      ...p,
      role: rolesList.find((r) => r.user_id === p.user_id)?.role || "unknown",
    }));

    setUsers(usersWithRoles);
    setAthletes(athletesList.map((a) => {
      const profile = profilesList.find((p) => p.user_id === a.user_id);
      return { ...a, full_name: profile?.full_name || "Unknown", avatar_url: profile?.avatar_url };
    }));
    setPayments(paymentsList);
    setStats({
      users: profilesList.length,
      athletes: athletesList.length,
      payments: paymentsList.length,
      totalFunds: paymentsList.reduce((sum, p) => sum + p.amount, 0),
    });
    setLoading(false);
  };

  const toggleVerify = async (athleteId: string, current: boolean) => {
    const { error } = await supabase
      .from("athlete_profiles")
      .update({ verified: !current })
      .eq("id", athleteId);
    if (error) toast.error("Failed to update");
    else {
      toast.success(current ? "Athlete unverified" : "Athlete verified!");
      loadData();
    }
  };

  const filteredUsers = users.filter((u) =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24 pb-12 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-primary" },
    { label: "Athletes", value: stats.athletes, icon: Trophy, color: "text-accent" },
    { label: "Payments", value: stats.payments, icon: IndianRupee, color: "text-primary" },
    { label: "Total Funds", value: `₹${stats.totalFunds.toLocaleString()}`, icon: IndianRupee, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-7 w-7 text-primary" />
            <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage users, verify athletes, and monitor platform activity</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-secondary/50 border-border" />
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                        {u.full_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{u.full_name || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{u.city && u.state ? `${u.city}, ${u.state}` : "No location"}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize border-border">
                        {u.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="athletes">
            <div className="glass-card p-6">
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {athletes.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium text-sm">
                        {a.full_name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.full_name}</p>
                        <p className="text-xs text-muted-foreground">{a.sport || "No sport"} · Score: {a.athlete_score || 0}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.verified ? (
                          <Badge className="bg-primary/20 text-primary border-0 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Unverified
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant={a.verified ? "outline" : "default"}
                          onClick={() => toggleVerify(a.id, a.verified)}
                          className="text-xs h-7"
                        >
                          {a.verified ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {athletes.length === 0 && <p className="text-center text-muted-foreground py-8">No athletes registered yet</p>}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="glass-card p-6">
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">₹{p.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{p.tier || "custom"} tier · {p.anonymous ? "Anonymous" : "Named"}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                  {payments.length === 0 && <p className="text-center text-muted-foreground py-8">No payments yet</p>}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
