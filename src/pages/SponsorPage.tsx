import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Target, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AthleteCard from "@/components/AthleteCard";
import { athletes, sponsors } from "@/data/mockData";
import { streamChat } from "@/lib/ai";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SponsorPage = () => {
  const [chatMessages, setChatMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your **AI Sponsor Assistant**. Ask me to find athletes — e.g. *\"Find me a boxer under ₹30k with high engagement\"*" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const handleChat = async () => {
    if (!chatInput.trim() || isStreaming) return;
    const userMsg: Msg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsStreaming(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setChatMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...chatMessages, userMsg],
        onDelta: upsertAssistant,
        onDone: () => setIsStreaming(false),
      });
    } catch (e: any) {
      toast.error(e.message || "AI error");
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl font-bold mb-2">For Sponsors</h1>
          <p className="text-muted-foreground">Find your perfect athlete match with AI-powered recommendations</p>
        </motion.div>

        {/* Sponsor Brands */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sponsors.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 text-center"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 font-display font-bold text-primary text-lg">
                {s.logo}
              </div>
              <h3 className="font-semibold text-sm text-foreground">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.industry}</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-primary">
                <Users className="h-3 w-3" /> {s.athletesSponsored} athletes
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Chat Assistant */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mb-12">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> AI Sponsor Assistant
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Powered by AI</span>
          </h2>
          <div ref={scrollRef} className="h-72 overflow-y-auto space-y-3 mb-4 p-3 rounded-lg bg-secondary/30 scroll-smooth">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isStreaming && chatMessages[chatMessages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground rounded-xl px-4 py-2.5 text-sm flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChat()}
              placeholder="Ask: 'Find me a boxer under ₹30k with high engagement'"
              className="bg-secondary border-border"
              disabled={isStreaming}
            />
            <Button onClick={handleChat} disabled={isStreaming} className="bg-primary text-primary-foreground">
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>

        {/* AI Match Scores */}
        <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" /> AI Recommended Athletes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {athletes.sort((a, b) => b.athleteScore - a.athleteScore).map((athlete, i) => (
            <AthleteCard key={athlete.id} athlete={athlete} index={i} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SponsorPage;
