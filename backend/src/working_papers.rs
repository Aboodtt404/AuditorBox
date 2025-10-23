use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::data_import;
use crate::storage::{next_working_paper_id, STORAGE};
use crate::types::{
    AccountData, CreateWorkingPaperRequest, FinancialRatio, Leadsheet, Result, TrendAnalysis,
    VarianceAnalysis, WorkingPaper,
};

// Create working paper
pub fn create_working_paper(
    caller: Principal,
    req: CreateWorkingPaperRequest,
) -> Result<WorkingPaper> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_working_paper(&user) {
        return Err("Insufficient permissions to create working paper".to_string());
    }

    // Get the dataset
    let dataset = data_import::get_dataset(caller, req.dataset_id)?;

    // Extract account data based on mapping
    let accounts = extract_accounts(&dataset, &req.column_mapping, &req.selected_accounts)?;

    // Generate leadsheet
    let leadsheet = generate_leadsheet(&accounts)?;

    // Calculate ratios
    let ratios = calculate_ratios(&accounts)?;

    // Generate trend analysis
    let trend_analysis = generate_trend_analysis(&accounts)?;

    // Generate variance analysis
    let variance_analysis = generate_variance_analysis(&accounts)?;

    let working_paper = WorkingPaper {
        id: next_working_paper_id(),
        engagement_id: req.engagement_id,
        dataset_id: req.dataset_id,
        name: req.name.clone(),
        column_mapping: req.column_mapping,
        leadsheet: Some(leadsheet),
        ratios,
        trend_analysis,
        variance_analysis,
        linked_document_ids: Vec::new(),
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .working_papers
            .insert(working_paper.id, working_paper.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "WorkingPaper".to_string(),
        working_paper.id.to_string(),
        format!("Created working paper: {}", req.name),
    );

    Ok(working_paper)
}

// Extract accounts from dataset based on column mapping
fn extract_accounts(
    dataset: &crate::types::ImportedDataset,
    mapping: &crate::types::ColumnMapping,
    selected_accounts: &[String],
) -> Result<Vec<AccountData>> {
    if dataset.sheets.is_empty() {
        return Err("Dataset has no sheets".to_string());
    }

    // Use first sheet by default
    let sheet = &dataset.sheets[0];

    // Find column indices based on mapping
    let account_num_idx = find_column_index(&sheet, &mapping.account_number)?;
    let account_name_idx = find_column_index(&sheet, &mapping.account_name)?;

    let currency_idx = find_column_index_opt(&sheet, &mapping.currency);
    let opening_debit_idx = find_column_index_opt(&sheet, &mapping.opening_debit);
    let opening_credit_idx = find_column_index_opt(&sheet, &mapping.opening_credit);
    let period_debit_idx = find_column_index_opt(&sheet, &mapping.period_debit);
    let period_credit_idx = find_column_index_opt(&sheet, &mapping.period_credit);
    let ytd_debit_idx = find_column_index_opt(&sheet, &mapping.ytd_debit);
    let ytd_credit_idx = find_column_index_opt(&sheet, &mapping.ytd_credit);
    let entity_idx = find_column_index_opt(&sheet, &mapping.entity);
    let department_idx = find_column_index_opt(&sheet, &mapping.department);
    let project_idx = find_column_index_opt(&sheet, &mapping.project);
    let notes_idx = find_column_index_opt(&sheet, &mapping.notes);

    let mut accounts = Vec::new();

    for row in &sheet.data {
        let account_number = row.get(account_num_idx).unwrap_or(&String::new()).clone();

        // Filter by selected accounts
        if !selected_accounts.is_empty() && !selected_accounts.contains(&account_number) {
            continue;
        }

        let account_name = row.get(account_name_idx).unwrap_or(&String::new()).clone();

        let account = AccountData {
            account_number,
            account_name,
            currency: get_value_or_default(row, currency_idx),
            opening_debit: parse_amount(get_value_or_default(row, opening_debit_idx)),
            opening_credit: parse_amount(get_value_or_default(row, opening_credit_idx)),
            period_debit: parse_amount(get_value_or_default(row, period_debit_idx)),
            period_credit: parse_amount(get_value_or_default(row, period_credit_idx)),
            ytd_debit: parse_amount(get_value_or_default(row, ytd_debit_idx)),
            ytd_credit: parse_amount(get_value_or_default(row, ytd_credit_idx)),
            entity: get_value_or_default(row, entity_idx),
            department: get_value_or_default(row, department_idx),
            project: get_value_or_default(row, project_idx),
            notes: get_value_or_default(row, notes_idx),
        };

        accounts.push(account);
    }

    Ok(accounts)
}

// Find column index by name (required)
fn find_column_index(
    sheet: &crate::types::SheetData,
    column_name: &Option<String>,
) -> Result<usize> {
    let name = column_name
        .as_ref()
        .ok_or("Column mapping is required".to_string())?;

    sheet
        .columns
        .iter()
        .position(|col| col.name == *name)
        .ok_or_else(|| format!("Column '{}' not found", name))
}

// Find column index by name (optional)
fn find_column_index_opt(
    sheet: &crate::types::SheetData,
    column_name: &Option<String>,
) -> Option<usize> {
    column_name.as_ref().and_then(|name| {
        sheet
            .columns
            .iter()
            .position(|col| col.name == *name)
    })
}

// Get value from row or default
fn get_value_or_default(row: &[String], index: Option<usize>) -> String {
    index
        .and_then(|idx| row.get(idx))
        .cloned()
        .unwrap_or_default()
}

