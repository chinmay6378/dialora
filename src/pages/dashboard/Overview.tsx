import { Megaphone, PhoneCall, Users, CreditCard, TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

const statCards = [
  { label: "Total Campaigns", value: "12", icon: Megaphone, change: "+3 this week" },
  { label: "Total Calls", value: "1,847", icon: PhoneCall, change: "+284 today" },
  { label: "Total Leads", value: "3,621", icon: Users, change: "+156 this week" },
  { label: "Credits Remaining", value: "100", icon: CreditCard, change: "of 100" },
];

const recentActivity = [
  { id: "1", description: "Campaign 'Q1 Outreach' completed", type: "campaign", date: "2 hours ago", status: "completed" },
  { id: "2", description: "150 leads uploaded to 'Product Launch'", type: "leads", date: "5 hours ago", status: "success" },
  { id: "3", description: "Call credit deduction — 25 credits", type: "debit", date: "Yesterday", amount: -25 },
  { id: "4", description: "Credit purchase — 500 credits", type: "credit", date: "2 days ago", amount: 500 },
  { id: "5", description: "Campaign 'Follow-up Batch' started", type: "campaign", date: "3 days ago", status: "active" },
];

const Overview = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Your campaign performance at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl glass-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-success mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Call Performance Chart Placeholder */}
        <div className="p-6 rounded-2xl glass-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Call Performance</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span>+12% vs last week</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg gradient-primary opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Status */}
        <div className="p-6 rounded-2xl glass-card">
          <h3 className="font-semibold text-foreground mb-6">Campaign Status</h3>
          <div className="space-y-4">
            {[
              { name: "Q1 Outreach", progress: 100, status: "completed", leads: 450 },
              { name: "Product Launch", progress: 65, status: "calling", leads: 320 },
              { name: "Follow-up Batch", progress: 30, status: "calling", leads: 180 },
              { name: "Enterprise Leads", progress: 0, status: "draft", leads: 95 },
            ].map((c) => (
              <div key={c.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{c.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${
                    c.status === "completed" ? "bg-success/10 text-success" :
                    c.status === "calling" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>{c.status}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full gradient-primary transition-all duration-500"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{c.leads} leads • {c.progress}% processed</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl glass-card">
        <h3 className="font-semibold mb-4 text-foreground">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  t.type === "credit" ? "bg-success/10" :
                  t.type === "debit" ? "bg-destructive/10" :
                  "bg-primary/10"
                }`}>
                  {t.type === "campaign" ? <CheckCircle2 className="w-4 h-4 text-primary" /> :
                   t.type === "leads" ? <Users className="w-4 h-4 text-primary" /> :
                   <CreditCard className={`w-4 h-4 ${t.type === "credit" ? "text-success" : "text-destructive"}`} />}
                </div>
                <div>
                  <p className="text-sm text-foreground/90">{t.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {t.date}
                  </p>
                </div>
              </div>
              {t.amount !== undefined && (
                <p className={`text-sm font-medium ${t.amount > 0 ? "text-success" : "text-destructive"}`}>
                  {t.amount > 0 ? "+" : ""}{t.amount} credits
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
