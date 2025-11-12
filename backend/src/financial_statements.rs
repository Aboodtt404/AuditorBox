use candid::Principal;
use ic_cdk::api::time;
use std::collections::HashMap;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{STORAGE, next_fs_id};
use crate::types::*;

// Financial Statement Line Items by Taxonomy
pub fn get_line_items_for_taxonomy(taxonomy: &XBRLTaxonomy) -> Vec<FSLineItem> {
    match taxonomy {
        XBRLTaxonomy::EAS => get_eas_line_items(),
        XBRLTaxonomy::GCC => get_gcc_line_items(),
        XBRLTaxonomy::IFRS => get_ifrs_line_items(),
        XBRLTaxonomy::Custom(_) => get_default_line_items(),
    }
}

fn get_eas_line_items() -> Vec<FSLineItem> {
    // Egyptian Accounting Standards (EAS) - uses same codes as US GAAP for now
    // but with EAS-specific naming and presentation order
    vec![
        // Statement of Financial Position - Assets
        FSLineItem {
            code: "BS_CASH".to_string(),
            name: "النقدية وما في حكمها / Cash and Cash Equivalents".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 1,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_AR".to_string(),
            name: "المدينون التجاريون / Trade Receivables".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 2,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_INVENTORY".to_string(),
            name: "المخزون / Inventories".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 3,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_PREPAID".to_string(),
            name: "مصروفات مدفوعة مقدماً / Prepaid Expenses".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 4,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_CURRENT_ASSETS".to_string(),
            name: "إجمالي الأصول المتداولة / Total Current Assets".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 5,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "BS_PPE".to_string(),
            name: "الممتلكات والآلات والمعدات / Property, Plant and Equipment".to_string(),
            category: FSCategory::Asset,
            subcategory: "Non-Current Assets".to_string(),
            order: 6,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_ACCUM_DEPR".to_string(),
            name: "مجمع الإهلاك / Accumulated Depreciation".to_string(),
            category: FSCategory::Asset,
            subcategory: "Non-Current Assets".to_string(),
            order: 7,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_TOTAL_ASSETS".to_string(),
            name: "إجمالي الأصول / Total Assets".to_string(),
            category: FSCategory::Asset,
            subcategory: "Total".to_string(),
            order: 8,
            is_subtotal: true,
            parent: None,
        },
        // Liabilities
        FSLineItem {
            code: "BS_AP".to_string(),
            name: "الدائنون التجاريون / Trade Payables".to_string(),
            category: FSCategory::Liability,
            subcategory: "Current Liabilities".to_string(),
            order: 9,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_ACCRUED".to_string(),
            name: "مصروفات مستحقة / Accrued Expenses".to_string(),
            category: FSCategory::Liability,
            subcategory: "Current Liabilities".to_string(),
            order: 10,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_CURRENT_LIAB".to_string(),
            name: "إجمالي الالتزامات المتداولة / Total Current Liabilities".to_string(),
            category: FSCategory::Liability,
            subcategory: "Current Liabilities".to_string(),
            order: 11,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "BS_LONG_TERM_DEBT".to_string(),
            name: "قروض طويلة الأجل / Long-term Borrowings".to_string(),
            category: FSCategory::Liability,
            subcategory: "Non-Current Liabilities".to_string(),
            order: 12,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_TOTAL_LIAB".to_string(),
            name: "إجمالي الالتزامات / Total Liabilities".to_string(),
            category: FSCategory::Liability,
            subcategory: "Total".to_string(),
            order: 13,
            is_subtotal: true,
            parent: None,
        },
        // Equity
        FSLineItem {
            code: "BS_CAPITAL".to_string(),
            name: "رأس المال / Share Capital".to_string(),
            category: FSCategory::Equity,
            subcategory: "Equity".to_string(),
            order: 14,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_RETAINED".to_string(),
            name: "أرباح محتجزة / Retained Earnings".to_string(),
            category: FSCategory::Equity,
            subcategory: "Equity".to_string(),
            order: 15,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_TOTAL_EQUITY".to_string(),
            name: "إجمالي حقوق الملكية / Total Equity".to_string(),
            category: FSCategory::Equity,
            subcategory: "Total".to_string(),
            order: 16,
            is_subtotal: true,
            parent: None,
        },
        // Income Statement
        FSLineItem {
            code: "IS_REVENUE".to_string(),
            name: "الإيرادات / Revenue".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Revenue".to_string(),
            order: 17,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_COGS".to_string(),
            name: "تكلفة المبيعات / Cost of Sales".to_string(),
            category: FSCategory::Expense,
            subcategory: "Cost of Sales".to_string(),
            order: 18,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_GROSS_PROFIT".to_string(),
            name: "مجمل الربح / Gross Profit".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Subtotal".to_string(),
            order: 19,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "IS_OPEX".to_string(),
            name: "مصروفات تشغيلية / Operating Expenses".to_string(),
            category: FSCategory::Expense,
            subcategory: "Operating Expenses".to_string(),
            order: 20,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_DEPRECIATION".to_string(),
            name: "إهلاك / Depreciation".to_string(),
            category: FSCategory::Expense,
            subcategory: "Operating Expenses".to_string(),
            order: 21,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_INTEREST".to_string(),
            name: "تكاليف التمويل / Finance Costs".to_string(),
            category: FSCategory::Expense,
            subcategory: "Finance Costs".to_string(),
            order: 22,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_OPERATING_PROFIT".to_string(),
            name: "الربح التشغيلي / Operating Profit".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Subtotal".to_string(),
            order: 23,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "IS_NET_INCOME".to_string(),
            name: "صافي الربح / Net Profit".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Bottom Line".to_string(),
            order: 24,
            is_subtotal: true,
            parent: None,
        },
    ]
}

