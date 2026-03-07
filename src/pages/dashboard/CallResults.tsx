import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Filter, Phone, Clock, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CallResult {
  id: string;
  lead_name: string;
  phone: string;
  campaign: string;
  duration: number;
  status: string;
  interested: boolean | null;
  summary: string | null;
  transcript: string | null;
  created_at: string;
}

const mockResults: CallResult[] = [
  { id: "cr1", lead_name: "Rahul Sharma", phone: "+919876543210", campaign: "Q1 Outreach", duration: 145, status: "completed", interested: true, summary: "Interested in enterprise plan. Wants a demo next week.", transcript: "AI: Hi, this is calling from VoiceAI. Am I speaking with Rahul?\nRahul: Yes, this is Rahul.\nAI: Great! I'm calling about our AI voice solution...\nRahul: That sounds interesting, can you tell me more?\nAI: Sure! We help businesses automate outbound calls...\nRahul: I'd like to schedule a demo.\nAI: Wonderful! I'll have our team reach out to schedule that.", created_at: "2026-03-07T10:30:00Z" },
  { id: "cr2", lead_name: "Priya Patel", phone: "+919876543211", campaign: "Q1 Outreach", duration: 62, status: "completed", interested: false, summary: "Not interested at this time. Already using a competitor.", transcript: "AI: Hi, am I speaking with Priya?\nPriya: Yes.\nAI: I'm calling about our AI voice solution...\nPriya: We already use another tool. Not interested.\nAI: I understand. Thank you for your time!", created_at: "2026-03-07T10:15:00Z" },
  { id: "cr3", lead_name: "Amit Kumar", phone: "+919876543212", campaign: "Product Launch", duration: 198, status: "completed", interested: true, summary: "Very interested in the product launch. Wants pricing details sent via email.", transcript: null, created_at: "2026-03-07T09:45:00Z" },
  { id: "cr4", lead_name: "Sneha Reddy", phone: "+919876543213", campaign: "Product Launch", duration: 0, status: "failed", interested: null, summary: "Call did not connect — number unreachable.", transcript: null, created_at: "2026-03-07T09:30:00Z" },
  { id: "cr5", lead_name: "Vikram Singh", phone: "+919876543214", campaign: "Follow-up Batch", duration: 95, status: "completed", interested: null, summary: "Requested callback next Monday. Neither confirmed nor denied interest.", transcript: null, created_at: "2026-03-06T16:00:00Z" },
  { id: "cr6", lead_name: "Ananya Gupta", phone: "+919876543215", campaign: "Product Launch", duration: 0, status: "failed", interested: null, summary: "Voicemail — no pickup after 4 rings.", transcript: null, created_at: "2026-03-06T15:30:00Z" },
];

const formatDuration = (seconds: number) => {
  if (seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const CallResults = () => {
  const [filter, setFilter] = useState<"all" | "completed" | "failed" | "interested">("all");

  const filtered = mockResults.filter((c) => {
    if (filter === "completed") return c.status === "completed";
    if (filter === "failed") return c.status === "failed";
    if (filter === "interested") return c.interested === true;
    return true;
  });

  const stats = {
    total: mockResults.length,
    completed: mockResults.filter((r) => r.status === "completed").length,
    interested: mockResults.filter((r) => r.interested === true).length,
    avgDuration: Math.round(mockResults.filter((r) => r.duration > 0).reduce((acc, r) => acc + r.duration, 0) / mockResults.filter((r) => r.duration > 0).length),
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Call Results</h1>
        <p className="text-muted-foreground mt-1">Review AI call outcomes and conversation summaries.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Total Calls", value: stats.total, icon: Phone },
          { label: "Completed", value: stats.completed, icon: Clock },
          { label: "Interested", value: stats.interested, icon: ThumbsUp },
          { label: "Avg Duration", value: formatDuration(stats.avgDuration), icon: Clock },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(["all", "completed", "failed", "interested"] as const).map((f) => (
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

      {/* Results Table */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card text-center">
          <p className="text-muted-foreground">No call results match this filter.</p>
        </div>
      ) : (
        <div className="rounded-2xl glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Interest</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="text-foreground text-sm font-medium">{c.lead_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{c.phone}</p>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{c.campaign}</td>
                  <td className="p-4 text-muted-foreground text-sm">{formatDuration(c.duration)}</td>
                  <td className="p-4">
                    <Badge className={`rounded-lg border-0 ${c.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {c.interested === true && <ThumbsUp className="w-4 h-4 text-success" />}
                    {c.interested === false && <ThumbsDown className="w-4 h-4 text-destructive" />}
                    {c.interested === null && <Minus className="w-4 h-4 text-muted-foreground" />}
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="rounded-lg"><Eye className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl glass-card border-border/50 max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Call Details — {c.lead_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-muted/30">
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <p className="text-foreground font-mono">{c.phone}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30">
                              <p className="text-xs text-muted-foreground">Duration</p>
                              <p className="text-foreground">{formatDuration(c.duration)}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30">
                              <p className="text-xs text-muted-foreground">Campaign</p>
                              <p className="text-foreground">{c.campaign}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-muted/30">
                              <p className="text-xs text-muted-foreground">Interest</p>
                              <p className="text-foreground">{c.interested === true ? "✅ Interested" : c.interested === false ? "❌ Not interested" : "— Unknown"}</p>
                            </div>
                          </div>
                          {c.summary && (
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                              <p className="text-xs text-primary font-medium mb-1">AI Summary</p>
                              <p className="text-foreground">{c.summary}</p>
                            </div>
                          )}
                          {c.transcript && (
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/30 max-h-48 overflow-y-auto">
                              <p className="text-xs text-muted-foreground mb-2">Transcript</p>
                              <pre className="text-foreground whitespace-pre-wrap text-xs leading-relaxed font-sans">{c.transcript}</pre>
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
