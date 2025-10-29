use candid::{CandidType, Principal};
use ic_cdk::api::time;
use serde::{Deserialize, Serialize};

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_trial_balance_id, next_account_id, STORAGE};
use crate::types::{Result, TrialBalance, TrialBalanceAccount, AccountType, CreateTrialBalanceRequest, UpdateAccountRequest};

// Create a new trial balance for an engagement
pub fn create_trial_balance(caller: Principal, req: CreateTrialBalanceRequest) -> Result<TrialBalance> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_engagement(&user) {
        return Err("Insufficient permissions to create trial balance".to_string());
    }

    // Verify engagement exists
    let _engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.engagement_id))
        .ok_or("Engagement not found")?;

    let trial_balance = TrialBalance {
        id: next_trial_balance_id(),
        engagement_id: req.engagement_id,
        period_end_date: req.period_end_date,
        description: req.description,
        currency: req.currency.unwrap_or_else(|| "USD".to_string()),
        is_adjusted: false,
        created_at: time(),
        created_by: caller,
        last_modified_at: time(),
        last_modified_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().trial_balances.insert(trial_balance.id, trial_balance.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "TrialBalance".to_string(),
        trial_balance.id.to_string(),
        format!("Created trial balance for engagement {}", req.engagement_id),
    );

    Ok(trial_balance)
}

// Add an account to a trial balance
pub fn add_account(caller: Principal, trial_balance_id: u64, req: UpdateAccountRequest) -> Result<TrialBalanceAccount> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to modify trial balance".to_string());
    }

    // Verify trial balance exists
    let _tb = STORAGE
        .with(|storage| storage.borrow().trial_balances.get(&trial_balance_id))
        .ok_or("Trial balance not found")?;

    let account_name = req.account_name.clone();
    
    let account = TrialBalanceAccount {
        id: next_account_id(),
        trial_balance_id,
        account_number: req.account_number,
        account_name: req.account_name,
        account_type: req.account_type,
        debit_balance: req.debit_balance,
        credit_balance: req.credit_balance,
        fs_line_item: req.fs_line_item,
        notes: req.notes.unwrap_or_default(),
        is_reconciled: false,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().trial_balance_accounts.insert(account.id, account.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "TrialBalanceAccount".to_string(),
        account.id.to_string(),
        format!("Added account {} to trial balance {}", account_name, trial_balance_id),
    );

    Ok(account)
}

// Get trial balance by ID
pub fn get_trial_balance(caller: Principal, id: u64) -> Result<TrialBalance> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().trial_balances.get(&id))
        .ok_or_else(|| "Trial balance not found".to_string())
}

// Get all accounts for a trial balance
pub fn get_accounts(caller: Principal, trial_balance_id: u64) -> Result<Vec<TrialBalanceAccount>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let accounts = STORAGE.with(|storage| {
        storage
            .borrow()
            .trial_balance_accounts
            .iter()
            .filter(|(_, acc)| acc.trial_balance_id == trial_balance_id)
            .map(|(_, acc)| acc)
            .collect()
    });

    Ok(accounts)
}

// List trial balances for an engagement
pub fn list_trial_balances_by_engagement(caller: Principal, engagement_id: u64) -> Result<Vec<TrialBalance>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let trial_balances = STORAGE.with(|storage| {
        storage
            .borrow()
            .trial_balances
            .iter()
            .filter(|(_, tb)| tb.engagement_id == engagement_id)
            .map(|(_, tb)| tb)
            .collect()
    });

    Ok(trial_balances)
}

// Validate trial balance (debits = credits)
pub fn validate_trial_balance(caller: Principal, trial_balance_id: u64) -> Result<TrialBalanceValidation> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let accounts = get_accounts(caller, trial_balance_id)?;

    let total_debits: i64 = accounts.iter().map(|a| a.debit_balance).sum();
    let total_credits: i64 = accounts.iter().map(|a| a.credit_balance).sum();
    let difference = total_debits - total_credits;

    let is_balanced = difference == 0;

    let account_issues: Vec<String> = accounts
        .iter()
        .filter(|a| a.debit_balance < 0 || a.credit_balance < 0)
        .map(|a| format!("Account {} has negative balance", a.account_name))
        .collect();

    Ok(TrialBalanceValidation {
        trial_balance_id,
        is_balanced,
        total_debits,
        total_credits,
        difference,
        account_count: accounts.len() as u64,
        issues: account_issues,
        validated_at: time(),
        validated_by: caller,
    })
}

