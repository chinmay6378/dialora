import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, Database, File, FileType } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface KBDoc {
  id: string;
  title: string;
  fileType: string;
  size: string;
  uploadedAt: string;
}

const initialDocs: KBDoc[] = [
  { id: "d1", title: "Product Catalog 2026.pdf", fileType: "pdf", size: "2.4 MB", uploadedAt: "2026-03-01" },
  { id: "d2", title: "Sales Objection Handling.md", fileType: "md", size: "48 KB", uploadedAt: "2026-02-28" },
  { id: "d3", title: "Company Overview.txt", fileType: "txt", size: "12 KB", uploadedAt: "2026-02-25" },
  { id: "d4", title: "Pricing & Plans.csv", fileType: "csv", size: "8 KB", uploadedAt: "2026-02-20" },
];

const fileIcons: Record<string, typeof FileText> = {
  pdf: File,
  md: FileType,
  txt: FileText,
  csv: FileText,
};

const KnowledgeBase = () => {
  const [docs, setDocs] = useState<KBDoc[]>(initialDocs);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1500));
    
    const newDoc: KBDoc = {
      id: Date.now().toString(),
      title: file.name,
      fileType: file.name.split(".").pop() || "txt",
      size: file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`,
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    
    setDocs([newDoc, ...docs]);
    toast.success(`${file.name} uploaded successfully`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const deleteDoc = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
    toast.success("Document deleted");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">Train your AI agent with company documents.</p>
      </div>

      <div
        className="p-10 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors text-center space-y-3 cursor-pointer group glass-card"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".txt,.md,.csv,.pdf" className="hidden" onChange={handleUpload} />
        <div className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{uploading ? "Processing document..." : "Upload knowledge documents"}</p>
          <p className="text-sm text-muted-foreground">PDF, Text, Markdown, or CSV files. Your AI will learn from these.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border/50" disabled={uploading}>
          <FileText className="w-4 h-4 mr-2" /> Select Files
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl glass text-sm">
        <Database className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">Documents:</span>
        <span className="font-semibold text-primary">{docs.length}</span>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => {
          const Icon = fileIcons[doc.fileType] || FileText;
          return (
            <div key={doc.id} className="flex items-center justify-between p-5 rounded-2xl glass-card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.fileType.toUpperCase()} • {doc.size} • Uploaded {doc.uploadedAt}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => deleteDoc(doc.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeBase;
