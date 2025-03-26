
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Code, FileCheck, LineChart, Users, ChevronRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-32 md:pb-24 hero-pattern">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
              <div className="flex items-center justify-center mb-8">
                <img 
                  src="/lovable-uploads/a04e2f3f-098b-458f-be9d-7a2501373708.png" 
                  alt="CodeShield" 
                  className="h-28 md:h-32"
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight bg-gradient-to-r from-shield-blue to-shield-teal bg-clip-text text-transparent max-w-4xl">
                Protect Intellectual Property in Coding Contests
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mt-4">
                Ensure fair coding competitions with advanced AI that detects fraud, plagiarism, and prevents intellectual property theft.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/login">
                  <Button className="h-12 px-8 bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="h-12 px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2 text-shield-teal" />
                <span>Trusted by 500+ students and faculty members</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-shield-dark">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16 animate-slide-up">
              <h2 className="text-3xl font-bold tracking-tight">How CodeShield Works</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our platform combines innovative technology with user-friendly features to create a secure environment for coding competitions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
              <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/5 card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                  <Code className="h-6 w-6 text-shield-blue" />
                </div>
                <h3 className="text-xl font-semibold">Advanced Editor</h3>
                <p className="text-muted-foreground">
                  Code in a VS Code-like environment with syntax highlighting and code completion.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/5 card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                  <FileCheck className="h-6 w-6 text-shield-blue" />
                </div>
                <h3 className="text-xl font-semibold">Fraud Detection</h3>
                <p className="text-muted-foreground">
                  AI-powered tools to identify plagiarism, AI-generated code, and focus violations.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/5 card-hover">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                  <LineChart className="h-6 w-6 text-shield-blue" />
                </div>
                <h3 className="text-xl font-semibold">Real-time Leaderboard</h3>
                <p className="text-muted-foreground">
                  Track rankings and performance with live updates during contests.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Role-based Features */}
        <section className="py-16 md:py-24 bg-shield-lightBlue dark:bg-shield-slate">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-slide-up">
                <h2 className="text-3xl font-bold tracking-tight">For Contest Organizers</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FileCheck className="h-5 w-5 text-shield-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Contest Management</h3>
                      <p className="text-muted-foreground">
                        Create, edit, and manage coding contests with customizable rules, questions, and preferred languages.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="h-5 w-5 text-shield-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Fraud Detection Dashboard</h3>
                      <p className="text-muted-foreground">
                        Review flagged submissions with detailed information on suspicious activities and take appropriate actions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="h-5 w-5 text-shield-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Participant Oversight</h3>
                      <p className="text-muted-foreground">
                        Monitor submissions, track participant progress, and respond to student queries.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                    Organize a Contest
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-8 animate-slide-up">
                <h2 className="text-3xl font-bold tracking-tight">For Students</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Code className="h-5 w-5 text-shield-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Interactive Coding Environment</h3>
                      <p className="text-muted-foreground">
                        Code in a VS Code-like editor, run your solutions against test cases, and submit with confidence.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <LineChart className="h-5 w-5 text-shield-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
                      <p className="text-muted-foreground">
                        Monitor your progress, view past results, and track your standing on the real-time leaderboard.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="h-5 w-5 text-shield-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Fair Competition</h3>
                      <p className="text-muted-foreground">
                        Participate in a level playing field where your original work is recognized and valued.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                    Join a Contest
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-white dark:bg-shield-dark">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-scale-in">
              <h2 className="text-3xl font-bold tracking-tight">Ready to Experience Fair Coding Contests?</h2>
              <p className="text-lg text-muted-foreground">
                Join CodeShield today and be part of a community that values original work and fair competition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/login">
                  <Button className="h-12 px-8 bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="h-12 px-8">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-col items-center">
                <p className="text-sm font-medium mb-2">Demo Accounts Available:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                    <p><span className="font-medium">Student:</span> student@example.com</p>
                    <p><span className="font-medium">Password:</span> password123</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                    <p><span className="font-medium">Organizer:</span> organizer@example.com</p>
                    <p><span className="font-medium">Password:</span> password123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
