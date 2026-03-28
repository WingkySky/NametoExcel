import React, { useState } from 'react';
import { Card, Tag, Input, Button, Space, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ExcludeCondition } from '../store/useAppStore';

const { Text } = Typography;

interface ConditionGroupCardProps {
  condition: ExcludeCondition;
  groupIndex: number;
  onUpdate: (id: string, tags: string[]) => void;
  onDelete: (id: string) => void;
}

export const ConditionGroupCard: React.FC<ConditionGroupCardProps> = ({
  condition,
  groupIndex,
  onUpdate,
  onDelete,
}) => {
  const [inputValue, setInputValue] = useState('');

  /* 添加标签到当前组 */
  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !condition.tags.includes(trimmed)) {
      onUpdate(condition.id, [...condition.tags, trimmed]);
      setInputValue('');
    }
  };

  /* 按回车添加标签 */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  /* 删除标签 */
  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate(condition.id, condition.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card
      size="small"
      style={{
        width: 280,
        border: '1px solid #d9d9d9',
        backgroundColor: '#fafafa'
      }}
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            条件组 {groupIndex + 1}
          </span>
        </Space>
      }
      extra={
        <Popconfirm
          title="确定删除此条件组？"
          onConfirm={() => onDelete(condition.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      }
    >
      {/* 标签展示区域 */}
      <div style={{ marginBottom: 12 }}>
        {condition.tags.length > 0 ? (
          <Space wrap size={[4, 4]}>
            {condition.tags.map((tag) => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemoveTag(tag)}
                style={{
                  margin: 0,
                  padding: '2px 8px',
                  fontSize: 13
                }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            暂未添加条件
          </Text>
        )}
      </div>

      {/* 输入框和添加按钮 */}
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="输入条件"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1 }}
          size="small"
        />
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAddTag}
        >
          添加
        </Button>
      </Space.Compact>

      {/* 关系说明 */}
      {condition.tags.length > 1 && (
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
            组内所有条件同时满足才排除
          </Text>
        </div>
      )}
    </Card>
  );
};
