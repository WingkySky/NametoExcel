# NameToExcel / 文件名提取工具

[English](README.md) | 中文

---

一个现代化的跨平台桌面应用程序，用于从文件名中提取人名并导出到 Excel 文件。

[英文版](README.md)

### 功能特性

- 📁 **目录选择**：轻松选择包含文件的源目录
- 🔍 **智能人名提取**：从文件名中提取人名，支持自定义排除词条
- 📝 **排除词条**：添加要从人名提取中排除的词条（如"备份"、"副本"、"_temp"等）
- 📋 **历史记录**：自动保存你使用过的排除词条，方便快速复用
- ⚡ **快捷词条**：常用词条（备份、副本、_temp、copy）一键添加
- 📄 **扩展名开关**：可选择保留或去除文件扩展名
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

1. **选择源目录**：点击目录选择按钮，选择包含文件的文件夹
2. **添加排除词条**：
   - 在输入框中输入词条，按回车或点击"添加"按钮
   - 点击快捷词条（备份、副本、_temp、copy）一键添加
   - 使用历史记录快速复用之前用过的词条
3. **扩展名开关**：选择是否保留文件扩展名
4. **预览结果**：在预览列表中查看提取的人名
5. **导出到 Excel**：点击导出按钮，将提取的人名保存为 .xlsx 文件

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

## 许可证

MIT License
