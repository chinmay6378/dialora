import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Users, Trash2, Search } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  status: string;
  campaign_id: string;
}

const mockCampaigns = [
  { id: "1", name: "Q1 Outreach" },
  { id: "2", name: "Product Launch" },
  { id: "3", name: "Follow-up Batch" },
  { id: "4", name: "Enterprise Leads" },
];

const initialLeads: Lead[] = [
  { id: "l1", name: "Rahul Sharma", phone: "+919876543210", email: "rahul@example.com", status: "completed", campaign_id: "1" },
  { id: "l2", name: "Priya Patel", phone: "+919876543211", email: "priya@example.com", status: "completed", campaign_id: "1" },
  { id: "l3", name: "Amit Kumar", phone: "+919876543212", email: null, status: "calling", campaign_id: "2" },
  { id: "l4", name: "Sneha Reddy", phone: "+919876543213", email: "sneha@corp.com", status: "pending", campaign_id: "2" },
  { id: "l5", name: "Vikram Singh", phone: "+919876543214", email: "vikram@startup.io", status: "pending", campaign_id: "3" },
  { id: "l6", name: "Ananya Gupta", phone: "+919876543215", email: null, status: "failed", campaign_id: "2" },
  { id: "l7", name: "Karthik Nair", phone: "+919876543216", email: "karthik@tech.com", status: "pending", campaign_id: "4" },
  { id: "l8", name: "Deepa Iyer", phone: "+919876543217", email: "deepa@sales.in", status: "pending", campaign_id: "3" },
];

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  calling: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  skipped: "bg-warning/10 text-warning",
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (selectedCampaign === "all") {
      toast.error("Please select a specific campaign first");
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) throw new Error("File must have header + data rows");

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const phoneIdx = headers.findIndex((h) => h.includes("phone"));
      const nameIdx = headers.findIndex((h) => h.includes("name"));
      const emailIdx = headers.findIndex((h) => h.includes("email"));

      if (phoneIdx === -1) throw new Error("CSV must have a 'phone' column");

      const parsed: Lead[] = lines.slice(1).map((line, i) => {
        const cols = line.split(",").map((c) => c.trim());
        return {
          id: `upload-${Date.now()}-${i}`,
          phone: cols[phoneIdx] || "",
          name: nameIdx >= 0 ? cols[nameIdx] || null : null,
          email: emailIdx >= 0 ? cols[emailIdx] || null : null,
          status: "pending",
          campaign_id: selectedCampaign,
        };
      }).filter((l) => l.phone);

      setLeads((prev) => [...parsed, ...prev]);
      toast.success(`${parsed.length} leads uploaded successfully`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const deleteLead = (id: string) => {
    setLeads(leads.filter((l) => l.id !== id));
    toast.success("Lead removed");
  };

  const filtered = leads.filter((l) => {
    const matchesCampaign = selectedCampaign === "all" || l.campaign_id === selectedCampaign;
    const matchesSearch = !search || 
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.email?.toLowerCase().includes(search.toLowerCase());
    return matchesCampaign && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leads</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your lead lists.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-64 rounded-xl bg-background/50 border-border/50">
            <SelectValue placeholder="All campaigns" />
          </SelectTrigger>
          <SelectContent className="rounded-xl glass border-border/50">
            <SelectItem value="all">All Campaigns</SelectItem>
            {mockCampaigns.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-background/50 border-border/50"
          />
        </div>
      </div>

      <div
        className="p-10 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors text-center space-y-3 cursor-pointer group glass-card"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
        <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{uploading ? "Uploading..." : "Drop your CSV file here"}</p>
          <p className="text-sm text-muted-foreground">Must have a 'phone' column. Supports .csv files</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border/50" disabled={uploading}>
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Select File
        </Button>
      </div>

      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h3 className="font-semibold text-foreground">Leads</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /> {filtered.length} leads
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No leads found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-foreground text-sm">{l.name || "—"}</td>
                  <td className="p-4 text-muted-foreground text-sm font-mono">{l.phone}</td>
                  <td className="p-4 text-muted-foreground text-sm">{l.email || "—"}</td>
                  <td className="p-4">
                    <Badge className={`rounded-lg border-0 ${statusColors[l.status] || ""}`}>{l.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteLead(l.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leads;
