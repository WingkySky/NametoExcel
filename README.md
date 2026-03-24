# NameToExcel / 文件名提取工具

<div align="center">
  <a href="#english-version">English Version</a> | <a href="#chinese-version">中文版</a>
</div>

---

## English Version

A modern cross-platform desktop application that extracts names from filenames and exports them to Excel files.

### Features

- 📁 **Directory Selection**: Easily select the source directory containing files
- 🔍 **Smart Name Extraction**: Extracts names from filenames with customizable exclude patterns
- 📝 **Exclude Patterns**: Define patterns to exclude from name extraction (e.g., numbers, "社保证明", etc.)
- 📊 **Preview Results**: Real-time preview of extracted names with count
- 📄 **Excel Export**: Export extracted names to .xlsx format
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🌍 **Bilingual Support**: Chinese and English interface

### Tech Stack

- **Framework**: Tauri 2.x (Rust + WebView)
- **Frontend**: React 18 + TypeScript
- **UI Library**: Ant Design 5.x
- **State Management**: Zustand 5.x
- **Build Tool**: Vite 5.x
- **Internationalization**: i18next + react-i18next

### System Requirements

- Windows 10/11 or macOS 10.15+
- No additional runtime required

### Quick Start

#### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### Build for Production

```bash
# Build production version
npm run tauri build

# Build artifacts located at
src-tauri/target/release/bundle/
```

### Usage

1. **Select Source Directory**: Click "选择源目录" to choose the folder containing your files
2. **Configure Exclude Patterns**: Enter patterns to exclude (comma-separated), e.g., `数字, 社保证明, _backup`
3. **Preview Results**: View extracted names in the preview list
4. **Export to Excel**: Click "导出 Excel" to save the extracted names to a .xlsx file

### Project Structure

```
nametoexcel/
├── src/                      # React frontend source
│   ├── store/               # Zustand state management
│   ├── i18n/                 # Internationalization
│   │   ├── index.ts         # i18n configuration
│   │   └── locales/         # Translation files
│   │       ├── zh.json      # Chinese translations
│   │       └── en.json      # English translations
│   ├── App.tsx              # Main application component
│   └── main.tsx            # Entry point
├── src-tauri/               # Rust backend source
│   ├── src/                # Rust source code
│   │   ├── lib.rs          # Tauri commands implementation
│   │   └── main.rs         # Main application entry
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri app configuration
└── dist/                    # Built frontend assets
```

---

## Chinese Version / 中文版

一个现代化的跨平台桌面应用程序，用于从文件名中提取人名并导出到 Excel 文件。

### 功能特性

- 📁 **目录选择**：轻松选择包含文件的源目录
- 🔍 **智能人名提取**：从文件名中提取人名，支持自定义排除模式
- 📝 **排除模式**：定义要排除的模式（如数字、"社保证明"等）
- 📊 **结果预览**：实时预览提取的人名及数量
- 📄 **Excel 导出**：将提取的人名导出为 .xlsx 格式
- 🌙 **深色模式**：在浅色和深色主题之间切换
- 🌍 **双语支持**：中英文界面

### 技术栈

- **框架**：Tauri 2.x（Rust + WebView）
- **前端**：React 18 + TypeScript
- **UI 库**：Ant Design 5.x
- **状态管理**：Zustand 5.x
- **构建工具**：Vite 5.x
- **国际化**：i18next + react-i18next

### 系统要求

- Windows 10/11 或 macOS 10.15+
- 无需额外的运行时环境

### 快速开始

#### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 生产构建

```bash
# 构建生产版本
npm run tauri build

# 构建产物位于
src-tauri/target/release/bundle/
```

### 使用说明

1. **选择源目录**：点击"选择源目录"按钮，选择包含文件的文件夹
2. **配置排除模式**：输入要排除的模式（逗号分隔），例如：`数字, 社保证明, _backup`
3. **预览结果**：在预览列表中查看提取的人名
4. **导出到 Excel**：点击"导出 Excel"按钮，将提取的人名保存为 .xlsx 文件

### 项目结构

```
nametoexcel/
├── src/                      # React 前端源码
│   ├── store/               # Zustand 状态管理
│   ├── i18n/                 # 国际化配置
│   │   ├── index.ts         # i18n 配置
│   │   └── locales/         # 翻译文件
│   │       ├── zh.json      # 中文翻译
│   │       └── en.json      # 英文翻译
│   ├── App.tsx              # 主应用组件
│   └── main.tsx            # 入口文件
├── src-tauri/               # Rust 后端源码
│   ├── src/                # Rust 源代码
│   │   ├── lib.rs          # Tauri 命令实现
│   │   └── main.rs         # 应用主入口
│   ├── Cargo.toml           # Rust 依赖配置
│   └── tauri.conf.json      # Tauri 应用配置
└── dist/                    # 前端构建产物
```

## License / 许可证

MIT License
