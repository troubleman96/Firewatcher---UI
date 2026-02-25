import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { IncidentProvider } from "@/contexts/IncidentContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIncident from "./pages/ReportIncident";
import IncidentDetail from "./pages/IncidentDetail";
import MyIncidents from "./pages/MyIncidents";
import Dashboard from "./pages/Dashboard";
import AllIncidents from "./pages/AllIncidents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IncidentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/incident/:id" element={<IncidentDetail />} />
              <Route path="/my-incidents" element={<MyIncidents />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incidents" element={<AllIncidents />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </IncidentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
