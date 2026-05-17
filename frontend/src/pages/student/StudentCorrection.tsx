import { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function StudentCorrection() {
  const { answerId } = useParams<{ answerId: string }>();
  const navigate = useNavigate();
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!answerId || !newAnswer.trim()) {
      message.warning('请输入订正后的答案');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitCorrection({ submissionAnswerId: Number(answerId), newAnswer });
      message.success('订正提交成功！');
      navigate(-1);
    } catch {
      message.error('订正提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 16 }}>错题订正</h2>
      <Card>
        <Input.TextArea
          rows={6}
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="在此输入订正后的答案..."
        />
        <Button type="primary" onClick={handleSubmit} loading={submitting} style={{ marginTop: 12 }}>
          提交订正
        </Button>
      </Card>
    </div>
  );
}
