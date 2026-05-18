import { useEffect, useState } from 'react';
import { Card, Col, Progress, Row, Spin, Statistic, Table, Typography } from 'antd';
import { TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import type { StudentReport, WeakPoint } from '../../types';

const { Title, Text } = Typography;

export default function StudentReportPage() {
  const user = useAuthStore((s) => s.user);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    api.getStudentReport(user.id).then(setReport).finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!report) return <p>暂无学习报告</p>;

  const accuracyPercent = Math.round(report.overallAccuracy * 100);

  const weakCols = [
    { title: '学科', dataIndex: 'subject', key: 'subject', width: 100 },
    { title: '题型', dataIndex: 'questionType', key: 'questionType', width: 100 },
    {
      title: '正确率', dataIndex: 'accuracy', key: 'accuracy', width: 100,
      render: (v: number) => {
        const pct = Math.round(v * 100);
        return <Text type={pct < 60 ? 'danger' : pct < 80 ? 'warning' : 'success'}>{pct}%</Text>;
      },
    },
    { title: '答题数', dataIndex: 'totalCount', key: 'totalCount', width: 80 },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        <TrophyOutlined style={{ marginRight: 8 }} />
        {report.studentName} 的学习报告
      </Title>

      <Card style={{ marginBottom: 24, textAlign: 'center' }}>
        <Statistic
          title="综合正确率"
          value={accuracyPercent}
          suffix="%"
          valueStyle={{ color: accuracyPercent >= 80 ? '#52c41a' : accuracyPercent >= 60 ? '#faad14' : '#ff4d4f', fontSize: 36 }}
        />
        <Text type="secondary">
          共提交 {report.totalSubmissions} 次作业，答题 {report.totalAnswers} 题
        </Text>
      </Card>

      <Title level={5} style={{ marginBottom: 16 }}>学科正确率</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {report.subjectAccuracies.map((sa) => {
          const pct = Math.round(sa.accuracy * 100);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={sa.subject}>
              <Card size="small">
                <Text strong>{sa.subject}</Text>
                <Progress
                  percent={pct}
                  status={pct >= 80 ? 'success' : pct >= 60 ? 'normal' : 'exception'}
                  format={() => `${pct}%`}
                  style={{ marginTop: 8 }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {sa.correctCount}/{sa.totalCount} 正确
                </Text>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Title level={5} style={{ marginBottom: 16 }}>
        <WarningOutlined style={{ marginRight: 8 }} />
        薄弱知识点
      </Title>
      <Table
        dataSource={report.weakPoints as any[]}
        columns={weakCols}
        rowKey={(r: WeakPoint) => `${r.subject}-${r.questionType}`}
        pagination={false}
        size="small"
        style={{ marginBottom: 24 }}
        locale={{ emptyText: '暂无薄弱知识点' }}
      />

      {report.aiSuggestions && (
        <Card title="AI 学习建议" style={{ background: '#f6ffed' }}>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{report.aiSuggestions}</Text>
        </Card>
      )}
    </div>
  );
}