import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="p-6 rounded-2xl glass-card space-y-6">
        <h3 className="font-semibold text-foreground">Profile Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue="John Doe" className="rounded-xl h-12 bg-background/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="john@company.com" className="rounded-xl h-12 bg-background/50 border-border/50" disabled />
          </div>
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input defaultValue="Acme Corp" className="rounded-xl h-12 bg-background/50 border-border/50" />
          </div>
        </div>
        <Button className="gradient-primary border-0 rounded-xl btn-glow">Save Changes</Button>
      </div>

      <div className="p-6 rounded-2xl glass-card space-y-6">
        <h3 className="font-semibold text-foreground">Change Password</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-background/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl h-12 bg-background/50 border-border/50" />
          </div>
        </div>
        <Button className="gradient-primary border-0 rounded-xl btn-glow">Update Password</Button>
      </div>

      <Separator className="bg-border/30" />

      <div className="p-6 rounded-2xl glass-card border-destructive/20 space-y-4">
        <h3 className="font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
        <Button variant="outline" className="rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
