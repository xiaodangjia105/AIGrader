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
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [commentModal, setCommentModal] = useState<{ visible: boolean; comment: string; loading: boolean }>({ visible: false, comment: '', loading: false });

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    api.getAssignmentSubmissions(Number(submissionId))
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, [submissionId]);

  const loadAnswers = async (subId: number) => {
    setSelectedSubmissionId(subId);
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
      message.success('复核提交成功');
      setReviewModal({ visible: false, answer: null });
      if (selectedSubmissionId) loadAnswers(selectedSubmissionId);
    } catch {
      message.error('复核失败');
    }
  };

  const handleGenerateComment = async () => {
    if (!selectedSubmissionId) return;
    setCommentModal({ visible: true, comment: '', loading: true });
    try {
      const data = await api.generateComment(selectedSubmissionId);
      setCommentModal({ visible: true, comment: data.comment, loading: false });
    } catch {
      message.error('生成评语失败');
      setCommentModal({ visible: false, comment: '', loading: false });
    }
  };

  const subCols = [
    { title: '编号', dataIndex: 'id', key: 'id', width: 60 },
    { title: '学生', dataIndex: 'studentId', key: 'studentId' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'GRADED' ? 'green' : 'orange'}>{s === 'GRADED' ? '已批改' : '已提交'}</Tag> },
    {
      title: '操作', key: 'actions',
      render: (_: any, record: Submission) => (
        <Button size="small" onClick={() => loadAnswers(record.id)}>查看答案</Button>
      ),
    },
  ];

  const ansCols = [
    { title: '题号', dataIndex: 'questionId', key: 'questionId', width: 50 },
    { title: '学生答案', dataIndex: 'studentAnswer', key: 'studentAnswer', ellipsis: true },
    { title: 'AI 评分', dataIndex: 'aiScore', key: 'aiScore', width: 80 },
    { title: '置信度', dataIndex: 'aiConfidence', key: 'aiConfidence', width: 90, render: (c: number) => c ? `${(c * 100).toFixed(0)}%` : '-' },
    {
      title: '操作', key: 'actions', width: 100,
      render: (_: any, record: SubmissionAnswer) => (
        <Button size="small" onClick={() => handleReview(record)}>复核</Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>批改复核</h2>
      <Table dataSource={submissions} columns={subCols} rowKey="id" loading={loading} style={{ marginBottom: 24 }} locale={{ emptyText: '暂无提交' }} />
      {answers.length > 0 && (
        <>
          <Space style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>答题明细</h3>
            <Button type="primary" onClick={handleGenerateComment}>生成个性化评语</Button>
          </Space>
          <Table dataSource={answers} columns={ansCols} rowKey="id" />
        </>
      )}
      <Modal
        title="复核评分"
        open={reviewModal.visible}
        onOk={submitReview}
        onCancel={() => setReviewModal({ visible: false, answer: null })}
        okText="确认"
        cancelText="取消"
      >
        {reviewModal.answer && (
          <div>
            <p><strong>学生答案：</strong> {reviewModal.answer.studentAnswer}</p>
            <p><strong>AI 反馈：</strong> {reviewModal.answer.aiFeedback}</p>
            <div style={{ marginTop: 12 }}>
              <label>评分（0-10）：</label>
              <InputNumber min={0} max={10} value={reviewScore} onChange={(v) => setReviewScore(v || 0)} style={{ width: '100%', marginTop: 4 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label>评语：</label>
              <Input.TextArea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} style={{ marginTop: 4 }} />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title="个性化评语"
        open={commentModal.visible}
        onCancel={() => setCommentModal({ visible: false, comment: '', loading: false })}
        footer={[
          <Button key="copy" type="primary" onClick={() => { navigator.clipboard.writeText(commentModal.comment); message.success('已复制到剪贴板'); }}>
            复制评语
          </Button>,
          <Button key="close" onClick={() => setCommentModal({ visible: false, comment: '', loading: false })}>关闭</Button>,
        ]}
      >
        {commentModal.loading ? <p>正在生成评语...</p> : <p style={{ whiteSpace: 'pre-wrap' }}>{commentModal.comment}</p>}
      </Modal>
    </div>
  );
}