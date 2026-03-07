import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-0",
  pending: "bg-warning/10 text-warning border-0",
  calling: "bg-primary/10 text-primary border-0",
  paused: "bg-muted text-muted-foreground border-0",
  completed: "bg-success/10 text-success border-0",
  failed: "bg-destructive/10 text-destructive border-0",
};

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  total_leads: number;
  processed_leads: number;
  created_at: string;
}

const initialCampaigns: Campaign[] = [
  { id: "1", name: "Q1 Outreach", description: "First quarter sales outreach campaign", status: "completed", total_leads: 450, processed_leads: 450, created_at: "2026-02-15T10:00:00Z" },
  { id: "2", name: "Product Launch", description: "New product announcement calls", status: "calling", total_leads: 320, processed_leads: 208, created_at: "2026-03-01T09:00:00Z" },
  { id: "3", name: "Follow-up Batch", description: "Follow-up calls for interested leads", status: "paused", total_leads: 180, processed_leads: 54, created_at: "2026-03-03T14:00:00Z" },
  { id: "4", name: "Enterprise Leads", description: null, status: "draft", total_leads: 95, processed_leads: 0, created_at: "2026-03-05T16:00:00Z" },
];

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const createCampaign = () => {
    if (!newName.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDesc.trim() || null,
      status: "draft",
      total_leads: 0,
      processed_leads: 0,
      created_at: new Date().toISOString(),
    };
    setCampaigns([newCampaign, ...campaigns]);
    toast.success("Campaign created");
    setShowCreate(false);
    setNewName("");
    setNewDesc("");
  };

  const toggleStatus = (id: string) => {
    setCampaigns(campaigns.map((c) => {
      if (c.id !== id) return c;
      if (c.status === "calling") return { ...c, status: "paused" };
      if (["draft", "pending", "paused"].includes(c.status)) return { ...c, status: "calling" };
      return c;
    }));
    toast.success("Campaign status updated");
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    toast.success("Campaign deleted");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage your voice campaigns.</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 rounded-xl btn-glow">
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Q1 Outreach" className="rounded-xl bg-background/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Campaign description..." className="rounded-xl bg-background/50 border-border/50" />
              </div>
              <Button onClick={createCampaign} className="w-full gradient-primary border-0 rounded-xl btn-glow">
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card text-center">
          <p className="text-muted-foreground">No campaigns yet. Create your first one!</p>
        </div>
      ) : (
        <div className="rounded-2xl glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Progress</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Leads</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{c.name}</p>
                    {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
                  </td>
                  <td className="p-4">
                    <Badge className={`rounded-lg ${statusColors[c.status] || ""}`}>{c.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full gradient-primary"
                          style={{ width: c.total_leads > 0 ? `${(c.processed_leads / c.total_leads) * 100}%` : "0%" }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {c.total_leads > 0 ? Math.round((c.processed_leads / c.total_leads) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{c.processed_leads}/{c.total_leads}</td>
                  <td className="p-4 text-muted-foreground text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {c.status === "calling" ? (
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8" onClick={() => toggleStatus(c.id)}>
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : ["draft", "pending", "paused"].includes(c.status) ? (
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8" onClick={() => toggleStatus(c.id)}>
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : null}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl glass border-border/50">
                          <DropdownMenuItem className="gap-2">
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive" onClick={() => deleteCampaign(c.id)}>
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

export default Campaigns;
