export enum QuestionType {
  CHOICE = 'CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
}

export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  role: UserRole;
  classId?: number | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  role: string;
  classId?: number | null;
}

export interface Question {
  id: number;
  type: QuestionType;
  subject: string;
  difficulty: string;
  content: string;
  answer: string;
  rubric: string | null;
  options: string | null;
}

export interface Assignment {
  id: number;
  title: string;
  teacherId: number;
  classId: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

export interface AssignmentQuestion {
  id: number;
  assignmentId: number;
  questionId: number;
  sortOrder: number;
  score: number;
}

export interface AnswerDTO {
  questionId: number;
  studentAnswer: string;
  score?: number;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  status: string;
  submittedAt: string;
  aiGradedAt: string | null;
}

export interface SubmissionDTO {
  id: number;
  assignmentId: number;
  studentId: number;
  status: string;
  submittedAt: string;
  aiGradedAt: string | null;
  answers: AnswerDTO[];
  totalScore: number;
  totalPossibleScore: number;
}

export interface SubmissionAnswer {
  id: number;
  submissionId: number;
  questionId: number;
  studentAnswer: string;
  aiScore: number;
  aiFeedback: string;
  aiConfidence: number;
  isCorrect: boolean;
  reviewedByTeacher: boolean;
  finalScore: number | null;
  teacherComment: string | null;
  needsReview: boolean;
}

export interface BatchImportResult {
  successCount: number;
  failCount: number;
  errors: string[];
}

export interface AiAccuracyTrend {
  date: string;
  totalReviewed: number;
  misjudgmentRate: number;
  avgDeviation: number;
}

export interface AiAccuracyDetail {
  answerId: number;
  submissionId: number;
  questionId: number;
  questionContent: string;
  aiScore: number;
  finalScore: number;
  deviation: number;
  date: string;
}

export interface AiAccuracyData {
  totalQuestions: number;
  totalGraded: number;
  totalReviewed: number;
  reviewRate: number;
  misjudgmentRate: number;
  avgDeviation: number;
  trend: AiAccuracyTrend[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface WeakPoint {
  subject: string;
  questionType: string;
  accuracy: number;
  totalCount: number;
  correctCount: number;
}

export interface SubjectAccuracy {
  subject: string;
  accuracy: number;
  totalCount: number;
  correctCount: number;
}

export interface StudentReport {
  studentId: number;
  studentName: string;
  totalSubmissions: number;
  totalAnswers: number;
  overallAccuracy: number;
  subjectAccuracies: SubjectAccuracy[];
  weakPoints: WeakPoint[];
  aiSuggestions: string;
}

export interface AiConfig {
  baseUrl?: string;
  model?: string;
  apiKey?: string;
}