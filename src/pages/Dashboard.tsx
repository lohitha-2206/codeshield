import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import OrganizerDashboard from '@/components/dashboard/OrganizerDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-6xl">
          {user.role === 'organizer' ? <OrganizerDashboard /> : <StudentDashboard />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
