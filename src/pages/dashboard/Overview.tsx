import { Megaphone, PhoneCall, Users, CreditCard, TrendingUp, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Total Campaigns", value: "12", icon: Megaphone, change: "+3 this month" },
  { label: "Total Calls", value: "1,847", icon: PhoneCall, change: "+234 this week" },
  { label: "Interested Leads", value: "23%", icon: Users, change: "+4.2% vs last" },
  { label: "Credits Remaining", value: "247", icon: CreditCard, change: "of 500 purchased" },
];

const recentActivity = [
  { action: "Campaign 'Q1 Outreach' completed", time: "2 hours ago" },
  { action: "42 new leads uploaded", time: "5 hours ago" },
  { action: "Knowledge doc 'Product Guide' processed", time: "1 day ago" },
  { action: "Campaign 'Follow-up Batch 3' started", time: "2 days ago" },
  { action: "100 credits purchased", time: "3 days ago" },
];

const Overview = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Your campaign performance at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl glass-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-success mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-card">
          <h3 className="font-semibold mb-4 text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <p className="text-sm text-foreground/90">{item.action}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card">
          <h3 className="font-semibold mb-4 text-foreground">Call Performance</h3>
          <div className="flex items-end justify-between h-48 px-2">
            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 rounded-t-lg gradient-primary transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
