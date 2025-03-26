import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X, Plus, Trash } from 'lucide-react';
import { Contest, Question } from '@/lib/types';

interface ContestFormProps {
  contest?: Contest;
  onSubmit: (contest: Contest) => void;
}

const ContestForm: React.FC<ContestFormProps> = ({ contest, onSubmit }) => {
  // If editing, use the provided contest, otherwise create a new one
  const [formData, setFormData] = useState<Contest>(
    contest || {
      id: '',
      title: '',
      description: '',
      startDate: new Date(Date.now() + 86400000), // Default to tomorrow
      endDate: new Date(Date.now() + 2 * 86400000), // Default to day after tomorrow
      status: 'upcoming',
      rules: ['No external references allowed', 'Use only the provided languages'],
      questions: [],
      participants: 0,
      languages: ['JavaScript', 'Python'],
      createdBy: 'CodeShield Team',
    }
  );
  
  const [newRule, setNewRule] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    title: '',
    description: '',
    difficulty: 'medium',
    points: 100,
    timeLimit: 30,
  });
  
  // Handle input changes for basic contest info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
    const date = new Date(e.target.value);
    setFormData((prev) => ({ ...prev, [field]: date }));
  };
  
  // Add a new rule
  const handleAddRule = () => {
    if (newRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule('');
    }
  };
  
  // Remove a rule
  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };
  
  // Add a new language
  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage('');
    }
  };
  
  // Remove a language
  const handleRemoveLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== language),
    }));
  };
  
  // Handle question input changes
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Question) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: field === 'points' || field === 'timeLimit' 
        ? parseInt(e.target.value) || 0 
        : e.target.value,
    }));
  };
  
  // Add a question to the contest
  const handleAddQuestion = () => {
    if (currentQuestion.title && currentQuestion.description) {
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        title: currentQuestion.title || '',
        description: currentQuestion.description || '',
        difficulty: (currentQuestion.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
        points: currentQuestion.points || 100,
        timeLimit: currentQuestion.timeLimit,
      };
      
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
      
      // Reset the form
      setCurrentQuestion({
        title: '',
        description: '',
        difficulty: 'medium',
        points: 100,
        timeLimit: 30,
      });
    }
  };
  
  // Remove a question
  const handleRemoveQuestion = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Contest Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Algorithm Masters Challenge"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the contest and its objectives..."
            required
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={new Date(formData.startDate.getTime() - formData.startDate.getTimezoneOffset() * 60000)
                .toISOString()
                .substring(0, 16)}
              onChange={(e) => handleDateChange(e, 'startDate')}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={new Date(formData.endDate.getTime() - formData.endDate.getTimezoneOffset() * 60000)
                .toISOString()
                .substring(0, 16)}
              onChange={(e) => handleDateChange(e, 'endDate')}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'upcoming' | 'active' | 'completed') => 
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Rules Section */}
        <div>
          <Label>Contest Rules</Label>
          <div className="mt-2 mb-3 flex flex-wrap gap-2">
            {formData.rules.map((rule, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                {rule}
                <button 
                  type="button" 
                  onClick={() => handleRemoveRule(index)}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add a new rule..."
              className="flex-grow"
            />
            <Button type="button" variant="outline" onClick={handleAddRule}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        {/* Programming Languages */}
        <div>
          <Label>Programming Languages</Label>
          <div className="mt-2 mb-3 flex flex-wrap gap-2">
            {formData.languages.map((language) => (
              <Badge key={language} variant="outline" className="px-2 py-1 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20">
                {language}
                <button 
                  type="button" 
                  onClick={() => handleRemoveLanguage(language)}
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a programming language..."
              className="flex-grow"
            />
            <Button type="button" variant="outline" onClick={handleAddLanguage}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        {/* Questions Section */}
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-semibold">Contest Questions</h3>
          
          {/* Existing Questions */}
          <div className="space-y-3">
            {formData.questions.map((question) => (
              <div key={question.id} className="border rounded-md p-3 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{question.title}</h4>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                      {question.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{question.points} points</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {question.description}
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/10"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {formData.questions.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No questions added yet. Add your first question below.
              </div>
            )}
          </div>
          
          {/* Add New Question Form */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium">Add a New Question</h4>
            
            <div>
              <Label htmlFor="questionTitle">Question Title</Label>
              <Input
                id="questionTitle"
                value={currentQuestion.title || ''}
                onChange={(e) => handleQuestionChange(e, 'title')}
                placeholder="e.g., Two Sum"
              />
            </div>
            
            <div>
              <Label htmlFor="questionDescription">Question Description</Label>
              <Textarea
                id="questionDescription"
                value={currentQuestion.description || ''}
                onChange={(e) => handleQuestionChange(e, 'description')}
                placeholder="Describe the problem in detail..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="questionDifficulty">Difficulty</Label>
                <Select 
                  value={currentQuestion.difficulty as string || 'medium'} 
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                    setCurrentQuestion((prev) => ({ ...prev, difficulty: value }))
                  }
                >
                  <SelectTrigger id="questionDifficulty">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="questionPoints">Points</Label>
                <Input
                  id="questionPoints"
                  type="number"
                  value={currentQuestion.points || 100}
                  onChange={(e) => handleQuestionChange(e, 'points')}
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="questionTimeLimit">Time Limit (min)</Label>
                <Input
                  id="questionTimeLimit"
                  type="number"
                  value={currentQuestion.timeLimit || 30}
                  onChange={(e) => handleQuestionChange(e, 'timeLimit')}
                  min="1"
                />
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleAddQuestion}
              className="w-full mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button type="submit" className="bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
          {contest ? 'Update Contest' : 'Create Contest'}
        </Button>
      </div>
    </form>
  );
};

export default ContestForm;
