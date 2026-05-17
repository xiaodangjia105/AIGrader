import { useEffect, useState } from 'react';
import { Card, Form, Input, Select, Button, Checkbox, DatePicker, message, Space } from 'antd';
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
      message.warning('Please select at least one question');
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
      message.success('Assignment created!');
      navigate('/teacher/assignments');
    } catch {
      message.error('Failed to create assignment');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Create Assignment</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 600 }}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="e.g., Week 3 Math Homework" />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Select Questions">
          <Checkbox.Group onChange={(vals) => setSelectedIds(vals as number[])}>
            <Space direction="vertical">
              {questions.map((q) => (
                <Checkbox key={q.id} value={q.id}>
                  [{q.type}] {q.content.substring(0, 60)}...
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Button type="primary" htmlType="submit">Create Assignment</Button>
      </Form>
    </div>
  );
}
