import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

import Registry "blob-storage/registry";



actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Organization Management
  public type Organization = {
    id : Text;
    name : Text;
    description : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var organizations = textMap.empty<Organization>();

  public shared ({ caller }) func createOrganization(id : Text, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create organizations");
    };

    let organization : Organization = {
      id;
      name;
      description;
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    organizations := textMap.put(organizations, id, organization);
  };

  public query func getOrganization(id : Text) : async ?Organization {
    textMap.get(organizations, id);
  };

  public query func getAllOrganizations() : async [Organization] {
    Iter.toArray(textMap.vals(organizations));
  };

  public shared ({ caller }) func updateOrganization(id : Text, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update organizations");
    };

    switch (textMap.get(organizations, id)) {
      case (null) { Debug.trap("Organization not found") };
      case (?existingOrganization) {
        let updatedOrganization : Organization = {
          id;
          name;
          description;
          createdBy = existingOrganization.createdBy;
          createdAt = existingOrganization.createdAt;
          updatedAt = Time.now();
        };
        organizations := textMap.put(organizations, id, updatedOrganization);
      };
    };
  };

  // Entity Management
  public type Entity = {
    id : Text;
    organizationId : Text;
    name : Text;
    description : Text;
    taxonomy : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  var entities = textMap.empty<Entity>();

  public shared ({ caller }) func createEntity(id : Text, organizationId : Text, name : Text, description : Text, taxonomy : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create entities");
    };

    let entity : Entity = {
      id;
      organizationId;
      name;
      description;
      taxonomy;
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    entities := textMap.put(entities, id, entity);
  };

  public query func getEntity(id : Text) : async ?Entity {
    textMap.get(entities, id);
  };

  public query func getAllEntities() : async [Entity] {
    Iter.toArray(textMap.vals(entities));
  };

  public query func getEntitiesByOrganization(organizationId : Text) : async [Entity] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(entities),
        func(entity : Entity) : Bool {
          entity.organizationId == organizationId;
        },
      )
    );
  };

  public shared ({ caller }) func updateEntity(id : Text, organizationId : Text, name : Text, description : Text, taxonomy : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update entities");
    };

    switch (textMap.get(entities, id)) {
      case (null) { Debug.trap("Entity not found") };
      case (?existingEntity) {
        let updatedEntity : Entity = {
          id;
          organizationId;
          name;
          description;
          taxonomy;
          createdBy = existingEntity.createdBy;
          createdAt = existingEntity.createdAt;
          updatedAt = Time.now();
        };
        entities := textMap.put(entities, id, updatedEntity);
      };
    };
  };

  // Engagement Management
  public type Engagement = {
    id : Text;
    organizationId : Text;
    entityId : Text;
    name : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    status : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  var engagements = textMap.empty<Engagement>();

  public shared ({ caller }) func createEngagement(id : Text, organizationId : Text, entityId : Text, name : Text, startDate : Time.Time, endDate : Time.Time, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create engagements");
    };

    let engagement : Engagement = {
      id;
      organizationId;
      entityId;
      name;
      startDate;
      endDate;
      status;
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    engagements := textMap.put(engagements, id, engagement);
  };

  public query func getEngagement(id : Text) : async ?Engagement {
    textMap.get(engagements, id);
  };

  public query func getAllEngagements() : async [Engagement] {
    Iter.toArray(textMap.vals(engagements));
  };

  public query func getEngagementsByOrganization(organizationId : Text) : async [Engagement] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(engagements),
        func(engagement : Engagement) : Bool {
          engagement.organizationId == organizationId;
        },
      )
    );
  };

  public query func getEngagementsByEntity(entityId : Text) : async [Engagement] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(engagements),
        func(engagement : Engagement) : Bool {
          engagement.entityId == entityId;
        },
      )
    );
  };

  public shared ({ caller }) func updateEngagement(id : Text, organizationId : Text, entityId : Text, name : Text, startDate : Time.Time, endDate : Time.Time, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update engagements");
    };

    switch (textMap.get(engagements, id)) {
      case (null) { Debug.trap("Engagement not found") };
      case (?existingEngagement) {
        let updatedEngagement : Engagement = {
          id;
          organizationId;
          entityId;
          name;
          startDate;
          endDate;
          status;
          createdBy = existingEngagement.createdBy;
          createdAt = existingEngagement.createdAt;
          updatedAt = Time.now();
        };
        engagements := textMap.put(engagements, id, updatedEngagement);
      };
    };
  };

  // Activity Log
  public type ActivityLogEntry = {
    id : Text;
    userId : Principal;
    action : Text;
    timestamp : Time.Time;
  };

  var activityLog = textMap.empty<ActivityLogEntry>();

  public shared ({ caller }) func logActivity(id : Text, action : Text) : async () {
    let entry : ActivityLogEntry = {
      id;
      userId = caller;
      action;
      timestamp = Time.now();
    };

    activityLog := textMap.put(activityLog, id, entry);
  };

  public query func getAllActivityLogs() : async [ActivityLogEntry] {
    Iter.toArray(textMap.vals(activityLog));
  };

  // Language Preferences
  public type LanguagePreference = {
    userId : Principal;
    language : Text;
  };

  var languagePreferences = principalMap.empty<LanguagePreference>();

  public shared ({ caller }) func setLanguagePreference(language : Text) : async () {
    let preference : LanguagePreference = {
      userId = caller;
      language;
    };

    languagePreferences := principalMap.put(languagePreferences, caller, preference);
  };

  public query ({ caller }) func getLanguagePreference() : async ?LanguagePreference {
    principalMap.get(languagePreferences, caller);
  };

  // Data Import
  public type ColumnMetadata = {
    name : Text;
    dataType : Text;
    isPII : Bool;
    nullPercent : Float;
    uniqueCount : Nat;
    minValue : ?Text;
    maxValue : ?Text;
    sampleValues : [Text];
  };

  public type ImportedDataset = {
    id : Text;
    name : Text;
    version : Nat;
    columns : [ColumnMetadata];
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  var importedDatasets = textMap.empty<ImportedDataset>();

  public shared ({ caller }) func saveImportedDataset(id : Text, name : Text, columns : [ColumnMetadata]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can import datasets");
    };

    let version = switch (textMap.get(importedDatasets, id)) {
      case (null) { 1 };
      case (?existingDataset) { existingDataset.version + 1 };
    };

    let dataset : ImportedDataset = {
      id;
      name;
      version;
      columns;
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    importedDatasets := textMap.put(importedDatasets, id, dataset);
  };

  public query func getImportedDataset(id : Text) : async ?ImportedDataset {
    textMap.get(importedDatasets, id);
  };

  public query func getAllImportedDatasets() : async [ImportedDataset] {
    Iter.toArray(textMap.vals(importedDatasets));
  };

  // Automated Working Papers
  public type AccountBalance = {
    accountNumber : Text;
    accountName : Text;
    currency : Text;
    openingDebit : Float;
    openingCredit : Float;
    periodDebit : Float;
    periodCredit : Float;
    ytdDebit : Float;
    ytdCredit : Float;
    entity : Text;
    department : Text;
    project : Text;
    notes : Text;
  };

  public type FinancialRatio = {
    name : Text;
    value : Float;
    description : Text;
  };

  public type TrendAnalysis = {
    accountNumber : Text;
    accountName : Text;
    currentPeriod : Float;
    priorPeriod : Float;
    variance : Float;
    percentageChange : Float;
  };

  public type VarianceAnalysis = {
    accountNumber : Text;
    accountName : Text;
    actual : Float;
    expected : Float;
    variance : Float;
    percentageVariance : Float;
  };

  public type WorkingPaper = {
    id : Text;
    engagementId : Text;
    name : Text;
    description : Text;
    accountBalances : [AccountBalance];
    financialRatios : [FinancialRatio];
    trendAnalysis : [TrendAnalysis];
    varianceAnalysis : [VarianceAnalysis];
    supportingDocuments : [Text];
    createdBy : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  var workingPapers = textMap.empty<WorkingPaper>();

  public shared ({ caller }) func createWorkingPaper(
    id : Text,
    engagementId : Text,
    name : Text,
    description : Text,
    accountBalances : [AccountBalance],
    financialRatios : [FinancialRatio],
    trendAnalysis : [TrendAnalysis],
    varianceAnalysis : [VarianceAnalysis],
    supportingDocuments : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can create working papers");
    };

    let workingPaper : WorkingPaper = {
      id;
      engagementId;
      name;
      description;
      accountBalances;
      financialRatios;
      trendAnalysis;
      varianceAnalysis;
      supportingDocuments;
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    workingPapers := textMap.put(workingPapers, id, workingPaper);
  };

  public query func getWorkingPaper(id : Text) : async ?WorkingPaper {
    textMap.get(workingPapers, id);
  };

  public query func getAllWorkingPapers() : async [WorkingPaper] {
    Iter.toArray(textMap.vals(workingPapers));
  };

  public query func getWorkingPapersByEngagement(engagementId : Text) : async [WorkingPaper] {
    Iter.toArray(
      Iter.filter(
        textMap.vals(workingPapers),
        func(workingPaper : WorkingPaper) : Bool {
          workingPaper.engagementId == engagementId;
        },
      )
    );
  };

  public shared ({ caller }) func updateWorkingPaper(
    id : Text,
    engagementId : Text,
    name : Text,
    description : Text,
    accountBalances : [AccountBalance],
    financialRatios : [FinancialRatio],
    trendAnalysis : [TrendAnalysis],
    varianceAnalysis : [VarianceAnalysis],
    supportingDocuments : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update working papers");
    };

    switch (textMap.get(workingPapers, id)) {
      case (null) { Debug.trap("Working paper not found") };
      case (?existingWorkingPaper) {
        let updatedWorkingPaper : WorkingPaper = {
          id;
          engagementId;
          name;
          description;
          accountBalances;
          financialRatios;
          trendAnalysis;
          varianceAnalysis;
          supportingDocuments;
          createdBy = existingWorkingPaper.createdBy;
          createdAt = existingWorkingPaper.createdAt;
          updatedAt = Time.now();
        };
        workingPapers := textMap.put(workingPapers, id, updatedWorkingPaper);
      };
    };
  };

  // File Reference Management
  let registry = Registry.new();

  public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
    Registry.add(registry, path, hash);
  };

  public query ({ caller }) func getFileReference(path : Text) : async Registry.FileReference {
    Registry.get(registry, path);
  };

  public query ({ caller }) func listFileReferences() : async [Registry.FileReference] {
    Registry.list(registry);
  };

  public shared ({ caller }) func dropFileReference(path : Text) : async () {
    Registry.remove(registry, path);
  };

  // Automated Working Paper Generation
  public shared ({ caller }) func generateWorkingPaperFromTrialBalance(
    engagementId : Text,
    name : Text,
    description : Text,
    trialBalanceData : [AccountBalance],
    priorPeriodData : [AccountBalance],
    expectedValues : [AccountBalance],
    supportingDocuments : [Text],
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can generate working papers");
    };

    let workingPaperId = Text.concat(engagementId, Text.concat("_", name));

    let financialRatios = calculateFinancialRatios(trialBalanceData);
    let trendAnalysis = performTrendAnalysis(trialBalanceData, priorPeriodData);
    let varianceAnalysis = performVarianceAnalysis(trialBalanceData, expectedValues);

    let workingPaper : WorkingPaper = {
      id = workingPaperId;
      engagementId;
      name;
      description;
      accountBalances = trialBalanceData;
      financialRatios;
      trendAnalysis;
      varianceAnalysis;
      supportingDocuments;
      createdBy = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    workingPapers := textMap.put(workingPapers, workingPaperId, workingPaper);

    workingPaperId;
  };

  func calculateFinancialRatios(accountBalances : [AccountBalance]) : [FinancialRatio] {
    let totalCurrentAssets = sumAccounts(accountBalances, ["1000", "1010", "1020"]);
    let totalCurrentLiabilities = sumAccounts(accountBalances, ["2000", "2010", "2020"]);
    let totalAssets = sumAccounts(accountBalances, ["1000", "1010", "1020", "1030", "1040"]);
    let totalLiabilities = sumAccounts(accountBalances, ["2000", "2010", "2020", "2030", "2040"]);
    let totalEquity = sumAccounts(accountBalances, ["3000", "3010", "3020"]);
    let netIncome = sumAccounts(accountBalances, ["4000", "4010", "4020"]);
    let totalRevenue = sumAccounts(accountBalances, ["4000", "4010", "4020"]);
    let costOfGoodsSold = sumAccounts(accountBalances, ["5000", "5010", "5020"]);

    let currentRatio = if (totalCurrentLiabilities != 0.0) {
      totalCurrentAssets / totalCurrentLiabilities;
    } else { 0.0 };

    let debtToEquityRatio = if (totalEquity != 0.0) {
      totalLiabilities / totalEquity;
    } else { 0.0 };

    let returnOnAssets = if (totalAssets != 0.0) {
      netIncome / totalAssets;
    } else { 0.0 };

    let grossProfitMargin = if (totalRevenue != 0.0) {
      (totalRevenue - costOfGoodsSold) / totalRevenue;
    } else { 0.0 };

    [
      {
        name = "Current Ratio";
        value = currentRatio;
        description = "Current Assets / Current Liabilities";
      },
      {
        name = "Debt to Equity Ratio";
        value = debtToEquityRatio;
        description = "Total Liabilities / Total Equity";
      },
      {
        name = "Return on Assets";
        value = returnOnAssets;
        description = "Net Income / Total Assets";
      },
      {
        name = "Gross Profit Margin";
        value = grossProfitMargin;
        description = "(Revenue - COGS) / Revenue";
      },
    ];
  };

  func sumAccounts(accountBalances : [AccountBalance], accountNumbers : [Text]) : Float {
    var total : Float = 0.0;
    for (accountNumber in accountNumbers.vals()) {
      for (account in accountBalances.vals()) {
        if (account.accountNumber == accountNumber) {
          total += account.ytdDebit - account.ytdCredit;
        };
      };
    };
    total;
  };

  func performTrendAnalysis(currentPeriodData : [AccountBalance], priorPeriodData : [AccountBalance]) : [TrendAnalysis] {
    var trendAnalysis : [TrendAnalysis] = [];

    for (currentAccount in currentPeriodData.vals()) {
      let priorPeriodBalance = findAccountBalance(priorPeriodData, currentAccount.accountNumber);
      let variance = (currentAccount.ytdDebit - currentAccount.ytdCredit) - priorPeriodBalance;
      let percentageChange = if (priorPeriodBalance != 0.0) {
        (variance / priorPeriodBalance) * 100.0;
      } else { 0.0 };

      trendAnalysis := Array.append(
        trendAnalysis,
        [
          {
            accountNumber = currentAccount.accountNumber;
            accountName = currentAccount.accountName;
            currentPeriod = currentAccount.ytdDebit - currentAccount.ytdCredit;
            priorPeriod = priorPeriodBalance;
            variance;
            percentageChange;
          },
        ],
      );
    };

    trendAnalysis;
  };

  func findAccountBalance(accountBalances : [AccountBalance], accountNumber : Text) : Float {
    for (account in accountBalances.vals()) {
      if (account.accountNumber == accountNumber) {
        return account.ytdDebit - account.ytdCredit;
      };
    };
    0.0;
  };

  func performVarianceAnalysis(actualData : [AccountBalance], expectedData : [AccountBalance]) : [VarianceAnalysis] {
    var varianceAnalysis : [VarianceAnalysis] = [];

    for (actualAccount in actualData.vals()) {
      let expectedValue = findAccountBalance(expectedData, actualAccount.accountNumber);
      let variance = (actualAccount.ytdDebit - actualAccount.ytdCredit) - expectedValue;
      let percentageVariance = if (expectedValue != 0.0) {
        (variance / expectedValue) * 100.0;
      } else { 0.0 };

      varianceAnalysis := Array.append(
        varianceAnalysis,
        [
          {
            accountNumber = actualAccount.accountNumber;
            accountName = actualAccount.accountName;
            actual = actualAccount.ytdDebit - actualAccount.ytdCredit;
            expected = expectedValue;
            variance;
            percentageVariance;
          },
        ],
      );
    };

    varianceAnalysis;
  };
};

