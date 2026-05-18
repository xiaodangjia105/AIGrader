import { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, List, Button, Spin, Alert, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { SubmissionDTO, SubmissionAnswer } from '../../types';

const { Text } = Typography;

export default function StudentResults() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<SubmissionDTO | null>(null);
  const [answers, setAnswers] = useState<SubmissionAnswer[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!submissionId) return;
    Promise.all([
      api.getResults(Number(submissionId)),
      api.getAnswers(Number(submissionId)),
      api.getComment(Number(submissionId)).catch(() => ({ comment: '' })),
    ]).then(([res, ans, c]) => {
      setResult(res);
      setAnswers(ans);
      setComment((c as any).comment || '');
    }).finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!result) return <p>暂无结果</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>批改结果</h2>

      {comment && (
        <Alert
          type="info"
          message="教师评语"
          description={<Text style={{ whiteSpace: 'pre-wrap' }}>{comment}</Text>}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="状态"><Tag color={result.status === 'GRADED' ? 'green' : 'orange'}>{result.status === 'GRADED' ? '已批改' : '已提交'}</Tag></Descriptions.Item>
          <Descriptions.Item label="总分">{result.totalScore}</Descriptions.Item>
          <Descriptions.Item label="提交时间">{result.submittedAt?.replace('T', ' ').substring(0, 19)}</Descriptions.Item>
          <Descriptions.Item label="批改时间">{result.aiGradedAt?.replace('T', ' ').substring(0, 19) || '等待中'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <List
        dataSource={answers}
        renderItem={(ans) => (
          <Card size="small" style={{ marginBottom: 8 }}>
            <p><strong>你的答案：</strong> {ans.studentAnswer || '（未作答）'}</p>
            {ans.aiFeedback && <p style={{ color: ans.isCorrect ? '#52c41a' : '#ff4d4f' }}><strong>AI 反馈：</strong> {ans.aiFeedback}</p>}
            <div style={{ marginTop: 8 }}>
              <Tag color={ans.isCorrect ? 'green' : 'red'}>{ans.isCorrect ? '正确' : '错误'}</Tag>
              <Tag>得分：{ans.finalScore ?? ans.aiScore}</Tag>
              <Tag>置信度：{((ans.aiConfidence || 0) * 100).toFixed(0)}%</Tag>
              {ans.aiConfidence && ans.aiConfidence < 0.7 && <Tag color="orange">需复核</Tag>}
            </div>
            {!ans.isCorrect && (
              <Button size="small" style={{ marginTop: 8 }} onClick={() => navigate(`/student/correction/${ans.id}`)}>
                订正
              </Button>
            )}
          </Card>
        )}
      />
    </div>
  );
}