fn get_gcc_line_items() -> Vec<FSLineItem> {
    // GCC Standards - similar structure to EAS
    get_eas_line_items()
}

fn get_us_gaap_line_items() -> Vec<FSLineItem> {
    vec![
        // Balance Sheet - Assets
        FSLineItem {
            code: "BS_CASH".to_string(),
            name: "Cash and Cash Equivalents".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 1,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_AR".to_string(),
            name: "Accounts Receivable".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 2,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_INVENTORY".to_string(),
            name: "Inventory".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 3,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_PREPAID".to_string(),
            name: "Prepaid Expenses".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 4,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_CURRENT_ASSETS".to_string(),
            name: "Total Current Assets".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 5,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "BS_PPE".to_string(),
            name: "Property, Plant, and Equipment".to_string(),
            category: FSCategory::Asset,
            subcategory: "Non-Current Assets".to_string(),
            order: 6,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_ACCUM_DEPR".to_string(),
            name: "Less: Accumulated Depreciation".to_string(),
            category: FSCategory::Asset,
            subcategory: "Non-Current Assets".to_string(),
            order: 7,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_TOTAL_ASSETS".to_string(),
            name: "Total Assets".to_string(),
            category: FSCategory::Asset,
            subcategory: "Total".to_string(),
            order: 8,
            is_subtotal: true,
            parent: None,
        },
        // Balance Sheet - Liabilities
        FSLineItem {
            code: "BS_AP".to_string(),
            name: "Accounts Payable".to_string(),
            category: FSCategory::Liability,
            subcategory: "Current Liabilities".to_string(),
            order: 9,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_ACCRUED".to_string(),
            name: "Accrued Liabilities".to_string(),
            category: FSCategory::Liability,
            subcategory: "Current Liabilities".to_string(),
            order: 10,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_CURRENT_LIAB".to_string(),
            name: "Total Current Liabilities".to_string(),
            category: FSCategory::Liability,
            subcategory: "Current Liabilities".to_string(),
            order: 11,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "BS_LONG_TERM_DEBT".to_string(),
            name: "Long-Term Debt".to_string(),
            category: FSCategory::Liability,
            subcategory: "Non-Current Liabilities".to_string(),
            order: 12,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_TOTAL_LIAB".to_string(),
            name: "Total Liabilities".to_string(),
            category: FSCategory::Liability,
            subcategory: "Total".to_string(),
            order: 13,
            is_subtotal: true,
            parent: None,
        },
        // Balance Sheet - Equity
        FSLineItem {
            code: "BS_CAPITAL".to_string(),
            name: "Owner's Capital / Share Capital".to_string(),
            category: FSCategory::Equity,
            subcategory: "Equity".to_string(),
            order: 14,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_RETAINED".to_string(),
            name: "Retained Earnings".to_string(),
            category: FSCategory::Equity,
            subcategory: "Equity".to_string(),
            order: 15,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "BS_TOTAL_EQUITY".to_string(),
            name: "Total Equity".to_string(),
            category: FSCategory::Equity,
            subcategory: "Total".to_string(),
            order: 16,
            is_subtotal: true,
            parent: None,
        },
        // Income Statement
        FSLineItem {
            code: "IS_REVENUE".to_string(),
            name: "Revenue".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Revenue".to_string(),
            order: 17,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_COGS".to_string(),
            name: "Cost of Goods Sold".to_string(),
            category: FSCategory::Expense,
            subcategory: "Cost of Sales".to_string(),
            order: 18,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_GROSS_PROFIT".to_string(),
            name: "Gross Profit".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Subtotal".to_string(),
            order: 19,
            is_subtotal: true,
            parent: None,
        },
        FSLineItem {
            code: "IS_OPEX".to_string(),
            name: "Operating Expenses".to_string(),
            category: FSCategory::Expense,
            subcategory: "Operating Expenses".to_string(),
            order: 20,
            is_subtotal: false,
            parent: None,
        },
        FSLineItem {
            code: "IS_NET_INCOME".to_string(),
            name: "Net Income".to_string(),
            category: FSCategory::Revenue,
            subcategory: "Bottom Line".to_string(),
            order: 21,
            is_subtotal: true,
            parent: None,
        },
    ]
}

