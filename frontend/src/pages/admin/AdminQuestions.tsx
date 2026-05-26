import { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Tabs, Upload, Alert } from 'antd';
import { PlusOutlined, ImportOutlined, UploadOutlined } from '@ant-design/icons';
import { api } from '../../services/api';
import type { Question, BatchImportResult } from '../../types';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importResult, setImportResult] = useState<BatchImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const csvFileRef = useRef<File | null>(null);

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

  const openImport = () => {
    setImportResult(null);
    setJsonText('');
    csvFileRef.current = null;
    setImportModalVisible(true);
  };

  const handleJsonImport = async () => {
    if (!jsonText.trim()) {
      message.warning('请输入 JSON 数据');
      return;
    }
    try {
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      setImporting(true);
      const result = await api.batchImportQuestions(items);
      setImportResult(result);
      message.success(`导入完成：成功 ${result.successCount} 条，失败 ${result.failCount} 条`);
      load();
    } catch (e: any) {
      message.error('JSON 解析失败：' + e.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvFileRef.current) {
      message.warning('请选择 CSV 文件');
      return;
    }
    try {
      setImporting(true);
      const result = await api.batchImportCsv(csvFileRef.current);
      setImportResult(result);
      message.success(`导入完成：成功 ${result.successCount} 条，失败 ${result.failCount} 条`);
      load();
    } catch (e: any) {
      message.error('CSV 导入失败：' + e.message);
    } finally {
      setImporting(false);
    }
  };

  const typeLabels: Record<string, string> = {
    CHOICE: '选择题', TRUE_FALSE: '判断题', FILL_BLANK: '填空题',
    SHORT_ANSWER: '简答题', ESSAY: '作文题',
  };

  const columns = [
    { title: '编号', dataIndex: 'id', key: 'id', width: 50 },
    { title: '题型', dataIndex: 'type', key: 'type', width: 90, render: (t: string) => typeLabels[t] || t },
    { title: '学科', dataIndex: 'subject', key: 'subject', width: 70, render: (s: string) => ({ Math: '数学', Chinese: '语文', Science: '科学', English: '英语' } as Record<string, string>)[s] || s },
    { title: '难度', dataIndex: 'difficulty', key: 'difficulty', width: 70, render: (d: string) => ({ EASY: '简单', MEDIUM: '中等', HARD: '困难' } as Record<string, string>)[d] || d },
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
        <Space>
          <Button icon={<ImportOutlined />} onClick={openImport}>批量导入</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>添加题目</Button>
        </Space>
      </div>
      <Table dataSource={questions} columns={columns} rowKey="id" loading={loading} locale={{ emptyText: '暂无题目' }} />

      <Modal title={editingId ? '编辑题目' : '添加题目'} open={modalVisible} onOk={() => form.submit()} onCancel={() => { setModalVisible(false); form.resetFields(); }} width={700} okText="保存" cancelText="取消">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="type" label="题型" rules={[{ required: true, message: '请选择题型' }]}>
            <Select options={Object.entries(typeLabels).map(([v, l]) => ({ value: v, label: l }))} />
          </Form.Item>
          <Form.Item name="subject" label="学科" rules={[{ required: true, message: '请选择学科' }]}>
            <Select options={[{ value: 'Math', label: '数学' }, { value: 'Chinese', label: '语文' }, { value: 'Science', label: '科学' }, { value: 'English', label: '英语' }]} />
          </Form.Item>
          <Form.Item name="difficulty" label="难度">
            <Select options={[{ value: 'EASY', label: '简单' }, { value: 'MEDIUM', label: '中等' }, { value: 'HARD', label: '困难' }]} />
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

      <Modal title="批量导入题目" open={importModalVisible} onCancel={() => setImportModalVisible(false)} width={700} footer={null}>
        <Tabs items={[{
          key: 'json', label: '粘贴 JSON',
          children: (<div>
            <Input.TextArea rows={8} placeholder={'[\n  {\n    "type": "CHOICE",\n    "subject": "Math",\n    "difficulty": "EASY",\n    "content": "1+1=?",\n    "answer": "2",\n    "options": "{\\\\"A\\\\":\\\\"1\\\\",\\\\"B\\\\":\\\\"2\\\\"}"\n  }\n]'} value={jsonText} onChange={e => setJsonText(e.target.value)} />
            <Button type="primary" onClick={handleJsonImport} loading={importing} style={{ marginTop: 12 }}>提交导入</Button>
          </div>),
        }, {
          key: 'csv', label: '上传 CSV',
          children: (<div>
            <Upload accept=".csv" maxCount={1} beforeUpload={file => { csvFileRef.current = file; return false; }} onRemove={() => { csvFileRef.current = null; }}>
              <Button icon={<UploadOutlined />}>选择 CSV 文件</Button>
            </Upload>
            <p style={{ color: '#888', marginTop: 8 }}>CSV 表头：type,subject,difficulty,content,answer,rubric,options</p>
            <Button type="primary" onClick={handleCsvImport} loading={importing} style={{ marginTop: 12 }}>提交导入</Button>
          </div>),
        }]} />
        {importResult && (
          <Alert type={importResult.failCount === 0 ? 'success' : 'warning'} message={<span>成功 <b>{importResult.successCount}</b> 条，失败 <b>{importResult.failCount}</b> 条</span>} description={importResult.errors.length > 0 && <ul style={{ margin: 0, paddingLeft: 20 }}>{importResult.errors.map((err, idx) => <li key={idx}>{err}</li>)}</ul>} style={{ marginTop: 16 }} />
        )}
      </Modal>
    </div>
  );
}
