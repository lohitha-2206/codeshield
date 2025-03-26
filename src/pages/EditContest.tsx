import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Contest, Question, TestCase } from '@/lib/types';

const defaultQuestion: Question = {
  id: '',
  title: '',
  description: '',
  difficulty: 'medium',
  points: 100,
  testCases: []
};

const initialMockContests: Contest[] = [
  {
    id: '1',
    title: 'Mock Contest 1',
    description: 'Description for Mock Contest 1',
    startDate: new Date(),
    endDate: new Date(),
    rules: ['Rule 1', 'Rule 2'],
    languages: ['JavaScript', 'Python'],
    questions: [
      {
        id: 'q1',
        title: 'Question 1',
        description: 'Description for Question 1',
        difficulty: 'easy',
        points: 50,
        testCases: [
          { input: '1', output: '1', explanation: 'Explanation 1' }
        ]
      }
    ],
    status: 'upcoming',
    participants: 0,
    createdBy: 'admin'
  }
];

const EditContest: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

  // Contest state
  const [contest, setContest] = useState<Contest | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rules, setRules] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchContest = async () => {
      if (!contestId) return;

      try {
        // For development, using mock data
        const mockContest = initialMockContests.find(c => c.id === contestId);
        if (!mockContest) throw new Error('Contest not found');

        setContest(mockContest);
        setTitle(mockContest.title);
        setDescription(mockContest.description);
        setStartDate(new Date(mockContest.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(mockContest.endDate).toISOString().slice(0, 16));
        setRules(mockContest.rules);
        setLanguages(mockContest.languages);
        setQuestions(mockContest.questions.map(q => ({
          ...q,
          testCases: q.testCases || []
        })));
      } catch (error) {
        toast.error('Failed to fetch contest details');
        navigate('/contests');
      }
    };

    fetchContest();
  }, [contestId, navigate]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      ...defaultQuestion,
      id: `${Date.now()}`,
      testCases: [{ input: '', output: '', explanation: '' }]
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const handleAddTestCase = (questionIndex: number) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    if (!question.testCases) {
      question.testCases = [];
    }
    question.testCases.push({ input: '', output: '', explanation: '' });
    setQuestions(newQuestions);
  };

  const handleUpdateTestCase = (
    questionIndex: number,
    testCaseIndex: number,
    updates: Partial<TestCase>
  ) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    if (question.testCases) {
      question.testCases[testCaseIndex] = {
        ...question.testCases[testCaseIndex],
        ...updates
      };
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!contest) throw new Error('No contest data');

      const updatedContest: Contest = {
        ...contest,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rules: rules.filter(rule => rule.trim() !== ''),
        languages: languages.filter(lang => lang.trim() !== ''),
        questions: questions.map(q => ({
          ...q,
          testCases: q.testCases?.filter(tc => tc.input.trim() !== '' && tc.output.trim() !== '')
        }))
      };

      // Replace with your actual API call
      await fetch(`/api/contests/${contestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContest),
      });

      toast.success('Contest updated successfully!');
      navigate('/contests');
    } catch (error) {
      toast.error('Failed to update contest');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/contests')}
              className="group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Contest List
            </Button>
          </div>

          <Card className="border-2 border-shield-blue/10 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-shield-blue/5 to-shield-teal/5 border-b">
              <CardTitle className="text-2xl font-bold">Edit Contest</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Basic Details</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="settings">Rules & Languages</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <TabsContent value="details" className="space-y-4">
                    {/* Contest Details Form */}
                    <div className="space-y-4">
                      <div>
                        <Label>Contest Title</Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="questions" className="space-y-6">
                    {/* Questions Management */}
                    {questions.map((question, index) => (
                      <Card key={question.id}>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <Label>Question {index + 1}</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newQuestions = questions.filter((_, i) => i !== index);
                                setQuestions(newQuestions);
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                          <Input
                            value={question.title}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[index].title = e.target.value;
                              setQuestions(newQuestions);
                            }}
                            placeholder="Question Title"
                            required
                          />
                          <Textarea
                            value={question.description}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[index].description = e.target.value;
                              setQuestions(newQuestions);
                            }}
                            placeholder="Question Description"
                            required
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Difficulty</Label>
                              <select
                                value={question.difficulty}
                                onChange={(e) => {
                                  const newQuestions = [...questions];
                                  newQuestions[index].difficulty = e.target.value as 'easy' | 'medium' | 'hard';
                                  setQuestions(newQuestions);
                                }}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>
                            </div>
                            <div>
                              <Label>Points</Label>
                              <Input
                                type="number"
                                value={question.points}
                                onChange={(e) => {
                                  const newQuestions = [...questions];
                                  newQuestions[index].points = parseInt(e.target.value) || 0;
                                  setQuestions(newQuestions);
                                }}
                                min="0"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Test Cases</Label>
                            {question.testCases?.map((testCase, testCaseIndex) => (
                              <div key={testCaseIndex} className="space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    value={testCase.input}
                                    onChange={(e) => handleUpdateTestCase(index, testCaseIndex, { input: e.target.value })}
                                    placeholder="Input"
                                    required
                                  />
                                  <Input
                                    value={testCase.output}
                                    onChange={(e) => handleUpdateTestCase(index, testCaseIndex, { output: e.target.value })}
                                    placeholder="Output"
                                    required
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const newQuestions = [...questions];
                                      newQuestions[index].testCases = newQuestions[index].testCases?.filter((_, i) => i !== testCaseIndex);
                                      setQuestions(newQuestions);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Textarea
                                  value={testCase.explanation}
                                  onChange={(e) => handleUpdateTestCase(index, testCaseIndex, { explanation: e.target.value })}
                                  placeholder="Explanation (optional)"
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleAddTestCase(index)}
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Test Case
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddQuestion}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    {/* Contest Settings */}
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div>
                          <Label>Contest Rules</Label>
                          {rules.map((rule, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                              <Input
                                value={rule}
                                onChange={(e) => {
                                  const newRules = [...rules];
                                  newRules[index] = e.target.value;
                                  setRules(newRules);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setRules(rules.filter((_, i) => i !== index));
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRules([...rules, ''])}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Rule
                          </Button>
                        </div>

                        <div>
                          <Label>Allowed Languages</Label>
                          {languages.map((lang, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                              <Input
                                value={lang}
                                onChange={(e) => {
                                  const newLanguages = [...languages];
                                  newLanguages[index] = e.target.value;
                                  setLanguages(newLanguages);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setLanguages(languages.filter((_, i) => i !== index));
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setLanguages([...languages, ''])}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Language
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <div className="flex justify-end space-x-2 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/contests')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-shield-blue hover:bg-shield-blue/90"
                    >
                      Update Contest
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditContest;
