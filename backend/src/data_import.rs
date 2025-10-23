use candid::Principal;
use ic_cdk::api::time;
use calamine::{Reader, open_workbook_from_rs, Xlsx, Data};
use std::io::Cursor;
use regex::Regex;
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
        "IMPORT".to_string(),
        "Dataset".to_string(),
        dataset.id.to_string(),
        format!("Imported dataset: {}", req.name),
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

    // Extract headers (first row)
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

    // Extract data (skip header row)
    let mut data_rows = Vec::new();
    for row_idx in 1..height {
        let mut row = Vec::new();
        for col_idx in 0..width {
            let cell = range.get((row_idx, col_idx));
            let value = cell_to_string(cell);
            row.push(value);
        }
        data_rows.push(row);
    }

    // Analyze columns
    let mut columns = Vec::new();
    for (col_idx, header) in headers.iter().enumerate() {
        let column_data: Vec<String> = data_rows
            .iter()
            .map(|row| row.get(col_idx).unwrap_or(&String::new()).clone())
            .collect();

        let metadata = analyze_column(header.clone(), column_data)?;
        columns.push(metadata);
    }

    Ok(SheetData {
        name: sheet_name.to_string(),
        columns,
        row_count: (height - 1) as u64, // Exclude header
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

    // Get non-empty values
    let non_empty: Vec<&String> = data.iter().filter(|s| !s.is_empty()).collect();
    
    // Count unique values
    let unique_set: HashSet<&String> = non_empty.iter().cloned().collect();
    let unique_count = unique_set.len() as u64;

    // Detect column type
    let detected_type = detect_column_type(&non_empty);

    // Get min/max values
    let (min_value, max_value) = get_min_max(&non_empty, &detected_type);

    // Get sample values (up to 5)
    let sample_values: Vec<String> = non_empty
        .iter()
        .take(5)
        .map(|s| (*s).clone())
        .collect();

    // Detect PII
    let pii_detection = detect_pii(&non_empty);

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

// Detect column type
fn detect_column_type(values: &[&String]) -> ColumnType {
    if values.is_empty() {
        return ColumnType::Text;
    }

    let mut numeric_count = 0;
    let mut date_count = 0;
    let mut boolean_count = 0;
    let mut currency_count = 0;

    for value in values.iter().take(100) {
        // Check for boolean
        let lower = value.to_lowercase();
        if lower == "true" || lower == "false" || lower == "yes" || lower == "no" 
           || lower == "1" || lower == "0" {
            boolean_count += 1;
            continue;
        }

        // Check for currency (contains currency symbols)
        if value.contains('$') || value.contains('€') || value.contains('£') 
           || value.contains('¥') {
            currency_count += 1;
            continue;
        }

        // Check for numeric
        let clean_value = value.replace(",", "").replace(" ", "");
        if clean_value.parse::<f64>().is_ok() {
            numeric_count += 1;
            continue;
        }

        // Check for date patterns
        if is_date_like(value) {
            date_count += 1;
        }
    }

    let sample_size = values.len().min(100);
    let threshold = sample_size as f64 * 0.7; // 70% threshold

    if currency_count as f64 >= threshold {
        ColumnType::Currency
    } else if boolean_count as f64 >= threshold {
        ColumnType::Boolean
    } else if numeric_count as f64 >= threshold {
        ColumnType::Numeric
    } else if date_count as f64 >= threshold {
        ColumnType::Date
    } else {
        ColumnType::Text
    }
}

// Check if string looks like a date
fn is_date_like(s: &str) -> bool {
    // Simple date pattern matching
    let date_patterns = vec![
        r"\d{4}-\d{2}-\d{2}",           // 2023-12-31
        r"\d{2}/\d{2}/\d{4}",           // 12/31/2023
        r"\d{2}-\d{2}-\d{4}",           // 12-31-2023
        r"\d{4}/\d{2}/\d{2}",           // 2023/12/31
    ];

    for pattern in date_patterns {
        if let Ok(re) = Regex::new(pattern) {
            if re.is_match(s) {
                return true;
            }
        }
    }
    false
}

// Get min and max values
fn get_min_max(values: &[&String], col_type: &ColumnType) -> (String, String) {
    if values.is_empty() {
        return (String::new(), String::new());
    }

    match col_type {
        ColumnType::Numeric | ColumnType::Currency => {
            let mut numbers: Vec<f64> = Vec::new();
            for value in values {
                let clean = value.replace(",", "").replace("$", "")
                    .replace("€", "").replace("£", "").replace("¥", "")
                    .replace(" ", "");
                if let Ok(num) = clean.parse::<f64>() {
                    numbers.push(num);
                }
            }
            
            if numbers.is_empty() {
                return (String::new(), String::new());
            }

            let min = numbers.iter().cloned().fold(f64::INFINITY, f64::min);
            let max = numbers.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
            (min.to_string(), max.to_string())
        }
        _ => {
            // For text/date, use lexicographic ordering
            let mut sorted: Vec<&String> = values.to_vec();
            sorted.sort();
            (
                sorted.first().unwrap_or(&&String::new()).to_string(),
                sorted.last().unwrap_or(&&String::new()).to_string(),
            )
        }
    }
}

// Detect PII in column data
fn detect_pii(values: &[&String]) -> PIIDetection {
    let email_re = Regex::new(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}").unwrap();
    let phone_re = Regex::new(r"(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}").unwrap();
    let name_re = Regex::new(r"^[A-Z][a-z]+\s[A-Z][a-z]+").unwrap();
    
    let mut has_emails = false;
    let mut has_phones = false;
    let mut has_names = false;

    for value in values.iter().take(50) {
        if email_re.is_match(value) {
            has_emails = true;
        }
        if phone_re.is_match(value) {
            has_phones = true;
        }
        if name_re.is_match(value) {
            has_names = true;
        }
    }

    PIIDetection {
        has_names,
        has_emails,
        has_phone_numbers: has_phones,
        has_national_ids: false, // Would need country-specific patterns
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