fn get_ifrs_line_items() -> Vec<FSLineItem> {
    // IFRS has similar structure but different terminology
    vec![
        FSLineItem {
            code: "SFP_CASH".to_string(),
            name: "Cash and Cash Equivalents".to_string(),
            category: FSCategory::Asset,
            subcategory: "Current Assets".to_string(),
            order: 1,
            is_subtotal: false,
            parent: None,
        },
        // Add more IFRS line items...
    ]
}

fn get_default_line_items() -> Vec<FSLineItem> {
    get_us_gaap_line_items()
}

// Generate Financial Statements from Trial Balance
pub fn generate_financial_statements(
    caller: Principal,
    request: GenerateFSRequest,
) -> Result<FinancialStatement> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to generate financial statements".to_string());
    }

    // Get trial balance
    let trial_balance = STORAGE
        .with(|storage| storage.borrow().trial_balances.get(&request.trial_balance_id))
        .ok_or("Trial balance not found")?;

    // Get engagement for taxonomy
    let engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&trial_balance.engagement_id))
        .ok_or("Engagement not found")?;

    // Get line items for taxonomy
    let line_items = get_line_items_for_taxonomy(&request.taxonomy);

    // Get all accounts from trial balance
    let accounts: Vec<crate::types::TrialBalanceAccount> = STORAGE.with(|storage| {
        storage
            .borrow()
            .trial_balance_accounts
            .iter()
            .filter(|(_, acc)| acc.trial_balance_id == request.trial_balance_id)
            .map(|(_, acc)| acc)
            .collect()
    });

    // Map accounts to FS line items
    let mut line_item_values: HashMap<String, i64> = HashMap::new();

    for account in accounts.iter() {
        if let Some(fs_line) = &account.fs_line_item {
            if !fs_line.is_empty() {
                // Calculate net balance based on account type
                // Assets & Expenses: Debit positive (Debit - Credit)
                // Liabilities, Equity, Revenue: Credit positive (Credit - Debit)
                let net_balance = match account.account_type {
                    AccountType::Asset | AccountType::Expense => {
                        account.debit_balance - account.credit_balance
                    },
                    AccountType::Liability | AccountType::Equity | AccountType::Revenue => {
                        account.credit_balance - account.debit_balance
                    },
                };

                *line_item_values.entry(fs_line.clone()).or_insert(0) += net_balance;
            }
        }
    }

    // Calculate subtotals
    line_item_values.insert("BS_CURRENT_ASSETS".to_string(), 
        line_item_values.get("BS_CASH").unwrap_or(&0) +
        line_item_values.get("BS_AR").unwrap_or(&0) +
        line_item_values.get("BS_INVENTORY").unwrap_or(&0) +
        line_item_values.get("BS_PREPAID").unwrap_or(&0)
    );

    line_item_values.insert("BS_TOTAL_ASSETS".to_string(),
        line_item_values.get("BS_CURRENT_ASSETS").unwrap_or(&0) +
        line_item_values.get("BS_PPE").unwrap_or(&0) +
        line_item_values.get("BS_ACCUM_DEPR").unwrap_or(&0)
    );

    line_item_values.insert("BS_CURRENT_LIAB".to_string(),
        line_item_values.get("BS_AP").unwrap_or(&0) +
        line_item_values.get("BS_ACCRUED").unwrap_or(&0)
    );

    line_item_values.insert("BS_TOTAL_LIAB".to_string(),
        line_item_values.get("BS_CURRENT_LIAB").unwrap_or(&0) +
        line_item_values.get("BS_LONG_TERM_DEBT").unwrap_or(&0)
    );

    line_item_values.insert("BS_TOTAL_EQUITY".to_string(),
        line_item_values.get("BS_CAPITAL").unwrap_or(&0) +
        line_item_values.get("BS_RETAINED").unwrap_or(&0)
    );

    line_item_values.insert("IS_GROSS_PROFIT".to_string(),
        line_item_values.get("IS_REVENUE").unwrap_or(&0) -
        line_item_values.get("IS_COGS").unwrap_or(&0)
    );

    line_item_values.insert("IS_OPERATING_PROFIT".to_string(),
        line_item_values.get("IS_GROSS_PROFIT").unwrap_or(&0) -
        line_item_values.get("IS_OPEX").unwrap_or(&0) -
        line_item_values.get("IS_DEPRECIATION").unwrap_or(&0)
    );

    line_item_values.insert("IS_NET_INCOME".to_string(),
        line_item_values.get("IS_OPERATING_PROFIT").unwrap_or(&0) -
        line_item_values.get("IS_INTEREST").unwrap_or(&0)
    );

    // Create FS line items with values
    let fs_lines: Vec<FSLine> = line_items
        .iter()
        .map(|item| FSLine {
            line_item: item.clone(),
            amount: *line_item_values.get(&item.code).unwrap_or(&0),
            mapped_accounts: accounts
                .iter()
                .filter(|acc| {
                    acc.fs_line_item.as_ref().map_or(false, |line| line == &item.code)
                })
                .map(|acc| acc.id)
                .collect(),
        })
        .collect();

    let fs_id = next_fs_id();
    let financial_statement = FinancialStatement {
        id: fs_id,
        engagement_id: engagement.id,
        trial_balance_id: request.trial_balance_id,
        taxonomy: request.taxonomy.clone(),
        period_end_date: trial_balance.period_end_date.clone(),
        lines: fs_lines,
        notes: vec![],
        created_at: time(),
        created_by: caller,
        last_modified: time(),
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .financial_statements
            .insert(fs_id, financial_statement.clone());
    });

    log_activity(
        caller,
        "generate_financial_statements".to_string(),
        "financial_statement".to_string(),
        fs_id.to_string(),
        format!(
            "Generated financial statements for trial balance {} using {} taxonomy",
            request.trial_balance_id,
            match request.taxonomy {
                XBRLTaxonomy::EAS => "EAS",
                XBRLTaxonomy::GCC => "GCC",
                XBRLTaxonomy::IFRS => "IFRS",
                XBRLTaxonomy::Custom(_) => "Custom",
            }
        ),
        None,
    );

    Ok(financial_statement)
}

// Get Financial Statement
pub fn get_financial_statement(caller: Principal, fs_id: u64) -> Result<FinancialStatement> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().financial_statements.get(&fs_id))
        .ok_or("Financial statement not found".to_string())
}

// List Financial Statements for Engagement
pub fn list_financial_statements_by_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<FinancialStatement>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let statements = STORAGE.with(|storage| {
        storage
            .borrow()
            .financial_statements
            .iter()
            .filter(|(_, fs)| fs.engagement_id == engagement_id)
            .map(|(_, fs)| fs)
            .collect()
    });

    Ok(statements)
}

// Update FS Line Item Mapping
pub fn update_fs_line_mapping(
    caller: Principal,
    request: UpdateFSLineMappingRequest,
) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_senior_or_above(&user) {
        return Err("Insufficient permissions to update FS line mappings".to_string());
    }

    // Update trial balance account with FS line item
    let mut account = STORAGE
        .with(|storage| {
            storage
                .borrow()
                .trial_balance_accounts
                .get(&request.account_id)
        })
        .ok_or("Account not found")?;

    account.fs_line_item = Some(request.fs_line_item_code.clone());

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .trial_balance_accounts
            .insert(request.account_id, account);
    });

    log_activity(
        caller,
        "update_fs_line_mapping".to_string(),
        "financial_statement".to_string(),
        request.account_id.to_string(),
        format!(
            "Mapped account to FS line item: {}",
            request.fs_line_item_code
        ),
        None,
    );

    Ok(())
}

// Add Note to Financial Statement
pub fn add_fs_note(caller: Principal, request: AddFSNoteRequest) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to add FS notes".to_string());
    }

    let mut fs = STORAGE
        .with(|storage| storage.borrow().financial_statements.get(&request.fs_id))
        .ok_or("Financial statement not found")?;

    let note = FSNote {
        note_number: (fs.notes.len() + 1) as u64,
        title: request.title,
        content: request.content,
        created_at: time(),
        created_by: caller,
    };

    fs.notes.push(note);
    fs.last_modified = time();

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .financial_statements
            .insert(request.fs_id, fs);
    });

    log_activity(
        caller,
        "add_fs_note".to_string(),
        "financial_statement".to_string(),
        request.fs_id.to_string(),
        format!("Added note to financial statement {}", request.fs_id),
        None,
    );

    Ok(())
}

