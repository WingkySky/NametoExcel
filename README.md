# NameToExcel

[English](README.md) | [中文](README_zh.md)

---

A modern cross-platform desktop application that extracts names from filenames and exports them to Excel files.

[Chinese Version](README_zh.md)

### Features

- 📁 **Directory Selection**: Easily select the source directory containing files
- 🔍 **Smart Name Extraction**: Extracts names from filenames with customizable exclude patterns
- 📝 **Exclude Tags**: Add tags to exclude from name extraction (e.g., "备份", "副本", "_temp", etc.)
- 📋 **Tag History**: Automatically saves your used exclude tags for quick reuse
- ⚡ **Quick Tags**: Common tags (backup, copy, _temp) for one-click adding
- 📄 **File Extension Toggle**: Option to keep or remove file extensions
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

1. **Select Source Directory**: Click the directory selection button to choose the folder containing your files
2. **Add Exclude Tags**:
   - Type tags in the input field and press Enter or click "Add"
   - Click quick tags (backup, copy, _temp) for one-click adding
   - Use tag history to quickly reuse previous tags
3. **Toggle File Extension**: Choose whether to keep or remove file extensions
4. **Preview Results**: View extracted names in the preview list
5. **Export to Excel**: Click the export button to save the extracted names to a .xlsx file

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

## License

MIT License
