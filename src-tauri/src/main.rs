#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            crate::extract_name_with_patterns,
            crate::get_unique_names,
            crate::export_to_excel
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}