export type UserRole = 'student' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface TestCase {
  id?: string;
  input: string;
  output: string;
  expectedOutput?: string;
  explanation: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  rules: string[];
  questions: Question[];
  participants: number;
  languages: string[];
  createdBy: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number;
  testCases?: TestCase[];
}

export interface Submission {
  id: string;
  userId: string;
  contestId: string;
  questionId: string;
  code: string;
  language: string;
  status: 'accepted' | 'rejected' | 'pending' | 'flagged';
  executionTime?: number;
  memoryUsed?: number;
  submittedAt: Date;
  fraudFlags?: {
    similarity: number;
    aiGenerated: boolean;
    focusViolations: number;
  };
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  solvedQuestions: number;
  averageTime: number;
  isFraud: boolean;
}

export interface FlaggedSubmission {
  id: string;
  studentName: string;
  contestTitle: string;
  questionTitle: string;
  flagReason: 'AI Generated Content' | 'Focus Violations' | 'High Similarity';
  similarity?: number;
  focusViolations?: number;
  timestamp: Date;
}
