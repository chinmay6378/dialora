import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, MoreHorizontal } from "lucide-react";

const campaigns = [
  { id: 1, name: "Q1 Outreach", status: "Completed", leads: 450, calls: 430, interested: 98 },
  { id: 2, name: "Follow-up Batch 3", status: "Running", leads: 200, calls: 87, interested: 23 },
  { id: 3, name: "Product Launch", status: "Pending", leads: 320, calls: 0, interested: 0 },
  { id: 4, name: "Re-engagement", status: "Paused", leads: 150, calls: 45, interested: 12 },
];

const statusColors: Record<string, string> = {
  Completed: "bg-success/10 text-success border-0",
  Running: "bg-primary/10 text-primary border-0",
  Pending: "bg-warning/10 text-warning border-0",
  Paused: "bg-muted text-muted-foreground border-0",
};

const Campaigns = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage your voice campaigns.</p>
        </div>
        <Button className="gradient-primary border-0 rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Create Campaign
        </Button>
      </div>

      <div className="rounded-2xl glass overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Leads</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Calls Made</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Interested</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4">
                  <Badge className={`rounded-lg ${statusColors[c.status]}`}>{c.status}</Badge>
                </td>
                <td className="p-4 text-muted-foreground">{c.leads}</td>
                <td className="p-4 text-muted-foreground">{c.calls}</td>
                <td className="p-4 text-muted-foreground">{c.interested}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {c.status === "Running" ? (
                      <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><Pause className="w-4 h-4" /></Button>
                    ) : c.status !== "Completed" ? (
                      <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><Play className="w-4 h-4" /></Button>
                    ) : null}
                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;
