// Auto-generated from master_graph.json + audit_graph.json
// 455 nodes, 195 edges

export const GRAPH_NODES = [
  {
    "id": "1",
    "label": "Property, plant and equipment leadsheet",
    "type": "leadsheet",
    "area": "general",
    "cycle": "PP&E",
    "inDegree": 1,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "",
      "is_parent": true,
      "purpose": "Engagement letter and terms of engagement documentation"
    }
  },
  {
    "id": "1.1",
    "label": "Property, plant and equipment - Cost",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "PP&E",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "1",
      "is_parent": false,
      "purpose": "Track property, plant and equipment costs with account details including prelimi"
    }
  },
  {
    "id": "1.101",
    "label": "1.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "101",
      "is_parent": false,
      "purpose": "Receivables non-current leadsheet - tracks non-current receivables account balan"
    }
  },
  {
    "id": "1.102",
    "label": "1.102",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "102",
      "is_parent": false,
      "purpose": "Property, plant and equipment - Depreciation"
    }
  },
  {
    "id": "1.120",
    "label": "Property, plant and equipment - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "PP&E",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "120",
      "is_parent": false,
      "purpose": "Property, plant and equipment - Substantive analytical procedures form for perfo"
    }
  },
  {
    "id": "1.2",
    "label": "Property, plant and equipment - Depreciation",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "PP&E",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "2",
      "is_parent": false,
      "purpose": "Property, plant and equipment - Depreciation"
    }
  },
  {
    "id": "10",
    "label": "Intangible assets and goodwill leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "intangible_assets_and_goodwill",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "10.1",
    "label": "Intangible assets - Cost",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "intangible_assets",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "10",
      "sub": "1",
      "is_parent": true,
      "purpose": "Working trial balance lead sheet for Intangible assets and goodwill at cost, use"
    }
  },
  {
    "id": "10.101",
    "label": "10.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 9,
    "isHub": true,
    "hierarchy": {
      "base": "10",
      "sub": "101",
      "is_parent": false,
      "purpose": "Comprehensive audit procedures work program for Notes Payable and Bank Debt (Sec"
    }
  },
  {
    "id": "10.102",
    "label": "10.102",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 3,
    "isHub": true,
    "hierarchy": {
      "base": "10",
      "sub": "102",
      "is_parent": false,
      "purpose": "IAS 38 compliance checklist for intangibles, goodwill and other intangible asset"
    }
  },
  {
    "id": "10.103",
    "label": "10.103",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 12,
    "isHub": true,
    "hierarchy": {
      "base": "10",
      "sub": "103",
      "is_parent": false,
      "purpose": "IFRS 3 compliance checklist for Business Combinations under the Acquisition Meth"
    }
  },
  {
    "id": "10.120",
    "label": "Intangible assets and goodwill - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "intangible_assets_and_goodwill",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "10",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for intangible assets and goodwill to assess r"
    }
  },
  {
    "id": "10.2",
    "label": "Intangible assets - Amortisation and impairment",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "intangible_assets",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {
      "base": "10",
      "sub": "2",
      "is_parent": false,
      "purpose": "Working trial balance lead sheet for Intangible assets and goodwill - Amortisati"
    }
  },
  {
    "id": "10.3",
    "label": "Goodwill - Cost",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "intangible_assets_and_goodwill",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "10.4",
    "label": "Goodwill - Amortisation and impairment",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "goodwill",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "100",
    "label": "Report approval and transmittal",
    "type": "procedure",
    "area": "completion",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "100.",
    "label": "100.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "100",
      "sub": "",
      "is_parent": true,
      "purpose": "Report approval and transmittal"
    }
  },
  {
    "id": "1000.1",
    "label": "Analytical review",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1000",
      "sub": "1",
      "is_parent": true,
      "purpose": "Analytical review showing financial statement line items with current and prior"
    }
  },
  {
    "id": "1000.2",
    "label": "Financial ratios",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "106",
    "label": "Simple statements",
    "type": "worksheet",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "106.",
    "label": "106.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "106",
      "sub": "",
      "is_parent": true,
      "purpose": "Financial statement preparation and review documentation"
    }
  },
  {
    "id": "110",
    "label": "Inventories leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "110",
      "sub": "",
      "is_parent": true,
      "purpose": "Inventories leadsheet - audit of inventory balances and procedures"
    }
  },
  {
    "id": "110.1",
    "label": "Inventories - Raw materials",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "110.101",
    "label": "110.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "110",
      "sub": "101",
      "is_parent": false,
      "purpose": "Inventory audit procedures - document audit tests and procedures for inventory"
    }
  },
  {
    "id": "110.110",
    "label": "Inventory count checklist",
    "type": "checklist",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 1,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "110",
      "sub": "110",
      "is_parent": false,
      "purpose": "Inventory count checklist"
    }
  },
  {
    "id": "110.120",
    "label": "Inventories - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "110.2",
    "label": "Inventories - Work in progress",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "110.3",
    "label": "Inventories - Finished goods",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "110.4",
    "label": "Inventories - Merchandise",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "110",
      "sub": "4",
      "is_parent": false,
      "purpose": "Inventories - Merchandise leadsheet showing account balances with preliminary am"
    }
  },
  {
    "id": "110.5",
    "label": "Inventories - Production supplies",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "110.6",
    "label": "Inventories - Other inventories for sale",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "110",
      "sub": "6",
      "is_parent": false,
      "purpose": "Inventories - Other inventories for sale leadsheet showing account balances with"
    }
  },
  {
    "id": "110.7",
    "label": "Inventories - Other",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "110",
      "sub": "7",
      "is_parent": false,
      "purpose": "Document inventories (other) account balances with preliminary amounts, adjustme"
    }
  },
  {
    "id": "120",
    "label": "Other financial assets, current leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "120.101",
    "label": "120.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 6,
    "isHub": true,
    "hierarchy": {
      "base": "120",
      "sub": "101",
      "is_parent": true,
      "purpose": "Detailed audit response workpaper for Other Financial Assets (Investment of Exce"
    }
  },
  {
    "id": "120.120",
    "label": "Other financial assets, current - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "120",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for other financial assets, current"
    }
  },
  {
    "id": "130",
    "label": "Receivables, current leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "130",
      "sub": "",
      "is_parent": true,
      "purpose": "Working trial balance lead sheet for Receivables, current account grouping, used"
    }
  },
  {
    "id": "130.1",
    "label": "Trade receivables",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "130.101",
    "label": "130.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 9,
    "isHub": true,
    "hierarchy": {
      "base": "130",
      "sub": "101",
      "is_parent": false,
      "purpose": "Detailed audit response workpaper for Accounts Receivable (trade and other), des"
    }
  },
  {
    "id": "130.110",
    "label": "Accounts receivable confirmation - Supplementary Procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 1,
    "outDegree": 6,
    "isHub": false,
    "hierarchy": {
      "base": "130",
      "sub": "110",
      "is_parent": false,
      "purpose": "Supplementary procedures for accounts receivable confirmation, providing detaile"
    }
  },
  {
    "id": "130.120",
    "label": "Receivables, current - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "130",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for receivables, current"
    }
  },
  {
    "id": "130.2",
    "label": "Other receivables",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "130",
      "sub": "2",
      "is_parent": false,
      "purpose": "Document trade receivables and other receivables account balances"
    }
  },
  {
    "id": "135",
    "label": "Prepayments leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "prepayments",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "135",
      "sub": "",
      "is_parent": true,
      "purpose": "Working trial balance lead sheet for Prepayments account grouping, used to docum"
    }
  },
  {
    "id": "135.101",
    "label": "135.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "135",
      "sub": "101",
      "is_parent": false,
      "purpose": "Audit procedures for prepaid expenses and other assets"
    }
  },
  {
    "id": "135.120",
    "label": "Prepayments - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "prepayments",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "135",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures working paper for Prepayments, designed to doc"
    }
  },
  {
    "id": "140",
    "label": "Cash and cash equivalents leadsheet",
    "type": "leadsheet",
    "area": "general",
    "cycle": "cash",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "140.101",
    "label": "140.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "140",
      "sub": "101",
      "is_parent": true,
      "purpose": "Document audit procedures for cash accounts including substantive procedures and"
    }
  },
  {
    "id": "140.110",
    "label": "Bank reconciliation procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "cash",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "140.115",
    "label": "Cash count procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "cash",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "140",
      "sub": "115",
      "is_parent": false,
      "purpose": "Document cash count procedures for audit verification of cash on hand"
    }
  },
  {
    "id": "140.120",
    "label": "Cash and cash equivalents - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "cash",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "140",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for cash and cash equivalents to verify balanc"
    }
  },
  {
    "id": "1500",
    "label": "Revenues leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "revenue",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1500",
      "sub": "",
      "is_parent": true,
      "purpose": "Working trial balance lead sheet for Revenues account grouping, used to document"
    }
  },
  {
    "id": "1500.120",
    "label": "Revenues - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "revenue",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1500",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for revenues"
    }
  },
  {
    "id": "1600",
    "label": "Operating expenses leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "expenses",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "",
      "is_parent": true,
      "purpose": "Operating expenses leadsheet showing account balances with preliminary amounts,"
    }
  },
  {
    "id": "1600.1",
    "label": "Change in inventories and work in progress",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "1",
      "is_parent": false,
      "purpose": "Change in inventories and work in progress leadsheet"
    }
  },
  {
    "id": "1600.101",
    "label": "1600.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "101",
      "is_parent": false,
      "purpose": "Document audit procedures for cost of sales including substantive procedures and"
    }
  },
  {
    "id": "1600.102",
    "label": "Cost of sales - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "cost_of_sales",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "102",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for cost of sales"
    }
  },
  {
    "id": "1600.105",
    "label": "1600.105",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "105",
      "is_parent": false,
      "purpose": "Detailed audit procedures for payroll and other expenses including substantive t"
    }
  },
  {
    "id": "1600.106",
    "label": "Payroll and other expenses - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "payroll, expenses",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "106",
      "is_parent": false,
      "purpose": "Payroll and other expenses - substantive analytical procedures for payroll expen"
    }
  },
  {
    "id": "1600.2",
    "label": "Raw materials and consumables used",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "2",
      "is_parent": false,
      "purpose": "Subsequent events review and documentation"
    }
  },
  {
    "id": "1600.3",
    "label": "Staff costs",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "payroll",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "3",
      "is_parent": false,
      "purpose": "Staff costs leadsheet showing detailed breakdown of payroll expenses with prelim"
    }
  },
  {
    "id": "1600.4",
    "label": "Other operating expenses, area by nature",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "expenses",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "4",
      "is_parent": false,
      "purpose": "Leadsheet for tracking other operating expenses analyzed by nature of expense"
    }
  },
  {
    "id": "1600.5",
    "label": "Cost of sales",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "cost_of_sales",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "5",
      "is_parent": false,
      "purpose": "Cost of sales leadsheet"
    }
  },
  {
    "id": "1600.6",
    "label": "Distribution costs",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "distribution_costs",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "6",
      "is_parent": false,
      "purpose": "Leadsheet for tracking distribution costs"
    }
  },
  {
    "id": "1600.7",
    "label": "Administrative costs",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "7",
      "is_parent": false,
      "purpose": "Leadsheet for tracking administrative costs"
    }
  },
  {
    "id": "1600.8",
    "label": "Other operating expenses, area by function",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "expenses",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1600",
      "sub": "8",
      "is_parent": false,
      "purpose": "Working trial balance lead sheet for Other operating expenses by function, used"
    }
  },
  {
    "id": "1700",
    "label": "Other income leadsheet",
    "type": "leadsheet",
    "area": "general",
    "cycle": "other_income",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1700",
      "sub": "",
      "is_parent": true,
      "purpose": "Working trial balance lead sheet for Other income account grouping, used to docu"
    }
  },
  {
    "id": "1700.1",
    "label": "Other operating income, area by nature",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1700",
      "sub": "1",
      "is_parent": false,
      "purpose": "Leadsheet for tracking other operating income analyzed by nature"
    }
  },
  {
    "id": "1700.2",
    "label": "Other operating income, area by function",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "revenue",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1700",
      "sub": "2",
      "is_parent": false,
      "purpose": "Track and analyze other operating income by functional area, showing preliminary"
    }
  },
  {
    "id": "1700.3",
    "label": "Other income",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1700",
      "sub": "3",
      "is_parent": false,
      "purpose": "Leadsheet for tracking other income"
    }
  },
  {
    "id": "1800",
    "label": "Other expenses leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1800",
      "sub": "",
      "is_parent": true,
      "purpose": "Other expenses leadsheet - Trial balance showing Prelim, Adj's, Rep values"
    }
  },
  {
    "id": "2.100",
    "label": "Issues - All",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "100",
      "is_parent": false,
      "purpose": "Issues tracking form for all audit issues"
    }
  },
  {
    "id": "2.105",
    "label": "Issues - My issues",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "105",
      "is_parent": false,
      "purpose": "Issues tracking - My issues"
    }
  },
  {
    "id": "2.11 - Notes to financial statements",
    "label": "2.11 - Notes to financial statements",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "2.110",
    "label": "Issues - Outstanding",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "110",
      "is_parent": false,
      "purpose": "Audit planning and strategy documentation"
    }
  },
  {
    "id": "2.115",
    "label": "Issues - Review notes",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "115",
      "is_parent": false,
      "purpose": "Issues tracking - Review notes"
    }
  },
  {
    "id": "2.16 - Working papers supporting statement",
    "label": "2.16 - Working papers supporting statement",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "2.25",
    "label": "Trial balance - By leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "2.30",
    "label": "Trial balance - By map no",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "30",
      "is_parent": false,
      "purpose": "Trial balance organized by map number showing preliminary balances, adjustments,"
    }
  },
  {
    "id": "2.35",
    "label": "Trial balance - By account number",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "2.50",
    "label": "Reclassifying journal entries",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "2.55",
    "label": "Elimination entries",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "55",
      "is_parent": false,
      "purpose": "Working paper to document elimination entries for consolidated financial stateme"
    }
  },
  {
    "id": "2.60",
    "label": "Closing entries",
    "type": "procedure",
    "area": "completion",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "60",
      "is_parent": false,
      "purpose": "Scoping and risk assessment documentation"
    }
  },
  {
    "id": "2.65",
    "label": "Tax journal entries",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "tax",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "65",
      "is_parent": false,
      "purpose": "Record and track tax journal entries including debits, credits, account details,"
    }
  },
  {
    "id": "2.75",
    "label": "Tickmarks",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "75",
      "is_parent": false,
      "purpose": "Tickmarks reference guide providing standardized audit notation legend for docum"
    }
  },
  {
    "id": "20",
    "label": "Investments leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "investments",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "",
      "is_parent": true,
      "purpose": "General investments leadsheet for tracking investment portfolio balances, adjust"
    }
  },
  {
    "id": "20.1",
    "label": "Investments in subsidiaries",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "1",
      "is_parent": false,
      "purpose": "Investments in subsidiaries leadsheet - Trial balance showing Prelim, Adj's, Rep"
    }
  },
  {
    "id": "20.101",
    "label": "20.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "101",
      "is_parent": false,
      "purpose": "Long-term investments audit procedures (for portfolio investments see 120.101)"
    }
  },
  {
    "id": "20.120",
    "label": "Investments - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "investments",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "120",
      "is_parent": false,
      "purpose": "Investments - Substantive analytical procedures form for performing analytical p"
    }
  },
  {
    "id": "20.2",
    "label": "Investments in associates",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "2",
      "is_parent": false,
      "purpose": "Investments in associates"
    }
  },
  {
    "id": "20.3",
    "label": "Investments in joint ventures",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "3",
      "is_parent": false,
      "purpose": "Investments in joint ventures leadsheet - Trial balance showing Prelim, Adj's, R"
    }
  },
  {
    "id": "20.4",
    "label": "Investments in subsidiaries",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "20",
      "sub": "4",
      "is_parent": false,
      "purpose": "Investments in subsidiaries leadsheet for tracking investment balances and chang"
    }
  },
  {
    "id": "200",
    "label": "Equity leadsheet",
    "type": "leadsheet",
    "area": "reporting",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "",
      "is_parent": true,
      "purpose": "Equity leadsheet for tracking shareholders' equity components including share ca"
    }
  },
  {
    "id": "200.1",
    "label": "Equity - Shares",
    "type": "worksheet",
    "area": "general",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "1",
      "is_parent": false,
      "purpose": "Equity - Shares leadsheet - Trial balance showing Prelim, Adj's, Rep values"
    }
  },
  {
    "id": "200.102",
    "label": "200.102",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "102",
      "is_parent": false,
      "purpose": "Summary of accounting records and trial balance differences - tracks differences"
    }
  },
  {
    "id": "200.120",
    "label": "Equity - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "120",
      "is_parent": false,
      "purpose": "Equity - Substantive analytical procedures"
    }
  },
  {
    "id": "200.2",
    "label": "Equity - Reserves",
    "type": "worksheet",
    "area": "general",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "2",
      "is_parent": false,
      "purpose": "Document equity reserves account balances"
    }
  },
  {
    "id": "200.3",
    "label": "Equity - Treasury",
    "type": "worksheet",
    "area": "general",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "3",
      "is_parent": false,
      "purpose": "Equity - Treasury leadsheet - Trial balance showing Prelim, Adj's, Rep values"
    }
  },
  {
    "id": "200.4",
    "label": "Equity - Retained earnings",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "4",
      "is_parent": false,
      "purpose": "Equity - Retained earnings"
    }
  },
  {
    "id": "200.5",
    "label": "Equity - Other",
    "type": "worksheet",
    "area": "general",
    "cycle": "equity",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "200",
      "sub": "5",
      "is_parent": false,
      "purpose": "Equity - Other account leadsheet tracking equity account balances"
    }
  },
  {
    "id": "260",
    "label": "260",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "3",
    "label": "3",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "3",
      "sub": "",
      "is_parent": true,
      "purpose": "Understanding the entity and its environment"
    }
  },
  {
    "id": "300",
    "label": "Borrowings, non-current leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "borrowings",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "300",
      "sub": "",
      "is_parent": true,
      "purpose": "Borrowings, non-current leadsheet"
    }
  },
  {
    "id": "300.1",
    "label": "Interest-bearing borrowings, non-current",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "debt",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "300",
      "sub": "1",
      "is_parent": false,
      "purpose": "Interest-bearing borrowings, non-current"
    }
  },
  {
    "id": "300.101",
    "label": "300.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 8,
    "isHub": true,
    "hierarchy": {
      "base": "300",
      "sub": "101",
      "is_parent": false,
      "purpose": "Detailed audit response workpaper for Long-term Debt, designed to document risk"
    }
  },
  {
    "id": "300.120",
    "label": "Borrowings, non-current - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "borrowings",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "300",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for borrowings, non-current"
    }
  },
  {
    "id": "300.2",
    "label": "Non-interest-bearing borrowings, non-current",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "payables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "300",
      "sub": "2",
      "is_parent": false,
      "purpose": "Non-interest-bearing borrowings, non-current leadsheet for tracking long-term de"
    }
  },
  {
    "id": "301",
    "label": "Engagement quality control review checklist",
    "type": "checklist",
    "area": "completion",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "301.",
    "label": "301.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "301",
      "sub": "",
      "is_parent": true,
      "purpose": "Engagement quality control review checklist"
    }
  },
  {
    "id": "302",
    "label": "Worksheet - Engagement quality review checklist",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "304",
    "label": "304",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "304",
      "sub": "",
      "is_parent": true,
      "purpose": "Optimiser checklist for the Reporting Checklist (Form 305) to identify and remov"
    }
  },
  {
    "id": "304.",
    "label": "Optimiser - Reporting checklist",
    "type": "checklist",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "305",
    "label": "305",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 12,
    "isHub": true,
    "hierarchy": {
      "base": "305",
      "sub": "",
      "is_parent": true,
      "purpose": "Comprehensive reporting checklist to ensure the auditor's report complies with I"
    }
  },
  {
    "id": "305.",
    "label": "305.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "310",
    "label": "310",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "310.",
    "label": "310.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "310",
      "sub": "",
      "is_parent": true,
      "purpose": "Audit completion checklist to ensure all audit engagement items have been comple"
    }
  },
  {
    "id": "311",
    "label": "311",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "311",
      "sub": "",
      "is_parent": true,
      "purpose": "Documentation checklist for audit completion"
    }
  },
  {
    "id": "320",
    "label": "Notes on significant audit decisions",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "320.",
    "label": "320.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "320",
      "sub": "",
      "is_parent": true,
      "purpose": "Notes on significant audit decisions - document significant matters, conclusions"
    }
  },
  {
    "id": "325",
    "label": "Deferred tax liabilities leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "deferred_tax_liabilities",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {
      "base": "325",
      "sub": "",
      "is_parent": true,
      "purpose": "Worksheet to identify, document, and evaluate potential key audit matters (KAM)"
    }
  },
  {
    "id": "325.101",
    "label": "325.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "325.120",
    "label": "Deferred tax liabilities - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "deferred_tax_liabilities",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "325",
      "sub": "120",
      "is_parent": false,
      "purpose": "Deferred tax liabilities - substantive analytical procedures for testing deferre"
    }
  },
  {
    "id": "330",
    "label": "Other liabilities, non-current leadsheet",
    "type": "leadsheet",
    "area": "general",
    "cycle": "liabilities",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "330",
      "sub": "",
      "is_parent": false,
      "purpose": "Working trial balance lead sheet for Other liabilities, non-current account grou"
    }
  },
  {
    "id": "330.",
    "label": "330.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "330",
      "sub": "",
      "is_parent": true,
      "purpose": "Audit findings and matters for discussion tracking"
    }
  },
  {
    "id": "330.101",
    "label": "330.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "330",
      "sub": "101",
      "is_parent": false,
      "purpose": "Loans and advances payable - Audit procedures"
    }
  },
  {
    "id": "330.120",
    "label": "Other liabilities, non-current - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "liabilities",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335",
    "label": "Misstatements Summary",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 6,
    "outDegree": 6,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335-1",
    "label": "Misstatements - Audit Plan",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335.10",
    "label": "Uncorrected misstatements - all",
    "type": "worksheet",
    "area": "completion",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335.11",
    "label": "Unrecorded misstatements - factual",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335.12",
    "label": "Uncorrected missstatments - projected",
    "type": "worksheet",
    "area": "completion",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335.13",
    "label": "Uncorrected misstatements - judgmental",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "335.14",
    "label": "Adjusted journal entries - corrected by client",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "335",
      "sub": "14",
      "is_parent": true,
      "purpose": "Adjusted journal entries - corrected by client - tracks adjusting entries that w"
    }
  },
  {
    "id": "335.15",
    "label": "Adjusted journal entries from client",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "335",
      "sub": "15",
      "is_parent": false,
      "purpose": "Document adjusted journal entries received from client during the audit period"
    }
  },
  {
    "id": "335.20",
    "label": "All adjusted journal entries",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "335",
      "sub": "20",
      "is_parent": false,
      "purpose": "Comprehensive report of all adjusted journal entries for the audit period showin"
    }
  },
  {
    "id": "340",
    "label": "340",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "340",
      "sub": "",
      "is_parent": true,
      "purpose": "Communications to be made by the auditor with Those Charged With Governance (TCW"
    }
  },
  {
    "id": "35",
    "label": "Receivables, non-current leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "35",
      "sub": "",
      "is_parent": true,
      "purpose": "Receivables non-current leadsheet - tracks non-current receivable balances"
    }
  },
  {
    "id": "35.120",
    "label": "Receivables, non-current - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "35",
      "sub": "120",
      "is_parent": false,
      "purpose": "Perform substantive analytical procedures for receivables, non-current accounts"
    }
  },
  {
    "id": "350",
    "label": "Management representation letter - sample for editing",
    "type": "letter",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "350.",
    "label": "350.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "350",
      "sub": "",
      "is_parent": true,
      "purpose": "Evaluation of misstatements identified during the audit"
    }
  },
  {
    "id": "351",
    "label": "351",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "360-1",
    "label": "Communicating IC Matters - material weaknesses/significant deficiencies - Sample Letter",
    "type": "letter",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "360-2",
    "label": "Communicating IC Matters - only 'other matters' - Sample Letter",
    "type": "letter",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "360-3",
    "label": "Key Audit Matters (KAM)",
    "type": "procedure",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "360.",
    "label": "Management letter report",
    "type": "report",
    "area": "completion",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "360",
      "sub": "",
      "is_parent": true,
      "purpose": "Management letter report - Summarizes reportable items accumulated through the e"
    }
  },
  {
    "id": "365",
    "label": "Management letter - Sample for editing",
    "type": "letter",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "366",
    "label": "Report for TCWG - Sample for editing",
    "type": "report",
    "area": "completion",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "366.",
    "label": "366.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "366",
      "sub": "",
      "is_parent": true,
      "purpose": "Report for Those Charged With Governance (TCWG) - Sample for editing"
    }
  },
  {
    "id": "367",
    "label": "Audit findings - Sample letter",
    "type": "letter",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "367.",
    "label": "367.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "367",
      "sub": "",
      "is_parent": true,
      "purpose": "Report for Those Charged With Governance (TCWG) - Detailed audit findings"
    }
  },
  {
    "id": "368",
    "label": "Significant deficiencies in internal control (Those charged with governance)",
    "type": "letter",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "370",
    "label": "Matters for future consideration",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "370",
      "sub": "",
      "is_parent": true,
      "purpose": "Document matters for future consideration to assist in planning and performing f"
    }
  },
  {
    "id": "380.",
    "label": "Worksheet - Withdrawal",
    "type": "worksheet",
    "area": "completion",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "4.10",
    "label": "History - Role completion",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "4",
      "sub": "10",
      "is_parent": true,
      "purpose": "History tracking for role completion showing user activity and timestamps"
    }
  },
  {
    "id": "4.20",
    "label": "History - Document creation",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 8,
    "isHub": true,
    "hierarchy": {
      "base": "4",
      "sub": "20",
      "is_parent": false,
      "purpose": "History log tracking document creation events within the engagement file, record"
    }
  },
  {
    "id": "4.30",
    "label": "History - Document deletion",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "4",
      "sub": "30",
      "is_parent": false,
      "purpose": "History log tracking document deletion events within the engagement file, record"
    }
  },
  {
    "id": "4.40",
    "label": "History - Document modification",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "4.50",
    "label": "History - Post lockdown events",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400",
    "label": "Borrowings leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "borrowings",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "400",
      "sub": "",
      "is_parent": true,
      "purpose": "Borrowings leadsheet - Trial balance showing Prelim, Adj's, Rep values"
    }
  },
  {
    "id": "400-1",
    "label": "Optimiser checklist - Profiles 2, 3 and 4",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-2",
    "label": "Optimiser checklist - Profile 5",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-3",
    "label": "Optimiser checklist - Profile 1",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-4",
    "label": "Optimiser checklist - Profiles 2, 3 and 4",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-4 - Optimiser checklist - Profiles 2, 3",
    "label": "400-4 - Optimiser checklist - Profiles 2, 3",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-5",
    "label": "Optimiser checklist - Profile 5",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-5 - Optimiser checklist - Profile 5",
    "label": "400-5 - Optimiser checklist - Profile 5",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-6",
    "label": "Optimiser checklist - Profile 1",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400-6 - Optimiser checklist - Profile 1",
    "label": "400-6 - Optimiser checklist - Profile 1",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400.",
    "label": "Optimiser checklist - Profiles 6 and 7",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400.1",
    "label": "Interest-bearing borrowings",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "debt",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400.101",
    "label": "400.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "400.120",
    "label": "Borrowings - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "borrowings",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "400",
      "sub": "120",
      "is_parent": false,
      "purpose": "Perform substantive analytical procedures for borrowings accounts"
    }
  },
  {
    "id": "400.2",
    "label": "Non-interest bearing borrowings",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "400",
      "sub": "2",
      "is_parent": false,
      "purpose": "Working trial balance lead sheet for Non-interest bearing borrowings account gro"
    }
  },
  {
    "id": "4000.101",
    "label": "4000.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "4000",
      "sub": "101",
      "is_parent": true,
      "purpose": "Complex audit procedures or specialized testing"
    }
  },
  {
    "id": "401",
    "label": "Optimiser checklist - Profiles 6 and 7",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "401 - Optimiser checklist - Profiles 6",
    "label": "401 - Optimiser checklist - Profiles 6",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "403.",
    "label": "403.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "403",
      "sub": "",
      "is_parent": true,
      "purpose": "Audit of Disclosures - Review and testing of financial statement disclosures"
    }
  },
  {
    "id": "405",
    "label": "405",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "405.",
    "label": "405.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "405",
      "sub": "",
      "is_parent": true,
      "purpose": "Engagement - Acceptance/Continuance (Core)"
    }
  },
  {
    "id": "406",
    "label": "406",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "408.",
    "label": "408.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "408",
      "sub": "",
      "is_parent": true,
      "purpose": "Initial audit engagement - Opening balances procedures (Core)"
    }
  },
  {
    "id": "415.",
    "label": "415.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "415",
      "sub": "",
      "is_parent": true,
      "purpose": "Engagement letter sample for editing"
    }
  },
  {
    "id": "420",
    "label": "420",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 5,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "420.",
    "label": "Materiality",
    "type": "procedure",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "420",
      "sub": "",
      "is_parent": true,
      "purpose": "Materiality calculation and documentation form - establishes overall materiality"
    }
  },
  {
    "id": "420.600",
    "label": "Group audit - Component materiality (Core)",
    "type": "worksheet",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "420",
      "sub": "600",
      "is_parent": false,
      "purpose": "Document component materiality calculations for group audits"
    }
  },
  {
    "id": "421.600",
    "label": "Component balances (Core)",
    "type": "report",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "421",
      "sub": "600",
      "is_parent": true,
      "purpose": "Component balances (Core) - consolidated view error message indicating no entiti"
    }
  },
  {
    "id": "422",
    "label": "Worksheet - Selecting a component auditor (Core)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "422.",
    "label": "422.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "422",
      "sub": "",
      "is_parent": true,
      "purpose": "Worksheet for selecting and evaluating component auditors in group audit engagem"
    }
  },
  {
    "id": "425",
    "label": "Payables leadsheet",
    "type": "leadsheet",
    "area": "general",
    "cycle": "payables",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "425-1",
    "label": "Team planning discussion action items",
    "type": "worksheet",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "425.1",
    "label": "Trade payables",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "payables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "425.101",
    "label": "425.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 10,
    "isHub": true,
    "hierarchy": {
      "base": "425",
      "sub": "101",
      "is_parent": false,
      "purpose": "Detailed audit response workpaper for accounts payable and accrued liabilities,"
    }
  },
  {
    "id": "425.110",
    "label": "Accounts payable confirmation - Supplementary procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "payables",
    "inDegree": 2,
    "outDegree": 5,
    "isHub": true,
    "hierarchy": {
      "base": "425",
      "sub": "110",
      "is_parent": false,
      "purpose": "Supplementary procedures for accounts payable confirmation, providing detailed g"
    }
  },
  {
    "id": "425.120",
    "label": "Payables - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "payables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "425",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for payables to assess completeness and accura"
    }
  },
  {
    "id": "425.2",
    "label": "Other payables",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "payables",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "425",
      "sub": "2",
      "is_parent": true,
      "purpose": "Related party payables leadsheet showing balances and transactions with related"
    }
  },
  {
    "id": "428",
    "label": "Worksheet - Selecting an auditor's expert",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "428.",
    "label": "428.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "428",
      "sub": "",
      "is_parent": true,
      "purpose": "Worksheet for selecting an auditor's expert and evaluating their competence, cap"
    }
  },
  {
    "id": "430",
    "label": "Other current liabilities leadsheet",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "payables",
    "inDegree": 0,
    "outDegree": 13,
    "isHub": true,
    "hierarchy": {
      "base": "430",
      "sub": "",
      "is_parent": true,
      "purpose": "Overall audit strategy document to establish the scope, timing and direction of"
    }
  },
  {
    "id": "430.101",
    "label": "430.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {
      "base": "430",
      "sub": "101",
      "is_parent": false,
      "purpose": "Bank indebtedness audit procedures including audit response table and detailed t"
    }
  },
  {
    "id": "430.120",
    "label": "Other current liabilities - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "liabilities",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "436",
    "label": "436",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "436-1",
    "label": "Team planning discussions",
    "type": "procedure",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "436.",
    "label": "436.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "436",
      "sub": "",
      "is_parent": true,
      "purpose": "Document workspace - appears to be a blank template or placeholder form"
    }
  },
  {
    "id": "438",
    "label": "Audit planning letter (Those charged with governance)",
    "type": "letter",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "438.",
    "label": "438.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "438",
      "sub": "",
      "is_parent": true,
      "purpose": "Audit planning letter to Those Charged with Governance - communicates audit scop"
    }
  },
  {
    "id": "440",
    "label": "Information/analysis requested from management",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "440",
      "sub": "",
      "is_parent": true,
      "purpose": "Worksheet to document and track requests made to management for preparing analys"
    }
  },
  {
    "id": "441",
    "label": "Firm deliverables and client information",
    "type": "procedure",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "441.",
    "label": "441.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "441",
      "sub": "",
      "is_parent": true,
      "purpose": "Firm deliverables and client information - tracks deliverables such as draft/fin"
    }
  },
  {
    "id": "442",
    "label": "Firm deliverables and client information letter - sample for editing",
    "type": "letter",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "442.",
    "label": "442.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "442",
      "sub": "",
      "is_parent": true,
      "purpose": "Firm deliverables and client information letter - sample for editing"
    }
  },
  {
    "id": "443.",
    "label": "443.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "443",
      "sub": "",
      "is_parent": true,
      "purpose": "Understanding and evaluation of a service organisation"
    }
  },
  {
    "id": "444.",
    "label": "444.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "444",
      "sub": "",
      "is_parent": true,
      "purpose": "Understanding and evaluation of the internal audit function"
    }
  },
  {
    "id": "455",
    "label": "Notes on meetings with management and others",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "455",
      "sub": "",
      "is_parent": false,
      "purpose": "Worksheet to document matters arising from meetings with management and others ("
    }
  },
  {
    "id": "455.",
    "label": "455.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "455",
      "sub": "",
      "is_parent": true,
      "purpose": "Preparing the risk assessment procedures (Core)"
    }
  },
  {
    "id": "5",
    "label": "Investment property leadsheet",
    "type": "leadsheet",
    "area": "general",
    "cycle": "investment_property",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "",
      "is_parent": true,
      "purpose": "Investment property leadsheet for tracking investment property account balances"
    }
  },
  {
    "id": "5.1",
    "label": "Investment property - Cost",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "PP&E",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "1",
      "is_parent": false,
      "purpose": "Investment property - Cost leadsheet for tracking investment property account ba"
    }
  },
  {
    "id": "5.10",
    "label": "Consolidation tree",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5.101",
    "label": "5.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "101",
      "is_parent": false,
      "purpose": "Document audit procedures for investment property including substantive procedur"
    }
  },
  {
    "id": "5.120",
    "label": "Investment property - Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "investment_property",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "120",
      "is_parent": false,
      "purpose": "Substantive analytical procedures for investment property to verify fair value m"
    }
  },
  {
    "id": "5.2",
    "label": "Investment property - Depreciation and impairment",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "PP&E",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "2",
      "is_parent": false,
      "purpose": "Investment property - Depreciation and impairment"
    }
  },
  {
    "id": "5.20",
    "label": "Trial balance - By leadsheet (Consolidation)",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "20",
      "is_parent": false,
      "purpose": "Trial balance - By leadsheet (Consolidation) - Error: Consolidated view currentl"
    }
  },
  {
    "id": "5.30",
    "label": "Trial balance - By map no (Consolidation)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "30",
      "is_parent": false,
      "purpose": "Trial balance by map number (Consolidation) - consolidated view error message"
    }
  },
  {
    "id": "5.40",
    "label": "Trial balance - By account number (Consolidation)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "40",
      "is_parent": false,
      "purpose": "Trial balance report by account number for consolidated view (currently unavaila"
    }
  },
  {
    "id": "5000",
    "label": "Consolidation completion",
    "type": "checklist",
    "area": "completion",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {
      "base": "5000",
      "sub": "",
      "is_parent": true,
      "purpose": "Consolidation completion checklist summarizing audit conclusions related to grou"
    }
  },
  {
    "id": "5001",
    "label": "Worksheet - EQR checklist - Group audits involving component auditors",
    "type": "worksheet",
    "area": "completion",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5002",
    "label": "Group audit - Overall strategy",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 7,
    "isHub": true,
    "hierarchy": {
      "base": "5002",
      "sub": "",
      "is_parent": true,
      "purpose": "Group audit overall strategy checklist to document the initial strategy for the"
    }
  },
  {
    "id": "5003",
    "label": "Group audit - Group audit plan",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 2,
    "outDegree": 8,
    "isHub": true,
    "hierarchy": {
      "base": "5003",
      "sub": "",
      "is_parent": true,
      "purpose": "Group audit plan checklist to document the initial group audit planning process"
    }
  },
  {
    "id": "5004",
    "label": "5004",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5005",
    "label": "5005",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5006",
    "label": "5006",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5007",
    "label": "Group audit - Preparation of group audit instructions",
    "type": "checklist",
    "area": "planning",
    "cycle": "general",
    "inDegree": 2,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {
      "base": "5007",
      "sub": "",
      "is_parent": true,
      "purpose": "Checklist for preparation of group audit instructions to component auditors, ens"
    }
  },
  {
    "id": "5009",
    "label": "Consolidation procedures",
    "type": "checklist",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "5009",
      "sub": "",
      "is_parent": true,
      "purpose": "Consolidation procedures checklist for consolidated financial statements prepara"
    }
  },
  {
    "id": "501-1",
    "label": "Analytical review - Balances - Preliminary",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "501.",
    "label": "501.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "501",
      "sub": "",
      "is_parent": true,
      "purpose": "Audit sampling - design and selection of samples"
    }
  },
  {
    "id": "5010",
    "label": "Goodwill impairment",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "equity",
    "inDegree": 2,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "5010",
      "sub": "",
      "is_parent": true,
      "purpose": "Audit program for goodwill impairment testing, designed to form an opinion on wh"
    }
  },
  {
    "id": "5011",
    "label": "5011",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "506.",
    "label": "506.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "506",
      "sub": "",
      "is_parent": true,
      "purpose": "Worksheet - Identifying fraud risks (Core)"
    }
  },
  {
    "id": "507",
    "label": "Minutes of governance meetings - audit plan",
    "type": "procedure",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "507-1",
    "label": "Minutes of governance meetings - extracts PART C - Extracts from minutes and other matters that have audit implications",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "507-1.",
    "label": "507-1.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "507.",
    "label": "507.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "507",
      "sub": "",
      "is_parent": true,
      "purpose": "Minutes of governance meetings - audit plan"
    }
  },
  {
    "id": "510",
    "label": "510",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "510.",
    "label": "510.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "510",
      "sub": "",
      "is_parent": true,
      "purpose": "Identifying risks through understanding the entity"
    }
  },
  {
    "id": "511-2",
    "label": "Understanding the IT environment - Listing (Core)",
    "type": "worksheet",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "511.",
    "label": "511.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "511",
      "sub": "",
      "is_parent": true,
      "purpose": "Understanding the IT Environment (Core) - Assessment of IT systems and controls"
    }
  },
  {
    "id": "515",
    "label": "515",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "520",
    "label": "520",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5200",
    "label": "5200",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "5201",
    "label": "5201",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "520E",
    "label": "Risk report",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 41,
    "outDegree": 0,
    "isHub": true,
    "hierarchy": {}
  },
  {
    "id": "520E.1",
    "label": "Risk Report - Risk identification",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 3,
    "outDegree": 6,
    "isHub": true,
    "hierarchy": {
      "base": "520",
      "sub": "1",
      "is_parent": true,
      "purpose": "Risk Report section documenting risk identification, listing all identified risk"
    }
  },
  {
    "id": "520E.2",
    "label": "Risk Report - Fraud risk",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 4,
    "outDegree": 6,
    "isHub": true,
    "hierarchy": {
      "base": "520",
      "sub": "2",
      "is_parent": false,
      "purpose": "Risk Report section documenting fraud risks identified during the audit, with tr"
    }
  },
  {
    "id": "520E.3",
    "label": "Risk Report - Business risk",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 4,
    "outDegree": 4,
    "isHub": true,
    "hierarchy": {
      "base": "520",
      "sub": "3",
      "is_parent": false,
      "purpose": "Risk Report section documenting business risks identified during the audit, incl"
    }
  },
  {
    "id": "520E.4",
    "label": "Risk Report - Risk per cycle",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 10,
    "isHub": true,
    "hierarchy": {
      "base": "520",
      "sub": "4",
      "is_parent": false,
      "purpose": "Risk Report section documenting risks organized by business/transaction cycle, i"
    }
  },
  {
    "id": "520E.5",
    "label": "Risk Report - Summary of control risk assessment",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 11,
    "isHub": true,
    "hierarchy": {
      "base": "520",
      "sub": "5",
      "is_parent": false,
      "purpose": "Risk Report section providing a summary of control risk assessment, documenting"
    }
  },
  {
    "id": "520E.6",
    "label": "Risk Report - Risk assessment",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "520E.7",
    "label": "Risk Report - Risk addressed",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "520E.8",
    "label": "Risk Report - Controls not designed / implemented - possible reportable items",
    "type": "report",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "520",
      "sub": "8",
      "is_parent": false,
      "purpose": "Risk Report - Controls not designed / implemented - possible reportable items"
    }
  },
  {
    "id": "523",
    "label": "Worksheet - Understanding accounting estimates (Core)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 7,
    "outDegree": 6,
    "isHub": true,
    "hierarchy": {
      "base": "523",
      "sub": "",
      "is_parent": true,
      "purpose": "Core worksheet to document understanding of accounting estimates, identify signi"
    }
  },
  {
    "id": "523-1",
    "label": "Worksheet - Understanding complex accounting estimates (Core)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "523-1.",
    "label": "523-1.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "523-2",
    "label": "Worksheet - Outcome of prior period accounting estimates (Core)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "525",
    "label": "Going concern - Identifying events and conditions",
    "type": "procedure",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "526",
    "label": "Analytical Procedures - Final",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "526.",
    "label": "526.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "526",
      "sub": "",
      "is_parent": true,
      "purpose": "Final analytical procedures comparing financial statement data across multiple r"
    }
  },
  {
    "id": "530",
    "label": "530",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 7,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "530.",
    "label": "530.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "530",
      "sub": "",
      "is_parent": true,
      "purpose": "Evaluation of pervasive entity-level controls design and implementation, particu"
    }
  },
  {
    "id": "535",
    "label": "535",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {
      "base": "535",
      "sub": "",
      "is_parent": true,
      "purpose": "Core audit planning document to obtain and document understanding of the entity'"
    }
  },
  {
    "id": "540",
    "label": "Entity-level and General IT Controls",
    "type": "worksheet",
    "area": "controls_testing",
    "cycle": "entity_level",
    "inDegree": 1,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "540.",
    "label": "Control design/implementation - Entity level and general IT controls",
    "type": "procedure",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "540",
      "sub": "",
      "is_parent": true,
      "purpose": "Evaluation of control design and implementation"
    }
  },
  {
    "id": "545",
    "label": "Control design/implementation - Revenue Cycle",
    "type": "procedure",
    "area": "controls_testing",
    "cycle": "revenue",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "545./550./555./560.",
    "label": "545./550./555./560.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "546",
    "label": "Control design/implementation - Conversion Cycle",
    "type": "report",
    "area": "controls_testing",
    "cycle": "conversion",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "546.",
    "label": "546.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "546",
      "sub": "",
      "is_parent": true,
      "purpose": "Control design/implementation - Conversion Cycle - Evaluating controls in the co"
    }
  },
  {
    "id": "547",
    "label": "Control design/implementation - Financial Management Cycle",
    "type": "report",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 6,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "547.",
    "label": "547.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "547",
      "sub": "",
      "is_parent": true,
      "purpose": "Control design/implementation - Financial Management Cycle"
    }
  },
  {
    "id": "548",
    "label": "Control design/implementation - Productive Assets (incl Intangibles) Cycle",
    "type": "report",
    "area": "controls_testing",
    "cycle": "productive_assets",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "549",
    "label": "Control design/implementation - Prepaids/Accruals Cycle",
    "type": "report",
    "area": "controls_testing",
    "cycle": "prepaids/accruals",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "549.",
    "label": "549.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "549",
      "sub": "",
      "is_parent": true,
      "purpose": "Control design/implementation - Prepaids/Accruals Cycle - documents understandin"
    }
  },
  {
    "id": "550",
    "label": "Expenditure Cycle Controls Evaluation",
    "type": "worksheet",
    "area": "controls_testing",
    "cycle": "expenditure",
    "inDegree": 1,
    "outDegree": 7,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "550.",
    "label": "550.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "550",
      "sub": "",
      "is_parent": true,
      "purpose": "Control design/implementation - Expenditure Cycle"
    }
  },
  {
    "id": "555",
    "label": "Control design/implementation - Payroll Cycle",
    "type": "procedure",
    "area": "controls_testing",
    "cycle": "payroll",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "560",
    "label": "Control design/implementation - Financial Reporting Cycle",
    "type": "procedure",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 2,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "560.",
    "label": "560.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "560",
      "sub": "",
      "is_parent": true,
      "purpose": "Control design/implementation - Financial Reporting Cycle"
    }
  },
  {
    "id": "565",
    "label": "Walkthrough documentation worksheet - blank",
    "type": "worksheet",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "565.",
    "label": "565.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "565",
      "sub": "",
      "is_parent": true,
      "purpose": "Walkthrough documentation worksheet - documents walkthroughs of business process"
    }
  },
  {
    "id": "566",
    "label": "Worksheet - Information flow - Business process",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "566.",
    "label": "566.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "566",
      "sub": "",
      "is_parent": true,
      "purpose": "Document information flow for business processes through walkthrough procedures"
    }
  },
  {
    "id": "582",
    "label": "582",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "590",
    "label": "Preliminary Engagement Scoping - Single Entity",
    "type": "worksheet",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "590-600",
    "label": "Group Audit Scoping - Group Financial Statements and Components",
    "type": "worksheet",
    "area": "planning",
    "cycle": "group_audit",
    "inDegree": 0,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "590.600",
    "label": "Group audit program - Engagement scoping components (Core)",
    "type": "procedure",
    "area": "planning",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "590",
      "sub": "600",
      "is_parent": true,
      "purpose": "Substantive procedures and testing of account balances"
    }
  },
  {
    "id": "600",
    "label": "600",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "605",
    "label": "Responding to risk at the financial statement level (Core)",
    "type": "procedure",
    "area": "risk_assessment",
    "cycle": "general",
    "inDegree": 31,
    "outDegree": 2,
    "isHub": true,
    "hierarchy": {}
  },
  {
    "id": "605.",
    "label": "605.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "605",
      "sub": "",
      "is_parent": true,
      "purpose": "Responding to risk at the financial statement level - designing overall response"
    }
  },
  {
    "id": "610.",
    "label": "Sampling - Tests of Details",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "615",
    "label": "Sampling Test of Controls",
    "type": "procedure",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 9,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "615 / 618",
    "label": "615 / 618",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "615.",
    "label": "615.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "615",
      "sub": "",
      "is_parent": true,
      "purpose": "Sampling Test of Controls - document statistical/non-statistical sampling for te"
    }
  },
  {
    "id": "618",
    "label": "Worksheet - Tests of controls - Entity level controls",
    "type": "worksheet",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 9,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "618.",
    "label": "618.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "618",
      "sub": "",
      "is_parent": true,
      "purpose": "Document tests of controls for entity level controls including planning, sample"
    }
  },
  {
    "id": "620",
    "label": "Worksheet - Evaluating the work of an auditor's expert",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "622",
    "label": "Worksheet - Evaluating the work of a component auditor (Core)",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "622.",
    "label": "622.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "622",
      "sub": "",
      "is_parent": true,
      "purpose": "Worksheet - Evaluating the work of a component auditor (Core)"
    }
  },
  {
    "id": "625",
    "label": "625",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "625.",
    "label": "625.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "625",
      "sub": "",
      "is_parent": true,
      "purpose": "Analytical review - Ratios - Planning"
    }
  },
  {
    "id": "630",
    "label": "Summary of external confirmations",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 3,
    "outDegree": 7,
    "isHub": true,
    "hierarchy": {
      "base": "630",
      "sub": "",
      "is_parent": true,
      "purpose": "Summary document to track and consolidate all external confirmations used as a s"
    }
  },
  {
    "id": "635",
    "label": "635",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "635.",
    "label": "635.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "635",
      "sub": "",
      "is_parent": true,
      "purpose": "Financial reporting - Audit procedures (Core) for testing financial statement pr"
    }
  },
  {
    "id": "645",
    "label": "645",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "645-1",
    "label": "Checklist for Evaluating Attorney Letter",
    "type": "checklist",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "645.",
    "label": "645.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "645",
      "sub": "",
      "is_parent": true,
      "purpose": "Litigation, claims and non-compliance"
    }
  },
  {
    "id": "650",
    "label": "650",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 7,
    "isHub": true,
    "hierarchy": {
      "base": "650",
      "sub": "",
      "is_parent": true,
      "purpose": "Core subsequent events working paper to obtain evidence about events occurring b"
    }
  },
  {
    "id": "665",
    "label": "Analytical review - Ratios - Final",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "665.",
    "label": "665.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "665",
      "sub": "",
      "is_parent": true,
      "purpose": "Analytical review - Ratios - Final"
    }
  },
  {
    "id": "666",
    "label": "666",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {
      "base": "666",
      "sub": "",
      "is_parent": true,
      "purpose": "Related party audit plan to document procedures for identifying, understanding,"
    }
  },
  {
    "id": "670",
    "label": "Journal Entries audit plan",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 5,
    "isHub": false,
    "hierarchy": {
      "base": "670",
      "sub": "",
      "is_parent": true,
      "purpose": "Journal Entries audit plan to determine whether material misstatements (fraud or"
    }
  },
  {
    "id": "675",
    "label": "675",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 12,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "676",
    "label": "Worksheet - Documenting consultation (Core)",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "676.",
    "label": "676.",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "676",
      "sub": "",
      "is_parent": true,
      "purpose": "Document consultation with internal or external experts on accounting or auditin"
    }
  },
  {
    "id": "A1.2",
    "label": "Letter to a predecessor accounting firm",
    "type": "letter",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "A5.1",
    "label": "Accounts receivable confirmation",
    "type": "letter",
    "area": "substantive_testing",
    "cycle": "receivables",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "A5.2-1",
    "label": "Inventory consigned to others confirmation",
    "type": "letter",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "A5.2-2",
    "label": "Inventory consigned to others confirmation - Sample response letter",
    "type": "letter",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "A5.3",
    "label": "Long-term debt confirmation",
    "type": "letter",
    "area": "substantive_testing",
    "cycle": "long_term_debt",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "5",
      "sub": "3",
      "is_parent": false,
      "purpose": "Obtain confirmation of long-term debt details from lenders"
    }
  },
  {
    "id": "A6.1",
    "label": "Inventory held at outside locations inquiry",
    "type": "letter",
    "area": "substantive_testing",
    "cycle": "inventory",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ACL",
    "label": "ACL",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AO",
    "label": "General options Profile: Tailor per eng...",
    "type": "leadsheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AOCR",
    "label": "Audit Optimiser confirmation report",
    "type": "report",
    "area": "general",
    "cycle": "general",
    "inDegree": 4,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AOCR (Optimiser Confirmation Report)",
    "label": "AOCR (Optimiser Confirmation Report)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AOCS",
    "label": "Audit Optimiser confirmation report",
    "type": "report",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AOCS - Audit Optimiser confirmation report",
    "label": "AOCS - Audit Optimiser confirmation report",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AU 265",
    "label": "AU 265",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AU 265.14",
    "label": "AU 265.14",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AU 600",
    "label": "AU 600",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "AU 600.39 and .58",
    "label": "AU 600.39 and .58",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Accounts receivable confirmation working papers",
    "label": "Accounts receivable confirmation working papers",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "All audit work programs",
    "label": "All audit work programs",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Audit findings letter",
    "label": "Audit findings letter",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Audit plan",
    "label": "Audit plan",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Audit procedure work programs",
    "label": "Audit procedure work programs",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Audit sampling substantive testing form",
    "label": "Audit sampling substantive testing form",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "B-15",
    "label": "B-15",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "B-7",
    "label": "B-7",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Bank confirmation working papers",
    "label": "Bank confirmation working papers",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "CH International EXCEL SAMPLING WORKBOOKS",
    "label": "CH International EXCEL SAMPLING WORKBOOKS",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "CH International Excel Sampling Workbooks",
    "label": "CH International Excel Sampling Workbooks",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "CHIAT 26.00",
    "label": "CHIAT 26.00",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "CTRLM.",
    "label": "Control matrix",
    "type": "worksheet",
    "area": "controls_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "CVN",
    "label": "Conversion Cycle",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "revenue",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Comments",
    "label": "Comments",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Crowe Global Audit Manual Chapter 33",
    "label": "Crowe Global Audit Manual Chapter 33",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Crowe Global Sampling Guide",
    "label": "Crowe Global Sampling Guide",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Cycle-specific audit work programs",
    "label": "Cycle-specific audit work programs",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "DIAGN",
    "label": "Diagnostics Report",
    "type": "report",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "EP7",
    "label": "Firm information",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {
      "base": "7",
      "sub": "",
      "is_parent": true,
      "purpose": "Capture firm information including name, address, contact details, and logo sett"
    }
  },
  {
    "id": "EXP",
    "label": "Expenditure Cycle",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "expenditure",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Engagement letter",
    "label": "Engagement letter",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "FIN",
    "label": "Financial Management Cycle",
    "type": "worksheet",
    "area": "general",
    "cycle": "financial_management_cycle",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "FSA",
    "label": "FSA",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 19,
    "outDegree": 0,
    "isHub": true,
    "hierarchy": {}
  },
  {
    "id": "FSA (Financial statement areas worksheet)",
    "label": "FSA (Financial statement areas worksheet)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "FSA. (or equivalent)/605",
    "label": "FSA. (or equivalent)/605",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Financial statement areas worksheet",
    "label": "Financial statement areas worksheet",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 110.101",
    "label": "Form 110.101",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 520E",
    "label": "Form 520E",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 16,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 582",
    "label": "Form 582",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 605",
    "label": "Form 605",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 17,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 615",
    "label": "Form 615",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 618",
    "label": "Form 618",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Form 675",
    "label": "Form 675",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 6,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Guidance",
    "label": "Guidance",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IAS 12",
    "label": "IAS 12",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IAS 17",
    "label": "IAS 17",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IAS 19",
    "label": "IAS 19",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IAS 32",
    "label": "IAS 32",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IAS 37",
    "label": "IAS 37",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IDEA",
    "label": "IDEA",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IESBA Code",
    "label": "IESBA Code",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IFRS 2",
    "label": "IFRS 2",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IFRS 3",
    "label": "IFRS 3",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IFRS 4",
    "label": "IFRS 4",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IFRS 5",
    "label": "IFRS 5",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IFRS 9",
    "label": "IFRS 9",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "IFRS Disclosure Checklist",
    "label": "IFRS Disclosure Checklist",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 200",
    "label": "ISA 200",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 220 (Revised)",
    "label": "ISA 220 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 230",
    "label": "ISA 230",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 240",
    "label": "ISA 240",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 250",
    "label": "ISA 250",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 260",
    "label": "ISA 260",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 265",
    "label": "ISA 265",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 300",
    "label": "ISA 300",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 315",
    "label": "ISA 315",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 315 (Revised)",
    "label": "ISA 315 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 330",
    "label": "ISA 330",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 501",
    "label": "ISA 501",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 505",
    "label": "ISA 505",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 4,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 520",
    "label": "ISA 520",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 530",
    "label": "ISA 530",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 540",
    "label": "ISA 540",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 550",
    "label": "ISA 550",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 560",
    "label": "ISA 560",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 570 (Revised)",
    "label": "ISA 570 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600",
    "label": "ISA 600",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 7,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600 (Revised)",
    "label": "ISA 600 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600.38-39",
    "label": "ISA 600.38-39",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600.46 / AU 600.45",
    "label": "ISA 600.46 / AU 600.45",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600.47 / AU 600.46",
    "label": "ISA 600.47 / AU 600.46",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600.48 / AU 600.47",
    "label": "ISA 600.48 / AU 600.47",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 600.49 / AU 600.48",
    "label": "ISA 600.49 / AU 600.48",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 700 (Revised)",
    "label": "ISA 700 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 701",
    "label": "ISA 701",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 705",
    "label": "ISA 705",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 705 (Revised)",
    "label": "ISA 705 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 3,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 706 (Revised)",
    "label": "ISA 706 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 710",
    "label": "ISA 710",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 720 (Revised)",
    "label": "ISA 720 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 800 (Revised)",
    "label": "ISA 800 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 805 (Revised)",
    "label": "ISA 805 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "ISA 810 (Revised)",
    "label": "ISA 810 (Revised)",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Inventory audit procedures",
    "label": "Inventory audit procedures",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "LETTER",
    "label": "Sample letter",
    "type": "letter",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Legal confirmation working papers",
    "label": "Legal confirmation working papers",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "MGTLETTER",
    "label": "Sample management letter",
    "type": "letter",
    "area": "reporting",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "NCHKLST",
    "label": "New checklist",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "NFF1",
    "label": "Blank flat-form - landscape",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "",
      "is_parent": false,
      "purpose": "Blank flat-form - landscape template for creating custom audit documentation"
    }
  },
  {
    "id": "NFF2",
    "label": "Blank flat-form - portrait",
    "type": "procedure",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "",
      "is_parent": true,
      "purpose": "Blank flat-form template in portrait orientation for custom audit documentation"
    }
  },
  {
    "id": "NPMSD",
    "label": "Partner and Manager Summary",
    "type": "report",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "NWPG",
    "label": "New Work Program",
    "type": "procedure",
    "area": "planning",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "PAY",
    "label": "Payroll Cycle",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "payroll",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "PMSD",
    "label": "Partner and Manager Summary",
    "type": "report",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "PPD",
    "label": "Prepaids and Accruals Cycle",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "prepaids_and_accruals",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "PPE",
    "label": "Document PPE: Productive Assets Cycle",
    "type": "worksheet",
    "area": "substantive_testing",
    "cycle": "PP&E",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "PROCALLRP",
    "label": "Procedure allocation maintenance report",
    "type": "procedure",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "PROGRPT.",
    "label": "Work Program/checklist progress report",
    "type": "checklist",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Q",
    "label": "CaseWare Q - Key Data for Engagements",
    "type": "worksheet",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "REV",
    "label": "Revenue Cycle",
    "type": "leadsheet",
    "area": "substantive_testing",
    "cycle": "revenue",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Reporting checklist",
    "label": "Reporting checklist",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Risk Report 520E",
    "label": "Risk Report 520E",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 5,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "SAP",
    "label": "Substantive analytical procedures",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "SPT",
    "label": "Sampling Tool",
    "type": "procedure",
    "area": "substantive_testing",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "SUP1",
    "label": "SUP1",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "1",
      "sub": "",
      "is_parent": false,
      "purpose": "Leases for lessees - Audit procedures for testing lease accounting and disclosur"
    }
  },
  {
    "id": "SUP2",
    "label": "SUP2",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "2",
      "sub": "",
      "is_parent": false,
      "purpose": "Audit procedures for government grants including substantive procedures to verif"
    }
  },
  {
    "id": "SUP3",
    "label": "SUP3",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {
      "base": "3",
      "sub": "",
      "is_parent": false,
      "purpose": "Audit procedures form (large file - specific purpose requires detailed review)"
    }
  },
  {
    "id": "SUP3.110",
    "label": "Agricultural asset count checklist",
    "type": "checklist",
    "area": "substantive_testing",
    "cycle": "agricultural_assets",
    "inDegree": 0,
    "outDegree": 1,
    "isHub": false,
    "hierarchy": {
      "base": "3",
      "sub": "110",
      "is_parent": false,
      "purpose": "Agricultural asset count checklist for procedures related to counting and verify"
    }
  },
  {
    "id": "Sampling Guide",
    "label": "Sampling Guide",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "UPDATE",
    "label": "Document UPDATE: UPDATE - CWUpdate",
    "type": "procedure",
    "area": "general",
    "cycle": "general",
    "inDegree": 0,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "Working paper index",
    "label": "Working paper index",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "_audit_sampling_substantive",
    "label": "_audit_sampling_substantive",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "_inventory_confirmation_third_party",
    "label": "_inventory_confirmation_third_party",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 4,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "_isa701_key_audit_matters",
    "label": "_isa701_key_audit_matters",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 2,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "_significant_deficiencies_management_letter",
    "label": "_significant_deficiencies_management_letter",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 0,
    "outDegree": 3,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "doc520E",
    "label": "doc520E",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "engagement letter",
    "label": "engagement letter",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "relevant Audit Plans aAnd Procedures for auditor's expert in accounting estimate",
    "label": "relevant Audit Plans aAnd Procedures for auditor's expert in accounting estimate",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "risk dialog",
    "label": "risk dialog",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 2,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  },
  {
    "id": "risk_dialog",
    "label": "risk_dialog",
    "type": "",
    "area": "",
    "cycle": "",
    "inDegree": 1,
    "outDegree": 0,
    "isHub": false,
    "hierarchy": {}
  }
];

