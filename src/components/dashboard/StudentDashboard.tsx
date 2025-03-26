import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Code, Award, BarChart, Users, ChevronRight, Play } from 'lucide-react';
import ContestCard from '@/components/ContestCard';
import { Contest } from '@/lib/types';

// Mock data for student dashboard
const upcomingContests: Contest[] = [
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
      },
      {
        id: '2',
        title: 'Valid Parentheses',
        description: 'Check if string has valid parentheses pairs',
        difficulty: 'medium',
        points: 200,
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
];

const activeContests: Contest[] = [
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
];

// Recent performance stats
const recentPerformance = [
  { metric: 'Contests Participated', value: 5, icon: Code },
  { metric: 'Problems Solved', value: 23, icon: Award },
  { metric: 'Current Ranking', value: '#42', icon: BarChart },
];

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Update the renderContestActions function
  const renderContestActions = (contest: Contest) => {
    const isContestActive = new Date() >= new Date(contest.startDate) && 
                          new Date() <= new Date(contest.endDate);

    return (
      <div className="flex gap-2">
        {isContestActive ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (confirm('Are you ready to start the contest? Make sure you have read the rules.')) {
                navigate(`/contests/${contest.id}/participate`);
              }
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Contest
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            <Clock className="h-4 w-4 mr-2" />
            {new Date() < new Date(contest.startDate) ? 'Not Started' : 'Ended'}
          </Button>
        )}
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
          Track your progress and upcoming contests.
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentPerformance.map((item) => (
          <Card key={item.metric} className="card-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.metric}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <item.icon className="h-6 w-6 text-shield-blue" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Contests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Contests</h2>
          <Link to="/contests" className="text-shield-blue hover:underline text-sm flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        {activeContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        ) : (
          <Card className="bg-muted/40">
            <CardContent className="py-8 flex flex-col items-center justify-center text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No Active Contests</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                There are no active contests right now. Check back soon or explore upcoming contests.
              </p>
              <Link to="/contests">
                <Button variant="outline">Browse Upcoming Contests</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Contests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Contests</h2>
          <Link to="/contests" className="text-shield-blue hover:underline text-sm flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Latest Submissions</CardTitle>
            <CardDescription>
              View and track your recent contest submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Code className="h-5 w-5 text-shield-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Binary Search Implementation</p>
                    <p className="text-sm text-muted-foreground">Algorithms 101 Contest</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-500 border-green-200 dark:border-green-800">
                  Accepted
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Code className="h-5 w-5 text-shield-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Dynamic Programming Challenge</p>
                    <p className="text-sm text-muted-foreground">Advanced Algorithms Contest</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500 border-amber-200 dark:border-amber-800">
                  Partially Accepted
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Submissions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
