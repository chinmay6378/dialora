import { Megaphone, PhoneCall, Users, CreditCard, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";

const Overview = () => {
  const { user } = useAuth();
  const { balance } = useCredits();
  const [stats, setStats] = useState({ campaigns: 0, calls: 0, leads: 0 });
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const [campsRes, callsRes, leadsRes, txRes] = await Promise.all([
        supabase.from("campaigns").select("*", { count: "exact", head: true }),
        supabase.from("call_results").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("credit_transactions").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        campaigns: campsRes.count ?? 0,
        calls: callsRes.count ?? 0,
        leads: leadsRes.count ?? 0,
      });
      setTransactions(txRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const statCards = [
    { label: "Total Campaigns", value: stats.campaigns.toString(), icon: Megaphone },
    { label: "Total Calls", value: stats.calls.toString(), icon: PhoneCall },
    { label: "Total Leads", value: stats.leads.toString(), icon: Users },
    { label: "Credits Remaining", value: (balance ?? 0).toString(), icon: CreditCard },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Your campaign performance at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl glass-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl glass-card">
        <h3 className="font-semibold mb-4 text-foreground">Recent Credit Activity</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm text-foreground/90">{t.description || t.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <p className={`text-sm font-medium ${t.amount > 0 ? "text-success" : "text-destructive"}`}>
                  {t.amount > 0 ? "+" : ""}{t.amount} credits
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
