import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    toast.success("Reset link sent! Check your email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="glow-blob-tr" />
      <div className="glow-blob-bl" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-md mx-4 animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-6 text-foreground">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            Dialora
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="text-muted-foreground mt-1">We'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card space-y-6">
          {sent ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-success/20 mx-auto flex items-center justify-center">
                <span className="text-success text-xl">✓</span>
              </div>
              <p className="text-foreground font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">We've sent a password reset link to {email}</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-12 bg-background/50 border-border/50" required />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0 rounded-xl h-12 text-base btn-glow">
                Send Reset Link
              </Button>
            </>
          )}
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
