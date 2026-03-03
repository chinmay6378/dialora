import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Users, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
  id: string;
  name: string | null;
  phone_number: string;
  email: string | null;
  status: string;
  campaign_id: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
}

const Leads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const [leadsRes, campsRes] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("campaigns").select("id, name").order("created_at", { ascending: false }),
      ]);
      setLeads((leadsRes.data as Lead[]) ?? []);
      setCampaigns((campsRes.data as Campaign[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCampaign) {
      toast.error("Please select a campaign first");
      return;
    }

    setUploading(true);
    try {
      // Parse CSV/simple text (for Excel, user would need to export to CSV)
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) throw new Error("File must have header + data rows");

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const phoneIdx = headers.findIndex(h => h.includes("phone"));
      const nameIdx = headers.findIndex(h => h.includes("name"));
      const emailIdx = headers.findIndex(h => h.includes("email"));

      if (phoneIdx === -1) throw new Error("CSV must have a 'phone' column");

      const parsed = lines.slice(1).map(line => {
        const cols = line.split(",").map(c => c.trim());
        return {
          phone_number: cols[phoneIdx] || "",
          name: nameIdx >= 0 ? cols[nameIdx] : null,
          email: emailIdx >= 0 ? cols[emailIdx] : null,
        };
      }).filter(l => l.phone_number);

      const res = await supabase.functions.invoke("upload-leads", {
        body: { campaign_id: selectedCampaign, leads: parsed },
      });

      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);

      toast.success(`${parsed.length} leads uploaded`);

      // Refetch
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100);
      setLeads((data as Lead[]) ?? []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your lead lists.</p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-64 rounded-xl bg-background/50 border-border/50">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent className="rounded-xl glass border-border/50">
            {campaigns.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className="p-12 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors text-center space-y-4 cursor-pointer group glass-card"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
        <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          {uploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
        </div>
        <div>
          <p className="font-semibold text-lg text-foreground">{uploading ? "Uploading..." : "Drop your CSV file here"}</p>
          <p className="text-sm text-muted-foreground">Must have a 'phone' column. Supports .csv files</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border/50" disabled={uploading}>
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Select File
        </Button>
      </div>

      {leads.length > 0 && (
        <div className="rounded-2xl glass-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <h3 className="font-semibold text-foreground">Leads</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" /> {leads.length} leads shown
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-foreground text-sm">{l.name || "—"}</td>
                  <td className="p-4 text-muted-foreground text-sm">{l.phone_number}</td>
                  <td className="p-4 text-muted-foreground text-sm">{l.email || "—"}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      l.status === "completed" ? "bg-success/10 text-success" :
                      l.status === "calling" ? "bg-primary/10 text-primary" :
                      l.status === "failed" ? "bg-destructive/10 text-destructive" :
                      "bg-muted text-muted-foreground"
                    }`}>{l.status}</span>
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

export default Leads;
