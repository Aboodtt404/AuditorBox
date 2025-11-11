use candid::{Principal, encode_args};
use ic_cdk::api::time;
use calamine::{Reader, open_workbook_from_rs, Xlsx, Data};
use std::io::Cursor;
use std::collections::HashSet;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_dataset_id, STORAGE};
use crate::types::{
    ColumnMetadata, ColumnType, ImportExcelRequest, ImportedDataset, PIIDetection, Result,
    SheetData,
};

// Import Excel file
pub fn import_excel(caller: Principal, req: ImportExcelRequest) -> Result<ImportedDataset> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_import_data(&user) {
        return Err("Insufficient permissions to import data".to_string());
    }

    // Parse Excel file
    let cursor = Cursor::new(&req.file_data);
    let mut workbook: Xlsx<_> = open_workbook_from_rs(cursor)
        .map_err(|e| format!("Failed to open Excel file: {}", e))?;

    let sheet_names = workbook.sheet_names().to_vec();
    let mut sheets = Vec::new();

    for sheet_name in sheet_names {
        if let Ok(range) = workbook.worksheet_range(&sheet_name) {
            let sheet_data = process_sheet(&sheet_name, &range)?;
            sheets.push(sheet_data);
        }
    }

    let dataset = ImportedDataset {
        id: next_dataset_id(),
        name: req.name.clone(),
        engagement_id: req.engagement_id,
        file_name: req.file_name.clone(),
        file_size: req.file_data.len() as u64,
        sheets,
        version: 1,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .datasets
            .insert(dataset.id, dataset.clone());
    });

    log_activity(
        caller,
        "import_excel".to_string(),
        "dataset".to_string(),
        dataset.id.to_string(),
        format!("Dataset {} imported from {}", dataset.id, dataset.file_name),
        encode_args((dataset.clone(),)).ok(),
    );

    Ok(dataset)
}

// Process a single sheet
fn process_sheet(
    sheet_name: &str,
    range: &calamine::Range<Data>,
) -> Result<SheetData> {
    let (height, width) = range.get_size();
    
    if height == 0 || width == 0 {
        return Ok(SheetData {
            name: sheet_name.to_string(),
            columns: Vec::new(),
            row_count: 0,
            data: Vec::new(),
        });
    }

    let max_rows_to_store = 100.min(height);
    let max_rows_to_analyze = 50.min(height - 1);

    let mut headers = Vec::new();
    for col_idx in 0..width {
        let cell = range.get((0, col_idx));
        let header = match cell {
            Some(Data::String(s)) => s.clone(),
            Some(Data::Int(i)) => i.to_string(),
            Some(Data::Float(f)) => f.to_string(),
            Some(Data::Bool(b)) => b.to_string(),
            Some(Data::DateTime(dt)) => format!("{}", dt),
            Some(Data::DateTimeIso(dt)) => dt.clone(),
            Some(Data::DurationIso(d)) => d.clone(),
            _ => format!("Column_{}", col_idx + 1),
        };
        headers.push(header);
    }

    let mut data_rows = Vec::new();
    for row_idx in 1..max_rows_to_store {
        if row_idx >= height {
            break;
        }
        let mut row = Vec::new();
        for col_idx in 0..width {
            let cell = range.get((row_idx, col_idx));
            let value = cell_to_string(cell);
            row.push(value);
        }
        data_rows.push(row);
    }

    let mut columns = Vec::new();
    for (col_idx, header) in headers.iter().enumerate() {
        let mut column_data: Vec<String> = Vec::new();
        for row_idx in 1..=max_rows_to_analyze {
            if row_idx >= height {
                break;
            }
            let cell = range.get((row_idx, col_idx));
            column_data.push(cell_to_string(cell));
        }

        let metadata = analyze_column(header.clone(), column_data)?;
        columns.push(metadata);
    }

    Ok(SheetData {
        name: sheet_name.to_string(),
        columns,
        row_count: (height - 1) as u64,
        data: data_rows,
    })
}

// Convert cell to string
fn cell_to_string(cell: Option<&Data>) -> String {
    match cell {
        Some(Data::String(s)) => s.clone(),
        Some(Data::Int(i)) => i.to_string(),
        Some(Data::Float(f)) => f.to_string(),
        Some(Data::Bool(b)) => b.to_string(),
        Some(Data::DateTime(dt)) => format!("{}", dt),
        Some(Data::DateTimeIso(dt)) => dt.clone(),
        Some(Data::DurationIso(d)) => d.clone(),
        Some(Data::Empty) | None => String::new(),
        Some(Data::Error(e)) => format!("ERROR: {:?}", e),
    }
}

