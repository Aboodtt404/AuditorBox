export const idlFactory = ({ IDL }) => {
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
  const Result = IDL.Variant({ 'Ok' : Client, 'Err' : IDL.Text });
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
  const Result_1 = IDL.Variant({ 'Ok' : Engagement, 'Err' : IDL.Text });
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
  const Result_2 = IDL.Variant({ 'Ok' : Entity, 'Err' : IDL.Text });
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
  const Result_3 = IDL.Variant({ 'Ok' : Organization, 'Err' : IDL.Text });
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
  const Result_4 = IDL.Variant({ 'Ok' : WorkingPaper, 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_6 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const ActivityLogEntry = IDL.Record({
    'id' : IDL.Nat64,
    'principal' : IDL.Principal,
    'action' : IDL.Text,
    'resource_type' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'resource_id' : IDL.Text,
    'details' : IDL.Text,
  });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Vec(ActivityLogEntry),
    'Err' : IDL.Text,
  });
  const UserRole = IDL.Variant({
    'Staff' : IDL.Null,
    'ClientUser' : IDL.Null,
    'Senior' : IDL.Null,
    'Admin' : IDL.Null,
    'Partner' : IDL.Null,
    'Manager' : IDL.Null,
  });
  const User = IDL.Record({
    'principal' : IDL.Principal,
    'name' : IDL.Text,
    'role' : UserRole,
    'created_at' : IDL.Nat64,
    'email' : IDL.Text,
    'language_preference' : IDL.Text,
  });
  const Result_8 = IDL.Variant({ 'Ok' : User, 'Err' : IDL.Text });
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
  const Result_9 = IDL.Variant({ 'Ok' : ImportedDataset, 'Err' : IDL.Text });
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
  const Result_10 = IDL.Variant({ 'Ok' : Document, 'Err' : IDL.Text });
  const ImportExcelRequest = IDL.Record({
    'name' : IDL.Text,
    'file_data' : IDL.Vec(IDL.Nat8),
    'file_name' : IDL.Text,
    'engagement_id' : IDL.Opt(IDL.Nat64),
  });
  const Result_11 = IDL.Variant({ 'Ok' : IDL.Vec(Client), 'Err' : IDL.Text });
  const Result_12 = IDL.Variant({
    'Ok' : IDL.Vec(ImportedDataset),
    'Err' : IDL.Text,
  });
  const Result_13 = IDL.Variant({ 'Ok' : IDL.Vec(Document), 'Err' : IDL.Text });
  const Result_14 = IDL.Variant({
    'Ok' : IDL.Vec(Engagement),
    'Err' : IDL.Text,
  });
  const Result_15 = IDL.Variant({ 'Ok' : IDL.Vec(Entity), 'Err' : IDL.Text });
  const Result_16 = IDL.Variant({
    'Ok' : IDL.Vec(Organization),
    'Err' : IDL.Text,
  });
  const Result_17 = IDL.Variant({ 'Ok' : IDL.Vec(User), 'Err' : IDL.Text });
  const Result_18 = IDL.Variant({
    'Ok' : IDL.Vec(WorkingPaper),
    'Err' : IDL.Text,
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
  return IDL.Service({
    'create_client' : IDL.Func([CreateClientRequest], [Result], []),
    'create_engagement' : IDL.Func([CreateEngagementRequest], [Result_1], []),
    'create_entity' : IDL.Func([CreateEntityRequest], [Result_2], []),
    'create_organization' : IDL.Func(
        [CreateOrganizationRequest],
        [Result_3],
        [],
      ),
    'create_working_paper' : IDL.Func(
        [CreateWorkingPaperRequest],
        [Result_4],
        [],
      ),
    'delete_client' : IDL.Func([IDL.Nat64], [Result_5], []),
    'delete_document' : IDL.Func([IDL.Nat64], [Result_5], []),
    'delete_engagement' : IDL.Func([IDL.Nat64], [Result_5], []),
    'delete_entity' : IDL.Func([IDL.Nat64], [Result_5], []),
    'delete_organization' : IDL.Func([IDL.Nat64], [Result_5], []),
    'download_document' : IDL.Func([IDL.Nat64], [Result_6], ['query']),
    'get_activity_logs' : IDL.Func([IDL.Opt(IDL.Nat64)], [Result_7], ['query']),
    'get_client' : IDL.Func([IDL.Nat64], [Result], ['query']),
    'get_current_user' : IDL.Func([], [Result_8], []),
    'get_dataset' : IDL.Func([IDL.Nat64], [Result_9], ['query']),
    'get_document' : IDL.Func([IDL.Nat64], [Result_10], ['query']),
    'get_engagement' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'get_entity' : IDL.Func([IDL.Nat64], [Result_2], ['query']),
    'get_organization' : IDL.Func([IDL.Nat64], [Result_3], ['query']),
    'get_resource_activity_logs' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Nat64)],
        [Result_7],
        ['query'],
      ),
    'get_user_activity_logs' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat64)],
        [Result_7],
        ['query'],
      ),
    'get_working_paper' : IDL.Func([IDL.Nat64], [Result_4], ['query']),
    'grant_document_access' : IDL.Func(
        [IDL.Nat64, IDL.Principal],
        [Result_5],
        [],
      ),
    'import_excel' : IDL.Func([ImportExcelRequest], [Result_9], []),
    'link_document_to_working_paper' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_5],
        [],
      ),
    'list_clients' : IDL.Func([], [Result_11], ['query']),
    'list_datasets' : IDL.Func([], [Result_12], ['query']),
    'list_datasets_by_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_12],
        ['query'],
      ),
    'list_documents' : IDL.Func([], [Result_13], ['query']),
    'list_documents_by_entity' : IDL.Func([IDL.Nat64], [Result_13], ['query']),
    'list_documents_by_organization' : IDL.Func(
        [IDL.Nat64],
        [Result_13],
        ['query'],
      ),
    'list_engagements' : IDL.Func([], [Result_14], ['query']),
    'list_engagements_by_client' : IDL.Func(
        [IDL.Nat64],
        [Result_14],
        ['query'],
      ),
    'list_engagements_by_entity' : IDL.Func(
        [IDL.Nat64],
        [Result_14],
        ['query'],
      ),
    'list_engagements_by_organization' : IDL.Func(
        [IDL.Nat64],
        [Result_14],
        ['query'],
      ),
    'list_entities' : IDL.Func([], [Result_15], ['query']),
    'list_entities_by_organization' : IDL.Func(
        [IDL.Nat64],
        [Result_15],
        ['query'],
      ),
    'list_organizations' : IDL.Func([], [Result_16], ['query']),
    'list_users' : IDL.Func([], [Result_17], ['query']),
    'list_working_papers_by_engagement' : IDL.Func(
        [IDL.Nat64],
        [Result_18],
        ['query'],
      ),
    'revoke_document_access' : IDL.Func(
        [IDL.Nat64, IDL.Principal],
        [Result_5],
        [],
      ),
    'update_client' : IDL.Func([UpdateClientRequest], [Result], []),
    'update_engagement' : IDL.Func([UpdateEngagementRequest], [Result_1], []),
    'update_entity' : IDL.Func([UpdateEntityRequest], [Result_2], []),
    'update_organization' : IDL.Func(
        [UpdateOrganizationRequest],
        [Result_3],
        [],
      ),
    'update_user_language' : IDL.Func([IDL.Text], [Result_5], []),
    'update_user_role' : IDL.Func([IDL.Principal, UserRole], [Result_5], []),
    'upload_document' : IDL.Func([UploadDocumentRequest], [Result_10], []),
  });
};
export const init = ({ IDL }) => { return []; };
