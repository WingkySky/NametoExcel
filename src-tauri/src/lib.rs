use regex::Regex;
use std::collections::HashSet;
use std::fs;
use tauri::command;
use xlsxwriter::Workbook;

#[command]
pub fn extract_name_with_patterns(filename: String, exclude_patterns: Vec<String>) -> String {
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
pub fn get_unique_names(directory: String, exclude_patterns: Vec<String>) -> Result<Vec<String>, String> {
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
pub fn export_to_excel(names: Vec<String>, output_path: String) -> Result<(), String> {
    let workbook = Workbook::new(&output_path).map_err(|e| format!("Failed to create workbook: {}", e))?;
    let mut sheet = workbook.add_worksheet(None).map_err(|e| format!("Failed to add worksheet: {}", e))?;

    sheet.write_string(0, 0, "Names", None).map_err(|e| format!("Failed to write header: {}", e))?;

    for (index, name) in names.iter().enumerate() {
        sheet.write_string((index + 1) as u32, 0, name, None)
            .map_err(|e| format!("Failed to write name at row {}: {}", index + 1, e))?;
    }

    workbook.close().map_err(|e| format!("Failed to close workbook: {}", e))?;
    Ok(())
}