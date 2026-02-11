// Auto-generated from tb_schema.json

export const ACCOUNT_RANGES = {
  "1000-1099": {
    "leadsheet": "1",
    "name": "Property, Plant & Equipment",
    "category": "non_current_assets",
    "cycle": "ppe"
  },
  "1100-1149": {
    "leadsheet": "5",
    "name": "Investment Property",
    "category": "non_current_assets",
    "cycle": "ppe"
  },
  "1150-1199": {
    "leadsheet": "10",
    "name": "Intangible Assets & Goodwill",
    "category": "non_current_assets",
    "cycle": "general"
  },
  "1200-1249": {
    "leadsheet": "20",
    "name": "Investments",
    "category": "non_current_assets",
    "cycle": "equity"
  },
  "1250-1299": {
    "leadsheet": "35",
    "name": "Receivables (Non-current)",
    "category": "non_current_assets",
    "cycle": "revenue"
  },
  "1300-1349": {
    "leadsheet": "120",
    "name": "Other Financial Assets (Current)",
    "category": "current_assets",
    "cycle": "general"
  },
  "1350-1399": {
    "leadsheet": "110",
    "name": "Inventories",
    "category": "current_assets",
    "cycle": "inventory"
  },
  "1400-1449": {
    "leadsheet": "130",
    "name": "Receivables (Current)",
    "category": "current_assets",
    "cycle": "revenue"
  },
  "1450-1499": {
    "leadsheet": "135",
    "name": "Prepayments",
    "category": "current_assets",
    "cycle": "general"
  },
  "1500-1599": {
    "leadsheet": "140",
    "name": "Cash & Cash Equivalents",
    "category": "current_assets",
    "cycle": "cash"
  },
  "2000-2099": {
    "leadsheet": "200",
    "name": "Share Capital",
    "category": "equity",
    "cycle": "equity"
  },
  "2100-2199": {
    "leadsheet": "200",
    "name": "Reserves",
    "category": "equity",
    "cycle": "equity"
  },
  "2200-2299": {
    "leadsheet": "200",
    "name": "Retained Earnings",
    "category": "equity",
    "cycle": "equity"
  },
  "3000-3099": {
    "leadsheet": "300",
    "name": "Borrowings (Non-current)",
    "category": "non_current_liabilities",
    "cycle": "general"
  },
  "3100-3199": {
    "leadsheet": "325",
    "name": "Deferred Tax Liabilities",
    "category": "non_current_liabilities",
    "cycle": "general"
  },
  "3200-3299": {
    "leadsheet": "330",
    "name": "Other Liabilities (Non-current)",
    "category": "non_current_liabilities",
    "cycle": "general"
  },
  "4000-4099": {
    "leadsheet": "400",
    "name": "Borrowings (Current)",
    "category": "current_liabilities",
    "cycle": "general"
  },
  "4100-4199": {
    "leadsheet": "425",
    "name": "Trade Payables",
    "category": "current_liabilities",
    "cycle": "expenditure"
  },
  "4200-4299": {
    "leadsheet": "430",
    "name": "Other Current Liabilities",
    "category": "current_liabilities",
    "cycle": "expenditure"
  },
  "5000-5099": {
    "leadsheet": "1500",
    "name": "Revenue",
    "category": "income",
    "cycle": "revenue"
  },
  "5100-5199": {
    "leadsheet": "1700",
    "name": "Other Income",
    "category": "income",
    "cycle": "revenue"
  },
  "6000-6099": {
    "leadsheet": "1600",
    "name": "Cost of Sales",
    "category": "expenses",
    "cycle": "expenditure"
  },
  "6100-6199": {
    "leadsheet": "1600",
    "name": "Distribution Costs",
    "category": "expenses",
    "cycle": "expenditure"
  },
  "6200-6299": {
    "leadsheet": "1600",
    "name": "Administrative Expenses",
    "category": "expenses",
    "cycle": "expenditure"
  },
  "6300-6399": {
    "leadsheet": "1600",
    "name": "Staff Costs",
    "category": "expenses",
    "cycle": "payroll"
  },
  "6400-6499": {
    "leadsheet": "1800",
    "name": "Other Expenses",
    "category": "expenses",
    "cycle": "general"
  },
  "6500-6599": {
    "leadsheet": "1800",
    "name": "Finance Costs",
    "category": "expenses",
    "cycle": "general"
  },
  "6600-6699": {
    "leadsheet": "325",
    "name": "Tax Expense",
    "category": "expenses",
    "cycle": "general"
  }
};

export const TB_FORMAT = {
  "description": "Trial Balance Upload Format for AuditorBox",
  "accepted_formats": [
    "CSV",
    "XLSX",
    "JSON"
  ],
  "required_columns": {
    "account_code": {
      "type": "string",
      "description": "Account code (e.g., '1400', '1400.01')"
    },
    "account_name": {
      "type": "string",
      "description": "Account description"
    },
    "debit": {
      "type": "number",
      "description": "Debit balance (positive number or 0)"
    },
    "credit": {
      "type": "number",
      "description": "Credit balance (positive number or 0)"
    }
  },
  "optional_columns": {
    "prior_debit": {
      "type": "number",
      "description": "Prior year debit balance"
    },
    "prior_credit": {
      "type": "number",
      "description": "Prior year credit balance"
    },
    "group_code": {
      "type": "string",
      "description": "Group/parent account code"
    },
    "sub_account": {
      "type": "boolean",
      "description": "Is this a sub-account?"
    },
    "map_no": {
      "type": "string",
      "description": "Manual leadsheet mapping override"
    }
  },
  "notes": [
    "Either debit or credit should be non-zero for each row, not both",
    "Net balance = debit - credit (positive = debit balance, negative = credit balance)",
    "Account codes can be numeric or alphanumeric",
    "Prior year data enables comparative analytical procedures"
  ]
};

export const ENGAGEMENT_SCHEMA = {
  "description": "Engagement Configuration for AuditorBox",
  "fields": {
    "id": {
      "type": "string",
      "required": true,
      "description": "Unique engagement identifier"
    },
    "client_name": {
      "type": "string",
      "required": true
    },
    "year_end": {
      "type": "date",
      "required": true,
      "format": "YYYY-MM-DD"
    },
    "prior_year_end": {
      "type": "date",
      "required": false
    },
    "reporting_framework": {
      "type": "enum",
      "required": true,
      "values": [
        "IFRS",
        "US_GAAP",
        "UK_GAAP",
        "IPSAS",
        "Local_GAAP"
      ]
    },
    "entity_type": {
      "type": "enum",
      "required": true,
      "values": [
        "listed",
        "private",
        "nfp",
        "public_sector",
        "sme"
      ]
    },
    "currency": {
      "type": "string",
      "required": true,
      "default": "USD"
    },
    "industry_sector": {
      "type": "enum",
      "required": true,
      "values": [
        "financial_services",
        "manufacturing",
        "retail",
        "technology",
        "real_estate",
        "healthcare",
        "nfp_government",
        "other"
      ]
    },
    "team": {
      "type": "array",
      "items": {
        "name": "string",
        "role": {
          "type": "enum",
          "values": [
            "partner",
            "eqcr",
            "manager",
            "senior",
            "staff"
          ]
        },
        "email": "string"
      }
    },
    "materiality": {
      "type": "object",
      "fields": {
        "benchmark": {
          "type": "enum",
          "values": [
            "revenue",
            "total_assets",
            "pbt",
            "equity",
            "total_expenses",
            "gross_profit"
          ]
        },
        "benchmark_amount": "number",
        "percentage": "number",
        "overall": "number",
        "performance": "number",
        "pm_factor": {
          "type": "number",
          "min": 0.5,
          "max": 0.75
        },
        "trivial": "number",
        "trivial_factor": {
          "type": "number",
          "default": 0.05
        }
      }
    },
    "risk_profile": {
      "type": "enum",
      "values": [
        "low",
        "medium",
        "high"
      ]
    },
    "is_group_audit": {
      "type": "boolean",
      "default": false
    },
    "is_first_year": {
      "type": "boolean",
      "default": false
    },
    "requires_eqcr": {
      "type": "boolean",
      "default": false
    },
    "going_concern_risk": {
      "type": "boolean",
      "default": false
    }
  }
};

export const SAMPLE_TB = {
  "description": "Sample Trial Balance for AuditorBox Testing",
  "client": "Demo Corporation Ltd",
  "year_end": "2025-12-31",
  "currency": "USD",
  "accounts": [
    {
      "account_code": "1000",
      "account_name": "Land & Buildings",
      "debit": 5000000,
      "credit": 0,
      "prior_debit": 4800000,
      "prior_credit": 0,
      "leadsheet": "1",
      "leadsheet_name": "Property, Plant & Equipment",
      "category": "non_current_assets",
      "cycle": "ppe",
      "net_balance": 5000000
    },
    {
      "account_code": "1001",
      "account_name": "Plant & Machinery",
      "debit": 3000000,
      "credit": 0,
      "prior_debit": 2500000,
      "prior_credit": 0,
      "leadsheet": "1",
      "leadsheet_name": "Property, Plant & Equipment",
      "category": "non_current_assets",
      "cycle": "ppe",
      "net_balance": 3000000
    },
    {
      "account_code": "1002",
      "account_name": "Accumulated Depreciation - PPE",
      "debit": 0,
      "credit": 1200000,
      "prior_debit": 0,
      "prior_credit": 900000,
      "leadsheet": "1",
      "leadsheet_name": "Property, Plant & Equipment",
      "category": "non_current_assets",
      "cycle": "ppe",
      "net_balance": -1200000
    },
    {
      "account_code": "1150",
      "account_name": "Goodwill",
      "debit": 500000,
      "credit": 0,
      "prior_debit": 500000,
      "prior_credit": 0,
      "leadsheet": "10",
      "leadsheet_name": "Intangible Assets & Goodwill",
      "category": "non_current_assets",
      "cycle": "general",
      "net_balance": 500000
    },
    {
      "account_code": "1200",
      "account_name": "Investment in Subsidiary",
      "debit": 2000000,
      "credit": 0,
      "prior_debit": 2000000,
      "prior_credit": 0,
      "leadsheet": "20",
      "leadsheet_name": "Investments",
      "category": "non_current_assets",
      "cycle": "equity",
      "net_balance": 2000000
    },
    {
      "account_code": "1350",
      "account_name": "Raw Materials",
      "debit": 800000,
      "credit": 0,
      "prior_debit": 750000,
      "prior_credit": 0,
      "leadsheet": "110",
      "leadsheet_name": "Inventories",
      "category": "current_assets",
      "cycle": "inventory",
      "net_balance": 800000
    },
    {
      "account_code": "1351",
      "account_name": "Finished Goods",
      "debit": 1200000,
      "credit": 0,
      "prior_debit": 1000000,
      "prior_credit": 0,
      "leadsheet": "110",
      "leadsheet_name": "Inventories",
      "category": "current_assets",
      "cycle": "inventory",
      "net_balance": 1200000
    },
    {
      "account_code": "1400",
      "account_name": "Trade Receivables",
      "debit": 3500000,
      "credit": 0,
      "prior_debit": 3200000,
      "prior_credit": 0,
      "leadsheet": "130",
      "leadsheet_name": "Receivables (Current)",
      "category": "current_assets",
      "cycle": "revenue",
      "net_balance": 3500000
    },
    {
      "account_code": "1401",
      "account_name": "Provision for Bad Debts",
      "debit": 0,
      "credit": 175000,
      "prior_debit": 0,
      "prior_credit": 160000,
      "leadsheet": "130",
      "leadsheet_name": "Receivables (Current)",
      "category": "current_assets",
      "cycle": "revenue",
      "net_balance": -175000
    },
    {
      "account_code": "1450",
      "account_name": "Prepaid Expenses",
      "debit": 150000,
      "credit": 0,
      "prior_debit": 120000,
      "prior_credit": 0,
      "leadsheet": "135",
      "leadsheet_name": "Prepayments",
      "category": "current_assets",
      "cycle": "general",
      "net_balance": 150000
    },
    {
      "account_code": "1500",
      "account_name": "Bank - Current Account",
      "debit": 2500000,
      "credit": 0,
      "prior_debit": 1800000,
      "prior_credit": 0,
      "leadsheet": "140",
      "leadsheet_name": "Cash & Cash Equivalents",
      "category": "current_assets",
      "cycle": "cash",
      "net_balance": 2500000
    },
    {
      "account_code": "1501",
      "account_name": "Petty Cash",
      "debit": 5000,
      "credit": 0,
      "prior_debit": 5000,
      "prior_credit": 0,
      "leadsheet": "140",
      "leadsheet_name": "Cash & Cash Equivalents",
      "category": "current_assets",
      "cycle": "cash",
      "net_balance": 5000
    },
    {
      "account_code": "2000",
      "account_name": "Share Capital",
      "debit": 0,
      "credit": 5000000,
      "prior_debit": 0,
      "prior_credit": 5000000,
      "leadsheet": "200",
      "leadsheet_name": "Share Capital",
      "category": "equity",
      "cycle": "equity",
      "net_balance": -5000000
    },
    {
      "account_code": "2100",
      "account_name": "Share Premium",
      "debit": 0,
      "credit": 1000000,
      "prior_debit": 0,
      "prior_credit": 1000000,
      "leadsheet": "200",
      "leadsheet_name": "Reserves",
      "category": "equity",
      "cycle": "equity",
      "net_balance": -1000000
    },
    {
      "account_code": "2200",
      "account_name": "Retained Earnings",
      "debit": 0,
      "credit": 3800000,
      "prior_debit": 0,
      "prior_credit": 3100000,
      "leadsheet": "200",
      "leadsheet_name": "Retained Earnings",
      "category": "equity",
      "cycle": "equity",
      "net_balance": -3800000
    },
    {
      "account_code": "3000",
      "account_name": "Bank Loan (Long-term)",
      "debit": 0,
      "credit": 3000000,
      "prior_debit": 0,
      "prior_credit": 3500000,
      "leadsheet": "300",
      "leadsheet_name": "Borrowings (Non-current)",
      "category": "non_current_liabilities",
      "cycle": "general",
      "net_balance": -3000000
    },
    {
      "account_code": "3100",
      "account_name": "Deferred Tax Liability",
      "debit": 0,
      "credit": 350000,
      "prior_debit": 0,
      "prior_credit": 300000,
      "leadsheet": "325",
      "leadsheet_name": "Deferred Tax Liabilities",
      "category": "non_current_liabilities",
      "cycle": "general",
      "net_balance": -350000
    },
    {
      "account_code": "4000",
      "account_name": "Bank Overdraft",
      "debit": 0,
      "credit": 200000,
      "prior_debit": 0,
      "prior_credit": 150000,
      "leadsheet": "400",
      "leadsheet_name": "Borrowings (Current)",
      "category": "current_liabilities",
      "cycle": "general",
      "net_balance": -200000
    },
    {
      "account_code": "4100",
      "account_name": "Trade Payables",
      "debit": 0,
      "credit": 2800000,
      "prior_debit": 0,
      "prior_credit": 2500000,
      "leadsheet": "425",
      "leadsheet_name": "Trade Payables",
      "category": "current_liabilities",
      "cycle": "expenditure",
      "net_balance": -2800000
    },
    {
      "account_code": "4200",
      "account_name": "Accrued Expenses",
      "debit": 0,
      "credit": 450000,
      "prior_debit": 0,
      "prior_credit": 380000,
      "leadsheet": "430",
      "leadsheet_name": "Other Current Liabilities",
      "category": "current_liabilities",
      "cycle": "expenditure",
      "net_balance": -450000
    },
    {
      "account_code": "4201",
      "account_name": "VAT Payable",
      "debit": 0,
      "credit": 280000,
      "prior_debit": 0,
      "prior_credit": 250000,
      "leadsheet": "430",
      "leadsheet_name": "Other Current Liabilities",
      "category": "current_liabilities",
      "cycle": "expenditure",
      "net_balance": -280000
    },
    {
      "account_code": "5000",
      "account_name": "Sales Revenue",
      "debit": 0,
      "credit": 25000000,
      "prior_debit": 0,
      "prior_credit": 22000000,
      "leadsheet": "1500",
      "leadsheet_name": "Revenue",
      "category": "income",
      "cycle": "revenue",
      "net_balance": -25000000
    },
    {
      "account_code": "5100",
      "account_name": "Other Income",
      "debit": 0,
      "credit": 200000,
      "prior_debit": 0,
      "prior_credit": 150000,
      "leadsheet": "1700",
      "leadsheet_name": "Other Income",
      "category": "income",
      "cycle": "revenue",
      "net_balance": -200000
    },
    {
      "account_code": "6000",
      "account_name": "Cost of Sales",
      "debit": 15000000,
      "credit": 0,
      "prior_debit": 13200000,
      "prior_credit": 0,
      "leadsheet": "1600",
      "leadsheet_name": "Cost of Sales",
      "category": "expenses",
      "cycle": "expenditure",
      "net_balance": 15000000
    },
    {
      "account_code": "6100",
      "account_name": "Distribution Costs",
      "debit": 1500000,
      "credit": 0,
      "prior_debit": 1300000,
      "prior_credit": 0,
      "leadsheet": "1600",
      "leadsheet_name": "Distribution Costs",
      "category": "expenses",
      "cycle": "expenditure",
      "net_balance": 1500000
    },
    {
      "account_code": "6200",
      "account_name": "Administrative Expenses",
      "debit": 3080000,
      "credit": 0,
      "prior_debit": 1800000,
      "prior_credit": 0,
      "leadsheet": "1600",
      "leadsheet_name": "Administrative Expenses",
      "category": "expenses",
      "cycle": "expenditure",
      "net_balance": 3080000
    },
    {
      "account_code": "6300",
      "account_name": "Staff Costs",
      "debit": 4000000,
      "credit": 0,
      "prior_debit": 3600000,
      "prior_credit": 0,
      "leadsheet": "1600",
      "leadsheet_name": "Staff Costs",
      "category": "expenses",
      "cycle": "payroll",
      "net_balance": 4000000
    },
    {
      "account_code": "6400",
      "account_name": "Depreciation",
      "debit": 300000,
      "credit": 0,
      "prior_debit": 280000,
      "prior_credit": 0,
      "leadsheet": "1800",
      "leadsheet_name": "Other Expenses",
      "category": "expenses",
      "cycle": "general",
      "net_balance": 300000
    },
    {
      "account_code": "6500",
      "account_name": "Finance Costs",
      "debit": 250000,
      "credit": 0,
      "prior_debit": 300000,
      "prior_credit": 0,
      "leadsheet": "1800",
      "leadsheet_name": "Finance Costs",
      "category": "expenses",
      "cycle": "general",
      "net_balance": 250000
    },
    {
      "account_code": "6600",
      "account_name": "Income Tax Expense",
      "debit": 670000,
      "credit": 0,
      "prior_debit": 555000,
      "prior_credit": 0,
      "leadsheet": "325",
      "leadsheet_name": "Tax Expense",
      "category": "expenses",
      "cycle": "general",
      "net_balance": 670000
    }
  ],
  "totals": {
    "total_debit": 43455000,
    "total_credit": 43455000,
    "balanced": true
  }
};
