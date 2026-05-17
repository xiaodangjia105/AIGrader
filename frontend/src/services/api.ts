import type { ApiResponse } from '../types';

const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const json: ApiResponse<T> = await res.json();
  if (json.code !== 200) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

export const api = {
  // Questions
  getQuestions: () => request<any[]>('/questions'),
  getQuestion: (id: number) => request<any>(`/questions/${id}`),
  createQuestion: (data: any) => request<any>('/questions', { method: 'POST', body: JSON.stringify(data) }),
  updateQuestion: (id: number, data: any) => request<any>(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteQuestion: (id: number) => request<void>(`/questions/${id}`, { method: 'DELETE' }),

  // Assignments
  getAssignment: (id: number) => request<any>(`/assignments/${id}`),
  getTeacherAssignments: (teacherId: number) => request<any[]>(`/assignments/teacher/${teacherId}`),
  getClassAssignments: (classId: number) => request<any[]>(`/assignments/class/${classId}`),
  createAssignment: (data: any) => request<any>('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  getAssignmentQuestions: (id: number) => request<any[]>(`/assignments/${id}/questions`),

  // Submissions
  getSubmission: (id: number) => request<any>(`/submissions/${id}`),
  getAssignmentSubmissions: (assignmentId: number) => request<any[]>(`/submissions/assignment/${assignmentId}`),
  getStudentSubmissions: (studentId: number) => request<any[]>(`/submissions/student/${studentId}`),
  submit: (assignmentId: number, studentId: number, answers: any[]) =>
    request<any>(`/submissions?assignmentId=${assignmentId}&studentId=${studentId}`, { method: 'POST', body: JSON.stringify(answers) }),
  triggerGrading: (id: number) => request<string>(`/submissions/${id}/grade`, { method: 'POST' }),
  getResults: (id: number) => request<any>(`/submissions/${id}/results`),

  // Grading
  getAnswers: (submissionId: number) => request<any[]>(`/grading/answers/${submissionId}`),
  reviewAnswer: (answerId: number, data: { finalScore: number; teacherComment: string }) =>
    request<any>(`/grading/${answerId}/review`, { method: 'PUT', body: JSON.stringify(data) }),
  submitCorrection: (data: { submissionAnswerId: number; newAnswer: string }) =>
    request<any>('/corrections', { method: 'POST', body: JSON.stringify(data) }),
  getCorrections: (answerId: number) => request<any[]>(`/corrections/${answerId}`),

  // Statistics & Users
  getClassStats: (classId: number) => request<any>(`/statistics/class/${classId}`),
  getStudentStats: (studentId: number) => request<any>(`/statistics/student/${studentId}`),
  getUsers: () => request<any[]>('/users'),
  getUser: (id: number) => request<any>(`/users/${id}`),
};
