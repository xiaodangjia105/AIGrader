import { useEffect, useState, useMemo } from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Select, message, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import type { Question } from '../../types';

export default function TeacherCreateAssignment() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterSubject, setFilterSubject] = useState<string | undefined>();
  const [form] = Form.useForm();

  useEffect(() => {
    api.getQuestions().then(setQuestions);
    api.getClasses().then(setClasses).catch(() => {});
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filterSubject && q.subject !== filterSubject) return false;
      if (searchText && !q.content.toLowerCase().includes(searchText.toLowerCase())) return false;
      return true;
    });
  }, [questions, searchText, filterSubject]);

  const handleSubmit = async (values: any) => {
    if (selectedIds.length === 0) { message.warning('请至少选择一道题目'); return; }
    if (!values.classId) { message.warning('请选择目标班级'); return; }
    try {
      await api.createAssignment({
        title: values.title, teacherId: user!.id, classId: values.classId,
        dueDate: values.dueDate?.toISOString() || new Date().toISOString(),
        questionIds: selectedIds,
      });
      message.success('作业创建成功！');
      navigate('/teacher/assignments');
    } catch { message.error('创建失败'); }
  };

  const typeLabel: Record<string, string> = { CHOICE: '选择', TRUE_FALSE: '判断', FILL_BLANK: '填空', SHORT_ANSWER: '简答', ESSAY: '作文' };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>布置作业</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 700 }}>
        <Form.Item name="title" label="作业标题" rules={[{ required: true, message: '请输入作业标题' }]}>
          <Input placeholder="例如：第三周数学作业" />
        </Form.Item>
        <Form.Item name="classId" label="目标班级" rules={[{ required: true, message: '请选择目标班级' }]}>
          <Select placeholder="选择班级">
            {classes.map((c: any) => (<Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>))}
          </Select>
        </Form.Item>
        <Form.Item name="dueDate" label="截止日期">
          <DatePicker style={{ width: '100%' }} placeholder="选择截止日期" />
        </Form.Item>
        <Form.Item label="选择题目">
          <Space style={{ marginBottom: 12 }}>
            <Input.Search placeholder="搜索题目内容" allowClear onSearch={setSearchText} onChange={(e) => { if (!e.target.value) setSearchText(''); }} style={{ width: 240 }} />
            <Select placeholder="筛选学科" allowClear style={{ width: 120 }} onChange={(v) => setFilterSubject(v)} options={[{ value: 'Math', label: '数学' }, { value: 'Chinese', label: '语文' }, { value: 'Science', label: '科学' }, { value: 'English', label: '英语' }]} />
            <span style={{ color: '#888' }}>已选 {selectedIds.length} 题</span>
          </Space>
          <Card size="small" style={{ maxHeight: 400, overflow: 'auto' }}>
            <Checkbox.Group value={selectedIds} onChange={(vals) => setSelectedIds(vals as number[])}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {filteredQuestions.map((q) => (
                  <Checkbox key={q.id} value={q.id}>[{typeLabel[q.type] || q.type}] {q.subject} - {q.content.substring(0, 60)}{q.content.length > 60 ? '...' : ''}</Checkbox>
                ))}
                {filteredQuestions.length === 0 && <span style={{ color: '#999' }}>没有匹配的题目</span>}
              </Space>
            </Checkbox.Group>
          </Card>
        </Form.Item>
        <Button type="primary" htmlType="submit">创建作业</Button>
      </Form>
    </div>
  );
}
