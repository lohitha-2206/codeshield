import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContestCard from '@/components/ContestCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Contest } from '@/lib/types';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Clock, 
  Edit, 
  Trash, 
  MoreHorizontal, 
  Eye, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Play,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock data for contests
const mockContests: Contest[] = [
  {
    id: '1',
    title: 'Algorithm Masters Challenge',
    description: 'Test your algorithmic skills with challenging problems across various difficulty levels.',
    startDate: new Date(Date.now() + 86400000), // Tomorrow
    endDate: new Date(Date.now() + 172800000), // Day after tomorrow
    status: 'upcoming',
    rules: ['No external references', 'Use only provided languages', 'Time limit per question'],
    questions: [
      {
        id: '1',
        title: 'Two Sum',
        description: 'Find two numbers that add up to a target value',
        difficulty: 'easy',
        points: 100,
        timeLimit: 30,
        testCases: [
          { 
            id: '1',
            input: '[2,7,11,15], 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          },
        ]
      },
      {
        id: '2',
        title: 'Valid Parentheses',
        description: 'Check if string has valid parentheses pairs',
        difficulty: 'medium',
        points: 200,
        timeLimit: 45,
        testCases: [
          {
            input: '()',
            output: 'true',
            explanation: 'Valid parentheses'
          }
        ]
      },
    ],
    participants: 145,
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    createdBy: 'CodeShield Team',
  },
  {
    id: '2',
    title: 'Web Development Championship',
    description: 'Create stunning web applications using modern frameworks and techniques.',
    startDate: new Date(Date.now() + 3 * 86400000), // 3 days from now
    endDate: new Date(Date.now() + 4 * 86400000), // 4 days from now
    status: 'upcoming',
    rules: ['Use specified frameworks only', 'Build responsive designs', 'All code must be original'],
    questions: [
      {
        id: '1',
        title: 'Build a Todo App',
        description: 'Create a fully functional todo application',
        difficulty: 'medium',
        points: 250,
      },
    ],
    participants: 89,
    languages: ['JavaScript', 'React', 'HTML', 'CSS'],
    createdBy: 'WebDev Institute',
  },
  {
    id: '3',
    title: 'Data Structures Sprint',
    description: 'Demonstrate your knowledge of data structures with optimization challenges.',
    startDate: new Date(Date.now() - 86400000), // Yesterday
    endDate: new Date(Date.now() + 86400000), // Tomorrow
    status: 'active',
    rules: ['Time efficiency matters', 'Memory usage tracked', 'Optimize for both space and time'],
    questions: [
      {
        id: '1',
        title: 'Implement a Queue',
        description: 'Create an efficient queue implementation',
        difficulty: 'easy',
        points: 150,
      },
      {
        id: '2',
        title: 'Binary Search Tree Operations',
        description: 'Implement various BST operations efficiently',
        difficulty: 'hard',
        points: 350,
      },
    ],
    participants: 203,
    languages: ['Python', 'Java', 'C++', 'Go'],
    createdBy: 'CS Department',
  },
  {
    id: '4',
    title: 'Frontend Coding Challenge',
    description: 'Build responsive UIs and implement interactive features within a time limit.',
    startDate: new Date(Date.now() - 172800000), // 2 days ago
    endDate: new Date(Date.now() - 86400000), // Yesterday
    status: 'completed',
    rules: ['Use vanilla JavaScript only', 'No external libraries', 'Focus on accessibility'],
    questions: [
      {
        id: '1',
        title: 'Responsive Navbar',
        description: 'Create a responsive navigation bar',
        difficulty: 'easy',
        points: 100,
      },
    ],
    participants: 175,
    languages: ['HTML', 'CSS', 'JavaScript'],
    createdBy: 'Frontend Guild',
  },
  {
    id: '5',
    title: 'Database Design Challenge',
    description: 'Create efficient database schemas and optimize queries for performance.',
    startDate: new Date(Date.now() + 5 * 86400000), // 5 days from now
    endDate: new Date(Date.now() + 6 * 86400000), // 6 days from now
    status: 'upcoming',
    rules: ['Use provided test data', 'Optimize for read performance', 'Document your design decisions'],
    questions: [
      {
        id: '1',
        title: 'E-commerce Schema',
        description: 'Design a database schema for an e-commerce platform',
        difficulty: 'medium',
        points: 200,
        timeLimit: 120,
        testCases: [
          {
            input: 'example input 1',
            output: 'example output 1',
            explanation: 'example explanation 1'
          },
          {
            input: 'example input 2',
            output: 'example output 2',
            explanation: 'example explanation 2'
          }
        ]
      }
    ],
    participants: 52,
    languages: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL'],
    createdBy: 'Database Systems Lab',
  },
  {
    id: '6',
    title: 'Mobile App Development Sprint',
    description: 'Build mobile applications with a focus on user experience and performance.',
    startDate: new Date(Date.now() - 10 * 86400000), // 10 days ago
    endDate: new Date(Date.now() - 8 * 86400000), // 8 days ago
    status: 'completed',
    rules: ['Use native APIs', 'Focus on performance', 'Implement responsive design'],
    questions: [
      {
        id: '1',
        title: 'Weather App',
        description: 'Create a weather application with location services',
        difficulty: 'medium',
        points: 250,
        timeLimit: 60, // example time limit in minutes
        testCases: [
          { input: 'location=NYC', output: 'weather data for NYC', expectedOutput: 'weather data for NYC', explanation: 'Weather data for New York City' },
          { id: '2', input: 'location=LA', output: 'weather data for LA', expectedOutput: 'weather data for LA', explanation: 'Weather data for Los Angeles' },
        ],
      },
    ],
    participants: 120,
    languages: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
    createdBy: 'Mobile Dev Community',
  },
];

const Contests = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter contests based on active tab and search query
  const filteredContests = mockContests.filter((contest) => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && contest.status === 'active') ||
      (activeTab === 'upcoming' && contest.status === 'upcoming') ||
      (activeTab === 'completed' && contest.status === 'completed');
    
    const matchesSearch = 
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.languages.some(lang => lang.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  // Function to handle deleting a contest
  const handleDeleteContest = (id: string) => {
    try {
      // In a real app, this would call an API to delete the contest
      // For now, we'll just show a success message
      toast.success('Contest deleted successfully');
      setConfirmDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete contest');
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-blue-500 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderContestActions = (contest: Contest) => {
    // Show different actions based on user role
    if (user?.role === 'organizer') {
      return (
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/contests/${contest.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={() => handleDeleteContest(contest.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      );
    } else {
      // Student view
      const isContestActive = new Date() >= new Date(contest.startDate) && 
                            new Date() <= new Date(contest.endDate);
      return (
        <Button
          variant={isContestActive ? "default" : "outline"}
          size="sm"
          onClick={() => navigate(`/contests/${contest.id}`)}
          disabled={!isContestActive}
        >
          {isContestActive ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Contest
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-2" />
              {new Date() < new Date(contest.startDate) ? 'Not Started' : 'Ended'}
            </>
          )}
        </Button>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Contests</h1>
                <p className="text-muted-foreground mt-1">
                  {user?.role === 'organizer' 
                    ? 'Manage your coding contests and challenges' 
                    : 'Explore and participate in coding contests'}
                </p>
              </div>
              
              {user?.role === 'organizer' && (
                <Link to="/contests/create">
                  <Button className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Contest
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contests..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {user?.role === 'organizer' ? (
                  // Organizer view
                  <div className="grid grid-cols-1 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <OrganizerContestCard 
                          key={contest.id} 
                          contest={contest} 
                          onDelete={() => setConfirmDeleteId(contest.id)}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No contests found matching your search.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Student view
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No contests found matching your search.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="active" className="mt-6">
                {user?.role === 'organizer' ? (
                  // Organizer view
                  <div className="grid grid-cols-1 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <OrganizerContestCard 
                          key={contest.id} 
                          contest={contest} 
                          onDelete={() => setConfirmDeleteId(contest.id)}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No active contests found.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Student view
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No active contests found.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-6">
                {user?.role === 'organizer' ? (
                  // Organizer view
                  <div className="grid grid-cols-1 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <OrganizerContestCard 
                          key={contest.id} 
                          contest={contest} 
                          onDelete={() => setConfirmDeleteId(contest.id)}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No upcoming contests found.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Student view
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No upcoming contests found.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                {user?.role === 'organizer' ? (
                  // Organizer view
                  <div className="grid grid-cols-1 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <OrganizerContestCard 
                          key={contest.id} 
                          contest={contest} 
                          onDelete={() => setConfirmDeleteId(contest.id)}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No completed contests found.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Student view
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredContests.length > 0 ? (
                      filteredContests.map((contest) => (
                        <ContestCard key={contest.id} contest={contest} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
                        <p className="text-muted-foreground">No completed contests found.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contest? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDeleteId && handleDeleteContest(confirmDeleteId)}
            >
              Delete Contest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

// Component for organizer contest card view
interface OrganizerContestCardProps {
  contest: Contest;
  onDelete: () => void;
  formatDate: (date: Date) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const OrganizerContestCard: React.FC<OrganizerContestCardProps> = ({ 
  contest, 
  onDelete,
  formatDate,
  getStatusBadge
}) => {
  const navigate = useNavigate();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Status indicator */}
        <div className={`md:w-2 h-2 md:h-auto flex-shrink-0 ${
          contest.status === 'active' 
            ? 'bg-green-500' 
            : contest.status === 'upcoming'
              ? 'bg-blue-500'
              : 'bg-gray-300'
        }`}></div>
        
        <div className="flex-grow flex flex-col md:flex-row">
          {/* Main content */}
          <div className="p-6 flex-grow">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(contest.status)}
              <div>
                {getStatusBadge(contest.status)}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mt-2">{contest.title}</h3>
            <p className="text-muted-foreground mt-2 line-clamp-2">{contest.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Starts: {formatDate(contest.startDate)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Ends: {formatDate(contest.endDate)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{contest.participants} Participants</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-2">📝</span>
                <span>{contest.questions.length} Questions</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-1">
              {contest.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Actions panel - Organizer specific actions only */}
          <div className="flex md:flex-col justify-between border-t md:border-t-0 md:border-l p-4 bg-muted/20">
            <Button 
              onClick={() => navigate(`/contests/${contest.id}/analytics`)}
              variant="outline" 
              className="flex items-center justify-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            
            <Button 
              onClick={() => navigate(`/contests/${contest.id}/edit`)}
              variant="outline" 
              className="flex items-center justify-center gap-2 mt-2"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            
            <Button 
              onClick={onDelete}
              variant="outline" 
              className="flex items-center justify-center gap-2 mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
            >
              <Trash className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Contests;
