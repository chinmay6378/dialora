import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const callResults = [
  { id: 1, name: "Alice Johnson", phone: "+1-555-0101", duration: "3:42", summary: "Very interested in the enterprise plan. Asked about API integrations and custom deployment. Wants a follow-up demo next Tuesday.", interested: true, campaign: "Q1 Outreach", date: "Feb 20" },
  { id: 2, name: "Bob Smith", phone: "+1-555-0102", duration: "1:15", summary: "Not a good fit. Currently locked into a competitor contract until Q3. Suggested reaching back out in July.", interested: false, campaign: "Q1 Outreach", date: "Feb 20" },
  { id: 3, name: "Carol Davis", phone: "+1-555-0103", duration: "4:18", summary: "Interested but needs budget approval. Will forward info to CTO. Asked for case studies and pricing breakdown.", interested: true, campaign: "Follow-up Batch 3", date: "Feb 19" },
  { id: 4, name: "David Lee", phone: "+1-555-0104", duration: "0:45", summary: "Wrong number. Line disconnected.", interested: false, campaign: "Q1 Outreach", date: "Feb 19" },
  { id: 5, name: "Eva Martinez", phone: "+1-555-0105", duration: "5:02", summary: "Very engaged. Currently evaluating 3 solutions. Loves the AI approach. Scheduled a demo for Thursday at 2pm.", interested: true, campaign: "Product Launch", date: "Feb 18" },
];

const CallResults = () => {
  const [filter, setFilter] = useState<"all" | "interested" | "not_interested">("all");

  const filtered = callResults.filter((c) => {
    if (filter === "interested") return c.interested;
    if (filter === "not_interested") return !c.interested;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Call Results</h1>
        <p className="text-muted-foreground mt-1">Review AI call outcomes and summaries.</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(["all", "interested", "not_interested"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className={`rounded-xl ${filter === f ? "gradient-primary border-0" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "interested" ? "Interested" : "Not Interested"}
          </Button>
        ))}
      </div>

      <div className="rounded-2xl glass overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lead</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Interest</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Summary</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-muted-foreground text-sm">{c.phone}</td>
                <td className="p-4 text-muted-foreground text-sm">{c.duration}</td>
                <td className="p-4 text-muted-foreground text-sm">{c.campaign}</td>
                <td className="p-4">
                  <Badge className={`rounded-lg border-0 ${c.interested ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {c.interested ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground text-sm">{c.date}</td>
                <td className="p-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Call Summary — {c.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <p><span className="text-muted-foreground">Phone:</span> {c.phone}</p>
                        <p><span className="text-muted-foreground">Duration:</span> {c.duration}</p>
                        <p><span className="text-muted-foreground">Campaign:</span> {c.campaign}</p>
                        <div className="p-4 rounded-xl bg-muted">
                          <p className="text-muted-foreground text-xs mb-1">Summary</p>
                          <p>{c.summary}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallResults;
