
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contests', path: '/contests' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-shield-dark/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <img 
              src="/lovable-uploads/a04e2f3f-098b-458f-be9d-7a2501373708.png" 
              alt="CodeShield" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Only show when logged in */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-shield-blue font-medium bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 hover:text-shield-blue hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-blue-100 dark:border-blue-900">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-shield-blue text-white">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:text-shield-blue">
                    Log In
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-shield-dark border-b border-gray-200 dark:border-gray-800 animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Only show nav links when logged in */}
            {user && navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'text-shield-blue font-medium bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 hover:text-shield-blue hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            {user ? (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-4 py-2">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-shield-blue text-white">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="mt-2 w-full flex items-center px-4 py-2 text-left rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Log In
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-center rounded-md text-white bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
