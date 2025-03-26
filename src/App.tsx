import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import ContestAnalytics from "./pages/ContestAnalytics";
import CreateContest from "./pages/CreateContest";
import EditContest from "./pages/EditContest";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import ContestParticipation from "./pages/ContestParticipation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Contest Routes */}
            <Route path="/contests" element={<Contests />} />
            <Route path="/contests/create" element={<CreateContest />} />
            {/* Student view */}
            <Route path="/contests/:contestId" element={<ContestDetail />} />
            <Route path="/contests/:contestId/participate" element={<ContestParticipation />} />
            {/* Organizer view */}
            <Route path="/contests/:contestId/edit" element={<EditContest />} />
            <Route path="/contests/:contestId/analytics" element={<ContestAnalytics />} />
            
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
