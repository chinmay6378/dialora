import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Megaphone, Users, BookOpen, PhoneCall, CreditCard, Settings, Phone, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", path: "/dashboard/campaigns", icon: Megaphone },
  { title: "Leads", path: "/dashboard/leads", icon: Users },
  { title: "Knowledge Base", path: "/dashboard/knowledge", icon: BookOpen },
  { title: "Call Results", path: "/dashboard/calls", icon: PhoneCall },
  { title: "Billing", path: "/dashboard/billing", icon: CreditCard },
  { title: "Settings", path: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`h-screen sticky top-0 border-r border-border/50 bg-sidebar flex flex-col transition-all duration-300 relative z-20 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <div className="flex items-center gap-2 font-bold text-foreground">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm">VoiceAI Pro</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary/15 text-primary font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
              activeClassName=""
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        {!collapsed && (
          <div className="p-3 rounded-xl glass text-center">
            <p className="text-xs text-muted-foreground">Credits Remaining</p>
            <p className="text-lg font-bold text-primary">247</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
