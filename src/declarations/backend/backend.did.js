export const idlFactory = ({ IDL }) => {
  const AccountType = IDL.Variant({
    'Asset' : IDL.Null,
    'Liability' : IDL.Null,
    'Revenue' : IDL.Null,
    'Expense' : IDL.Null,
    'Equity' : IDL.Null,
  });
  const UpdateAccountRequest = IDL.Record({
    'fs_line_item' : IDL.Opt(IDL.Text),
    'debit_balance' : IDL.Int64,
    'credit_balance' : IDL.Int64,
    'account_number' : IDL.Text,
    'notes' : IDL.Opt(IDL.Text),
    'account_name' : IDL.Text,
    'account_type' : AccountType,
  });
  const TrialBalanceAccount = IDL.Record({
    'id' : IDL.Nat64,
    'trial_balance_id' : IDL.Nat64,
    'fs_line_item' : IDL.Opt(IDL.Text),
    'is_reconciled' : IDL.Bool,
    'debit_balance' : IDL.Int64,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'credit_balance' : IDL.Int64,
    'account_number' : IDL.Text,
    'notes' : IDL.Text,
    'account_name' : IDL.Text,
    'account_type' : AccountType,
  });
  const Result = IDL.Variant({ 'Ok' : TrialBalanceAccount, 'Err' : IDL.Text });
  const ApplyTemplateRequest = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'template_id' : IDL.Nat64,
    'engagement_id' : IDL.Nat64,
  });
  const ChecklistItemStatus = IDL.Variant({
    'NotApplicable' : IDL.Null,
    'InProgress' : IDL.Null,
    'Completed' : IDL.Null,
    'NotStarted' : IDL.Null,
  });
  const ChecklistItemInstance = IDL.Record({
    'status' : ChecklistItemStatus,
    'title' : IDL.Text,
    'order' : IDL.Nat32,
    'section' : IDL.Text,
    'description' : IDL.Text,
    'assigned_to' : IDL.Opt(IDL.Principal),
    'notes' : IDL.Text,
    'actual_hours' : IDL.Opt(IDL.Float64),
    'completed_at' : IDL.Opt(IDL.Nat64),
    'completed_by' : IDL.Opt(IDL.Principal),
    'item_id' : IDL.Text,
  });
  const EngagementChecklist = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'template_id' : IDL.Nat64,
    'engagement_id' : IDL.Nat64,
    'items' : IDL.Vec(ChecklistItemInstance),
  });
  const Result_1 = IDL.Variant({
    'Ok' : EngagementChecklist,
    'Err' : IDL.Text,
  });
  const AjeStatus = IDL.Variant({
    'Posted' : IDL.Null,
    'Approved' : IDL.Null,
    'Draft' : IDL.Null,
    'Rejected' : IDL.Null,
    'Proposed' : IDL.Null,
    'Reviewed' : IDL.Null,
  });
  const AdjustingJournalEntry = IDL.Record({
    'id' : IDL.Nat64,
    'status' : AjeStatus,
    'trial_balance_id' : IDL.Nat64,
    'blockchain_signature' : IDL.Text,
    'approved_at' : IDL.Opt(IDL.Nat64),
    'approved_by' : IDL.Opt(IDL.Principal),
    'reviewed_at' : IDL.Opt(IDL.Nat64),
    'reviewed_by' : IDL.Opt(IDL.Principal),
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'blockchain_hash' : IDL.Text,
    'engagement_id' : IDL.Nat64,
    'amount' : IDL.Int64,
    'aje_number' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'Ok' : AdjustingJournalEntry,
    'Err' : IDL.Text,
  });
  const ApproveDocumentInput = IDL.Record({
    'request_id' : IDL.Nat64,
    'approved' : IDL.Bool,
    'rejection_reason' : IDL.Opt(IDL.Text),
  });
  const DocumentRequestStatus = IDL.Variant({
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Uploaded' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const DocumentRequest = IDL.Record({
    'id' : IDL.Nat64,
    'status' : DocumentRequestStatus,
    'title' : IDL.Text,
    'is_required' : IDL.Bool,
    'fulfilled_document_id' : IDL.Opt(IDL.Nat64),
    'requested_from_principal' : IDL.Opt(IDL.Principal),
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'requested_by' : IDL.Principal,
    'engagement_id' : IDL.Nat64,
    'category' : IDL.Text,
    'due_date' : IDL.Opt(IDL.Nat64),
    'fulfilled_at' : IDL.Opt(IDL.Nat64),
  });
  const Result_3 = IDL.Variant({ 'Ok' : DocumentRequest, 'Err' : IDL.Text });
  const UserRole = IDL.Variant({
    'Staff' : IDL.Null,
    'ClientUser' : IDL.Null,
    'Senior' : IDL.Null,
    'Admin' : IDL.Null,
    'Partner' : IDL.Null,
    'Manager' : IDL.Null,
  });
  const CompleteProfileRequest = IDL.Record({
    'requested_role' : UserRole,
    'name' : IDL.Text,
    'email' : IDL.Text,
  });
  const User = IDL.Record({
    'profile_completed' : IDL.Bool,
    'principal' : IDL.Principal,
    'name' : IDL.Text,
    'role' : UserRole,
    'created_at' : IDL.Nat64,
    'email' : IDL.Text,
    'language_preference' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
  const CreateAjeLineItemRequest = IDL.Record({
    'account_id' : IDL.Nat64,
    'description' : IDL.Text,
    'debit_amount' : IDL.Int64,
    'credit_amount' : IDL.Int64,
  });
  const CreateAjeRequest = IDL.Record({
    'trial_balance_id' : IDL.Nat64,
    'line_items' : IDL.Vec(CreateAjeLineItemRequest),
    'description' : IDL.Text,
    'engagement_id' : IDL.Nat64,
    'aje_number' : IDL.Text,
  });
  const CreateClientRequest = IDL.Record({
    'name' : IDL.Text,
    'contact_email' : IDL.Text,
    'address' : IDL.Text,
    'contact_phone' : IDL.Text,
  });
  const Client = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'contact_email' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'address' : IDL.Text,
    'contact_phone' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'Ok' : Client, 'Err' : IDL.Text });
  const CreateDocumentRequestInput = IDL.Record({
    'title' : IDL.Text,
    'is_required' : IDL.Bool,
    'requested_from_principal' : IDL.Opt(IDL.Principal),
    'description' : IDL.Text,
    'engagement_id' : IDL.Nat64,
    'category' : IDL.Text,
    'due_date' : IDL.Opt(IDL.Nat64),
  });
  const EngagementLink = IDL.Variant({
    'Entity' : IDL.Nat64,
    'Client' : IDL.Nat64,
    'Organization' : IDL.Nat64,
  });
  const CreateEngagementRequest = IDL.Record({
    'status' : IDL.Text,
    'link' : EngagementLink,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'end_date' : IDL.Nat64,
    'start_date' : IDL.Nat64,
  });
  const Engagement = IDL.Record({
    'id' : IDL.Nat64,
    'status' : IDL.Text,
    'link' : EngagementLink,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'end_date' : IDL.Nat64,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'start_date' : IDL.Nat64,
  });
  const Result_6 = IDL.Variant({ 'Ok' : Engagement, 'Err' : IDL.Text });
  const XBRLTaxonomy = IDL.Variant({
    'IFRS' : IDL.Null,
    'Custom' : IDL.Text,
    'USGAAP' : IDL.Null,
  });
  const CreateEntityRequest = IDL.Record({
    'name' : IDL.Text,
    'taxonomy_config' : IDL.Text,
    'description' : IDL.Text,
    'organization_id' : IDL.Nat64,
    'taxonomy' : IDL.Opt(XBRLTaxonomy),
  });
  const Entity = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'taxonomy_config' : IDL.Text,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'organization_id' : IDL.Nat64,
    'taxonomy' : IDL.Opt(XBRLTaxonomy),
  });
  const Result_7 = IDL.Variant({ 'Ok' : Entity, 'Err' : IDL.Text });
  const CreateOrganizationRequest = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const Organization = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'entity_ids' : IDL.Vec(IDL.Nat64),
  });
  const Result_8 = IDL.Variant({ 'Ok' : Organization, 'Err' : IDL.Text });
  const ChecklistItem = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'estimated_hours' : IDL.Opt(IDL.Float64),
    'order' : IDL.Nat32,
    'is_required' : IDL.Bool,
    'reference' : IDL.Opt(IDL.Text),
    'section' : IDL.Text,
    'description' : IDL.Text,
  });
  const TemplateType = IDL.Variant({
    'Review' : IDL.Null,
    'Compilation' : IDL.Null,
    'Custom' : IDL.Null,
    'Audit' : IDL.Null,
    'TaxPreparation' : IDL.Null,
  });
  const CreateTemplateRequest = IDL.Record({
    'is_public' : IDL.Bool,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'checklist_items' : IDL.Vec(ChecklistItem),
    'template_type' : TemplateType,
    'firm_id' : IDL.Opt(IDL.Nat64),
  });
  const AuditTemplate = IDL.Record({
    'id' : IDL.Nat64,
    'is_public' : IDL.Bool,
    'updated_at' : IDL.Nat64,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'checklist_items' : IDL.Vec(ChecklistItem),
    'template_type' : TemplateType,
    'is_default' : IDL.Bool,
    'firm_id' : IDL.Opt(IDL.Nat64),
  });
  const Result_9 = IDL.Variant({ 'Ok' : AuditTemplate, 'Err' : IDL.Text });
  const CreateTrialBalanceRequest = IDL.Record({
    'description' : IDL.Text,
    'currency' : IDL.Opt(IDL.Text),
    'engagement_id' : IDL.Nat64,
    'period_end_date' : IDL.Text,
  });
  const TrialBalance = IDL.Record({
    'id' : IDL.Nat64,
    'last_modified_at' : IDL.Nat64,
    'last_modified_by' : IDL.Principal,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'is_adjusted' : IDL.Bool,
    'currency' : IDL.Text,
    'engagement_id' : IDL.Nat64,
    'period_end_date' : IDL.Text,
  });
  const Result_10 = IDL.Variant({ 'Ok' : TrialBalance, 'Err' : IDL.Text });
  const ColumnMapping = IDL.Record({
    'entity' : IDL.Opt(IDL.Text),
    'opening_debit' : IDL.Opt(IDL.Text),
    'period_credit' : IDL.Opt(IDL.Text),
    'account_number' : IDL.Opt(IDL.Text),
    'currency' : IDL.Opt(IDL.Text),
    'notes' : IDL.Opt(IDL.Text),
    'period_debit' : IDL.Opt(IDL.Text),
    'opening_credit' : IDL.Opt(IDL.Text),
    'ytd_debit' : IDL.Opt(IDL.Text),
    'ytd_credit' : IDL.Opt(IDL.Text),
    'department' : IDL.Opt(IDL.Text),
    'account_name' : IDL.Opt(IDL.Text),
    'project' : IDL.Opt(IDL.Text),
  });
  const CreateWorkingPaperRequest = IDL.Record({
    'dataset_id' : IDL.Nat64,
    'column_mapping' : ColumnMapping,
    'name' : IDL.Text,
    'selected_accounts' : IDL.Vec(IDL.Text),
    'engagement_id' : IDL.Nat64,
  });
  const VarianceAnalysis = IDL.Record({
    'actual' : IDL.Float64,
    'variance_percent' : IDL.Float64,
    'expected' : IDL.Float64,
    'item_name' : IDL.Text,
    'variance' : IDL.Float64,
  });
  const FinancialRatio = IDL.Record({
    'value' : IDL.Float64,
    'name' : IDL.Text,
    'formula' : IDL.Text,
  });
  const AccountData = IDL.Record({
    'entity' : IDL.Text,
    'opening_debit' : IDL.Float64,
    'period_credit' : IDL.Float64,
    'account_number' : IDL.Text,
    'currency' : IDL.Text,
    'notes' : IDL.Text,
    'period_debit' : IDL.Float64,
    'opening_credit' : IDL.Float64,
    'ytd_debit' : IDL.Float64,
    'ytd_credit' : IDL.Float64,
    'department' : IDL.Text,
    'account_name' : IDL.Text,
    'project' : IDL.Text,
  });
  const Leadsheet = IDL.Record({
    'closing_balance' : IDL.Float64,
    'opening_balance' : IDL.Float64,
    'created_at' : IDL.Nat64,
    'adjustments' : IDL.Float64,
    'accounts' : IDL.Vec(AccountData),
  });
  const TrendAnalysis = IDL.Record({
    'prior_value' : IDL.Float64,
    'change_percent' : IDL.Float64,
    'period_name' : IDL.Text,
    'change' : IDL.Float64,
    'current_value' : IDL.Float64,
  });
  const WorkingPaper = IDL.Record({
    'id' : IDL.Nat64,
    'linked_document_ids' : IDL.Vec(IDL.Nat64),
    'dataset_id' : IDL.Nat64,
    'column_mapping' : ColumnMapping,
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'variance_analysis' : IDL.Vec(VarianceAnalysis),
    'engagement_id' : IDL.Nat64,
    'ratios' : IDL.Vec(FinancialRatio),
    'leadsheet' : IDL.Opt(Leadsheet),
    'trend_analysis' : IDL.Vec(TrendAnalysis),
  });
  const Result_11 = IDL.Variant({ 'Ok' : WorkingPaper, 'Err' : IDL.Text });
  const Result_12 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_13 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const FulfillDocumentRequestInput = IDL.Record({
    'request_id' : IDL.Nat64,
    'document_name' : IDL.Text,
    'file_data' : IDL.Vec(IDL.Nat8),
    'file_type' : IDL.Text,
    'category' : IDL.Text,
  });
  const ActivityLogEntry = IDL.Record({
    'id' : IDL.Nat64,
    'principal' : IDL.Principal,
    'signature' : IDL.Text,
    'action' : IDL.Text,
    'previous_hash' : IDL.Text,
    'resource_type' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'resource_id' : IDL.Text,
    'data_hash' : IDL.Text,
    'details' : IDL.Text,
    'block_height' : IDL.Nat64,
  });
  const Result_14 = IDL.Variant({
    'Ok' : IDL.Vec(ActivityLogEntry),
    'Err' : IDL.Text,
  });
  const AjeLineItem = IDL.Record({
    'id' : IDL.Nat64,
    'account_id' : IDL.Nat64,
    'aje_id' : IDL.Nat64,
    'description' : IDL.Text,
    'account_number' : IDL.Text,
    'debit_amount' : IDL.Int64,
    'credit_amount' : IDL.Int64,
    'account_name' : IDL.Text,
  });
  const Result_15 = IDL.Variant({
    'Ok' : IDL.Vec(AjeLineItem),
    'Err' : IDL.Text,
  });
  const BlockchainProof = IDL.Record({
    'signature' : IDL.Text,
    'previous_hash' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'data_hash' : IDL.Text,
    'entry_id' : IDL.Nat64,
    'block_height' : IDL.Nat64,
  });
  const Result_16 = IDL.Variant({ 'Ok' : BlockchainProof, 'Err' : IDL.Text });
  const ClientAccessLevel = IDL.Variant({
    'Full' : IDL.Null,
    'UploadDocuments' : IDL.Null,
    'ViewOnly' : IDL.Null,
  });
  const ClientAccess = IDL.Record({
    'principal' : IDL.Principal,
    'access_level' : ClientAccessLevel,
    'granted_at' : IDL.Nat64,
    'granted_by' : IDL.Principal,
    'engagement_id' : IDL.Nat64,
  });
  const Result_17 = IDL.Variant({
    'Ok' : IDL.Vec(ClientAccess),
    'Err' : IDL.Text,
  });
  const PIIDetection = IDL.Record({
    'has_national_ids' : IDL.Bool,
    'has_emails' : IDL.Bool,
    'has_names' : IDL.Bool,
    'has_phone_numbers' : IDL.Bool,
  });
  const ColumnType = IDL.Variant({
    'Date' : IDL.Null,
    'Text' : IDL.Null,
    'Boolean' : IDL.Null,
    'Currency' : IDL.Null,
    'Numeric' : IDL.Null,
  });
  const ColumnMetadata = IDL.Record({
    'max_value' : IDL.Text,
    'pii_detection' : PIIDetection,
    'unique_count' : IDL.Nat64,
    'name' : IDL.Text,
    'min_value' : IDL.Text,
    'detected_type' : ColumnType,
    'sample_values' : IDL.Vec(IDL.Text),
    'original_name' : IDL.Text,
    'null_percent' : IDL.Float64,
  });
  const SheetData = IDL.Record({
    'data' : IDL.Vec(IDL.Vec(IDL.Text)),
    'name' : IDL.Text,
    'row_count' : IDL.Nat64,
    'columns' : IDL.Vec(ColumnMetadata),
  });
  const ImportedDataset = IDL.Record({
    'id' : IDL.Nat64,
    'sheets' : IDL.Vec(SheetData),
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'file_name' : IDL.Text,
    'file_size' : IDL.Nat64,
    'version' : IDL.Nat32,
    'engagement_id' : IDL.Opt(IDL.Nat64),
  });
  const Result_18 = IDL.Variant({ 'Ok' : ImportedDataset, 'Err' : IDL.Text });
  const Document = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'file_size' : IDL.Nat64,
    'file_type' : IDL.Text,
    'access_principals' : IDL.Vec(IDL.Principal),
    'data_chunks' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'category' : IDL.Text,
    'entity_id' : IDL.Opt(IDL.Nat64),
    'organization_id' : IDL.Opt(IDL.Nat64),
  });
  const Result_19 = IDL.Variant({ 'Ok' : Document, 'Err' : IDL.Text });
  const Result_20 = IDL.Variant({
    'Ok' : IDL.Vec(DocumentRequest),
    'Err' : IDL.Text,
  });
  const Result_21 = IDL.Variant({
    'Ok' : IDL.Vec(EngagementChecklist),
    'Err' : IDL.Text,
  });
  const Result_22 = IDL.Variant({
    'Ok' : IDL.Vec(TrialBalanceAccount),
    'Err' : IDL.Text,
  });
  const GrantClientAccessRequest = IDL.Record({
    'access_level' : ClientAccessLevel,
    'client_principal' : IDL.Principal,
    'engagement_id' : IDL.Nat64,
  });
  const Result_23 = IDL.Variant({ 'Ok' : ClientAccess, 'Err' : IDL.Text });
  const ImportExcelRequest = IDL.Record({
    'name' : IDL.Text,
    'file_data' : IDL.Vec(IDL.Nat8),
    'file_name' : IDL.Text,
    'engagement_id' : IDL.Opt(IDL.Nat64),
  });
  const CsvAccountRow = IDL.Record({
    'debit_balance' : IDL.Int64,
    'credit_balance' : IDL.Int64,
    'account_number' : IDL.Text,
    'account_name' : IDL.Text,
  });
  const Result_24 = IDL.Variant({
    'Ok' : IDL.Vec(AdjustingJournalEntry),
    'Err' : IDL.Text,
  });
  const Result_25 = IDL.Variant({ 'Ok' : IDL.Vec(Client), 'Err' : IDL.Text });
  const Result_26 = IDL.Variant({
    'Ok' : IDL.Vec(ImportedDataset),
    'Err' : IDL.Text,
  });
  const Result_27 = IDL.Variant({ 'Ok' : IDL.Vec(Document), 'Err' : IDL.Text });
  const Result_28 = IDL.Variant({
    'Ok' : IDL.Vec(Engagement),
    'Err' : IDL.Text,
  });
  const Result_29 = IDL.Variant({ 'Ok' : IDL.Vec(Entity), 'Err' : IDL.Text });
  const Result_30 = IDL.Variant({
    'Ok' : IDL.Vec(Organization),
    'Err' : IDL.Text,
  });
  const Result_31 = IDL.Variant({
    'Ok' : IDL.Vec(AuditTemplate),
    'Err' : IDL.Text,
  });
  const Result_32 = IDL.Variant({
    'Ok' : IDL.Vec(TrialBalance),
    'Err' : IDL.Text,
  });
  const Result_33 = IDL.Variant({ 'Ok' : IDL.Vec(User), 'Err' : IDL.Text });
  const Result_34 = IDL.Variant({
    'Ok' : IDL.Vec(WorkingPaper),
    'Err' : IDL.Text,
  });
  const UpdateChecklistItemRequest = IDL.Record({
    'status' : IDL.Opt(ChecklistItemStatus),
    'checklist_id' : IDL.Nat64,
    'assigned_to' : IDL.Opt(IDL.Principal),
    'notes' : IDL.Opt(IDL.Text),
    'actual_hours' : IDL.Opt(IDL.Float64),
    'item_id' : IDL.Text,
  });
  const UpdateClientRequest = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'contact_email' : IDL.Text,
    'address' : IDL.Text,
    'contact_phone' : IDL.Text,
  });
  const UpdateEngagementRequest = IDL.Record({
    'id' : IDL.Nat64,
    'status' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'end_date' : IDL.Nat64,
    'start_date' : IDL.Nat64,
  });
  const UpdateEntityRequest = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'taxonomy_config' : IDL.Text,
    'description' : IDL.Text,
    'taxonomy' : IDL.Opt(XBRLTaxonomy),
  });
  const UpdateOrganizationRequest = IDL.Record({
    'id' : IDL.Nat64,
    'name' : IDL.Text,
    'description' : IDL.Text,
  });
  const UploadDocumentRequest = IDL.Record({
    'name' : IDL.Text,
    'file_data' : IDL.Vec(IDL.Nat8),
    'file_type' : IDL.Text,
    'category' : IDL.Text,
    'entity_id' : IDL.Opt(IDL.Nat64),
    'organization_id' : IDL.Opt(IDL.Nat64),
  });
  const TrialBalanceValidation = IDL.Record({
    'trial_balance_id' : IDL.Nat64,
    'account_count' : IDL.Nat64,
    'difference' : IDL.Int64,
    'is_balanced' : IDL.Bool,
    'issues' : IDL.Vec(IDL.Text),
    'total_credits' : IDL.Int64,
    'validated_at' : IDL.Nat64,
    'validated_by' : IDL.Principal,
    'total_debits' : IDL.Int64,
  });
  const Result_35 = IDL.Variant({
    'Ok' : TrialBalanceValidation,
    'Err' : IDL.Text,
  });
  const VerificationResult = IDL.Record({
    'is_valid' : IDL.Bool,
    'message' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'data_hash' : IDL.Text,
    'chain_integrity' : IDL.Bool,
    'entry_id' : IDL.Nat64,
    'block_height' : IDL.Nat64,
    'verification_timestamp' : IDL.Nat64,
  });
  const Result_36 = IDL.Variant({
    'Ok' : VerificationResult,
    'Err' : IDL.Text,
  });
  const AjeBlockchainVerification = IDL.Record({
    'status' : IDL.Text,
    'aje_id' : IDL.Nat64,
    'blockchain_signature' : IDL.Text,
    'computed_hash' : IDL.Text,
    'is_valid' : IDL.Bool,
    'approved_at' : IDL.Opt(IDL.Nat64),
    'approved_by' : IDL.Opt(IDL.Principal),
    'created_at' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'blockchain_hash' : IDL.Text,
    'verified_at' : IDL.Nat64,
    'verified_by' : IDL.Principal,
  });
  const Result_37 = IDL.Variant({
    'Ok' : AjeBlockchainVerification,
    'Err' : IDL.Text,
  });
  const Result_38 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  return IDL.Service({
    'add_trial_balance_account' : IDL.Func(
        [IDL.Nat64, UpdateAccountRequest],
        [Result],
        [],
      ),
    'apply_template_to_engagement' : IDL.Func(
        [ApplyTemplateRequest],
        [Result_1],
        [],
      ),
    'approve_aje' : IDL.Func([IDL.Nat64], [Result_2], []),
    'approve_document_request' : IDL.Func(
        [ApproveDocumentInput],
        [Result_3],
        [],
      ),
    'complete_user_profile' : IDL.Func(
        [CompleteProfileRequest],
        [Result_4],
        [],
      ),
    'create_aje' : IDL.Func([CreateAjeRequest], [Result_2], []),
    'create_client' : IDL.Func([CreateClientRequest], [Result_5], []),
    'create_document_request' : IDL.Func(
        [CreateDocumentRequestInput],
        [Result_3],
        [],
      ),
    'create_engagement' : IDL.Func([CreateEngagementRequest], [Result_6], []),
    'create_entity' : IDL.Func([CreateEntityRequest], [Result_7], []),
    'create_organization' : IDL.Func(
        [CreateOrganizationRequest],
        [Result_8],
        [],
      ),
    'create_template' : IDL.Func([CreateTemplateRequest], [Result_9], []),
    'create_trial_balance' : IDL.Func(
        [CreateTrialBalanceRequest],
        [Result_10],
        [],
      ),
    'create_working_paper' : IDL.Func(
        [CreateWorkingPaperRequest],
        [Result_11],
        [],
      ),
    'delete_client' : IDL.Func([IDL.Nat64], [Result_12], []),
    'delete_document' : IDL.Func([IDL.Nat64], [Result_12], []),
    'delete_engagement' : IDL.Func([IDL.Nat64], [Result_12], []),
    'delete_entity' : IDL.Func([IDL.Nat64], [Result_12], []),
    'delete_organization' : IDL.Func([IDL.Nat64], [Result_12], []),
    'download_document' : IDL.Func([IDL.Nat64], [Result_13], ['query']),
    'fulfill_document_request' : IDL.Func(
        [FulfillDocumentRequestInput],
        [Result_3],
        [],
      ),
    'get_activity_logs' : IDL.Func(
        [IDL.Opt(IDL.Nat64)],
        [Result_14],
        ['query'],
      ),
    'get_aje' : IDL.Func([IDL.Nat64], [Result_2], ['query']),
    'get_aje_line_items' : IDL.Func([IDL.Nat64], [Result_15], ['query']),
    'get_blockchain_proof' : IDL.Func([IDL.Nat64], [Result_16], ['query']),
    'get_client' : IDL.Func([IDL.Nat64], [Result_5], ['query']),
    'get_client_access_for_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_17],
        ['query'],
      ),
    'get_current_user' : IDL.Func([], [Result_4], []),
    'get_dataset' : IDL.Func([IDL.Nat64], [Result_18], ['query']),
    'get_document' : IDL.Func([IDL.Nat64], [Result_19], ['query']),
    'get_document_requests_for_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_20],
        ['query'],
      ),
    'get_engagement' : IDL.Func([IDL.Nat64], [Result_6], ['query']),
    'get_engagement_checklists' : IDL.Func([IDL.Nat64], [Result_21], ['query']),
    'get_entity' : IDL.Func([IDL.Nat64], [Result_7], ['query']),
    'get_my_document_requests' : IDL.Func([], [Result_20], ['query']),
    'get_organization' : IDL.Func([IDL.Nat64], [Result_8], ['query']),
    'get_resource_activity_logs' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Nat64)],
        [Result_14],
        ['query'],
      ),
    'get_template' : IDL.Func([IDL.Nat64], [Result_9], ['query']),
    'get_trial_balance' : IDL.Func([IDL.Nat64], [Result_10], ['query']),
    'get_trial_balance_accounts' : IDL.Func(
        [IDL.Nat64],
        [Result_22],
        ['query'],
      ),
    'get_user_activity_logs' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat64)],
        [Result_14],
        ['query'],
      ),
    'get_working_paper' : IDL.Func([IDL.Nat64], [Result_11], ['query']),
    'grant_client_access' : IDL.Func(
        [GrantClientAccessRequest],
        [Result_23],
        [],
      ),
    'grant_document_access' : IDL.Func(
        [IDL.Nat64, IDL.Principal],
        [Result_12],
        [],
      ),
    'import_excel' : IDL.Func([ImportExcelRequest], [Result_18], []),
    'import_trial_balance_csv' : IDL.Func(
        [IDL.Nat64, IDL.Text, IDL.Vec(CsvAccountRow)],
        [Result_10],
        [],
      ),
    'link_document_to_working_paper' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_12],
        [],
      ),
    'list_ajes_by_engagement' : IDL.Func([IDL.Nat64], [Result_24], ['query']),
    'list_clients' : IDL.Func([], [Result_25], ['query']),
    'list_datasets' : IDL.Func([], [Result_26], ['query']),
    'list_datasets_by_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_26],
        ['query'],
      ),
    'list_documents' : IDL.Func([], [Result_27], ['query']),
    'list_documents_by_entity' : IDL.Func([IDL.Nat64], [Result_27], ['query']),
    'list_documents_by_organization' : IDL.Func(
        [IDL.Nat64],
        [Result_27],
        ['query'],
      ),
    'list_engagements' : IDL.Func([], [Result_28], ['query']),
    'list_engagements_by_client' : IDL.Func(
        [IDL.Nat64],
        [Result_28],
        ['query'],
      ),
    'list_engagements_by_entity' : IDL.Func(
        [IDL.Nat64],
        [Result_28],
        ['query'],
      ),
    'list_engagements_by_organization' : IDL.Func(
        [IDL.Nat64],
        [Result_28],
        ['query'],
      ),
    'list_entities' : IDL.Func([], [Result_29], ['query']),
    'list_entities_by_organization' : IDL.Func(
        [IDL.Nat64],
        [Result_29],
        ['query'],
      ),
    'list_organizations' : IDL.Func([], [Result_30], ['query']),
    'list_templates' : IDL.Func([], [Result_31], ['query']),
    'list_trial_balances_by_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_32],
        ['query'],
      ),
    'list_users' : IDL.Func([], [Result_33], ['query']),
    'list_working_papers_by_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_34],
        ['query'],
      ),
    'map_account_to_fs_line' : IDL.Func([IDL.Nat64, IDL.Text], [Result], []),
    'post_aje' : IDL.Func([IDL.Nat64], [Result_2], []),
    'review_aje' : IDL.Func([IDL.Nat64, IDL.Bool], [Result_2], []),
    'revoke_document_access' : IDL.Func(
        [IDL.Nat64, IDL.Principal],
        [Result_12],
        [],
      ),
    'submit_aje' : IDL.Func([IDL.Nat64], [Result_2], []),
    'update_checklist_item' : IDL.Func(
        [UpdateChecklistItemRequest],
        [Result_1],
        [],
      ),
    'update_client' : IDL.Func([UpdateClientRequest], [Result_5], []),
    'update_engagement' : IDL.Func([UpdateEngagementRequest], [Result_6], []),
    'update_entity' : IDL.Func([UpdateEntityRequest], [Result_7], []),
    'update_organization' : IDL.Func(
        [UpdateOrganizationRequest],
        [Result_8],
        [],
      ),
    'update_user_email' : IDL.Func([IDL.Text], [Result_12], []),
    'update_user_language' : IDL.Func([IDL.Text], [Result_12], []),
    'update_user_name' : IDL.Func([IDL.Text], [Result_12], []),
    'update_user_role' : IDL.Func([IDL.Principal, UserRole], [Result_12], []),
    'upload_document' : IDL.Func([UploadDocumentRequest], [Result_19], []),
    'validate_trial_balance' : IDL.Func([IDL.Nat64], [Result_35], ['query']),
    'verify_activity_log' : IDL.Func([IDL.Nat64], [Result_36], ['query']),
    'verify_aje_blockchain' : IDL.Func([IDL.Nat64], [Result_37], ['query']),
    'verify_blockchain_chain' : IDL.Func([], [Result_38], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
