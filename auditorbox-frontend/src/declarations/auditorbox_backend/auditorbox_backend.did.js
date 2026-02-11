export const idlFactory = ({ IDL }) => {
  const FormStatus = IDL.Variant({
    'Prepared' : IDL.Null,
    'Reviewed' : IDL.Null,
    'InProgress' : IDL.Null,
    'SignedOff' : IDL.Null,
    'NotStarted' : IDL.Null,
  });
  const SaveFormDataRequest = IDL.Record({
    'status' : FormStatus,
    'values' : IDL.Text,
    'formId' : IDL.Text,
  });
  const ApiResult_9 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const UserRole = IDL.Variant({
    'Staff' : IDL.Null,
    'ClientUser' : IDL.Null,
    'Senior' : IDL.Null,
    'Admin' : IDL.Null,
    'Partner' : IDL.Null,
    'Manager' : IDL.Null,
  });
  const CompleteProfileRequest = IDL.Record({
    'name' : IDL.Text,
    'email' : IDL.Text,
    'requestedRole' : UserRole,
  });
  const User = IDL.Record({
    'languagePreference' : IDL.Text,
    'principal' : IDL.Principal,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'role' : UserRole,
    'email' : IDL.Text,
    'profileCompleted' : IDL.Bool,
  });
  const ApiResult_8 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const AjeLineItem = IDL.Record({
    'description' : IDL.Text,
    'credit' : IDL.Float64,
    'accountName' : IDL.Text,
    'accountNumber' : IDL.Text,
    'debit' : IDL.Float64,
  });
  const CreateAjeRequest = IDL.Record({
    'lineItems' : IDL.Vec(AjeLineItem),
    'engagementId' : IDL.Nat,
    'trialBalanceId' : IDL.Nat,
    'description' : IDL.Text,
  });
  const AjeStatus = IDL.Variant({
    'Posted' : IDL.Null,
    'Approved' : IDL.Null,
    'Draft' : IDL.Null,
    'Rejected' : IDL.Null,
    'Proposed' : IDL.Null,
    'Reviewed' : IDL.Null,
  });
  const Adjustment = IDL.Record({
    'id' : IDL.Nat,
    'status' : AjeStatus,
    'lineItems' : IDL.Vec(AjeLineItem),
    'engagementId' : IDL.Nat,
    'trialBalanceId' : IDL.Nat,
    'approvedBy' : IDL.Opt(IDL.Principal),
    'createdAt' : IDL.Int,
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'reviewedBy' : IDL.Opt(IDL.Principal),
    'blockchainHash' : IDL.Text,
  });
  const ApiResult_5 = IDL.Variant({ 'ok' : Adjustment, 'err' : IDL.Text });
  const EngagementLink = IDL.Variant({
    'Entity' : IDL.Nat,
    'Client' : IDL.Nat,
    'Organization' : IDL.Nat,
  });
  const CreateEngagementRequest = IDL.Record({
    'materialityOverall' : IDL.Float64,
    'industrySector' : IDL.Text,
    'endDate' : IDL.Int,
    'yearEnd' : IDL.Text,
    'clientName' : IDL.Text,
    'link' : EngagementLink,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'isGroupAudit' : IDL.Bool,
    'materialityPerformance' : IDL.Float64,
    'materialityTrivial' : IDL.Float64,
    'reportingFramework' : IDL.Text,
    'currency' : IDL.Text,
    'riskProfile' : IDL.Text,
    'entityType' : IDL.Text,
    'isFirstYear' : IDL.Bool,
    'startDate' : IDL.Int,
  });
  const EngagementStatus = IDL.Variant({
    'Review' : IDL.Null,
    'Archived' : IDL.Null,
    'Planning' : IDL.Null,
    'InProgress' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const Engagement = IDL.Record({
    'id' : IDL.Nat,
    'materialityOverall' : IDL.Float64,
    'status' : EngagementStatus,
    'industrySector' : IDL.Text,
    'endDate' : IDL.Int,
    'yearEnd' : IDL.Text,
    'clientName' : IDL.Text,
    'link' : EngagementLink,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'isGroupAudit' : IDL.Bool,
    'materialityPerformance' : IDL.Float64,
    'materialityTrivial' : IDL.Float64,
    'reportingFramework' : IDL.Text,
    'currency' : IDL.Text,
    'riskProfile' : IDL.Text,
    'entityType' : IDL.Text,
    'isFirstYear' : IDL.Bool,
    'startDate' : IDL.Int,
  });
  const ApiResult_4 = IDL.Variant({ 'ok' : Engagement, 'err' : IDL.Text });
  const XBRLTaxonomy = IDL.Variant({
    'EAS' : IDL.Null,
    'GCC' : IDL.Null,
    'IFRS' : IDL.Null,
    'Custom' : IDL.Text,
  });
  const FSLineItem = IDL.Record({
    'nameAr' : IDL.Opt(IDL.Text),
    'code' : IDL.Text,
    'name' : IDL.Text,
    'category' : IDL.Text,
    'amount' : IDL.Float64,
  });
  const FinancialStatement = IDL.Record({
    'id' : IDL.Nat,
    'lineItems' : IDL.Vec(FSLineItem),
    'engagementId' : IDL.Nat,
    'title' : IDL.Text,
    'trialBalanceId' : IDL.Nat,
    'generatedAt' : IDL.Int,
    'generatedBy' : IDL.Principal,
    'taxonomy' : XBRLTaxonomy,
  });
  const ApiResult_7 = IDL.Variant({
    'ok' : FinancialStatement,
    'err' : IDL.Text,
  });
  const Organization = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'entityIds' : IDL.Vec(IDL.Nat),
  });
  const ApiResult_6 = IDL.Variant({ 'ok' : Organization, 'err' : IDL.Text });
  const CreateTrialBalanceRequest = IDL.Record({
    'engagementId' : IDL.Nat,
    'description' : IDL.Text,
    'periodEndDate' : IDL.Text,
    'currency' : IDL.Text,
  });
  const AccountType = IDL.Variant({
    'Asset' : IDL.Null,
    'Liability' : IDL.Null,
    'Other' : IDL.Null,
    'Revenue' : IDL.Null,
    'Expense' : IDL.Null,
    'Equity' : IDL.Null,
  });
  const TrialBalanceAccount = IDL.Record({
    'beginningBalance' : IDL.Float64,
    'credit' : IDL.Float64,
    'accountName' : IDL.Text,
    'accountType' : AccountType,
    'endingBalance' : IDL.Float64,
    'accountNumber' : IDL.Text,
    'fsLineItem' : IDL.Text,
    'debit' : IDL.Float64,
  });
  const TrialBalance = IDL.Record({
    'id' : IDL.Nat,
    'engagementId' : IDL.Nat,
    'createdAt' : IDL.Int,
    'createdBy' : IDL.Principal,
    'description' : IDL.Text,
    'periodEndDate' : IDL.Text,
    'accounts' : IDL.Vec(TrialBalanceAccount),
    'currency' : IDL.Text,
  });
  const ApiResult_2 = IDL.Variant({ 'ok' : TrialBalance, 'err' : IDL.Text });
  const AuditTrailEntry = IDL.Record({
    'id' : IDL.Nat,
    'principal' : IDL.Principal,
    'action' : IDL.Text,
    'resourceId' : IDL.Nat,
    'hash' : IDL.Text,
    'resourceType' : IDL.Text,
    'timestamp' : IDL.Int,
    'details' : IDL.Text,
    'previousHash' : IDL.Text,
  });
  const FormData = IDL.Record({
    'status' : FormStatus,
    'engagementId' : IDL.Nat,
    'values' : IDL.Text,
    'lastUpdated' : IDL.Int,
    'reviewedBy' : IDL.Opt(IDL.Principal),
    'preparedBy' : IDL.Opt(IDL.Principal),
    'updatedBy' : IDL.Principal,
    'formId' : IDL.Text,
  });
  const UserPreferences = IDL.Record({
    'lastEngagementId' : IDL.Opt(IDL.Nat),
    'dismissedTooltips' : IDL.Vec(IDL.Text),
    'seenPhaseIntros' : IDL.Vec(IDL.Text),
  });
  const ApiResult_3 = IDL.Variant({ 'ok' : FormData, 'err' : IDL.Text });
  const UpdateEngagementRequest = IDL.Record({
    'materialityOverall' : IDL.Opt(IDL.Float64),
    'status' : IDL.Opt(EngagementStatus),
    'industrySector' : IDL.Opt(IDL.Text),
    'endDate' : IDL.Opt(IDL.Int),
    'yearEnd' : IDL.Opt(IDL.Text),
    'clientName' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'isGroupAudit' : IDL.Opt(IDL.Bool),
    'materialityPerformance' : IDL.Opt(IDL.Float64),
    'materialityTrivial' : IDL.Opt(IDL.Float64),
    'reportingFramework' : IDL.Opt(IDL.Text),
    'currency' : IDL.Opt(IDL.Text),
    'riskProfile' : IDL.Opt(IDL.Text),
    'entityType' : IDL.Opt(IDL.Text),
    'isFirstYear' : IDL.Opt(IDL.Bool),
  });
  const ApiResult_1 = IDL.Variant({ 'ok' : UserPreferences, 'err' : IDL.Text });
  const ApiResult = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'batchSaveFormData' : IDL.Func(
        [IDL.Nat, IDL.Vec(SaveFormDataRequest)],
        [ApiResult_9],
        [],
      ),
    'completeProfile' : IDL.Func([CompleteProfileRequest], [ApiResult_8], []),
    'createAdjustment' : IDL.Func([CreateAjeRequest], [ApiResult_5], []),
    'createEngagement' : IDL.Func([CreateEngagementRequest], [ApiResult_4], []),
    'createFinancialStatement' : IDL.Func(
        [IDL.Nat, IDL.Nat, XBRLTaxonomy, IDL.Text],
        [ApiResult_7],
        [],
      ),
    'createOrganization' : IDL.Func([IDL.Text, IDL.Text], [ApiResult_6], []),
    'createTrialBalance' : IDL.Func(
        [CreateTrialBalanceRequest],
        [ApiResult_2],
        [],
      ),
    'getAdjustment' : IDL.Func([IDL.Nat], [IDL.Opt(Adjustment)], ['query']),
    'getAuditTrail' : IDL.Func([], [IDL.Vec(AuditTrailEntry)], ['query']),
    'getCurrentUser' : IDL.Func([], [IDL.Opt(User)], []),
    'getEngagement' : IDL.Func([IDL.Nat], [IDL.Opt(Engagement)], ['query']),
    'getFinancialStatement' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(FinancialStatement)],
        ['query'],
      ),
    'getFormData' : IDL.Func(
        [IDL.Nat, IDL.Text],
        [IDL.Opt(FormData)],
        ['query'],
      ),
    'getOrganization' : IDL.Func([IDL.Nat], [IDL.Opt(Organization)], ['query']),
    'getTrialBalance' : IDL.Func([IDL.Nat], [IDL.Opt(TrialBalance)], ['query']),
    'getUserPreferences' : IDL.Func([], [UserPreferences], []),
    'listAdjustments' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Adjustment))],
        ['query'],
      ),
    'listEngagements' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Engagement))],
        ['query'],
      ),
    'listFinancialStatements' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, FinancialStatement))],
        ['query'],
      ),
    'listFormData' : IDL.Func([IDL.Nat], [IDL.Vec(FormData)], ['query']),
    'listOrganizations' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Organization))],
        ['query'],
      ),
    'listTrialBalances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, TrialBalance))],
        ['query'],
      ),
    'listUsers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, User))],
        ['query'],
      ),
    'saveFormData' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, FormStatus],
        [ApiResult_3],
        [],
      ),
    'updateAdjustmentStatus' : IDL.Func(
        [IDL.Nat, AjeStatus],
        [ApiResult_5],
        [],
      ),
    'updateEngagement' : IDL.Func(
        [IDL.Nat, UpdateEngagementRequest],
        [ApiResult_4],
        [],
      ),
    'updateFormStatus' : IDL.Func(
        [IDL.Nat, IDL.Text, FormStatus],
        [ApiResult_3],
        [],
      ),
    'updateTrialBalanceAccounts' : IDL.Func(
        [IDL.Nat, IDL.Vec(TrialBalanceAccount)],
        [ApiResult_2],
        [],
      ),
    'updateUserPreferences' : IDL.Func([UserPreferences], [ApiResult_1], []),
    'updateUserRole' : IDL.Func([IDL.Principal, UserRole], [ApiResult], []),
    'verifyAuditTrailIntegrity' : IDL.Func([], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
