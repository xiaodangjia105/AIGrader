import { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, InputNumber, Input, message, Space } from 'antd';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import type { Submission, SubmissionAnswer } from '../../types';

export default function TeacherGradingReview() {
  const { submissionId } = useParams<{ submissionId?: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [answers, setAnswers] = useState<SubmissionAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ visible: boolean; answer: SubmissionAnswer | null }>({ visible: false, answer: null });
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!submissionId) return;
    // If submissionId is an assignment ID, list submissions
    setLoading(true);
    api.getAssignmentSubmissions(Number(submissionId))
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, [submissionId]);

  const loadAnswers = async (subId: number) => {
    setLoading(true);
    try {
      const data = await api.getAnswers(subId);
      setAnswers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (answer: SubmissionAnswer) => {
    setReviewModal({ visible: true, answer });
    setReviewScore(answer.aiScore || 0);
    setReviewComment(answer.teacherComment || '');
  };

  const submitReview = async () => {
    if (!reviewModal.answer) return;
    try {
      await api.reviewAnswer(reviewModal.answer.id, { finalScore: reviewScore, teacherComment: reviewComment });
      message.success('Review submitted');
      setReviewModal({ visible: false, answer: null });
      if (submissions.length > 0) loadAnswers(submissions[0].id);
    } catch {
      message.error('Review failed');
    }
  };

  const subCols = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'GRADED' ? 'green' : 'orange'}>{s}</Tag> },
    {
      title: 'Actions', key: 'actions',
      render: (_: any, record: Submission) => (
        <Button size="small" onClick={() => loadAnswers(record.id)}>View Answers</Button>
      ),
    },
  ];

  const ansCols = [
    { title: 'Q#', dataIndex: 'questionId', key: 'questionId', width: 50 },
    { title: 'Answer', dataIndex: 'studentAnswer', key: 'studentAnswer', ellipsis: true },
    { title: 'AI Score', dataIndex: 'aiScore', key: 'aiScore', width: 80 },
    { title: 'Confidence', dataIndex: 'aiConfidence', key: 'aiConfidence', width: 90, render: (c: number) => `${(c * 100).toFixed(0)}%` },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_: any, record: SubmissionAnswer) => (
        <Button size="small" onClick={() => handleReview(record)}>Review</Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Grading Review</h2>
      <Table dataSource={submissions} columns={subCols} rowKey="id" loading={loading} style={{ marginBottom: 24 }} />
      {answers.length > 0 && (
        <>
          <h3 style={{ marginBottom: 12 }}>Answers</h3>
          <Table dataSource={answers} columns={ansCols} rowKey="id" />
        </>
      )}
      <Modal
        title="Review Answer"
        open={reviewModal.visible}
        onOk={submitReview}
        onCancel={() => setReviewModal({ visible: false, answer: null })}
      >
        {reviewModal.answer && (
          <div>
            <p><strong>Student Answer:</strong> {reviewModal.answer.studentAnswer}</p>
            <p><strong>AI Feedback:</strong> {reviewModal.answer.aiFeedback}</p>
            <div style={{ marginTop: 12 }}>
              <label>Score (0-10):</label>
              <InputNumber min={0} max={10} value={reviewScore} onChange={(v) => setReviewScore(v || 0)} style={{ width: '100%', marginTop: 4 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label>Comment:</label>
              <Input.TextArea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} style={{ marginTop: 4 }} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
