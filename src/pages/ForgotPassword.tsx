import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-md mx-4 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-6">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary-foreground" />
            </div>
            VoiceAI Pro
          </Link>
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground mt-1">We'll send you a reset link</p>
        </div>

        <div className="p-8 rounded-2xl glass space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl h-12" />
          </div>
          <Button className="w-full gradient-primary border-0 rounded-xl h-12 text-base">
            Send Reset Link
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
