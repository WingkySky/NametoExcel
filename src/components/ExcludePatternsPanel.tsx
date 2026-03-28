import React, { useState } from 'react';
import { Card, Tag, Input, Button, Space, Typography, Divider } from 'antd';
import { PlusOutlined, FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

/* 快捷标签配置 */
const QUICK_TAGS = [
  { label: '数字', pattern: '数字' },
  { label: '日期', pattern: '日期' },
  { label: '社保证明', pattern: '社保证明' },
  { label: '证明', pattern: '证明' },
  { label: '备份', pattern: '备份' },
  { label: '副本', pattern: '副本' },
  { label: '_temp', pattern: '_temp' },
  { label: 'copy', pattern: 'copy' },
];

interface ExcludePatternsPanelProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onClearAll: () => void;
}

export const ExcludePatternsPanel: React.FC<ExcludePatternsPanelProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  onClearAll,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAddTag(trimmed);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card title="排除词条" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 标签输入区域 */}
        <div>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="输入要排除的词条，按回车添加"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex: 1 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>
              添加
            </Button>
          </Space.Compact>
        </div>

        {/* 已添加的标签 */}
        {tags.length > 0 && (
          <div>
            <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
              已添加的排除词条：
            </Text>
            <Space wrap size={[4, 4]}>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => onRemoveTag(tag)}
                  style={{
                    margin: 0,
                    padding: '4px 8px',
                    fontSize: 14
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
            <div style={{ marginTop: 8 }}>
              <Button type="link" size="small" onClick={onClearAll} danger>
                清除全部
              </Button>
            </div>
          </div>
        )}

        <Divider style={{ margin: '8px 0' }} />

        {/* 快捷标签栏 */}
        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <FireOutlined style={{ color: '#ff7a45' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              快捷添加：
            </Text>
          </Space>
          <Space wrap size={[4, 4]}>
            {QUICK_TAGS.map((quickTag) => (
              <Button
                key={quickTag.pattern}
                size="small"
                onClick={() => onAddTag(quickTag.pattern)}
                disabled={tags.includes(quickTag.pattern)}
                style={{
                  fontSize: 12,
                  padding: '0 8px',
                  height: 24
                }}
              >
                {quickTag.label}
              </Button>
            ))}
          </Space>
        </div>

        {/* 提示信息 */}
        <div style={{ backgroundColor: '#fafafa', padding: '8px 12px', borderRadius: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 输入的每个词条都会从文件名中移除。例如：输入"社保证明"和"2024"，
            则"张三_社保证明_2024.pdf"会变为"张三_.pdf"
          </Text>
        </div>
      </Space>
    </Card>
  );
};
