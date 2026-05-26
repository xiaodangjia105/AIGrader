import { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Table, Tag, Progress } from 'antd';
import { api } from '../../services/api';
import type { AiAccuracyData, AiAccuracyDetail } from '../../types';

export default function AdminMonitor() {
  const [data, setData] = useState<AiAccuracyData | null>(null);
  const [details, setDetails] = useState<AiAccuracyDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAiAccuracy(),
      api.getAiAccuracyDetail(),
    ]).then(([acc, det]) => {
      setData(acc);
      setDetails(det);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!data) return <p>暂无数据</p>;

  const detailCols = [
    { title: '答题ID', dataIndex: 'answerId', key: 'answerId', width: 70 },
    { title: '题目', dataIndex: 'questionContent', key: 'questionContent', ellipsis: true },
    { title: 'AI评分', dataIndex: 'aiScore', key: 'aiScore', width: 70 },
    { title: '最终评分', dataIndex: 'finalScore', key: 'finalScore', width: 80 },
    { title: '偏差', dataIndex: 'deviation', key: 'deviation', width: 70, render: (d: number) => <Tag color={Math.abs(d) > 2 ? 'red' : 'green'}>{d?.toFixed(1)}</Tag> },
    { title: '日期', dataIndex: 'date', key: 'date', width: 100 },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>质量监控</h2>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={3} size="small">
          <Descriptions.Item label="总题目数">{data.totalQuestions}</Descriptions.Item>
          <Descriptions.Item label="已批改数">{data.totalGraded}</Descriptions.Item>
          <Descriptions.Item label="已复核数">{data.totalReviewed}</Descriptions.Item>
          <Descriptions.Item label="复核率"><Progress percent={((data.reviewRate || 0) * 100)} size="small" /></Descriptions.Item>
          <Descriptions.Item label="误判率"><Tag color={(data.misjudgmentRate || 0) > 0.1 ? 'red' : 'green'}>{((data.misjudgmentRate || 0) * 100).toFixed(1)}%</Tag></Descriptions.Item>
          <Descriptions.Item label="平均偏差">{data.avgDeviation?.toFixed(2)}</Descriptions.Item>
        </Descriptions>
      </Card>
      <h3 style={{ marginBottom: 12 }}>偏差明细</h3>
      <Table dataSource={details} columns={detailCols} rowKey="answerId" size="small" locale={{ emptyText: '暂无复核数据' }} />
    </div>
  );
}
