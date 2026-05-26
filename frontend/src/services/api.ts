import type { AiConfig, ApiResponse, LoginRequest, LoginResponse } from '../types';

const BASE_URL = '/api';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('aigrader_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.token ?? null;
    }
  } catch {}
  return null;
}

function clearAuth() {
  localStorage.removeItem('aigrader_auth');
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${url}`, {
    headers,
    ...options,
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new Error('Login expired');
  }
  if (!res.ok) {
    try {
      const errJson = await res.json();
      throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
    } catch (e) {
      if (e instanceof Error && e.message !== `HTTP ${res.status}: ${res.statusText}`) throw e;
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  }
  const json: ApiResponse<T> = await res.json();
  if (json.code !== 200) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

async function uploadCsv<T>(url: string, file: File): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new Error('Login expired');
  }
  if (!res.ok) {
    try {
      const errJson = await res.json();
      throw new Error(errJson.message || `HTTP ${res.status}: ${res.statusText}`);
    } catch (e) {
      if (e instanceof Error && e.message !== `HTTP ${res.status}: ${res.statusText}`) throw e;
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  }
  const json: ApiResponse<T> = await res.json();
  if (json.code !== 200) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password } as LoginRequest),
    }),

  // Questions
  getQuestions: () => request<any[]>('/questions'),
  getQuestion: (id: number) => request<any>(`/questions/${id}`),
  createQuestion: (data: any) => request<any>('/questions', { method: 'POST', body: JSON.stringify(data) }),
  updateQuestion: (id: number, data: any) => request<any>(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuestion: (id: number) => request<void>(`/questions/${id}`, { method: 'DELETE' }),
  batchImportQuestions: (questions: any[]) => request<any>('/questions/batch-import', { method: 'POST', body: JSON.stringify(questions) }),
  batchImportCsv: (file: File) => uploadCsv<any>('/questions/batch-import/csv', file),

  // Assignments
  getAssignment: (id: number) => request<any>(`/assignments/${id}`),
  getMyAssignments: () => request<any[]>('/assignments/my'),
  getClasses: () => request<any[]>('/classes'),
  getClassAssignments: (classId: number) => request<any[]>(`/assignments/class/${classId}`),
  createAssignment: (data: any) => request<any>('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  getAssignmentQuestions: (id: number) => request<any[]>(`/assignments/${id}/questions`),

  // Submissions
  getSubmission: (id: number) => request<any>(`/submissions/${id}`),
  getAssignmentSubmissions: (assignmentId: number) => request<any[]>(`/submissions/assignment/${assignmentId}`),
  getMySubmissions: () => request<any[]>('/submissions/my'),
  submit: (assignmentId: number, answers: any[]) =>
    request<any>(`/submissions?assignmentId=${assignmentId}`, { method: 'POST', body: JSON.stringify(answers) }),
  triggerGrading: (id: number) => request<string>(`/submissions/${id}/grade`, { method: 'POST' }),
  getResults: (id: number) => request<any>(`/submissions/${id}/results`),

  // Grading
  generateComment: (submissionId: number) => request<{ comment: string }>(`/grading/${submissionId}/generate-comment`, { method: 'POST' }),
  getComment: (submissionId: number) => request<{ comment: string }>(`/grading/${submissionId}/comment`),
  getAnswers: (submissionId: number) => request<any[]>(`/grading/answers/${submissionId}`),
  reviewAnswer: (answerId: number, data: { finalScore: number; teacherComment: string }) =>
    request<any>(`/grading/${answerId}/review`, { method: 'PUT', body: JSON.stringify(data) }),
  submitCorrection: (data: { submissionAnswerId: number; newAnswer: string }) =>
    request<any>('/corrections', { method: 'POST', body: JSON.stringify(data) }),
  getCorrections: (answerId: number) => request<any[]>(`/corrections/${answerId}`),

  // Statistics & Users
  getStudentReport: (studentId: number) => request<any>(`/statistics/student/${studentId}/report`),
  getClassStats: (classId: number) => request<any>(`/statistics/class/${classId}`),
  getStudentStats: (studentId: number) => request<any>(`/statistics/student/${studentId}`),
  getAiAccuracy: () => request<any>('/statistics/ai-accuracy'),
  getAiAccuracyDetail: () => request<any[]>('/statistics/ai-accuracy/detail'),
  getUsers: () => request<any[]>('/users'),
  getUser: (id: number) => request<any>(`/users/${id}`),

  // AI Config
  getAiConfig: () => request<AiConfig>('/admin/ai-config'),
  updateAiConfig: (data: AiConfig) =>
    request<{ message: string; model: string }>('/admin/ai-config', { method: 'PUT', body: JSON.stringify(data) }),
};