import { useEffect, useState } from 'react';
import { Card, Input, Button, Radio, Space, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { QuestionType } from '../../types';
import type { Question, AssignmentQuestion, AnswerDTO } from '../../types';

export default function StudentAnswer() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aqList, setAqList] = useState<AssignmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getAssignmentQuestions(Number(id)),
    ]).then(async ([aqs]) => {
      setAqList(aqs);
      const qs = await Promise.all(aqs.map((aq: AssignmentQuestion) => api.getQuestion(aq.questionId)));
      setQuestions(qs);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const answerList: AnswerDTO[] = questions.map((q) => ({
        questionId: q.id,
        studentAnswer: answers[q.id] || '',
      }));
      const submission = await api.submit(Number(id), answerList);
      message.success('提交成功！正在跳转到批改结果...');
      setTimeout(() => navigate(`/student/results/${submission.id}`), 1500);
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const renderQuestionInput = (q: Question, idx: number) => {
    const val = answers[q.id] || '';
    switch (q.type) {
      case QuestionType.CHOICE:
        const opts = q.options ? JSON.parse(q.options) : {};
        return (
          <Radio.Group value={val} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}>
            <Space direction="vertical">
              {Object.entries(opts).map(([k, v]) => (
                <Radio key={k} value={k}>{k}. {v as string}</Radio>
              ))}
            </Space>
          </Radio.Group>
        );
      case QuestionType.TRUE_FALSE:
        return (
          <Radio.Group value={val} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}>
            <Radio value="TRUE">正确</Radio>
            <Radio value="FALSE">错误</Radio>
          </Radio.Group>
        );
      default:
        return (
          <Input.TextArea
            rows={4}
            value={val}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder="在此输入你的答案..."
          />
        );
    }
  };

  const typeNames: Record<string, string> = {
    CHOICE: '选择题', TRUE_FALSE: '判断题', FILL_BLANK: '填空题',
    SHORT_ANSWER: '简答题', ESSAY: '作文题',
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>作答</h2>
      {questions.map((q, idx) => (
        <Card key={q.id} title={`第${idx + 1}题 [${typeNames[q.type] || q.type}] ${q.content}`} style={{ marginBottom: 16 }}>
          {renderQuestionInput(q, idx)}
        </Card>
      ))}
      <Button type="primary" size="large" onClick={handleSubmit} loading={submitting} block>
        提交答案
      </Button>
    </div>
  );
}
