
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const { user } = useAuth();

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-shield-dark dark:to-shield-slate">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container px-4 md:px-6 max-w-md mx-auto">
          <div className="w-full animate-fade-in flex flex-col items-center">
            <img 
              src="/lovable-uploads/a04e2f3f-098b-458f-be9d-7a2501373708.png" 
              alt="CodeShield" 
              className="h-24 mb-8"
            />
            <AuthForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