// Map account to financial statement line item
pub fn map_to_fs_line(caller: Principal, account_id: u64, fs_line_item: String) -> Result<TrialBalanceAccount> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to map accounts".to_string());
    }

    let mut account = STORAGE
        .with(|storage| storage.borrow().trial_balance_accounts.get(&account_id))
        .ok_or("Account not found")?;

    account.fs_line_item = Some(fs_line_item.clone());

    STORAGE.with(|storage| {
        storage.borrow_mut().trial_balance_accounts.insert(account.id, account.clone());
    });

    log_activity(
        caller,
        "UPDATE".to_string(),
        "TrialBalanceAccount".to_string(),
        account.id.to_string(),
        format!("Mapped account {} to FS line item {}", account.account_name, fs_line_item),
    );

    Ok(account)
}

// Import trial balance from CSV data
pub fn import_trial_balance_csv(
    caller: Principal,
    engagement_id: u64,
    period_end_date: String,
    csv_data: Vec<CsvAccountRow>,
) -> Result<TrialBalance> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_engagement(&user) {
        return Err("Insufficient permissions to import trial balance".to_string());
    }

    // Create trial balance
    let tb = create_trial_balance(
        caller,
        CreateTrialBalanceRequest {
            engagement_id,
            period_end_date: period_end_date.clone(),
            description: format!("Imported trial balance for period {}", period_end_date),
            currency: Some("USD".to_string()),
        },
    )?;

    // Import accounts
    let account_count = csv_data.len();
    for row in csv_data {
        let account_type = infer_account_type(&row.account_number, &row.account_name);
        
        add_account(
            caller,
            tb.id,
            UpdateAccountRequest {
                account_number: row.account_number,
                account_name: row.account_name,
                account_type,
                debit_balance: row.debit_balance,
                credit_balance: row.credit_balance,
                fs_line_item: None,
                notes: None,
            },
        )?;
    }

    log_activity(
        caller,
        "IMPORT".to_string(),
        "TrialBalance".to_string(),
        tb.id.to_string(),
        format!("Imported trial balance with {} accounts", account_count),
    );

    Ok(tb)
}

// Helper: Infer account type from account number/name
fn infer_account_type(account_number: &str, account_name: &str) -> AccountType {
    let number = account_number.parse::<u32>().unwrap_or(0);
    let name_lower = account_name.to_lowercase();

    // Standard account number ranges
    if number >= 1000 && number < 2000 {
        return AccountType::Asset;
    }
    if number >= 2000 && number < 3000 {
        return AccountType::Liability;
    }
    if number >= 3000 && number < 4000 {
        return AccountType::Equity;
    }
    if number >= 4000 && number < 5000 {
        return AccountType::Revenue;
    }
    if number >= 5000 && number < 9000 {
        return AccountType::Expense;
    }

    // Fallback to name-based inference
    if name_lower.contains("asset") || name_lower.contains("receivable") || name_lower.contains("cash") {
        AccountType::Asset
    } else if name_lower.contains("liability") || name_lower.contains("payable") || name_lower.contains("loan") {
        AccountType::Liability
    } else if name_lower.contains("equity") || name_lower.contains("capital") || name_lower.contains("retained") {
        AccountType::Equity
    } else if name_lower.contains("revenue") || name_lower.contains("income") || name_lower.contains("sales") {
        AccountType::Revenue
    } else if name_lower.contains("expense") || name_lower.contains("cost") {
        AccountType::Expense
    } else {
        AccountType::Asset // Default fallback
    }
}

// CSV import structure
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CsvAccountRow {
    pub account_number: String,
    pub account_name: String,
    pub debit_balance: i64,
    pub credit_balance: i64,
}

// Validation result
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TrialBalanceValidation {
    pub trial_balance_id: u64,
    pub is_balanced: bool,
    pub total_debits: i64,
    pub total_credits: i64,
    pub difference: i64,
    pub account_count: u64,
    pub issues: Vec<String>,
    pub validated_at: u64,
    pub validated_by: Principal,
}

