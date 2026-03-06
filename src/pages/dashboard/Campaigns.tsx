import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  n8n_webhook_url: string | null;
  created_at: string;
}

const Campaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newWebhook, setNewWebhook] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    setCampaigns((data as Campaign[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();

    const channel = supabase
      .channel("campaigns-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "campaigns" }, () => {
        fetchCampaigns();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const createCampaign = async () => {
    if (!newName.trim()) {
      toast.error("Campaign name is required");
      return;
    }

    if (!newWebhook.trim()) {
      toast.error("n8n webhook URL is required");
      return;
    }

    try {
      new URL(newWebhook.trim());
    } catch {
      toast.error("Please enter a valid n8n webhook URL");
      return;
    }

    setCreating(true);
    const { error } = await supabase.from("campaigns").insert({
      user_id: user!.id,
      name: newName.trim(),
      description: newDesc.trim() || null,
      n8n_webhook_url: newWebhook.trim(),
    });
    setCreating(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Campaign created");
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      setNewWebhook("");
      fetchCampaigns();
    }
  };

  const triggerAction = async (campaignId: string, action: string) => {
    if (actionLoading) return; // prevent duplicate
    setActionLoading(campaignId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("trigger-campaign", {
        body: { campaign_id: campaignId, action },
      });
      if (res.error) throw new Error(res.error.message);
      const result = res.data;
      if (result.error) throw new Error(result.error);
      toast.success(`Campaign ${action === "pause" ? "paused" : "started"}`);
      fetchCampaigns();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

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
              <div className="space-y-2">
                <Label>n8n Webhook URL</Label>
                <Input value={newWebhook} onChange={(e) => setNewWebhook(e.target.value)} placeholder="https://your-n8n.app/webhook/..." className="rounded-xl bg-background/50 border-border/50" />
              </div>
              <Button onClick={createCampaign} disabled={creating} className="w-full gradient-primary border-0 rounded-xl btn-glow">
                {creating ? "Creating..." : "Create Campaign"}
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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Leads</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Processed</th>
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
                  <td className="p-4 text-muted-foreground">{c.total_leads}</td>
                  <td className="p-4 text-muted-foreground">{c.processed_leads}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {actionLoading === c.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : c.status === "calling" ? (
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8" onClick={() => triggerAction(c.id, "pause")}>
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : ["draft", "pending", "paused"].includes(c.status) ? (
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8" onClick={() => triggerAction(c.id, c.status === "paused" ? "resume" : "start")}>
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : null}
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
