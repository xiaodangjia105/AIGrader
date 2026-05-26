import { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, List, Tag, Progress, Alert } from 'antd';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { StudentReport } from '../../types';

export default function StudentReportPage() {
  const user = useAuthStore((s) => s.user);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.getStudentReport(user.id)
      .then(setReport)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!report) return <p>暂无报告</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>学习报告</h2>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="学生姓名">{report.studentName}</Descriptions.Item>
          <Descriptions.Item label="总提交次数">{report.totalSubmissions}</Descriptions.Item>
          <Descriptions.Item label="总答题数">{report.totalAnswers}</Descriptions.Item>
          <Descriptions.Item label="整体正确率"><Progress percent={((report.overallAccuracy || 0) * 100)} size="small" /></Descriptions.Item>
        </Descriptions>
      </Card>

      {report.subjectAccuracies && report.subjectAccuracies.length > 0 && (
        <Card title="学科正确率" style={{ marginBottom: 16 }}>
          <List
            dataSource={report.subjectAccuracies}
            renderItem={(item) => (
              <List.Item>
                <span>{item.subject}</span>
                <Progress percent={((item.accuracy || 0) * 100)} size="small" style={{ width: 200 }} />
                <span style={{ color: '#888' }}>{item.correctCount}/{item.totalCount}</span>
              </List.Item>
            )}
          />
        </Card>
      )}

      {report.weakPoints && report.weakPoints.length > 0 && (
        <Card title="薄弱环节" style={{ marginBottom: 16 }}>
          <List
            dataSource={report.weakPoints}
            renderItem={(item) => (
              <List.Item>
                <span>{item.subject} - {item.questionType}</span>
                <Tag color={(item.accuracy || 0) < 0.6 ? 'red' : 'orange'}>正确率 {((item.accuracy || 0) * 100).toFixed(0)}%</Tag>
              </List.Item>
            )}
          />
        </Card>
      )}

      {report.aiSuggestions && (
        <Alert type="info" message="AI 学习建议" description={report.aiSuggestions} showIcon />
      )}
    </div>
  );
}
