import { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, List, Button, Spin, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { SubmissionDTO, SubmissionAnswer } from '../../types';

export default function StudentResults() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<SubmissionDTO | null>(null);
  const [answers, setAnswers] = useState<SubmissionAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!submissionId) return;
    Promise.all([
      api.getResults(Number(submissionId)),
      api.getAnswers(Number(submissionId)),
    ]).then(([res, ans]) => {
      setResult(res);
      setAnswers(ans);
    }).finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!result) return <p>No results found</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Grading Results</h2>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Status"><Tag color={result.status === 'GRADED' ? 'green' : 'orange'}>{result.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Total Score">{result.totalScore}</Descriptions.Item>
          <Descriptions.Item label="Submitted">{result.submittedAt?.replace('T', ' ').substring(0, 19)}</Descriptions.Item>
          <Descriptions.Item label="Graded">{result.aiGradedAt?.replace('T', ' ').substring(0, 19) || 'Pending'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <List
        dataSource={answers}
        renderItem={(ans) => (
          <Card size="small" style={{ marginBottom: 8 }}>
            <p><strong>Your Answer:</strong> {ans.studentAnswer || '(empty)'}</p>
            {ans.aiFeedback && <p style={{ color: ans.isCorrect ? '#52c41a' : '#ff4d4f' }}><strong>Feedback:</strong> {ans.aiFeedback}</p>}
            <div style={{ marginTop: 8 }}>
              <Tag color={ans.isCorrect ? 'green' : 'red'}>{ans.isCorrect ? 'Correct' : 'Incorrect'}</Tag>
              <Tag>Score: {ans.finalScore ?? ans.aiScore}</Tag>
              <Tag>Confidence: {((ans.aiConfidence || 0) * 100).toFixed(0)}%</Tag>
              {ans.needsReview && <Tag color="orange">Needs Review</Tag>}
            </div>
            {!ans.isCorrect && (
              <Button size="small" style={{ marginTop: 8 }} onClick={() => navigate(`/student/correction/${ans.id}`)}>
                Correct
              </Button>
            )}
          </Card>
        )}
      />
    </div>
  );
}
