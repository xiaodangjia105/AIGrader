import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin, Table, Tag } from 'antd';
import {
  CheckCircleOutlined, ExperimentOutlined, AlertOutlined, LineChartOutlined,
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../../services/api';
import type { AiAccuracyData, AiAccuracyDetail } from '../../types';

export default function AdminMonitor() {
  const [accuracyData, setAccuracyData] = useState<AiAccuracyData | null>(null);
  const [details, setDetails] = useState<AiAccuracyDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAiAccuracy(),
      api.getAiAccuracyDetail(),
    ]).then(([acc, det]) => {
      setAccuracyData(acc);
      setDetails(det);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const summary = accuracyData;

  const trendData = (summary?.trend || []).map(item => ({
    ...item,
    misjudgmentPct: +(item.misjudgmentRate * 100).toFixed(1),
    deviationLabel: +item.avgDeviation.toFixed(2),
  }));

  const detailColumns = [
    { title: '答案ID', dataIndex: 'answerId', key: 'answerId', width: 70 },
    { title: '题目', dataIndex: 'questionContent', key: 'questionContent', ellipsis: true },
    { title: 'AI评分', dataIndex: 'aiScore', key: 'aiScore', width: 80 },
    { title: '最终评分', dataIndex: 'finalScore', key: 'finalScore', width: 80 },
    {
      title: '偏差', dataIndex: 'deviation', key: 'deviation', width: 80,
      render: (v: number) => <Tag color={v >= 5 ? 'red' : 'orange'}>{v.toFixed(1)}</Tag>,
    },
    { title: '日期', dataIndex: 'date', key: 'date', width: 110 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>系统监控</h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总题目数" value={summary?.totalQuestions || 0} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总批改数" value={summary?.totalGraded || 0} prefix={<ExperimentOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="复核率"
              value={summary ? (summary.reviewRate * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均偏差"
              value={summary?.avgDeviation || 0}
              precision={2}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="AI 准确率趋势" style={{ marginBottom: 24 }}>
        {trendData.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>暂无复核数据</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: '误判率 (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: '平均偏差', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="misjudgmentPct" stroke="#ff4d4f" name="误判率 (%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="deviationLabel" stroke="#1890ff" name="平均偏差" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="偏差较大答案明细（|AI评分 - 最终评分| ≥ 2）">
        <Table
          dataSource={details}
          columns={detailColumns}
          rowKey="answerId"
          locale={{ emptyText: '暂无偏差较大的答案' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}