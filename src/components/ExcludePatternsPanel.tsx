import React, { useState } from 'react';
import { Card, Tag, Input, Button, Space, Typography, Divider } from 'antd';
import { PlusOutlined, HistoryOutlined, FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

/* 通用快捷标签配置 */
const COMMON_TAGS = [
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
  tagHistory: string[];
  onClearHistory: () => void;
}

export const ExcludePatternsPanel: React.FC<ExcludePatternsPanelProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  onClearAll,
  tagHistory,
  onClearHistory,
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

        {/* 历史记录标签 */}
        {tagHistory.length > 0 && (
          <div>
            <Space align="center" style={{ marginBottom: 8 }}>
              <HistoryOutlined style={{ color: '#1890ff' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                历史记录：
              </Text>
            </Space>
            <Space wrap size={[4, 4]} style={{ marginBottom: 8 }}>
              {tagHistory
                .filter(tag => !tags.includes(tag))
                .slice(0, 10)
                .map((tag) => (
                  <Button
                    key={tag}
                    size="small"
                    onClick={() => onAddTag(tag)}
                    style={{
                      fontSize: 12,
                      padding: '0 8px',
                      height: 24
                    }}
                  >
                    {tag}
                  </Button>
                ))}
            </Space>
            <div>
              <Button type="link" size="small" onClick={onClearHistory} danger>
                清除历史
              </Button>
            </div>
          </div>
        )}

        {/* 通用快捷标签栏 */}
        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <FireOutlined style={{ color: '#ff7a45' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              常用词条：
            </Text>
          </Space>
          <Space wrap size={[4, 4]}>
            {COMMON_TAGS.map((quickTag) => (
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
            💡 输入的每个词条都会从文件名中移除。例如：输入"备份"和"副本"，
            则"张三_备份_副本.pdf"会变为"张三_.pdf"
          </Text>
        </div>
      </Space>
    </Card>
  );
};
