import React from 'react';
import { Card, Button, Space, Typography, Divider } from 'antd';
import { PlusOutlined, FireOutlined } from '@ant-design/icons';
import { ConditionGroupCard } from './ConditionGroupCard';
import { ExcludeCondition } from '../store/useAppStore';

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
  excludeConditions: ExcludeCondition[];
  onUpdateCondition: (id: string, tags: string[]) => void;
  onAddCondition: () => void;
  onDeleteCondition: (id: string) => void;
  onQuickAddTag: (tag: string) => void;
}

export const ExcludePatternsPanel: React.FC<ExcludePatternsPanelProps> = ({
  excludeConditions,
  onUpdateCondition,
  onAddCondition,
  onDeleteCondition,
  onQuickAddTag,
}) => {
  /* 生成条件预览文本 */
  const getPreviewText = (): string => {
    if (excludeConditions.length === 0) {
      return '暂未设置排除条件';
    }

    if (excludeConditions.length === 1) {
      const condition = excludeConditions[0];
      if (condition.tags.length === 0) {
        return '暂未设置排除条件';
      }
      if (condition.tags.length === 1) {
        return `排除包含"${condition.tags[0]}"的文件`;
      }
      return `排除同时包含 ${condition.tags.map(t => `"${t}"`).join(' 和 ')} 的文件`;
    }

    const descriptions = excludeConditions.map((condition, index) => {
      if (condition.tags.length === 0) return null;
      if (condition.tags.length === 1) {
        return `条件组${index + 1}：包含"${condition.tags[0]}"`;
      }
      return `条件组${index + 1}：同时包含 ${condition.tags.map(t => `"${t}"`).join(' 和 ')}`;
    }).filter(Boolean);

    return descriptions!.join('\n• ');
  };

  return (
    <Card title="排除模式" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 条件组卡片区域 */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'flex-start'
        }}>
          {excludeConditions.map((condition, index) => (
            <ConditionGroupCard
              key={condition.id}
              condition={condition}
              groupIndex={index}
              onUpdate={onUpdateCondition}
              onDelete={onDeleteCondition}
            />
          ))}

          {/* 添加组按钮 */}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={onAddCondition}
            style={{
              width: 280,
              height: 120,
              fontSize: 14,
              borderColor: '#d9d9d9',
              color: '#666'
            }}
          >
            添加条件组
          </Button>
        </div>

        {/* 组间关系说明 */}
        {excludeConditions.length > 1 && (
          <div style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 4,
            padding: '8px 12px'
          }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              组间关系：<strong style={{ color: '#52c41a' }}>OR</strong>（满足任一条件组即排除）
            </Text>
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
                onClick={() => onQuickAddTag(quickTag.pattern)}
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

        <Divider style={{ margin: '8px 0' }} />

        {/* 预览区域 */}
        <div style={{
          backgroundColor: '#fafafa',
          borderRadius: 4,
          padding: '8px 12px',
          border: '1px solid #e8e8e8'
        }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <strong>排除规则预览：</strong>
          </Text>
          <div style={{ marginTop: 4 }}>
            {excludeConditions.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {getPreviewText()}
              </Text>
            ) : (
              <Text style={{ fontSize: 12, whiteSpace: 'pre-line' }}>
                {getPreviewText()}
              </Text>
            )}
          </div>
          {excludeConditions.length > 1 && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                满足任一条件即排除
              </Text>
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
};
