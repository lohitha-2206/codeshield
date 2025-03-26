
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Shield, Loader2, Users } from 'lucide-react';
import { UserRole } from '@/lib/types';

const AuthForm: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('student');
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('student');

  // Demo account shortcuts
  const setDemoStudent = () => {
    setLoginEmail('student@example.com');
    setLoginPassword('password123');
    setLoginRole('student');
  };

  const setDemoOrganizer = () => {
    setLoginEmail('organizer@example.com');
    setLoginPassword('password123');
    setLoginRole('organizer');
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword, loginRole);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(signupName, signupEmail, signupPassword, signupRole);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Signup failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-shield-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to CodeShield
        </h1>
        <p className="text-sm text-muted-foreground">
          Secure your coding contests with AI-powered protection
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-shield-blue hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup
                value={loginRole}
                onValueChange={(value) => setLoginRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="login-student" />
                  <Label htmlFor="login-student" className="cursor-pointer">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organizer" id="login-organizer" />
                  <Label htmlFor="login-organizer" className="cursor-pointer">Organizer</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Demo Account Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={setDemoStudent}
                className="flex items-center justify-center text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                Demo Student
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={setDemoOrganizer}
                className="flex items-center justify-center text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Demo Organizer
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="signup" className="mt-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="••••••••"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup
                value={signupRole}
                onValueChange={(value) => setSignupRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="signup-student" />
                  <Label htmlFor="signup-student" className="cursor-pointer">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organizer" id="signup-organizer" />
                  <Label htmlFor="signup-organizer" className="cursor-pointer">Organizer</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
