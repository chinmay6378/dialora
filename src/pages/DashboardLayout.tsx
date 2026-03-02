import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <div className="glow-blob-tr" />
      <div className="glow-blob-bl" />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto gradient-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
