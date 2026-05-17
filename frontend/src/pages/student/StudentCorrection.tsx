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
      message.warning('Please enter your corrected answer');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitCorrection({ submissionAnswerId: Number(answerId), newAnswer });
      message.success('Correction submitted!');
      navigate(-1);
    } catch {
      message.error('Failed to submit correction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 16 }}>Correct Your Answer</h2>
      <Card>
        <Input.TextArea
          rows={6}
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your corrected answer here..."
        />
        <Button type="primary" onClick={handleSubmit} loading={submitting} style={{ marginTop: 12 }}>
          Submit Correction
        </Button>
      </Card>
    </div>
  );
}
