import { Card, Form, Input, Switch, Button, message, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AdminAIConfig() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await api.getAiConfig();
      form.setFieldsValue({
        baseUrl: data.baseUrl || 'https://api.deepseek.com',
        model: data.model || 'deepseek-chat',
        apiKey: data.apiKey || '',
      });
    } catch {
      message.warning('Failed to load AI configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: { baseUrl: string; model: string; apiKey: string }) => {
    setSaving(true);
    try {
      await api.updateAiConfig(values);
      message.success('AI configuration saved');
    } catch {
      message.error('Failed to save AI configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="AI Configuration" extra={loading && <Spin size="small" />}>
      <Form form={form} layout="vertical" onFinish={handleSave} style={{ maxWidth: 500 }}>
        <Form.Item label="Base URL" name="baseUrl" rules={[{ required: true }]}>
          <Input placeholder="https://api.deepseek.com" />
        </Form.Item>

        <Form.Item label="Model" name="model" rules={[{ required: true }]}>
          <Input placeholder="deepseek-chat" />
        </Form.Item>

        <Form.Item label="API Key" name="apiKey" rules={[{ required: true }]}>
          <Input.Password placeholder="sk-xxxxxxxx" />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
            Save Configuration
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
