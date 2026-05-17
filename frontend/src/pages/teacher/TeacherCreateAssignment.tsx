import { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { Question } from '../../types';

export default function TeacherCreateAssignment() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    api.getQuestions().then(setQuestions);
  }, []);

  const handleSubmit = async (values: any) => {
    if (selectedIds.length === 0) {
      message.warning('请至少选择一道题目');
      return;
    }
    try {
      await api.createAssignment({
        title: values.title,
        teacherId: user!.id,
        classId: 1,
        dueDate: values.dueDate?.toISOString() || new Date().toISOString(),
        questionIds: selectedIds,
      });
      message.success('作业创建成功！');
      navigate('/teacher/assignments');
    } catch {
      message.error('创建失败');
    }
  };

  const typeLabel: Record<string, string> = {
    CHOICE: '选择', TRUE_FALSE: '判断', FILL_BLANK: '填空',
    SHORT_ANSWER: '简答', ESSAY: '作文',
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>布置作业</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 600 }}>
        <Form.Item name="title" label="作业标题" rules={[{ required: true, message: '请输入作业标题' }]}>
          <Input placeholder="例如：第三周数学作业" />
        </Form.Item>
        <Form.Item name="dueDate" label="截止日期">
          <DatePicker style={{ width: '100%' }} placeholder="选择截止日期" />
        </Form.Item>
        <Form.Item label="选择题目">
          <Checkbox.Group onChange={(vals) => setSelectedIds(vals as number[])}>
            <Space direction="vertical">
              {questions.map((q) => (
                <Checkbox key={q.id} value={q.id}>
                  [{typeLabel[q.type] || q.type}] {q.subject} - {q.content.substring(0, 50)}...
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit">创建作业</Button>
      </Form>
    </div>
  );
}
