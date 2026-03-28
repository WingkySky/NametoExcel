use std::fs::File;
use std::io::Write;
use std::path::Path;

fn main() {
    let icon_path = Path::new("icons/icon.png");
    let temp_created = if !icon_path.exists() {
        let mut file = File::create(icon_path).expect("Failed to create icon.png");
        let png_data = create_simple_png();
        file.write_all(&png_data).expect("Failed to write icon.png");
        true
    } else {
        false
    };
    
    tauri_build::build();
    
    if temp_created {
        let _ = std::fs::remove_file(icon_path);
    }
}

fn create_simple_png() -> Vec<u8> {
    let mut data = Vec::new();
    
    data.extend_from_slice(b"\x89PNG\r\n\x1a\n");
    
    let ihdr_data = [
        0x00, 0x00, 0x01, 0x00,
        0x00, 0x00, 0x01, 0x00,
        0x08, 0x06, 0x00, 0x00, 0x00,
    ];
    write_chunk(&mut data, b"IHDR", &ihdr_data);
    
    let idat_data = [
        0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01,
    ];
    write_chunk(&mut data, b"IDAT", &idat_data);
    
    write_chunk(&mut data, b"IEND", &[]);
    
    data
}

fn write_chunk(data: &mut Vec<u8>, chunk_type: &[u8], chunk_data: &[u8]) {
    let len = chunk_data.len() as u32;
    data.extend_from_slice(&len.to_be_bytes());
    
    let mut crc_data = Vec::new();
    crc_data.extend_from_slice(chunk_type);
    crc_data.extend_from_slice(chunk_data);
    let crc = crc32(&crc_data);
    
    data.extend_from_slice(chunk_type);
    data.extend_from_slice(chunk_data);
    data.extend_from_slice(&crc.to_be_bytes());
}

fn crc32(data: &[u8]) -> u32 {
    let mut crc: u32 = 0xFFFFFFFF;
    for &byte in data {
        crc ^= byte as u32;
        for _ in 0..8 {
            let mask = (crc & 1) as u32;
            crc >>= 1;
            if mask != 0 {
                crc ^= 0xEDB88320;
            }
        }
    }
    !crc
}
