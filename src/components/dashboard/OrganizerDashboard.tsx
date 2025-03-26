import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash, Flag, Users, ChevronRight, BarChart, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Contest, Question } from '@/lib/types';
import ContestForm from '@/components/contest/ContestForm';
import { toast } from 'sonner';

// Mock contests for organizer dashboard
const initialMockContests: Contest[] = [
  {
    id: '1',
    title: 'Algorithm Masters Challenge',
    description: 'Test your algorithmic skills with challenging problems across various difficulty levels.',
    startDate: new Date(Date.now() - 86400000), // Yesterday
    endDate: new Date(Date.now() + 86400000), // Tomorrow
    status: 'active',
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
          { input: '1,2,3', output: '2,1', explanation: 'Explanation for sample input 1' },
          { input: '4,5,6', output: '5,4', explanation: 'Explanation for sample input 2' },
        ],
      },
      {
        id: '2',
        title: 'Valid Parentheses',
        description: 'Check if string has valid parentheses pairs',
        difficulty: 'medium',
        points: 200,
        timeLimit: 45,
        testCases: [
          { input: '()', output: 'true', explanation: 'Valid parentheses' },
          { input: '(]', output: 'false', explanation: 'Invalid parentheses' },
        ],
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
        timeLimit: 60,
        testCases: [
          { input: 'sample input 1', output: 'expected output 1', explanation: 'Explanation for sample input 1' },
          { input: 'sample input 2', output: 'expected output 2', explanation: 'Explanation for sample input 2' },
        ],
      },
    ],
    participants: 0,
    languages: ['JavaScript', 'React', 'HTML', 'CSS'],
    createdBy: 'WebDev Institute',
  },
];

// Flagged submissions data
const flaggedSubmissions = [
  {
    id: '1',
    studentName: 'Maria Garcia',
    contestTitle: 'Data Structures Sprint',
    questionTitle: 'Implement a Queue',
    flagReason: 'AI Generated Content',
    similarity: 92,
    focusViolations: 0,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    studentName: 'James Smith',
    contestTitle: 'Algorithm Masters Challenge',
    questionTitle: 'Valid Parentheses',
    flagReason: 'Focus Violations',
    similarity: 65,
    focusViolations: 4,
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    studentName: 'Emma Wilson',
    contestTitle: 'Data Structures Sprint',
    questionTitle: 'Binary Search Tree Operations',
    flagReason: 'High Similarity',
    similarity: 88,
    focusViolations: 1,
    timestamp: new Date(Date.now() - 10800000),
  },
];

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contests');
  const [contests, setContests] = useState<Contest[]>(initialMockContests);
  const navigate = useNavigate();

  // Create a new contest
  const handleCreateContest = (newContest: Contest) => {
    setContests((prev) => [...prev, { ...newContest, id: `${Date.now()}` }]);
    toast.success('Contest created successfully!');
  };

  // Delete a contest
  const handleDeleteContest = (id: string) => {
    setContests((prev) => prev.filter((contest) => contest.id !== id));
    toast.success('Contest deleted successfully!');
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

  const renderContestActions = (contest: Contest) => {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/contests/edit/${contest.id}`)}
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
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your contests and monitor participant activity.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Contests</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="h-12 w-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-bold">348</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-shield-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Flagged Submissions</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <div className="h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Flag className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="contests" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="contests">Contests</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Submissions</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        {/* Contests Tab */}
        <TabsContent value="contests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Contests</h2>
            <Link to="/contests/create">
              <Button className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4 mr-2" />
                Create Contest
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contests.map((contest) => (
              <Card key={contest.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant={contest.status === 'active' ? 'default' : 'secondary'} className="mb-2">
                        {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                      </Badge>
                      <CardTitle>{contest.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {contest.description}
                  </p>
                  <div className="flex items-center justify-start text-xs text-muted-foreground gap-4">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(contest.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{contest.participants} participants</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                      {contest.questions.length} questions
                    </Badge>
                    {contest.languages.slice(0, 2).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                        {lang}
                      </Badge>
                    ))}
                    {contest.languages.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                        +{contest.languages.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <div className="flex space-x-2">
                    <Link to={`/contests/${contest.id}/edit`}>
                      <Button variant="default" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Contest
                      </Button>
                    </Link>
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
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Flagged Submissions Tab */}
        <TabsContent value="flagged" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Flagged Submissions</h2>
            <Button variant="outline">
              <Flag className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Student</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contest</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Flag Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Timestamp</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flaggedSubmissions.map((submission, index) => (
                      <tr 
                        key={submission.id} 
                        className={`border-b border-border ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">{submission.studentName}</td>
                        <td className="px-4 py-3 text-sm">{submission.contestTitle}</td>
                        <td className="px-4 py-3 text-sm">{submission.questionTitle}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className={`
                            ${submission.flagReason === 'AI Generated Content' 
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800' 
                              : submission.flagReason === 'Focus Violations'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
                            }
                          `}>
                            {submission.flagReason}
                          </Badge>
                          {submission.similarity > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {submission.similarity}% similarity
                            </span>
                          )}
                          {submission.focusViolations > 0 && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {submission.focusViolations} violations
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {submission.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                            <Button size="sm" variant="destructive">
                              Flag
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Contest Statistics</h2>
            <Link to="/stats">
              <Button variant="outline" className="text-shield-blue">
                <BarChart className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Participation Rate</CardTitle>
                <CardDescription>
                  Students participating in recent contests
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-2 opacity-30" />
                  <p>Analytics visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection</CardTitle>
                <CardDescription>
                  Breakdown of flagged submissions by reason
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <AlertTriangle className="h-16 w-16 mx-auto mb-2 opacity-30" />
                  <p>Analytics visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerDashboard;