export const GRAPH_EDGES = [
  {
    "id": "e0",
    "source": "1.2",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e1",
    "source": "1.2",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e2",
    "source": "1",
    "target": "520E",
    "label": "feeds"
  },
  {
    "id": "e3",
    "source": "1",
    "target": "605",
    "label": "feeds"
  },
  {
    "id": "e4",
    "source": "110.110",
    "target": "520E",
    "label": "consider any fraud risk identified relating to inventory"
  },
  {
    "id": "e5",
    "source": "110.5",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e6",
    "source": "110.5",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e7",
    "source": "110",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e8",
    "source": "110",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e9",
    "source": "130.110",
    "target": "330",
    "label": "record details on Form 330. for further consideration"
  },
  {
    "id": "e10",
    "source": "130.110",
    "target": "675",
    "label": "extended procedures"
  },
  {
    "id": "e11",
    "source": "140.110",
    "target": "330",
    "label": "record details on Form 330 for further consideration"
  },
  {
    "id": "e12",
    "source": "1600.3",
    "target": "Form 675",
    "label": "dependency"
  },
  {
    "id": "e13",
    "source": "1600.3",
    "target": "Form 110.101",
    "label": "feeds"
  },
  {
    "id": "e14",
    "source": "2.25",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e15",
    "source": "2.25",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e16",
    "source": "2.30",
    "target": "Form 675",
    "label": "feeds"
  },
  {
    "id": "e17",
    "source": "2.35",
    "target": "520E",
    "label": "dependency"
  },
  {
    "id": "e18",
    "source": "2.35",
    "target": "605",
    "label": "dependency"
  },
  {
    "id": "e19",
    "source": "2.55",
    "target": "Form 520E",
    "label": "dependency"
  },
  {
    "id": "e20",
    "source": "2.55",
    "target": "Form 605",
    "label": "dependency"
  },
  {
    "id": "e21",
    "source": "2.65",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e22",
    "source": "2.65",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e23",
    "source": "20",
    "target": "Form 520E",
    "label": "dependency"
  },
  {
    "id": "e24",
    "source": "20",
    "target": "Form 605",
    "label": "dependency"
  },
  {
    "id": "e25",
    "source": "20",
    "target": "Form 675",
    "label": "feeds"
  },
  {
    "id": "e26",
    "source": "301",
    "target": "405",
    "label": "independence evidence"
  },
  {
    "id": "e27",
    "source": "301",
    "target": "406",
    "label": "independence evidence"
  },
  {
    "id": "e28",
    "source": "301",
    "target": "420",
    "label": "materiality documentation"
  },
  {
    "id": "e29",
    "source": "301",
    "target": "351",
    "label": "letter of representation"
  },
  {
    "id": "e30",
    "source": "301",
    "target": "310",
    "label": "audit completion checklist"
  },
  {
    "id": "e31",
    "source": "302",
    "target": "420",
    "label": "materiality documented on Form 420."
  },
  {
    "id": "e32",
    "source": "304.",
    "target": "305.",
    "label": "extended procedures"
  },
  {
    "id": "e33",
    "source": "335-1",
    "target": "420",
    "label": "update overall and performance materiality"
  },
  {
    "id": "e34",
    "source": "335",
    "target": "335.14",
    "label": "extended procedures for adjusting journal entries"
  },
  {
    "id": "e35",
    "source": "335",
    "target": "335.15",
    "label": "extended procedures for adjusting journal entries"
  },
  {
    "id": "e36",
    "source": "335",
    "target": "335.11",
    "label": "extended procedures for unrecorded misstatements - factual"
  },
  {
    "id": "e37",
    "source": "335",
    "target": "335.12",
    "label": "extended procedures for unrecorded misstatements - projected"
  },
  {
    "id": "e38",
    "source": "335",
    "target": "335.13",
    "label": "extended procedures for unrecorded misstatements - judgmental"
  },
  {
    "id": "e39",
    "source": "335",
    "target": "335.10",
    "label": "extended procedures for total uncorrected misstatements"
  },
  {
    "id": "e40",
    "source": "335.15",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e41",
    "source": "335.15",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e42",
    "source": "335.20",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e43",
    "source": "335.20",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e44",
    "source": "35",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e45",
    "source": "35",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e46",
    "source": "360-1",
    "target": "AU 265.14",
    "label": "requirements for communicating internal control deficiencies"
  },
  {
    "id": "e47",
    "source": "360-2",
    "target": "360-1",
    "label": "sample letter for material weaknesses and/or significant deficiencies to communicate"
  },
  {
    "id": "e48",
    "source": "360-2",
    "target": "AU 265",
    "label": "example of a letter when no material weaknesses are noted"
  },
  {
    "id": "e49",
    "source": "360-3",
    "target": "ISA 315 (Revised)",
    "label": "risk assessment input"
  },
  {
    "id": "e50",
    "source": "360-3",
    "target": "ISA 705 (Revised)",
    "label": "prohibition on communicating key audit matters when disclaiming an opinion"
  },
  {
    "id": "e51",
    "source": "4.30",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e52",
    "source": "4.40",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e53",
    "source": "400-1",
    "target": "AOCR",
    "label": "optimiser confirmation report"
  },
  {
    "id": "e54",
    "source": "400-1",
    "target": "Form 520E",
    "label": "risk assessment input"
  },
  {
    "id": "e55",
    "source": "400-2",
    "target": "Form 605",
    "label": "extended procedures for confirmations"
  },
  {
    "id": "e56",
    "source": "400-2",
    "target": "ISA 220 (Revised)",
    "label": "engagement quality management"
  },
  {
    "id": "e57",
    "source": "400-2",
    "target": "ISA 600 (Revised)",
    "label": "group audit procedures"
  },
  {
    "id": "e58",
    "source": "400-3",
    "target": "AOCR",
    "label": "extended procedures"
  },
  {
    "id": "e59",
    "source": "400-4",
    "target": "Form 520E",
    "label": "risk assessment input"
  },
  {
    "id": "e60",
    "source": "400-4",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e61",
    "source": "400-5",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e62",
    "source": "400-5",
    "target": "ISA 220 (Revised)",
    "label": "engagement quality management"
  },
  {
    "id": "e63",
    "source": "400-5",
    "target": "ISA 600 (Revised)",
    "label": "group audit definition"
  },
  {
    "id": "e64",
    "source": "400-6",
    "target": "AOCR",
    "label": "extended procedures"
  },
  {
    "id": "e65",
    "source": "400.",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e66",
    "source": "400.",
    "target": "Form 675",
    "label": "extended procedures"
  },
  {
    "id": "e67",
    "source": "401",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e68",
    "source": "401",
    "target": "Form 520E",
    "label": "risk assessment input"
  },
  {
    "id": "e69",
    "source": "420.",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e70",
    "source": "420.",
    "target": "335",
    "label": "trivial misstatements recording"
  },
  {
    "id": "e71",
    "source": "422",
    "target": "5200",
    "label": "communication to the component auditor"
  },
  {
    "id": "e72",
    "source": "422",
    "target": "5201",
    "label": "communication to the component auditor"
  },
  {
    "id": "e73",
    "source": "425-1",
    "target": "425",
    "label": "risk assessment input"
  },
  {
    "id": "e74",
    "source": "425.110",
    "target": "330",
    "label": "record details on Form 330. for further consideration"
  },
  {
    "id": "e75",
    "source": "438",
    "target": "engagement letter",
    "label": "auditor and management responsibilities"
  },
  {
    "id": "e76",
    "source": "438",
    "target": "Form 675",
    "label": "feeds"
  },
  {
    "id": "e77",
    "source": "442",
    "target": "675",
    "label": "feeds"
  },
  {
    "id": "e78",
    "source": "455",
    "target": "ISA 240",
    "label": "related ISA"
  },
  {
    "id": "e79",
    "source": "455",
    "target": "ISA 260",
    "label": "related ISA"
  },
  {
    "id": "e80",
    "source": "455",
    "target": "ISA 300",
    "label": "related ISA"
  },
  {
    "id": "e81",
    "source": "5000",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e82",
    "source": "5001",
    "target": "302",
    "label": "supplement to this form for ISQM 2"
  },
  {
    "id": "e83",
    "source": "5001",
    "target": "301",
    "label": "supplement to this form for ISQC 1"
  },
  {
    "id": "e84",
    "source": "5002",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e85",
    "source": "5003",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e86",
    "source": "5007",
    "target": "5011",
    "label": "extended procedures"
  },
  {
    "id": "e87",
    "source": "5007",
    "target": "ISA 600",
    "label": "risk assessment input"
  },
  {
    "id": "e88",
    "source": "5009",
    "target": "600",
    "label": "relevant ISAs for this section include potentially all ISAs but specifically ISA 600"
  },
  {
    "id": "e89",
    "source": "5010",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e90",
    "source": "507-1",
    "target": "520E",
    "label": "record risks"
  },
  {
    "id": "e91",
    "source": "507",
    "target": "507-1",
    "label": "extended procedures"
  },
  {
    "id": "e92",
    "source": "507",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e93",
    "source": "507",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e94",
    "source": "511-2",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e95",
    "source": "520E.1",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e96",
    "source": "520E.2",
    "target": "520E",
    "label": "parent form"
  },
  {
    "id": "e97",
    "source": "520E.2",
    "target": "675",
    "label": "extended procedures"
  },
  {
    "id": "e98",
    "source": "520E.3",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e99",
    "source": "520E.4",
    "target": "520E",
    "label": "related form for risk assessment"
  },
  {
    "id": "e100",
    "source": "520E.4",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e101",
    "source": "520E.5",
    "target": "520E",
    "label": "parent form containing detailed risk assessment procedures"
  },
  {
    "id": "e102",
    "source": "520E.5",
    "target": "675",
    "label": "extended procedures for control testing"
  },
  {
    "id": "e103",
    "source": "520E.7",
    "target": "520E.1",
    "label": "dependency"
  },
  {
    "id": "e104",
    "source": "520E.7",
    "target": "520E.2",
    "label": "dependency"
  },
  {
    "id": "e105",
    "source": "520E.7",
    "target": "605",
    "label": "feeds"
  },
  {
    "id": "e106",
    "source": "523-1",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e107",
    "source": "523-1",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e108",
    "source": "523",
    "target": "530",
    "label": "risk assessment input"
  },
  {
    "id": "e109",
    "source": "525",
    "target": "625",
    "label": "extended procedures"
  },
  {
    "id": "e110",
    "source": "525",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e111",
    "source": "526",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e112",
    "source": "526",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e113",
    "source": "540.",
    "target": "615",
    "label": "test control effectiveness"
  },
  {
    "id": "e114",
    "source": "540.",
    "target": "618",
    "label": "test control effectiveness"
  },
  {
    "id": "e115",
    "source": "545",
    "target": "615",
    "label": "extended procedures"
  },
  {
    "id": "e116",
    "source": "545",
    "target": "618",
    "label": "extended procedures"
  },
  {
    "id": "e117",
    "source": "546",
    "target": "582",
    "label": "extended procedures"
  },
  {
    "id": "e118",
    "source": "546",
    "target": "615",
    "label": "test control effectiveness"
  },
  {
    "id": "e119",
    "source": "546",
    "target": "618",
    "label": "test control effectiveness"
  },
  {
    "id": "e120",
    "source": "546",
    "target": "risk dialog",
    "label": "dependency"
  },
  {
    "id": "e121",
    "source": "547",
    "target": "582",
    "label": "extended procedures"
  },
  {
    "id": "e122",
    "source": "547",
    "target": "615",
    "label": "test control effectiveness"
  },
  {
    "id": "e123",
    "source": "547",
    "target": "618",
    "label": "test control effectiveness"
  },
  {
    "id": "e124",
    "source": "547",
    "target": "Form 582",
    "label": "dependency"
  },
  {
    "id": "e125",
    "source": "547",
    "target": "Form 615",
    "label": "feeds"
  },
  {
    "id": "e126",
    "source": "547",
    "target": "Form 618",
    "label": "feeds"
  },
  {
    "id": "e127",
    "source": "548",
    "target": "582",
    "label": "extended procedures"
  },
  {
    "id": "e128",
    "source": "548",
    "target": "615",
    "label": "test control effectiveness"
  },
  {
    "id": "e129",
    "source": "548",
    "target": "618",
    "label": "test control effectiveness"
  },
  {
    "id": "e130",
    "source": "548",
    "target": "risk_dialog",
    "label": "dependency"
  },
  {
    "id": "e131",
    "source": "549",
    "target": "582",
    "label": "extended procedures"
  },
  {
    "id": "e132",
    "source": "549",
    "target": "615",
    "label": "test control effectiveness"
  },
  {
    "id": "e133",
    "source": "549",
    "target": "618",
    "label": "test control effectiveness"
  },
  {
    "id": "e134",
    "source": "549",
    "target": "risk dialog",
    "label": "dependency"
  },
  {
    "id": "e135",
    "source": "550",
    "target": "615",
    "label": "test control effectiveness"
  },
  {
    "id": "e136",
    "source": "550",
    "target": "618",
    "label": "test control effectiveness"
  },
  {
    "id": "e137",
    "source": "550",
    "target": "535",
    "label": "Business process understanding and SCOTABD identification"
  },
  {
    "id": "e138",
    "source": "550",
    "target": "520",
    "label": "Risk identification feeds control requirements"
  },
  {
    "id": "e139",
    "source": "550",
    "target": "540",
    "label": "Entity-level controls feed into cycle-specific controls"
  },
  {
    "id": "e140",
    "source": "550",
    "target": "520E",
    "label": "Extended risk assessment for fraud and special risks"
  },
  {
    "id": "e141",
    "source": "555",
    "target": "615 / 618",
    "label": "Test Control Effectiveness"
  },
  {
    "id": "e142",
    "source": "560",
    "target": "615",
    "label": "extended procedures"
  },
  {
    "id": "e143",
    "source": "560",
    "target": "618",
    "label": "extended procedures"
  },
  {
    "id": "e144",
    "source": "565",
    "target": "520E",
    "label": "record any new risk factors identified"
  },
  {
    "id": "e145",
    "source": "565",
    "target": "545./550./555./560.",
    "label": "cross-reference to Forms"
  },
  {
    "id": "e146",
    "source": "566",
    "target": "520E",
    "label": "record any new risk factors identified"
  },
  {
    "id": "e147",
    "source": "590.600",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e148",
    "source": "590.600",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e149",
    "source": "605",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e150",
    "source": "605",
    "target": "FSA",
    "label": "related ISAs"
  },
  {
    "id": "e151",
    "source": "610.",
    "target": "420",
    "label": "materiality / tolerable misstatement input"
  },
  {
    "id": "e152",
    "source": "610.",
    "target": "Sampling Guide",
    "label": "sampling tools and methods reference"
  },
  {
    "id": "e153",
    "source": "615",
    "target": "Crowe Global Sampling Guide",
    "label": "detailed discussion of the different sampling tools available"
  },
  {
    "id": "e154",
    "source": "615",
    "target": "CH International EXCEL SAMPLING WORKBOOKS",
    "label": "sampling tool reference"
  },
  {
    "id": "e155",
    "source": "615",
    "target": "IDEA",
    "label": "sampling tool reference"
  },
  {
    "id": "e156",
    "source": "615",
    "target": "ACL",
    "label": "sampling tool reference"
  },
  {
    "id": "e157",
    "source": "618",
    "target": "530",
    "label": "description and assessment of pervasive controls"
  },
  {
    "id": "e158",
    "source": "618",
    "target": "FSA. (or equivalent)/605",
    "label": "details of the overall responses to assessed risk at the financial statement level"
  },
  {
    "id": "e159",
    "source": "620",
    "target": "428",
    "label": "guidance on selecting an auditor's expert"
  },
  {
    "id": "e160",
    "source": "620",
    "target": "relevant Audit Plans aAnd Procedures for auditor's expert in accounting estimate",
    "label": "extended procedures"
  },
  {
    "id": "e161",
    "source": "630",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e162",
    "source": "630",
    "target": "605",
    "label": "extended procedures"
  },
  {
    "id": "e163",
    "source": "670",
    "target": "520E",
    "label": "risk assessment input"
  },
  {
    "id": "e164",
    "source": "670",
    "target": "675",
    "label": "extended procedures"
  },
  {
    "id": "e165",
    "source": "A5.1",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e166",
    "source": "A5.2-1",
    "target": "675",
    "label": "extended procedures"
  },
  {
    "id": "e167",
    "source": "A5.2-2",
    "target": "Form 675",
    "label": "feeds"
  },
  {
    "id": "e168",
    "source": "A6.1",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e169",
    "source": "A6.1",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e170",
    "source": "AOCR",
    "target": "Financial statement areas worksheet",
    "label": "input for identifying deletions"
  },
  {
    "id": "e171",
    "source": "AOCS",
    "target": "Financial statement areas worksheet",
    "label": "related"
  },
  {
    "id": "e172",
    "source": "CTRLM.",
    "target": "615 / 618",
    "label": "test control effectiveness"
  },
  {
    "id": "e173",
    "source": "CTRLM.",
    "target": "615",
    "label": "dependency"
  },
  {
    "id": "e174",
    "source": "CTRLM.",
    "target": "618",
    "label": "dependency"
  },
  {
    "id": "e175",
    "source": "EP7",
    "target": "Form 520E",
    "label": "feeds"
  },
  {
    "id": "e176",
    "source": "EP7",
    "target": "Form 605",
    "label": "feeds"
  },
  {
    "id": "e177",
    "source": "NWPG",
    "target": "Form 520E",
    "label": "risk assessment input"
  },
  {
    "id": "e178",
    "source": "NWPG",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e179",
    "source": "PROCALLRP",
    "target": "Form 520E",
    "label": "risk assessment input"
  },
  {
    "id": "e180",
    "source": "PROCALLRP",
    "target": "Form 605",
    "label": "extended procedures"
  },
  {
    "id": "e181",
    "source": "PROGRPT.",
    "target": "Guidance",
    "label": "providing guidance for the work program/checklist items"
  },
  {
    "id": "e182",
    "source": "PROGRPT.",
    "target": "Comments",
    "label": "additional comments or notes related to the progress report"
  },
  {
    "id": "e183",
    "source": "SUP3.110",
    "target": "520E",
    "label": "fraud risk assessment input"
  },
  {
    "id": "e184",
    "source": "540",
    "target": "535",
    "label": "Business process understanding feeds controls identification"
  },
  {
    "id": "e185",
    "source": "540",
    "target": "520E",
    "label": "Risk assessment from Form 520E determines which controls to test"
  },
  {
    "id": "e186",
    "source": "540",
    "target": "550",
    "label": "Expenditure cycle controls documented in Form 550"
  },
  {
    "id": "e187",
    "source": "590",
    "target": "605",
    "label": "Materiality calculation feeds scoping"
  },
  {
    "id": "e188",
    "source": "590",
    "target": "520",
    "label": "Risk assessment informs scoping decisions"
  },
  {
    "id": "e189",
    "source": "590",
    "target": "520E",
    "label": "Extended risk assessment for scope determination"
  },
  {
    "id": "e190",
    "source": "590-600",
    "target": "605",
    "label": "Materiality calculation for group"
  },
  {
    "id": "e191",
    "source": "590-600",
    "target": "5000",
    "label": "Group audit planning memorandum"
  },
  {
    "id": "e192",
    "source": "590-600",
    "target": "5004",
    "label": "Group audit planning memorandum detail"
  },
  {
    "id": "e193",
    "source": "590-600",
    "target": "5005",
    "label": "Group component summary"
  },
  {
    "id": "e194",
    "source": "590-600",
    "target": "5006",
    "label": "Component auditors summary"
  }
];

export const GRAPH_STATS = {
  "total_nodes": 455,
  "total_edges": 448,
  "total_numeric_fields": 606,
  "forms_with_metadata": 243,
  "forms_in_hierarchy": 196,
  "hub_forms": 30,
  "data_sources": [
    "extracted_v2/*.json",
    "links_complete.csv",
    "form_hierarchy.csv",
    "hubs_analysis.csv",
    "update_dependencies.json",
    "field_dependencies.json"
  ]
};
