import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import TeacherAssignments from '../pages/teacher/TeacherAssignments';
import TeacherCreateAssignment from '../pages/teacher/TeacherCreateAssignment';
import TeacherGradingReview from '../pages/teacher/TeacherGradingReview';
import TeacherStatistics from '../pages/teacher/TeacherStatistics';
import StudentAssignments from '../pages/student/StudentAssignments';
import StudentAnswer from '../pages/student/StudentAnswer';
import StudentResults from '../pages/student/StudentResults';
import StudentCorrection from '../pages/student/StudentCorrection';
import AdminQuestions from '../pages/admin/AdminQuestions';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminMonitor from '../pages/admin/AdminMonitor';
import MainLayout from '../components/MainLayout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Teacher */}
        <Route path="/teacher" element={<MainLayout role="TEACHER" />}>
          <Route index element={<Navigate to="assignments" replace />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="assignments/new" element={<TeacherCreateAssignment />} />
          <Route path="grading/:submissionId" element={<TeacherGradingReview />} />
          <Route path="statistics" element={<TeacherStatistics />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<MainLayout role="STUDENT" />}>
          <Route index element={<Navigate to="assignments" replace />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="assignments/:id/answer" element={<StudentAnswer />} />
          <Route path="results/:submissionId" element={<StudentResults />} />
          <Route path="correction/:answerId" element={<StudentCorrection />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<MainLayout role="ADMIN" />}>
          <Route index element={<Navigate to="questions" replace />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="monitor" element={<AdminMonitor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
