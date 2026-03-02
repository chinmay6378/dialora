import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardLayout from "./pages/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Campaigns from "./pages/dashboard/Campaigns";
import Leads from "./pages/dashboard/Leads";
import KnowledgeBase from "./pages/dashboard/KnowledgeBase";
import CallResults from "./pages/dashboard/CallResults";
import Billing from "./pages/dashboard/Billing";
import SettingsPage from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="leads" element={<Leads />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="calls" element={<CallResults />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
