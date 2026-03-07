import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, CreditCard } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { balance, loading } = useCredits();
  const navigate = useNavigate();

  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-border/50 glass flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">Welcome back, <span className="text-foreground">{user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"}</span></h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium">
          <CreditCard className="w-4 h-4" />
          {loading ? <Skeleton className="w-8 h-4" /> : `${balance ?? 0} credits`}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                {initials}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl glass border-border/50">
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings" className="flex items-center gap-2">
                <User className="w-4 h-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/billing" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive">
              <LogOut className="w-4 h-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
