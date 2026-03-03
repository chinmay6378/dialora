import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CallResult {
  id: string;
  call_sid: string | null;
  duration: number;
  status: string;
  recording_url: string | null;
  transcript: string | null;
  sentiment: string | null;
  notes: string | null;
  created_at: string;
  lead_id: string;
  campaign_id: string;
}

const CallResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<CallResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "failed">("all");

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("call_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setResults((data as CallResult[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filtered = results.filter(c => {
    if (filter === "completed") return c.status === "completed";
    if (filter === "failed") return c.status === "failed";
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Call Results</h1>
        <p className="text-muted-foreground mt-1">Review AI call outcomes and summaries.</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(["all", "completed", "failed"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className={`rounded-xl ${filter === f ? "gradient-primary border-0" : "border-border/50"}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card text-center">
          <p className="text-muted-foreground">No call results yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Call SID</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Sentiment</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-foreground text-sm font-mono">{c.call_sid?.slice(0, 12) || "—"}...</td>
                  <td className="p-4 text-muted-foreground text-sm">{c.duration}s</td>
                  <td className="p-4">
                    <Badge className={`rounded-lg border-0 ${c.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{c.sentiment || "—"}</td>
                  <td className="p-4 text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="rounded-lg"><Eye className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl glass-card border-border/50">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Call Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                          <p><span className="text-muted-foreground">Call SID:</span> <span className="text-foreground">{c.call_sid || "N/A"}</span></p>
                          <p><span className="text-muted-foreground">Duration:</span> <span className="text-foreground">{c.duration}s</span></p>
                          {c.transcript && (
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                              <p className="text-muted-foreground text-xs mb-1">Transcript</p>
                              <p className="text-foreground">{c.transcript}</p>
                            </div>
                          )}
                          {c.notes && (
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                              <p className="text-muted-foreground text-xs mb-1">Notes</p>
                              <p className="text-foreground">{c.notes}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CallResults;
