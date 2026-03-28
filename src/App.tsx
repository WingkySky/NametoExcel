import { useTranslation } from 'react-i18next';
import { Button, Layout, Input, List, Card, Space, Typography, message } from 'antd';
import { SunOutlined, MoonOutlined, FolderOpenOutlined, ExportOutlined } from '@ant-design/icons';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore } from './store/useAppStore';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const { t, i18n } = useTranslation();
  const {
    selectedDirectory,
    setSelectedDirectory,
    excludePatterns,
    setExcludePatterns,
    extractedNames,
    setExtractedNames,
    theme,
    toggleTheme,
    setIsLoading,
  } = useAppStore();

  const handleSelectDirectory = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });
      if (selected) {
        setSelectedDirectory(selected as string);
        await handleExtractNames(selected as string);
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  const handleExtractNames = async (directory: string) => {
    try {
      setIsLoading(true);
      const patterns = excludePatterns
        ? excludePatterns.split(',').map((p) => p.trim()).filter((p) => p)
        : [];
      const names = await invoke<string[]>('get_unique_names', {
        directory,
        excludePatterns: patterns,
      });
      setExtractedNames(names);
    } catch (error) {
      message.error(String(error));
      setExtractedNames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatternChange = async (value: string) => {
    setExcludePatterns(value);
    if (selectedDirectory) {
      const patterns = value
        ? value.split(',').map((p) => p.trim()).filter((p) => p)
        : [];
      try {
        setIsLoading(true);
        const names = await invoke<string[]>('get_unique_names', {
          directory: selectedDirectory,
          excludePatterns: patterns,
        });
        setExtractedNames(names);
      } catch (error) {
        message.error(String(error));
        setExtractedNames([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      // 根据错误码显示对应的国际化提示
      if (errorStr.includes('ERROR_EXPORT_TO_SOURCE_DIR')) {
        message.error(t('app.exportToSourceDirError'));
      } else {
        message.error(t('app.exportError', { error: errorStr }));
      }
    }
  };

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

        <Card title={t('app.excludePatterns')} style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input
              placeholder={t('app.excludePatternsPlaceholder')}
              value={excludePatterns}
              onChange={(e) => handlePatternChange(e.target.value)}
            />
            <Text type="secondary">{t('app.excludePatternsHint')}</Text>
          </Space>
        </Card>

        {/* 提取到的名称列表卡片 - 显示提取的名称数量和列表 */}
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