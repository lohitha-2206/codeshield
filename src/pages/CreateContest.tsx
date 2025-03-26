import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  testCases: TestCase[];
}

const CreateContest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rules, setRules] = useState(['']);
  const [languages, setLanguages] = useState(['']);
  const [questions, setQuestions] = useState<Question[]>([{
    id: '1',
    title: '',
    description: '',
    difficulty: 'medium',
    points: 100,
    testCases: [{ input: '', output: '', explanation: '' }]
  }]);

  // Redirect if not organizer
  React.useEffect(() => {
    if (user && user.role !== 'organizer') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: `${questions.length + 1}`,
      title: '',
      description: '',
      difficulty: 'medium',
      points: 100,
      testCases: [{ input: '', output: '', explanation: '' }]
    }]);
  };

  const handleAddTestCase = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].testCases.push({ input: '', output: '', explanation: '' });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation here
    const newContest = {
      id: `${Date.now()}`,
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'upcoming',
      rules: rules.filter(rule => rule.trim() !== ''),
      questions,
      participants: 0,
      languages: languages.filter(lang => lang.trim() !== ''),
      createdBy: 'Current User',
    };

    // Add your API call here to save the contest
    toast.success('Contest created successfully!');
    navigate('/dashboard'); // Navigate back to dashboard
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/contests')} 
            className="mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Contests
          </Button>
          
          <Card className="border-2 border-shield-blue/10 shadow-lg animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-shield-blue/5 to-shield-teal/5 border-b">
              <CardTitle className="text-2xl font-bold">Create New Contest</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Contest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contest Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Contest Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Contest Rules</Label>
                        {rules.map((rule, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={rule}
                              onChange={(e) => {
                                const newRules = [...rules];
                                newRules[index] = e.target.value;
                                setRules(newRules);
                              }}
                              placeholder={`Rule ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newRules = rules.filter((_, i) => i !== index);
                                setRules(newRules);
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
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Rule
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Accepted Languages</Label>
                        {languages.map((lang, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={lang}
                              onChange={(e) => {
                                const newLangs = [...languages];
                                newLangs[index] = e.target.value;
                                setLanguages(newLangs);
                              }}
                              placeholder={`Language ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newLangs = languages.filter((_, i) => i !== index);
                                setLanguages(newLangs);
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
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Language
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions Section */}
                {questions.map((question, qIndex) => (
                  <Card key={question.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Question {qIndex + 1}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const updatedQuestions = questions.filter((_, i) => i !== qIndex);
                            setQuestions(updatedQuestions);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Question Title</Label>
                        <Input
                          value={question.title}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].title = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={question.description}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[qIndex].description = e.target.value;
                            setQuestions(updatedQuestions);
                          }}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <select
                            value={question.difficulty}
                            onChange={(e) => {
                              const updatedQuestions = [...questions];
                              updatedQuestions[qIndex].difficulty = e.target.value;
                              setQuestions(updatedQuestions);
                            }}
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => {
                              const updatedQuestions = [...questions];
                              updatedQuestions[qIndex].points = parseInt(e.target.value) || 0;
                              setQuestions(updatedQuestions);
                            }}
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      {/* Test Cases */}
                      <div className="space-y-4">
                        <Label>Test Cases</Label>
                        {question.testCases.map((testCase, tIndex) => (
                          <Card key={tIndex}>
                            <CardContent className="pt-4 space-y-4">
                              <div className="space-y-2">
                                <Label>Input</Label>
                                <Textarea
                                  value={testCase.input}
                                  onChange={(e) => {
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[qIndex].testCases[tIndex].input = e.target.value;
                                    setQuestions(updatedQuestions);
                                  }}
                                  placeholder="Enter test case input"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Expected Output</Label>
                                <Textarea
                                  value={testCase.output}
                                  onChange={(e) => {
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[qIndex].testCases[tIndex].output = e.target.value;
                                    setQuestions(updatedQuestions);
                                  }}
                                  placeholder="Enter expected output"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Explanation</Label>
                                <Textarea
                                  value={testCase.explanation}
                                  onChange={(e) => {
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[qIndex].testCases[tIndex].explanation = e.target.value;
                                    setQuestions(updatedQuestions);
                                  }}
                                  placeholder="Explain the test case (optional)"
                                />
                              </div>
                              <div className="flex justify-end">
                                {question.testCases.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const updatedQuestions = [...questions];
                                      updatedQuestions[qIndex].testCases = question.testCases.filter(
                                        (_, i) => i !== tIndex
                                      );
                                      setQuestions(updatedQuestions);
                                    }}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete Test Case
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddTestCase(qIndex)}
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
                  variant="outline"
                  onClick={handleAddQuestion}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Contest
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateContest;
