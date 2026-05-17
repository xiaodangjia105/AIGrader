import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import { QuestionType } from '../../types';
import type { Question } from '../../types';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      setQuestions(await api.getQuestions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (values: any) => {
    try {
      if (editingId) {
        await api.updateQuestion(editingId, values);
        message.success('Updated');
      } else {
        await api.createQuestion(values);
        message.success('Created');
      }
      setModalVisible(false);
      form.resetFields();
      load();
    } catch {
      message.error('Save failed');
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteQuestion(id);
    message.success('Deleted');
    load();
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    form.setFieldsValue(q);
    setModalVisible(true);
  };

  const openNew = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 100 },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', width: 80 },
    { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty', width: 80 },
    { title: 'Content', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: 'Answer', dataIndex: 'answer', key: 'answer', ellipsis: true, width: 100 },
    {
      title: 'Actions', key: 'actions', width: 160,
      render: (_: any, record: Question) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Question Bank</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>Add Question</Button>
      </div>
      <Table dataSource={questions} columns={columns} rowKey="id" loading={loading} />
      <Modal
        title={editingId ? 'Edit Question' : 'Add Question'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={Object.values(QuestionType).map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Select options={['Math', 'Chinese', 'Science', 'English'].map((s) => ({ value: s, label: s }))} />
          </Form.Item>
          <Form.Item name="difficulty" label="Difficulty">
            <Select options={['EASY', 'MEDIUM', 'HARD'].map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="answer" label="Answer">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="rubric" label="Rubric (for subjective questions)">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="options" label="Options (JSON for choice questions)">
            <Input.TextArea rows={2} placeholder='{"A":"...","B":"..."}' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
