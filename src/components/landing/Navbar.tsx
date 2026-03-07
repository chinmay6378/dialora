import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Phone className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>Dialora</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-foreground" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button size="sm" className="gradient-primary border-0 btn-glow" asChild>
            <Link to="/signup">Start Free Trial</Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50 px-6 py-4 space-y-3">
          <a href="#features" className="block text-sm text-muted-foreground">Features</a>
          <a href="#how-it-works" className="block text-sm text-muted-foreground">How It Works</a>
          <a href="#pricing" className="block text-sm text-muted-foreground">Pricing</a>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Log In</Link></Button>
            <Button size="sm" className="gradient-primary border-0" asChild><Link to="/signup">Start Free Trial</Link></Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
