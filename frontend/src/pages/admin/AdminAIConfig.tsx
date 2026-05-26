import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Descriptions, Spin } from 'antd';
import { api } from '../../services/api';
import type { AiConfig } from '../../types';

function maskKey(key: string | undefined): string {
  if (!key || key.length <= 8) return '****';
  return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}

export default function AdminAIConfig() {
  const [config, setConfig] = useState<AiConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const loadConfig = () => {
    setLoading(true);
    api.getAiConfig()
      .then((c) => {
        setConfig(c);
        form.setFieldsValue(c);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadConfig(); }, []);

  const handleSave = async (values: AiConfig) => {
    setSaving(true);
    try {
      const res = await api.updateAiConfig(values);
      message.success('已切换到模型：' + res.model);
      loadConfig();
    } catch {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>AI 配置</h2>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="当前模型">{config.model || '未配置'}</Descriptions.Item>
          <Descriptions.Item label="Base URL">{config.baseUrl || '默认'}</Descriptions.Item>
          <Descriptions.Item label="API Key">{maskKey(config.apiKey)}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="修改配置">
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ maxWidth: 500 }}>
          <Form.Item name="apiKey" label="API Key" rules={[{ required: true, message: '请输入 API Key' }]}>
            <Input.Password placeholder="sk-..." />
          </Form.Item>
          <Form.Item name="model" label="模型名称" rules={[{ required: true, message: '请输入模型名称' }]}>
            <Input placeholder="deepseek-chat" />
          </Form.Item>
          <Form.Item name="baseUrl" label="Base URL">
            <Input placeholder="https://api.deepseek.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>保存配置</Button>
        </Form>
      </Card>
    </div>
  );
}