// Parse amount string to f64
fn parse_amount(s: String) -> f64 {
    s.replace(",", "")
        .replace("$", "")
        .replace("€", "")
        .replace("£", "")
        .replace("¥", "")
        .replace(" ", "")
        .parse()
        .unwrap_or(0.0)
}

// Generate leadsheet
fn generate_leadsheet(accounts: &[AccountData]) -> Result<Leadsheet> {
    let mut opening_balance = 0.0;
    let mut adjustments = 0.0;
    let mut closing_balance = 0.0;

    for account in accounts {
        // Opening balance = Opening Debit - Opening Credit
        opening_balance += account.opening_debit - account.opening_credit;

        // Adjustments = Period Debit - Period Credit
        adjustments += account.period_debit - account.period_credit;

        // Closing balance = YTD Debit - YTD Credit
        closing_balance += account.ytd_debit - account.ytd_credit;
    }

    Ok(Leadsheet {
        accounts: accounts.to_vec(),
        opening_balance,
        adjustments,
        closing_balance,
        created_at: time(),
    })
}

// Calculate financial ratios
fn calculate_ratios(accounts: &[AccountData]) -> Result<Vec<FinancialRatio>> {
    let mut ratios = Vec::new();

    // Calculate total assets, liabilities, equity, revenue, expenses
    let mut total_debits = 0.0;
    let mut total_credits = 0.0;

    for account in accounts {
        total_debits += account.ytd_debit;
        total_credits += account.ytd_credit;
    }

    // Net movement
    let net_movement = total_debits - total_credits;
    ratios.push(FinancialRatio {
        name: "Net Movement".to_string(),
        value: net_movement,
        formula: "Total YTD Debits - Total YTD Credits".to_string(),
    });

    // Activity ratio (transaction volume)
    let total_activity = total_debits + total_credits;
    ratios.push(FinancialRatio {
        name: "Total Activity".to_string(),
        value: total_activity,
        formula: "Total YTD Debits + Total YTD Credits".to_string(),
    });

    // Average balance per account
    if !accounts.is_empty() {
        let avg_balance = net_movement / accounts.len() as f64;
        ratios.push(FinancialRatio {
            name: "Average Balance per Account".to_string(),
            value: avg_balance,
            formula: "Net Movement / Number of Accounts".to_string(),
        });
    }

    Ok(ratios)
}

// Generate trend analysis
fn generate_trend_analysis(accounts: &[AccountData]) -> Result<Vec<TrendAnalysis>> {
    let mut analyses = Vec::new();

    // Compare opening vs closing
    let mut total_opening = 0.0;
    let mut total_closing = 0.0;

    for account in accounts {
        total_opening += account.opening_debit - account.opening_credit;
        total_closing += account.ytd_debit - account.ytd_credit;
    }

    let change = total_closing - total_opening;
    let change_percent = if total_opening != 0.0 {
        (change / total_opening) * 100.0
    } else {
        0.0
    };

    analyses.push(TrendAnalysis {
        period_name: "Opening to Closing".to_string(),
        current_value: total_closing,
        prior_value: total_opening,
        change,
        change_percent,
    });

    Ok(analyses)
}

// Generate variance analysis
fn generate_variance_analysis(accounts: &[AccountData]) -> Result<Vec<VarianceAnalysis>> {
    let mut analyses = Vec::new();

    // Period movements vs expected (using period as actual, opening as baseline)
    let mut total_period_movement = 0.0;
    let mut total_opening = 0.0;

    for account in accounts {
        total_period_movement += account.period_debit - account.period_credit;
        total_opening += account.opening_debit - account.opening_credit;
    }

    let variance = total_period_movement - total_opening;
    let variance_percent = if total_opening != 0.0 {
        (variance / total_opening) * 100.0
    } else {
        0.0
    };

    analyses.push(VarianceAnalysis {
        item_name: "Period Activity vs Opening Balance".to_string(),
        actual: total_period_movement,
        expected: total_opening,
        variance,
        variance_percent,
    });

    Ok(analyses)
}

// Get working paper by ID
pub fn get_working_paper(caller: Principal, id: u64) -> Result<WorkingPaper> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().working_papers.get(&id))
        .ok_or_else(|| "Working paper not found".to_string())
}

// List working papers by engagement
pub fn list_working_papers_by_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<WorkingPaper>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let working_papers = STORAGE.with(|storage| {
        storage
            .borrow()
            .working_papers
            .iter()
            .filter(|(_, wp)| wp.engagement_id == engagement_id)
            .map(|(_, wp)| wp)
            .collect()
    });

    Ok(working_papers)
}

// Link document to working paper
pub fn link_document_to_working_paper(
    caller: Principal,
    working_paper_id: u64,
    document_id: u64,
) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_working_paper(&user) {
        return Err("Insufficient permissions".to_string());
    }

    let mut wp = STORAGE
        .with(|storage| storage.borrow().working_papers.get(&working_paper_id))
        .ok_or_else(|| "Working paper not found".to_string())?;

    if !wp.linked_document_ids.contains(&document_id) {
        wp.linked_document_ids.push(document_id);
        STORAGE.with(|storage| {
            storage.borrow_mut().working_papers.insert(wp.id, wp);
        });
    }

    log_activity(
        caller,
        "LINK".to_string(),
        "WorkingPaper".to_string(),
        working_paper_id.to_string(),
        format!("Linked document {} to working paper", document_id),
    );

    Ok(())
}

