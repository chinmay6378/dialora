import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Users } from "lucide-react";

const Leads = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your lead lists.</p>
      </div>

      <div className="p-12 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-center space-y-4 cursor-pointer group">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-lg">Drop your Excel file here</p>
          <p className="text-sm text-muted-foreground">or click to browse. Supports .xlsx files</p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Select File
        </Button>
      </div>

      <div className="rounded-2xl glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Uploaded Lead Lists</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /> 1,120 total leads
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: "q1_leads.xlsx", leads: 450, campaign: "Q1 Outreach", date: "Jan 15" },
            { name: "product_launch_list.xlsx", leads: 320, campaign: "Product Launch", date: "Feb 3" },
            { name: "followup_batch3.xlsx", leads: 200, campaign: "Follow-up Batch 3", date: "Feb 10" },
            { name: "re-engagement.xlsx", leads: 150, campaign: "Re-engagement", date: "Feb 18" },
          ].map((file) => (
            <div key={file.name} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.leads} leads • {file.campaign}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{file.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leads;
