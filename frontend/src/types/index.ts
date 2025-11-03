export type UserRole = 
  | { Admin: null }
  | { Partner: null }
  | { Manager: null }
  | { Senior: null }
  | { Staff: null }
  | { ClientUser: null };

export interface User {
  principal: any; // Principal from IC can be string or object
  role: UserRole;
  name: string;
  email: string;
  created_at: bigint;
  language_preference: string;
  profile_completed: boolean;
}

export enum XBRLTaxonomy {
  USGAAP = 'USGAAP',
  IFRS = 'IFRS',
}

export interface Organization {
  id: bigint;
  name: string;
  description: string;
  created_at: bigint;
  created_by: string;
  entity_ids: bigint[];
}

export interface Entity {
  id: bigint;
  organization_id: bigint;
  name: string;
  description: string;
  taxonomy?: XBRLTaxonomy | { Custom: string };
  taxonomy_config: string;
  created_at: bigint;
  created_by: string;
}

export interface Client {
  id: bigint;
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  created_at: bigint;
  created_by: string;
}

export type EngagementLink =
  | { Organization: bigint }
  | { Entity: bigint }
  | { Client: bigint };

export interface Engagement {
  id: bigint;
  name: string;
  description: string;
  link: EngagementLink;
  start_date: bigint;
  end_date: bigint;
  status: string;
  created_at: bigint;
  created_by: string;
}

export enum ColumnType {
  Numeric = 'Numeric',
  Text = 'Text',
  Date = 'Date',
  Boolean = 'Boolean',
  Currency = 'Currency',
}

export interface PIIDetection {
  has_names: boolean;
  has_emails: boolean;
  has_phone_numbers: boolean;
  has_national_ids: boolean;
}

export interface ColumnMetadata {
  name: string;
  original_name: string;
  detected_type: ColumnType;
  null_percent: number;
  unique_count: bigint;
  min_value: string;
  max_value: string;
  sample_values: string[];
  pii_detection: PIIDetection;
}

export interface SheetData {
  name: string;
  columns: ColumnMetadata[];
  row_count: bigint;
  data: string[][];
}

export interface ImportedDataset {
  id: bigint;
  name: string;
  engagement_id?: bigint;
  file_name: string;
  file_size: bigint;
  sheets: SheetData[];
  version: number;
  created_at: bigint;
  created_by: string;
}

export interface ColumnMapping {
  account_number?: string;
  account_name?: string;
  currency?: string;
  opening_debit?: string;
  opening_credit?: string;
  period_debit?: string;
  period_credit?: string;
  ytd_debit?: string;
  ytd_credit?: string;
  entity?: string;
  department?: string;
  project?: string;
  notes?: string;
}

export interface AccountData {
  account_number: string;
  account_name: string;
  currency: string;
  opening_debit: number;
  opening_credit: number;
  period_debit: number;
  period_credit: number;
  ytd_debit: number;
  ytd_credit: number;
  entity: string;
  department: string;
  project: string;
  notes: string;
}

export interface Leadsheet {
  accounts: AccountData[];
  opening_balance: number;
  adjustments: number;
  closing_balance: number;
  created_at: bigint;
}

export interface FinancialRatio {
  name: string;
  value: number;
  formula: string;
}

export interface TrendAnalysis {
  period_name: string;
  current_value: number;
  prior_value: number;
  change: number;
  change_percent: number;
}

export interface VarianceAnalysis {
  item_name: string;
  actual: number;
  expected: number;
  variance: number;
  variance_percent: number;
}

export interface WorkingPaper {
  id: bigint;
  engagement_id: bigint;
  dataset_id: bigint;
  name: string;
  column_mapping: ColumnMapping;
  leadsheet?: Leadsheet;
  ratios: FinancialRatio[];
  trend_analysis: TrendAnalysis[];
  variance_analysis: VarianceAnalysis[];
  linked_document_ids: bigint[];
  created_at: bigint;
  created_by: string;
}

export interface Document {
  id: bigint;
  name: string;
  file_type: string;
  file_size: bigint;
  organization_id?: bigint;
  entity_id?: bigint;
  category: string;
  created_at: bigint;
  created_by: string;
  access_principals: string[];
}

export interface ActivityLogEntry {
  id: bigint;
  principal: any; // Principal from IC can be string or object
  action: string;
  resource_type: string;
  resource_id: string;
  details: string;
  timestamp: bigint;
  data_hash: string;
  signature: string;
  previous_hash: string;
  block_height: bigint;
}

export interface BlockchainProof {
  entry_id: bigint;
  data_hash: string;
  timestamp: bigint;
  block_height: bigint;
  signature: string;
  previous_hash: string;
}

export interface VerificationResult {
  is_valid: boolean;
  entry_id: bigint;
  timestamp: bigint;
  data_hash: string;
  block_height: bigint;
  verification_timestamp: bigint;
  chain_integrity: boolean;
  message: string;
}

