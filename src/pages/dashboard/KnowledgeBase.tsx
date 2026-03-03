import { Button } from "@/components/ui/button";
import { Upload, FileText, Trash2, Database, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface KBDoc {
  id: string;
  title: string;
  content: string;
  file_type: string | null;
  chunk_index: number;
  created_at: string;
}

const KnowledgeBase = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<KBDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("chunk_index", 0) // Only show first chunk per doc
      .order("created_at", { ascending: false });
    setDocs((data as KBDoc[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const content = await file.text();
      const res = await supabase.functions.invoke("upload-document", {
        body: { title: file.name, content, file_type: file.type },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(`${file.name} uploaded (${res.data.chunks} chunks)`);
      fetchDocs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const deleteDoc = async (title: string) => {
    // Delete all chunks with this base title
    const baseTitle = title.replace(/ \(chunk \d+\)$/, "");
    const { error } = await supabase
      .from("knowledge_base")
      .delete()
      .like("title", `${baseTitle}%`);
    if (error) toast.error(error.message);
    else {
      toast.success("Document deleted");
      fetchDocs();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">Train your AI agent with company documents.</p>
      </div>

      <div
        className="p-12 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors text-center space-y-4 cursor-pointer group glass-card"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleUpload} />
        <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          {uploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
        </div>
        <div>
          <p className="font-semibold text-lg text-foreground">{uploading ? "Processing..." : "Upload knowledge documents"}</p>
          <p className="text-sm text-muted-foreground">Text or Markdown files. Your AI will learn from these.</p>
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
        {docs.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-5 rounded-2xl glass-card">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.file_type || "text"} • Uploaded {new Date(doc.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteDoc(doc.title)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
