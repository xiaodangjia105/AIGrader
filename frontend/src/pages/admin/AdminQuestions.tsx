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
        message.success('更新成功');
      } else {
        await api.createQuestion(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      load();
    } catch {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteQuestion(id);
    message.success('已删除');
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

  const typeLabels: Record<string, string> = {
    CHOICE: '选择题', TRUE_FALSE: '判断题', FILL_BLANK: '填空题',
    SHORT_ANSWER: '简答题', ESSAY: '作文题',
  };

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id', width: 50 },
    { title: '题型', dataIndex: 'type', key: 'type', width: 90, render: (t: string) => typeLabels[t] || t },
    { title: '学科', dataIndex: 'subject', key: 'subject', width: 70, render: (s: string) => ({ Math: '数学', Chinese: '语文', Science: '科学', English: '英语' })[s] || s },
    { title: '难度', dataIndex: 'difficulty', key: 'difficulty', width: 70, render: (d: string) => ({ EASY: '简单', MEDIUM: '中等', HARD: '困难' })[d] || d },
    { title: '题目内容', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '答案', dataIndex: 'answer', key: 'answer', ellipsis: true, width: 80 },
    {
      title: '操作', key: 'actions', width: 160,
      render: (_: any, record: Question) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>题库管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>添加题目</Button>
      </div>
      <Table dataSource={questions} columns={columns} rowKey="id" loading={loading} locale={{ emptyText: '暂无题目' }} />
      <Modal
        title={editingId ? '编辑题目' : '添加题目'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="type" label="题型" rules={[{ required: true, message: '请选择题型' }]}>
            <Select options={Object.entries(typeLabels).map(([v, l]) => ({ value: v, label: l }))} />
          </Form.Item>
          <Form.Item name="subject" label="学科" rules={[{ required: true, message: '请选择学科' }]}>
            <Select options={[
              { value: 'Math', label: '数学' }, { value: 'Chinese', label: '语文' },
              { value: 'Science', label: '科学' }, { value: 'English', label: '英语' },
            ]} />
          </Form.Item>
          <Form.Item name="difficulty" label="难度">
            <Select options={[
              { value: 'EASY', label: '简单' }, { value: 'MEDIUM', label: '中等' }, { value: 'HARD', label: '困难' },
            ]} />
          </Form.Item>
          <Form.Item name="content" label="题目内容" rules={[{ required: true, message: '请输入题目内容' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="answer" label="答案">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="rubric" label="评分标准（主观题用）">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="options" label="选项（选择题用，JSON格式）">
            <Input.TextArea rows={2} placeholder='{"A":"选项A内容","B":"选项B内容"}' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
