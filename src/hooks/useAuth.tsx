
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts for quick login
const DEMO_ACCOUNTS = {
  student: {
    email: 'student@example.com',
    password: 'password123',
    name: 'Demo Student',
    role: 'student' as UserRole,
  },
  organizer: {
    email: 'organizer@example.com',
    password: 'password123',
    name: 'Demo Organizer',
    role: 'organizer' as UserRole,
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for saved auth state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('codeshield_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Mock authentication functions for MVP
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    try {
      // Check for demo accounts first
      if (
        (email === DEMO_ACCOUNTS.student.email && password === DEMO_ACCOUNTS.student.password) ||
        (email === DEMO_ACCOUNTS.organizer.email && password === DEMO_ACCOUNTS.organizer.password)
      ) {
        // Determine which demo account to use
        const isDemoStudent = email === DEMO_ACCOUNTS.student.email;
        const demoAccount = isDemoStudent ? DEMO_ACCOUNTS.student : DEMO_ACCOUNTS.organizer;
        
        const mockUser: User = {
          id: isDemoStudent ? 'demo-student-123' : 'demo-organizer-456',
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role,
          avatar: `https://ui-avatars.com/api/?name=${demoAccount.name.replace(' ', '+')}&background=random`,
        };
        
        // Save to local storage
        localStorage.setItem('codeshield_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        // Success message
        toast.success(`Logged in as ${mockUser.name}`);
        return;
      }
      
      // For non-demo accounts, create a mock user
      const mockUser: User = {
        id: '123',
        name: email.split('@')[0],
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
      };
      
      // Save to local storage
      localStorage.setItem('codeshield_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      const mockUser: User = {
        id: '123',
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
      };
      
      // Save to local storage
      localStorage.setItem('codeshield_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Success message
      toast.success(`Welcome, ${name}!`);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('codeshield_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
