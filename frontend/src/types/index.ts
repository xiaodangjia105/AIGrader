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
  classId: number | null;
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

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}
