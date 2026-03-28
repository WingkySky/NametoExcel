import { useTranslation } from 'react-i18next';
import { Button, Layout, List, Card, Space, Typography, message, Switch, Divider } from 'antd';
import { SunOutlined, MoonOutlined, FolderOpenOutlined, ExportOutlined, SyncOutlined, ClearOutlined } from '@ant-design/icons';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from './store/useAppStore';
import { ExcludePatternsPanel } from './components';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const { t, i18n } = useTranslation();
  const {
    selectedDirectory,
    setSelectedDirectory,
    excludeTags,
    addExcludeTag,
    removeExcludeTag,
    clearExcludeTags,
    tagHistory,
    clearTagHistory,
    removeExtension,
    setRemoveExtension,
    extractedNames,
    setExtractedNames,
    theme,
    toggleTheme,
    setIsLoading,
  } = useAppStore();

  /* 提取名称 - 将标签列表发送给后端 */
  const extractNames = async (directory: string, tags: string[], removeExt: boolean) => {
    try {
      setIsLoading(true);
      const names = await invoke<string[]>('get_unique_names', {
        directory,
        excludeTags: tags,
        removeExtension: removeExt,
      });
      setExtractedNames(names);
    } catch (error) {
      message.error(String(error));
      setExtractedNames([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* 选择目录 - 自动生成预览 */
  const handleSelectDirectory = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });
      if (selected) {
        setSelectedDirectory(selected as string);
        await extractNames(selected as string, excludeTags, removeExtension);
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  /* 更新预览按钮 - 手动重新计算 */
  const handleUpdatePreview = async () => {
    if (!selectedDirectory) {
      message.warning(t('app.noDirectorySelected'));
      return;
    }
    await extractNames(selectedDirectory, excludeTags, removeExtension);
  };

  /* 重置条件按钮 */
  const handleResetConditions = () => {
    clearExcludeTags();
    setExtractedNames([]);
  };

  /* 导出 Excel */
  const handleExport = async () => {
    if (!extractedNames.length) {
      message.warning(t('app.noNamesExtracted'));
      return;
    }
    if (!selectedDirectory) {
      message.warning(t('app.noDirectorySelected'));
      return;
    }
    try {
      const filePath = await save({
        defaultPath: 'names.xlsx',
        filters: [{ name: 'Excel', extensions: ['xlsx'] }],
      });
      if (filePath) {
        await invoke('export_to_excel', {
          names: extractedNames,
          outputPath: filePath,
          sourceDirectory: selectedDirectory,
        });
        message.success(t('app.exportSuccess'));
      }
    } catch (error) {
      const errorStr = String(error);
      if (errorStr.includes('ERROR_EXPORT_TO_SOURCE_DIR')) {
        message.error(t('app.exportToSourceDirError'));
      } else {
        message.error(t('app.exportError', { error: errorStr }));
      }
    }
  };

  /* 语言切换 */
  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Title
          level={3}
          style={{ color: '#fff', margin: 0, lineHeight: '64px' }}
        >
          {t('app.title')}
        </Title>
        <Space>
          <Button
            type="text"
            icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ color: '#fff' }}
          />
          <Button
            type="text"
            onClick={handleLanguageToggle}
            style={{ color: '#fff' }}
          >
            {i18n.language.toUpperCase()}
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px 50px' }}>
        {/* 目录选择卡片 */}
        <Card title={t('app.selectDirectory')} style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Button
              type="primary"
              icon={<FolderOpenOutlined />}
              onClick={handleSelectDirectory}
            >
              {t('app.selectDirectory')}
            </Button>
            {selectedDirectory && (
              <Text>
                {t('app.selectedPath')}: {selectedDirectory}
              </Text>
            )}
          </Space>
        </Card>

        {/* 排除词条面板 */}
        <ExcludePatternsPanel
          tags={excludeTags}
          onAddTag={addExcludeTag}
          onRemoveTag={removeExcludeTag}
          onClearAll={clearExcludeTags}
          tagHistory={tagHistory}
          onClearHistory={clearTagHistory}
        />

        {/* 操作按钮区域 */}
        <Card style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 去除扩展名开关 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch
                checked={removeExtension}
                onChange={(checked) => setRemoveExtension(checked)}
              />
              <Text>去除文件扩展名</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                （如 "张三.pdf" → "张三"）
              </Text>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <Space wrap size="middle" style={{ justifyContent: 'center', width: '100%' }}>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={handleUpdatePreview}
                disabled={!selectedDirectory}
              >
                更新预览
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={handleResetConditions}
              >
                重置条件
              </Button>
            </Space>
          </Space>
        </Card>

        {/* 提取结果列表卡片 */}
        <Card
          title={`${t('app.extractedNames')} (${t('app.nameCount', { count: extractedNames.length })})`}
          style={{ marginBottom: 24 }}
        >
          {extractedNames.length > 0 ? (
            <List
              bordered
              dataSource={extractedNames}
              style={{ maxHeight: 300, overflow: 'auto' }}
              renderItem={(item) => (
                <List.Item>
                  {item}
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">{t('app.noNamesExtracted')}</Text>
          )}
        </Card>

        <Button
          type="primary"
          size="large"
          icon={<ExportOutlined />}
          onClick={handleExport}
          disabled={extractedNames.length === 0}
          block
        >
          {t('app.export')}
        </Button>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {t('app.footer')}
      </Footer>
    </Layout>
  );
}

export default App;
