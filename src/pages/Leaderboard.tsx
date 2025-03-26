
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Trophy, Clock, AlertTriangle } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/types';

// Mock data for leaderboard
const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: '1',
    userName: 'Alex Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random',
    score: 850,
    solvedQuestions: 8,
    averageTime: 35,
    isFraud: false,
  },
  {
    userId: '2',
    userName: 'Samantha Lee',
    avatar: 'https://ui-avatars.com/api/?name=Samantha+Lee&background=random',
    score: 920,
    solvedQuestions: 9,
    averageTime: 29,
    isFraud: false,
  },
  {
    userId: '3',
    userName: 'David Chen',
    avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=random',
    score: 780,
    solvedQuestions: 7,
    averageTime: 40,
    isFraud: false,
  },
  {
    userId: '4',
    userName: 'Maria Garcia',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=random',
    score: 750,
    solvedQuestions: 7,
    averageTime: 42,
    isFraud: true,
  },
  {
    userId: '5',
    userName: 'James Smith',
    avatar: 'https://ui-avatars.com/api/?name=James+Smith&background=random',
    score: 680,
    solvedQuestions: 6,
    averageTime: 45,
    isFraud: true,
  },
  {
    userId: '6',
    userName: 'Sophie Taylor',
    avatar: 'https://ui-avatars.com/api/?name=Sophie+Taylor&background=random',
    score: 950,
    solvedQuestions: 9,
    averageTime: 27,
    isFraud: false,
  },
  {
    userId: '7',
    userName: 'Mohammed Ali',
    avatar: 'https://ui-avatars.com/api/?name=Mohammed+Ali&background=random',
    score: 890,
    solvedQuestions: 8,
    averageTime: 32,
    isFraud: false,
  },
  {
    userId: '8',
    userName: 'Emma Wilson',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=random',
    score: 820,
    solvedQuestions: 8,
    averageTime: 38,
    isFraud: false,
  },
  {
    userId: '9',
    userName: 'Lucas Brown',
    avatar: 'https://ui-avatars.com/api/?name=Lucas+Brown&background=random',
    score: 710,
    solvedQuestions: 7,
    averageTime: 48,
    isFraud: false,
  },
  {
    userId: '10',
    userName: 'Olivia Jones',
    avatar: 'https://ui-avatars.com/api/?name=Olivia+Jones&background=random',
    score: 880,
    solvedQuestions: 8,
    averageTime: 33,
    isFraud: false,
  },
];

// Available contests for select
const availableContests = [
  { id: '1', name: 'Algorithm Masters Challenge' },
  { id: '2', name: 'Web Development Championship' },
  { id: '3', name: 'Data Structures Sprint' },
  { id: '4', name: 'Frontend Coding Challenge' },
];

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContest, setSelectedContest] = useState('3'); // Default to Data Structures Sprint
  
  // Filter leaderboard based on search query
  const filteredLeaderboard = mockLeaderboard.filter((entry) => 
    entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort by score (descending)
  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => b.score - a.score);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-muted-foreground mt-1">
                View rankings and performance metrics for current contests
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedContest} onValueChange={setSelectedContest}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Select contest" />
                </SelectTrigger>
                <SelectContent>
                  {availableContests.map((contest) => (
                    <SelectItem key={contest.id} value={contest.id}>
                      {contest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Leaderboard Table */}
            <div className="bg-white dark:bg-shield-dark border border-border rounded-lg overflow-hidden shadow-sm animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Participant</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Score</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Problems Solved</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Avg. Time (min)</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaderboard.map((entry, index) => (
                      <tr 
                        key={entry.userId} 
                        className={`border-b border-border ${
                          entry.isFraud ? 'bg-red-50/30 dark:bg-red-900/10' : index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <div className={`h-7 w-7 rounded-full flex items-center justify-center mr-2 ${
                                index === 0 
                                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500'
                                  : index === 1
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500'
                              }`}>
                                <Trophy className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <span className="h-7 w-7 flex items-center justify-center font-medium">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={entry.avatar} alt={entry.userName} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                                {entry.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{entry.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-right font-medium">{entry.score}</td>
                        <td className="px-4 py-4 text-sm text-right">{entry.solvedQuestions}</td>
                        <td className="px-4 py-4 text-sm text-right">
                          <div className="inline-flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{entry.averageTime}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-right">
                          {entry.isFraud ? (
                            <Badge variant="outline" className="ml-auto bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                              Verified
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Legend */}
            <div className="bg-muted/30 rounded-lg p-4 text-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                    Verified
                  </Badge>
                  <span className="text-muted-foreground">Submissions passed all fraud checks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                  <span className="text-muted-foreground">Suspicious activity detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
