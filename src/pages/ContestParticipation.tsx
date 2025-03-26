import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CodeEditor from '@/components/CodeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Timer, AlertTriangle, Check, X } from 'lucide-react';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation: string;
}
import { Badge } from '@/components/ui/badge';

// Add these constants at the top of the file
const VIOLATION_MESSAGES = {
  COPY: "Copying is not allowed during the contest!",
  PASTE: "Pasting is not allowed during the contest!",
  RIGHT_CLICK: "Right-click is disabled during the contest!",
  TAB_SWITCH: "Warning: First violation detected! Next violation will end your contest.",
  FINAL: "Contest ended: Multiple violations detected!",
  FULLSCREEN: "Fullscreen mode is required for the contest!"
};

const ContestParticipation: React.FC = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [warningCount, setWarningCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9000); // 2.5 hours in seconds
  const [output, setOutput] = useState<string>('');
  const [testCases] = useState<TestCase[]>([
    {
      id: '1',
      input: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      id: '2',
      input: 'nums = [3,2,4], target = 6',
      expectedOutput: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
    },
    {
      id: '3',
      input: 'nums = [3,3], target = 6',
      expectedOutput: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
    }
  ]);
  
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isRunning, setIsRunning] = useState(false);

  // Combined security measures for contest integrity
  useEffect(() => {
    if (!hasStarted) return;

    const handleViolation = () => {
      if (warningCount === 0) {
        toast.warning(VIOLATION_MESSAGES.TAB_SWITCH, {
          duration: 5000,
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        });
        setWarningCount(prev => prev + 1);
      } else {
        toast.error(VIOLATION_MESSAGES.FINAL, {
          duration: 5000,
        });
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
    };

    const preventDefaultWithMessage = (e: Event, message: string) => {
      e.preventDefault();
      e.stopPropagation();
      toast.error(message);
      return false;
    };

    const handlers = {
      copy: (e: ClipboardEvent) => preventDefaultWithMessage(e, VIOLATION_MESSAGES.COPY),
      paste: (e: ClipboardEvent) => preventDefaultWithMessage(e, VIOLATION_MESSAGES.PASTE),
      contextmenu: (e: MouseEvent) => preventDefaultWithMessage(e, VIOLATION_MESSAGES.RIGHT_CLICK),
      keydown: (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
          preventDefaultWithMessage(e, VIOLATION_MESSAGES.COPY);
        }
      },
      visibilitychange: () => {
        if (document.hidden) handleViolation();
      },
      blur: () => handleViolation(),
    };

    // Add event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      document.addEventListener(event, handler as EventListener, true);
    });

    // Request fullscreen
    const enableFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        toast.error(VIOLATION_MESSAGES.FULLSCREEN);
      }
    };
    enableFullscreen();

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange, true);

    // Cleanup
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        document.removeEventListener(event, handler as EventListener, true);
      });
      document.removeEventListener('fullscreenchange', handleFullscreenChange, true);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [hasStarted, warningCount, navigate, logout]); // Add all dependencies

  // Timer functionality
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up! Contest ended.", {
            duration: 5000,
          });
          setTimeout(() => {
            logout();
            navigate('/login');
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, navigate, logout]);

  // Handle code execution
  const handleRunCode = async (code: string) => {
    try {
      setIsRunning(true);
      setOutput('Running test cases...\n');
      const results: Record<string, boolean> = {};
      
      // Evaluate the submitted code
      const userFunction = new Function(`
        ${code}
        return twoSum;
      `)();
  
      // Run test cases
      for (const testCase of testCases) {
        try {
          // Parse input
          const [numsStr, targetStr] = testCase.input
            .replace('nums = ', '')
            .replace('target = ', '')
            .split(',');
          const nums = JSON.parse(numsStr);
          const target = parseInt(targetStr);
  
          // Run user's code
          const result = userFunction(nums, target);
          const expected = JSON.parse(testCase.expectedOutput);
          
          // Compare results
          const passed = JSON.stringify(result) === JSON.stringify(expected);
          results[testCase.id] = passed;
          
          setOutput(prev => prev + `\nTest Case ${testCase.id}: ${passed ? 'PASSED ✓' : 'FAILED ✗'}`);
        } catch (error) {
          results[testCase.id] = false;
          setOutput(prev => prev + `\nTest Case ${testCase.id}: ERROR - ${error.message}`);
        }
      }
  
      setTestResults(results);
      const passedCount = Object.values(results).filter(Boolean).length;
      setOutput(prev => prev + `\n\nPassed ${passedCount}/${testCases.length} test cases`);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-center">Contest Rules</h2>
          <div className="space-y-2">
            <p className="text-red-500 font-semibold">Important:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>The contest will run in fullscreen mode</li>
              <li>Changing tabs or browsers is not allowed</li>
              <li>You will get ONE warning for tab switching</li>
              <li>Second violation will end your contest</li>
              <li>Exiting fullscreen will end your contest</li>
            </ul>
          </div>
          <Button 
            className="w-full"
            onClick={() => setHasStarted(true)}
          >
            I Accept & Start Contest
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <div className={`bg-card p-2 rounded-lg shadow-md transition-colors ${
          warningCount > 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'
        }`}>
          {warningCount === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">✓ No warnings</span>
          ) : (
            <span className="text-red-600 dark:text-red-400 font-medium animate-pulse">⚠️ Final warning!</span>
          )}
        </div>
        <div className="bg-card p-2 rounded-lg shadow-md flex items-center gap-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono font-medium ${
            timeLeft < 300 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-muted-foreground'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-16">
        <div className="grid grid-cols-12 gap-4">
          {/* Question Panel */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <Card className="border-2">
              <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Two Sum</h2>
                    <p className="text-muted-foreground mb-4">
                      Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Example 1:</h3>
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <p><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
                      <p><strong>Output:</strong> [0,1]</p>
                      <p><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Constraints:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>2 ≤ nums.length ≤ 104</li>
                      <li>-109 ≤ nums[i] ≤ 109</li>
                      <li>-109 ≤ target ≤ 109</li>
                      <li>Only one valid answer exists.</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Code Editor Panel */}
          <div className="col-span-12 lg:col-span-7">
            <Tabs defaultValue="code">
              <TabsList className="mb-4">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="m-0">
                <CodeEditor
                  onRun={handleRunCode}
                  onReset={() => setOutput('')}
                  defaultValue="// Write your solution here\nfunction twoSum(nums, target) {\n  \n}"
                  height="calc(70vh - 40px)"
                />
              </TabsContent>

              <TabsContent value="testcases" className="m-0">
                <Card className="border-2">
                  <ScrollArea className="h-[70vh]">
                    <div className="p-6 space-y-6">
                      {testCases.map((testCase) => (
                        <div 
                          key={testCase.id}
                          className={`p-4 rounded-lg border-2 ${
                            testResults[testCase.id] === undefined
                              ? 'border-gray-200'
                              : testResults[testCase.id]
                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                                : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Test Case {testCase.id}</h4>
                            {testResults[testCase.id] !== undefined && (
                              <Badge
                                variant={testResults[testCase.id] ? 'default' : 'destructive'}
                                className="flex items-center gap-1"
                              >
                                {testResults[testCase.id] ? (
                                  <><Check className="h-3 w-3" /> Passed</>
                                ) : (
                                  <><X className="h-3 w-3" /> Failed</>
                                )}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="bg-muted p-2 rounded">
                              <strong>Input:</strong> {testCase.input}
                            </div>
                            <div className="bg-muted p-2 rounded">
                              <strong>Expected Output:</strong> {testCase.expectedOutput}
                            </div>
                            <div className="text-muted-foreground">
                              <strong>Explanation:</strong> {testCase.explanation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="output" className="m-0">
                <Card className="border-2">
                  <ScrollArea className="h-[70vh]">
                    <div className="p-6 font-mono whitespace-pre-wrap bg-muted/30">
                      {output || 'No output yet. Run your code to see results.'}
                    </div>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestParticipation;