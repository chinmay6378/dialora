import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { User, Bell, Shield, Palette } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [companyName, setCompanyName] = useState("Dialora AI");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    campaignComplete: true,
    lowCredits: true,
    weeklyReport: false,
  });

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Profile Information</h3>
        </div>
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-xl h-11 bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="rounded-xl h-11 bg-background/50 border-border/50" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} className="rounded-xl h-11 bg-background/50 border-border/50" disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl h-11 bg-background/50 border-border/50" />
            </div>
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="gradient-primary border-0 rounded-xl btn-glow">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "campaignComplete", label: "Campaign Completed", desc: "Notify when a campaign finishes" },
            { key: "lowCredits", label: "Low Credits Alert", desc: "Alert when credits fall below 10" },
            { key: "weeklyReport", label: "Weekly Report", desc: "Receive weekly performance summary" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-2xl glass-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-border/50">Change</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-border/50">Enable</Button>
          </div>
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Danger Zone */}
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