// Analyze column data
fn analyze_column(name: String, data: Vec<String>) -> Result<ColumnMetadata> {
    let total_count = data.len();
    let null_count = data.iter().filter(|s| s.is_empty()).count();
    let null_percent = if total_count > 0 {
        (null_count as f64 / total_count as f64) * 100.0
    } else {
        0.0
    };

    let non_empty: Vec<&String> = data.iter().filter(|s| !s.is_empty()).collect();
    
    let sample_for_unique = non_empty.iter().take(50);
    let unique_set: HashSet<_> = sample_for_unique.collect();
    let unique_count = unique_set.len() as u64;

    let detected_type = detect_column_type(&non_empty);

    let (min_value, max_value) = get_min_max_simple(&non_empty, &detected_type);

    let sample_values: Vec<String> = non_empty
        .iter()
        .take(5)
        .map(|s| (*s).clone())
        .collect();

    let pii_detection = detect_pii_simple(&non_empty);

    Ok(ColumnMetadata {
        name: name.clone(),
        original_name: name,
        detected_type,
        null_percent,
        unique_count,
        min_value,
        max_value,
        sample_values,
        pii_detection,
    })
}

fn detect_column_type(values: &[&String]) -> ColumnType {
    if values.is_empty() {
        return ColumnType::Text;
    }

    let sample_size = values.len().min(20);
    let mut numeric_count = 0;
    let mut currency_count = 0;

    for value in values.iter().take(sample_size) {
        if value.contains('$') || value.contains('€') || value.contains('£') || value.contains('¥') {
            currency_count += 1;
            continue;
        }

        let clean_value = value.replace(",", "").replace(" ", "");
        if clean_value.parse::<f64>().is_ok() {
            numeric_count += 1;
        }
    }

    let threshold = sample_size as f64 * 0.6;

    if currency_count as f64 >= threshold {
        ColumnType::Currency
    } else if numeric_count as f64 >= threshold {
        ColumnType::Numeric
    } else {
        ColumnType::Text
    }
}

fn get_min_max_simple(values: &[&String], col_type: &ColumnType) -> (String, String) {
    if values.is_empty() {
        return (String::new(), String::new());
    }

    let sample = values.iter().take(20);

    match col_type {
        ColumnType::Numeric | ColumnType::Currency => {
            let mut min = f64::INFINITY;
            let mut max = f64::NEG_INFINITY;
            
            for value in sample {
                let clean = value.replace(",", "").replace("$", "")
                    .replace("€", "").replace("£", "").replace("¥", "")
                    .replace(" ", "");
                if let Ok(num) = clean.parse::<f64>() {
                    if num < min { min = num; }
                    if num > max { max = num; }
                }
            }
            
            if min == f64::INFINITY {
                (String::new(), String::new())
            } else {
            (min.to_string(), max.to_string())
            }
        }
        _ => {
            (String::new(), String::new())
        }
    }
}

fn detect_pii_simple(values: &[&String]) -> PIIDetection {
    let mut has_emails = false;
    let mut has_phones = false;

    for value in values.iter().take(10) {
        if value.contains('@') && value.contains('.') {
            has_emails = true;
        }
        if value.contains("(") && value.contains(")") && value.chars().filter(|c| c.is_numeric()).count() >= 7 {
            has_phones = true;
        }
        if has_emails && has_phones {
            break;
        }
    }

    PIIDetection {
        has_names: false,
        has_emails,
        has_phone_numbers: has_phones,
        has_national_ids: false,
    }
}

// Get dataset by ID
pub fn get_dataset(caller: Principal, id: u64) -> Result<ImportedDataset> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().datasets.get(&id))
        .ok_or_else(|| "Dataset not found".to_string())
}

// List all datasets
pub fn list_datasets(caller: Principal) -> Result<Vec<ImportedDataset>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let datasets = STORAGE.with(|storage| {
        storage
            .borrow()
            .datasets
            .iter()
            .map(|(_, dataset)| dataset)
            .collect()
    });

    Ok(datasets)
}

// List datasets by engagement
pub fn list_datasets_by_engagement(caller: Principal, engagement_id: u64) -> Result<Vec<ImportedDataset>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let datasets = STORAGE.with(|storage| {
        storage
            .borrow()
            .datasets
            .iter()
            .filter(|(_, dataset)| dataset.engagement_id == Some(engagement_id))
            .map(|(_, dataset)| dataset)
            .collect()
    });

    Ok(datasets)
}


