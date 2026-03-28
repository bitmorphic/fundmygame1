import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, CreditCard, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  tier: { amount: number; label: string; emoji: string; description: string } | null;
}

const PaymentModal = ({ open, onClose, athleteId, athleteName, tier }: PaymentModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [customAmount, setCustomAmount] = useState(tier?.amount?.toString() || "500");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  const amount = tier?.amount || parseInt(customAmount) || 500;

  const handlePay = async () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      toast.error("Please fill all card details");
      return;
    }

    setStep("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Record payment in database
    const { error } = await supabase.from("payments").insert({
      athlete_id: athleteId,
      donor_id: user?.id || null,
      amount,
      tier: tier?.label || "custom",
      anonymous,
      message: message || null,
    });

    if (error) {
      toast.error("Payment recording failed");
      setStep("form");
      return;
    }

    setStep("success");
  };

  const reset = () => {
    setStep("form");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setName("");
    setMessage("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={reset}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md glass-card p-6"
        >
          <button onClick={reset} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>

          {step === "form" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{tier?.emoji || "💰"}</div>
                <h3 className="font-display text-xl font-bold">Fund {athleteName}</h3>
                <p className="text-sm text-muted-foreground">{tier?.label || "Custom"} contribution</p>
              </div>

              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-display text-3xl font-bold text-primary">₹{amount.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Cardholder Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="bg-secondary/50 border-border" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Card Number</label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    placeholder="4242 4242 4242 4242"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Expiry</label>
                    <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="bg-secondary/50 border-border" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">CVV</label>
                    <Input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" type="password" className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Message (optional)</label>
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Keep going champ!" className="bg-secondary/50 border-border" />
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="rounded" />
                  Donate anonymously
                </label>
              </div>

              <Button onClick={handlePay} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" /> Pay ₹{amount.toLocaleString()}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">This is a simulated payment for demo purposes</p>
            </div>
          )}

          {step === "processing" && (
            <div className="py-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <IndianRupee className="h-12 w-12 mx-auto text-primary" />
              </motion.div>
              <p className="mt-4 text-muted-foreground">Processing payment...</p>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 text-center space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <CheckCircle className="h-16 w-16 mx-auto text-primary" />
              </motion.div>
              <h3 className="font-display text-xl font-bold">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                ₹{amount.toLocaleString()} has been contributed to {athleteName}
              </p>
              <Button onClick={reset} variant="outline" className="border-border">Close</Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
