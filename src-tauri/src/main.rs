#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use regex::Regex;
use std::collections::HashSet;
use std::fs;
use tauri::command;
use xlsxwriter::Workbook;

/* 将用户输入的字符串转换为正则表达式模式（转义特殊字符） */
fn escape_regex(s: &str) -> String {
    let special_chars = ['.', '\\', '+', '*', '?', '(', ')', '[', ']', '{', '}', '^', '$', '|', ' '];
    let mut result = String::new();
    for ch in s.chars() {
        if special_chars.contains(&ch) {
            result.push('\\');
        }
        result.push(ch);
    }
    result
}

/* 从文件名中提取有效名称（去除排除词条后的结果） */
fn extract_name_with_tags(
    filename: &str,
    exclude_tags: &[String],
    remove_extension: bool,
) -> Option<String> {
    /* 获取文件基础名（去除扩展名或完整文件名） */
    let base_name = if remove_extension {
        match filename.rfind('.') {
            Some(pos) if pos > 0 => &filename[..pos],
            _ => &filename,
        }
    } else {
        filename
    };

    if base_name.is_empty() {
        return None;
    }

    let mut result = base_name.to_string();

    /* 遍历每个排除词条，将其从文件名中移除 */
    for tag in exclude_tags {
        if tag.is_empty() {
            continue;
        }
        let escaped = escape_regex(tag);
        let pattern = format!("(?i){}", escaped);
        if let Ok(re) = Regex::new(&pattern) {
            result = re.replace_all(&result, "").to_string();
        }
    }

    let trimmed = result.trim().to_string();
    if trimmed.is_empty() {
        None
    } else {
        Some(trimmed)
    }
}

#[command]
fn get_unique_names(
    directory: String,
    exclude_tags: Vec<String>,
    remove_extension: Option<bool>,
) -> Result<Vec<String>, String> {
    let remove_ext = remove_extension.unwrap_or(true);

    let entries = fs::read_dir(&directory).map_err(|e| format!("Failed to read directory: {}", e))?;

    let mut names: HashSet<String> = HashSet::new();

    for entry in entries.flatten() {
        if entry.file_type().map(|ft| ft.is_file()).unwrap_or(false) {
            if let Some(filename) = entry.file_name().to_str() {
                if let Some(name) = extract_name_with_tags(filename, &exclude_tags, remove_ext) {
                    if !name.is_empty() {
                        names.insert(name);
                    }
                }
            }
        }
    }

    let mut sorted_names: Vec<String> = names.into_iter().collect();
    sorted_names.sort();
    Ok(sorted_names)
}

#[command]
fn export_to_excel(names: Vec<String>, output_path: String, source_directory: Option<String>) -> Result<(), String> {
    use std::path::Path;

    let path = Path::new(&output_path);

    if let Some(ref src_dir) = source_directory {
        let src_path = Path::new(src_dir);
        if let Some(parent) = path.parent() {
            if parent.starts_with(src_path) {
                return Err("ERROR_EXPORT_TO_SOURCE_DIR".to_string());
            }
        }
    }

    if let Some(parent) = path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create output directory '{}': {}", parent.display(), e))?;
        }
    }

    if path.exists() {
        fs::remove_file(path)
            .map_err(|e| format!("Failed to remove existing file '{}': {}. Please close the file if it's open.", output_path, e))?;
    }

    let temp_path = format!("{}.tmp", output_path);

    let workbook = Workbook::new(&temp_path)
        .map_err(|e| format!("Failed to create workbook at '{}': {}", temp_path, e))?;
    let mut sheet = workbook.add_worksheet(None)
        .map_err(|e| format!("Failed to add worksheet: {}", e))?;

    sheet.write_string(0, 0, "Names", None)
        .map_err(|e| format!("Failed to write header: {}", e))?;

    for (index, name) in names.iter().enumerate() {
        sheet.write_string((index + 1) as u32, 0, name, None)
            .map_err(|e| format!("Failed to write name at row {}: {}", index + 1, e))?;
    }

    workbook.close()
        .map_err(|e| format!("Failed to close workbook: {}. Path: '{}'", e, temp_path))?;

    fs::rename(&temp_path, path)
        .map_err(|e| format!("Failed to rename temp file to '{}': {}", output_path, e))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            get_unique_names,
            export_to_excel
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
