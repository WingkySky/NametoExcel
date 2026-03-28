#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use regex::Regex;
use std::collections::HashSet;
use std::fs;
use tauri::command;
use xlsxwriter::Workbook;

#[command]
fn extract_name_with_patterns(filename: String, exclude_patterns: Vec<String>) -> String {
    let base_name = match filename.rfind('.') {
        Some(pos) if pos > 0 => &filename[..pos],
        _ => &filename,
    };

    let mut result = base_name.to_string();
    for pattern in exclude_patterns {
        if let Ok(re) = Regex::new(&format!("(?i){}", pattern)) {
            result = re.replace_all(&result, "").to_string();
        }
    }
    result
}

#[command]
fn get_unique_names(directory: String, exclude_patterns: Vec<String>) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(&directory).map_err(|e| format!("Failed to read directory: {}", e))?;

    let mut names: HashSet<String> = HashSet::new();

    for entry in entries.flatten() {
        if entry.file_type().map(|ft| ft.is_file()).unwrap_or(false) {
            if let Some(filename) = entry.file_name().to_str() {
                let name = extract_name_with_patterns(filename.to_string(), exclude_patterns.clone());
                if !name.is_empty() {
                    names.insert(name);
                }
            }
        }
    }

    let mut sorted_names: Vec<String> = names.into_iter().collect();
    sorted_names.sort();
    Ok(sorted_names)
}

#[command]
fn export_to_excel(names: Vec<String>, output_path: String) -> Result<(), String> {
    // 检查输出目录是否存在，如果不存在则创建
    if let Some(parent) = std::path::Path::new(&output_path).parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create output directory: {}", e))?;
        }
    }

    // 创建 Excel 工作簿
    let workbook = Workbook::new(&output_path)
        .map_err(|e| format!("Failed to create workbook at '{}': {}", output_path, e))?;
    let mut sheet = workbook.add_worksheet(None)
        .map_err(|e| format!("Failed to add worksheet: {}", e))?;

    // 写入表头
    sheet.write_string(0, 0, "Names", None)
        .map_err(|e| format!("Failed to write header: {}", e))?;

    // 写入数据
    for (index, name) in names.iter().enumerate() {
        sheet.write_string((index + 1) as u32, 0, name, None)
            .map_err(|e| format!("Failed to write name at row {}: {}", index + 1, e))?;
    }

    // 关闭工作簿
    workbook.close()
        .map_err(|e| format!("Failed to close workbook: {}. Path: '{}'", e, output_path))?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            extract_name_with_patterns,
            get_unique_names,
            export_to_excel
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
