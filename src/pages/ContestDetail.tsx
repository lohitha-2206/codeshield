import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { 
  Clock, 
  Users, 
  AlignLeft, 
  Check, 
  ArrowLeft, 
  Play, 
  Send, 
  AlertTriangle,
  X,
  RefreshCw,
  Share2,
  FileText,
  FileLock2,
  Terminal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/contest/CodeEditor';
import { toast } from 'sonner';
import { Contest, Question, TestCase } from '@/lib/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { getLanguageTemplate } from '@/lib/code-languages';

// Mock contest data (would be fetched from API in real implementation)
const mockContests: Record<string, Contest> = {
  '1': {
    id: '1',
    title: 'Algorithm Masters Challenge',
    description: 'Test your algorithmic skills with challenging problems across various difficulty levels.',
    startDate: new Date(Date.now() - 86400000), // Yesterday
    endDate: new Date(Date.now() + 86400000), // Tomorrow
    status: 'active',
    rules: [
      'No external code references allowed',
      'Use only the provided languages',
      'Time limit per question must be respected',
      'All solutions must pass provided test cases',
      'Do not leave the browser tab during the contest'
    ],
    questions: [
      {
        id: '1-1',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        difficulty: 'easy',
        points: 100,
        timeLimit: 30,
        testCases: [
          {
            input: '[2,7,11,15], 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          },
          {
            input: '[3,2,4], 6',
            output: '[1,2]',
            explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
          },
          {
            input: '[3,3], 6',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
        difficulty: 'medium',
        points: 200,
        timeLimit: 45,
        testCases: [
          {
            input: '"()"',
            output: 'true',
            explanation: 'The string contains matching parentheses.'
          },
          {
            input: '"()[]{}"',
            output: 'true',
            explanation: 'All brackets are matched and closed in the correct order.'
          },
          {
            input: '"(]"',
            output: 'false',
            explanation: 'The brackets are not matched properly.'
          },
          {
            input: '"([)]"',
            output: 'false',
            explanation: 'The brackets are not closed in the correct order.'
          }
        ]
      },
    ],
    participants: 145,
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    createdBy: 'CodeShield Team',
  },
  '3': {
    id: '3',
    title: 'Data Structures Sprint',
    description: 'Demonstrate your knowledge of data structures with optimization challenges.',
    startDate: new Date(Date.now() - 86400000), // Yesterday
    endDate: new Date(Date.now() + 86400000), // Tomorrow
    status: 'active',
    rules: [
      'Time efficiency matters',
      'Memory usage is tracked',
      'Optimize for both space and time',
      'No external libraries allowed',
      'Focus must be maintained on the test window'
    ],
    questions: [
      {
        id: '3-1',
        title: 'Implement a Queue',
        description: 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).',
        difficulty: 'easy',
        points: 150,
        timeLimit: 45,
        testCases: [
          {
            input: '["Queue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
            output: '[null, null, null, 1, 1, false]',
            explanation: 'Queue queue = new Queue();\nqueue.push(1);\nqueue.push(2);\nqueue.peek();  // returns 1\nqueue.pop();   // returns 1\nqueue.empty(); // returns false'
          }
        ]
      },
      {
        id: '3-2',
        title: 'Binary Search Tree Operations',
        description: 'Implement the insertion, deletion, and search operations for a binary search tree. Your implementation should handle edge cases like empty trees and duplicates appropriately.',
        difficulty: 'hard',
        points: 350,
        timeLimit: 60,
        testCases: [
          {
            input: '["BST", "insert", "insert", "search", "delete", "search"]\n[[], [5], [3], [5], [5], [5]]',
            output: '[null, null, null, true, null, false]',
            explanation: 'BST bst = new BST();\nbst.insert(5);\nbst.insert(3);\nbst.search(5);  // returns true\nbst.delete(5);\nbst.search(5);  // returns false'
          }
        ]
      },
    ],
    participants: 203,
    languages: ['Python', 'Java', 'C++', 'Go'],
    createdBy: 'CS Department',
  },
};

const ContestDetail: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('JavaScript');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [focusViolations, setFocusViolations] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResults, setRunResults] = useState<{passed: boolean, message: string, testCase: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [contestStarted, setContestStarted] = useState<boolean>(false);
  
  // Get contest data from our mock data
  const contest = contestId ? mockContests[contestId] : null;
  
  // Start timer for question
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up!
      toast.error("Time's up! Your solution will be submitted automatically.");
      handleSubmitCode();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);
  
  // Format time in minutes and seconds
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!contest) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold">Contest Not Found</h1>
              <p className="mt-4 text-muted-foreground">
                The contest you're looking for doesn't exist or has been removed.
              </p>
              <Button
                className="mt-6"
                onClick={() => navigate('/contests')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contests
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStartContest = () => {
    setContestStarted(true);
    toast.success("Contest started! Good luck!");
    setActiveTab('problems');
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setActiveTab('solve');
    // Reset code when selecting a new question
    const template = getLanguageTemplate(selectedLanguage.toLowerCase());
    setCode(template);
    
    // Reset timer
    if (question.timeLimit) {
      setTimeLeft(question.timeLimit * 60);
      setTimerActive(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // Adjust template code based on language
    const template = getLanguageTemplate(language.toLowerCase());
    setCode(template);
  };

  const handleStartSolving = () => {
    setIsFullScreen(true);
    if (selectedQuestion?.timeLimit && timeLeft !== null) {
      setTimerActive(true);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setRunResults([]);
    toast.info("Running your code...");
    
    // Mock execution - in a real app, this would send the code to a backend
    setTimeout(() => {
      setIsRunning(false);
      
      // Generate mock results - simulate passing some test cases
      if (selectedQuestion?.testCases) {
        const results = selectedQuestion.testCases.map((_, index) => {
          const passed = Math.random() > 0.3; // 70% chance to pass
          return {
            passed,
            message: passed ? 'Success!' : 'Failed. Expected output does not match.',
            testCase: index + 1
          };
        });
        
        setRunResults(results);
        
        const passedCount = results.filter(r => r.passed).length;
        const totalCount = results.length;
        
        toast.success(`Code executed: ${passedCount}/${totalCount} test cases passed!`);
      } else {
        toast.success("Code executed successfully!");
      }
    }, 2000);
  };

  const handleSubmitCode = () => {
    if (focusViolations > 2) {
      toast.error("Too many focus violations. Your submission may be flagged for review.");
    }
    
    setIsSubmitting(true);
    toast.info("Submitting your solution...");
    setTimerActive(false);
    
    // Mock submission - in a real app, this would send the code to a backend
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Generate random results for demo
      const passRate = Math.random();
      
      if (passRate > 0.8) {
        toast.success("Solution submitted successfully! All test cases passed!");
      } else if (passRate > 0.4) {
        toast.warning("Solution submitted with partial success. Some test cases failed.");
      } else {
        toast.error("Solution failed most test cases. Try again!");
      }
      
      // Exit full screen and go back to questions
      setIsFullScreen(false);
      setActiveTab('problems');
    }, 3000);
  };

  // Mock function to simulate focus violations
  const handleFocusViolation = () => {
    const newViolations = focusViolations + 1;
    setFocusViolations(newViolations);
    
    if (newViolations <= 2) {
      toast.warning(`Focus violation detected! (${newViolations}/3)`);
    } else {
      toast.error("Multiple focus violations detected! Your submission will be flagged.");
    }
  };

  // Format date to readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format test case
  const formatTestCase = (testCase: TestCase, index: number) => {
    return (
      <div key={index} className="bg-gray-900 p-3 rounded-md mb-3">
        <div className="text-xs font-semibold text-gray-400 mb-1">Example {index + 1}</div>
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Input:</div>
          <pre className="text-gray-300 font-mono text-sm bg-gray-800 p-2 rounded whitespace-pre-wrap">{testCase.input}</pre>
        </div>
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Output:</div>
          <pre className="text-gray-300 font-mono text-sm bg-gray-800 p-2 rounded whitespace-pre-wrap">{testCase.output}</pre>
        </div>
        {testCase.explanation && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Explanation:</div>
            <pre className="text-gray-300 font-mono text-sm bg-gray-800 p-2 rounded whitespace-pre-wrap">{testCase.explanation}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col min-h-screen ${isFullScreen ? 'bg-gray-900' : ''}`}>
      {!isFullScreen && <Navbar />}
      
      <main className={`flex-grow ${isFullScreen ? 'pt-0' : 'pt-24'} pb-16`}>
        <div className={`container px-4 md:px-6 ${isFullScreen ? 'max-w-full' : 'max-w-6xl'}`}>
          {isFullScreen ? (
            // Full-screen mode for solving problems
            <div className="h-screen flex flex-col">
              <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsFullScreen(false);
                      setTimerActive(false);
                    }}
                    className="text-white hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Exit Full Screen
                  </Button>
                  <div className="ml-4">
                    <span className="font-medium">{contest.title}</span>
                    <span className="mx-2">|</span>
                    <span>{selectedQuestion?.title}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {timeLeft !== null && (
                    <div className="bg-gray-700 px-3 py-1 rounded-md flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className={`font-mono ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}
                  <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {selectedQuestion?.timeLimit} min
                  </Badge>
                  <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800">
                    {selectedQuestion?.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                    {selectedQuestion?.points} points
                  </Badge>
                </div>
              </div>
              
              <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Problem Description</h3>
                    <p className="text-gray-300">{selectedQuestion?.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Examples</h3>
                    <div className="space-y-3">
                      {selectedQuestion?.testCases?.map((testCase, index) => (
                        formatTestCase(testCase, index)
                      ))}
                    </div>
                  </div>
                  
                  {runResults.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                        <Terminal className="h-5 w-5 mr-2" />
                        Test Results
                      </h3>
                      <div className="space-y-3">
                        {runResults.map((result, index) => (
                          <Alert key={index} className={result.passed ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}>
                            <div className="flex items-center">
                              {result.passed ? (
                                <Check className="h-4 w-4 text-green-400 mr-2" />
                              ) : (
                                <X className="h-4 w-4 text-red-400 mr-2" />
                              )}
                              <AlertTitle className={result.passed ? "text-green-400" : "text-red-400"}>
                                Test Case {result.testCase} - {result.passed ? "Passed" : "Failed"}
                              </AlertTitle>
                            </div>
                            <AlertDescription className="text-gray-300 mt-2 text-sm">
                              {result.message}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-900 flex flex-col">
                  <div className="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                      >
                        {contest.languages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      
                      {focusViolations > 0 && (
                        <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-800">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                          Focus Violations: {focusViolations}/3
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                        onClick={handleRunCode}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Run Code
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSubmitCode}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Submit
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage.toLowerCase()}
                      onFocusViolation={handleFocusViolation}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Regular contest view
            <div className="space-y-8 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <Button
                    variant="ghost"
                    className="mb-2 -ml-2 text-muted-foreground"
                    onClick={() => navigate('/contests')}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Contests
                  </Button>
                  <h1 className="text-3xl font-bold tracking-tight">{contest.title}</h1>
                  <p className="text-muted-foreground mt-1">
                    {contest.description}
                  </p>
                </div>
                
                <div className="flex flex-col items-end">
                  <Badge variant="default" className="mb-2">
                    {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                  </Badge>
                  
                  {contest.status === 'active' && !contestStarted && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
                          Start Contest
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ready to begin?</DialogTitle>
                          <DialogDescription>
                            Once you start, the contest timer will begin. Make sure you're ready to focus for the full duration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted/30 p-4 rounded-md mb-4">
                          <h3 className="font-semibold mb-2 flex items-center">
                            <FileLock2 className="h-4 w-4 mr-2" />
                            Contest Rules
                          </h3>
                          <ul className="text-sm space-y-2">
                            {contest.rules.map((rule, index) => (
                              <li key={index} className="flex gap-2">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleStartContest}>
                            I'm Ready!
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  
                  {contest.status === 'active' && contestStarted && (
                    <Button 
                      className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity"
                      onClick={() => setActiveTab('problems')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Problems
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Contest Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Start Time</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(contest.startDate)}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">End Time</h3>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(contest.endDate)}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Participants</h3>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{contest.participants} registered</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="problems" disabled={!contestStarted}>Problems</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Contest Overview</h2>
                      <p>{contest.description}</p>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Supported Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {contest.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Organized by</h3>
                        <p className="text-sm text-muted-foreground">{contest.createdBy}</p>
                      </div>
                      
                      {!contestStarted && contest.status === 'active' && (
                        <div className="mt-6 pt-4 border-t">
                          <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
                            <AlertTitle className="flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Ready to challenge yourself?
                            </AlertTitle>
                            <AlertDescription className="mt-2">
                              Click the "Start Contest" button above to begin solving problems and test your coding skills.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="problems" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Problems</h2>
                      <div className="space-y-4">
                        {contest.questions.map((question) => (
                          <div 
                            key={question.id}
                            className="border rounded-lg p-4 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 dark:hover:border-blue-800 cursor-pointer transition-colors"
                            onClick={() => handleQuestionSelect(question)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{question.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {question.description}
                                </p>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                                  {question.difficulty}
                                </Badge>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  {question.points} points
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rules" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Contest Rules</h2>
                      <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-md p-4">
                          <p className="text-yellow-800 dark:text-yellow-400 font-semibold flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Important Notice
                          </p>
                          <p className="text-sm mt-2">
                            Violation of these rules may result in disqualification. All submissions will be checked for plagiarism and AI-generated content.
                          </p>
                        </div>
                        
                        <ul className="space-y-3">
                          {contest.rules.map((rule, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="solve" className="space-y-6">
                  {selectedQuestion ? (
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-xl font-semibold">{selectedQuestion.title}</h2>
                              <div className="flex items-center space-x-3 mt-1">
                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                                  {selectedQuestion.difficulty}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {selectedQuestion.points} points
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {selectedQuestion.timeLimit} min
                                </span>
                              </div>
                            </div>
                            <Button
                              onClick={handleStartSolving}
                              className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity"
                            >
                              Start Coding
                            </Button>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="font-semibold mb-2">Problem Description</h3>
                            <p>{selectedQuestion.description}</p>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="font-semibold mb-2">Examples</h3>
                            <div className="space-y-3">
                              {selectedQuestion.testCases?.map((testCase, index) => (
                                <div key={index} className="bg-muted/40 p-3 rounded-md">
                                  <div className="mb-2">
                                    <div className="text-xs font-semibold mb-1">Input:</div>
                                    <pre className="font-mono text-sm bg-muted/80 p-2 rounded whitespace-pre-wrap">{testCase.input}</pre>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-xs font-semibold mb-1">Output:</div>
                                    <pre className="font-mono text-sm bg-muted/80 p-2 rounded whitespace-pre-wrap">{testCase.output}</pre>
                                  </div>
                                  {testCase.explanation && (
                                    <div>
                                      <div className="text-xs font-semibold mb-1">Explanation:</div>
                                      <pre className="font-mono text-sm bg-muted/80 p-2 rounded whitespace-pre-wrap">{testCase.explanation}</pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex justify-between items-center">
                            <Button variant="outline" onClick={() => setActiveTab('problems')}>
                              <ArrowLeft className="mr-1 h-4 w-4" />
                              Back to Problems
                            </Button>
                            
                            <div className="text-sm text-muted-foreground">
                              <AlignLeft className="inline h-4 w-4 mr-1" />
                              Full instructions will be available in the coding environment
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold">No Problem Selected</h3>
                      <p className="mt-2 text-muted-foreground">
                        Please select a problem from the Problems tab.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab('problems')}
                      >
                        View Problems
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      {!isFullScreen && <Footer />}
    </div>
  );
};

export default ContestDetail;
