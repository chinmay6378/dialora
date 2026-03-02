import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, Database } from "lucide-react";

const docs = [
  { name: "Product Guide 2024.pdf", chunks: 142, size: "2.4 MB", date: "Jan 10" },
  { name: "FAQ & Objections.docx", chunks: 87, size: "890 KB", date: "Jan 22" },
  { name: "Pricing Sheet.pdf", chunks: 23, size: "340 KB", date: "Feb 5" },
];

const KnowledgeBase = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">Train your AI agent with company documents.</p>
      </div>

      <div className="p-12 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-center space-y-4 cursor-pointer group">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-lg">Upload knowledge documents</p>
          <p className="text-sm text-muted-foreground">PDF or DOCX files. Your AI will learn from these.</p>
        </div>
        <Button variant="outline" className="rounded-xl">
          <FileText className="w-4 h-4 mr-2" /> Select Files
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 text-sm">
        <Database className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">Total vector chunks:</span>
        <span className="font-semibold text-primary">252</span>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.name} className="flex items-center justify-between p-5 rounded-2xl glass hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.size} • {doc.chunks} chunks • Uploaded {doc.date}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
