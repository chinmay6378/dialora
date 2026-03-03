import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const packages = [
  { credits: 100, price: "$19", perCredit: "$0.19", popular: false },
  { credits: 500, price: "$49", perCredit: "$0.098", popular: true },
  { credits: 1000, price: "$89", perCredit: "$0.089", popular: false },
];

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

const Billing = () => {
  const { balance, loading: balLoading } = useCredits();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("credit_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      setTransactions((data as Transaction[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading || balLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing & Credits</h1>
        <p className="text-muted-foreground mt-1">Manage your credit balance and purchases.</p>
      </div>

      <div className="p-6 rounded-2xl glass-card flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <CreditCard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold text-foreground">{balance ?? 0} <span className="text-lg font-normal text-muted-foreground">credits</span></p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4 text-foreground">Buy Credits</h3>
        <p className="text-sm text-muted-foreground mb-4">Payment integration coming soon (Razorpay).</p>
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.credits} className={`p-6 rounded-2xl transition-all ${pkg.popular ? "gradient-primary text-primary-foreground shadow-lg btn-glow" : "glass-card"}`}>
              {pkg.popular && <p className="text-xs font-semibold mb-3 opacity-80">BEST VALUE</p>}
              <p className="text-3xl font-bold">{pkg.credits}</p>
              <p className={`text-sm ${pkg.popular ? "opacity-80" : "text-muted-foreground"}`}>credits</p>
              <p className="text-2xl font-bold mt-4">{pkg.price}</p>
              <p className={`text-xs mt-1 ${pkg.popular ? "opacity-70" : "text-muted-foreground"}`}>{pkg.perCredit}/credit</p>
              <Button disabled className={`w-full mt-6 rounded-xl ${pkg.popular ? "bg-background text-foreground hover:bg-background/90" : "gradient-primary border-0 btn-glow"}`}>
                Coming Soon <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4 text-foreground">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="p-8 rounded-2xl glass-card text-center">
            <p className="text-muted-foreground">No transactions yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-foreground">{t.type}</td>
                    <td className={`p-4 text-sm font-medium ${t.amount > 0 ? "text-success" : "text-destructive"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount} credits
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{t.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
