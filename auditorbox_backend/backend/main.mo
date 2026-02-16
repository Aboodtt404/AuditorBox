// main.mo — AuditorBox ICP Canister
// Audit management platform on the Internet Computer
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";

import Types "./Types";
import Auth "./Auth";
import AuditTrail "./AuditTrail";
import TrialBalance "./TrialBalance";
import Adjustments "./Adjustments";

persistent actor AuditorBox {
    // ===== Stable Storage =====
    var usersStable : [(Principal, Types.User)] = [];
    var orgsStable : [(Nat, Types.Organization)] = [];
    var entitiesStable : [(Nat, Types.Entity)] = [];
    var clientsStable : [(Nat, Types.Client)] = [];
    var engagementsStable : [(Nat, Types.Engagement)] = [];
    var trialBalancesStable : [(Nat, Types.TrialBalance)] = [];
    var adjustmentsStable : [(Nat, Types.Adjustment)] = [];
    var financialStatementsStable : [(Nat, Types.FinancialStatement)] = [];
    var auditTrailStable : [Types.AuditTrailEntry] = [];
    var formDataStable : [(Text, Types.FormData)] = []; // key = "{engagementId}_{formId}"
    var userPrefsStable : [(Principal, Types.UserPreferences)] = [];

    var nextOrgId : Nat = 1;
    var _nextEntityId : Nat = 1;
    var _nextClientId : Nat = 1;
    var nextEngagementId : Nat = 1;
    var nextTBId : Nat = 1;
    var nextAdjId : Nat = 1;
    var nextFSId : Nat = 1;
    var nextAuditTrailId : Nat = 1;

    // ===== Transient Runtime Storage =====
    private transient var users = HashMap.HashMap<Principal, Types.User>(16, Principal.equal, Principal.hash);
    private transient var orgs = HashMap.HashMap<Nat, Types.Organization>(16, Nat.equal, Nat32.fromNat);
    private transient var entities = HashMap.HashMap<Nat, Types.Entity>(16, Nat.equal, Nat32.fromNat);
    private transient var clients = HashMap.HashMap<Nat, Types.Client>(16, Nat.equal, Nat32.fromNat);
    private transient var engagements = HashMap.HashMap<Nat, Types.Engagement>(16, Nat.equal, Nat32.fromNat);
    private transient var trialBalances = HashMap.HashMap<Nat, Types.TrialBalance>(16, Nat.equal, Nat32.fromNat);
    private transient var adjustments = HashMap.HashMap<Nat, Types.Adjustment>(16, Nat.equal, Nat32.fromNat);
    private transient var financialStatements = HashMap.HashMap<Nat, Types.FinancialStatement>(16, Nat.equal, Nat32.fromNat);
    private transient var formData = HashMap.HashMap<Text, Types.FormData>(64, Text.equal, Text.hash);
    private transient var userPrefs = HashMap.HashMap<Principal, Types.UserPreferences>(16, Principal.equal, Principal.hash);

    // ===== Upgrade Hooks =====
    system func preupgrade() {
        usersStable := Iter.toArray(users.entries());
        orgsStable := Iter.toArray(orgs.entries());
        entitiesStable := Iter.toArray(entities.entries());
        clientsStable := Iter.toArray(clients.entries());
        engagementsStable := Iter.toArray(engagements.entries());
        trialBalancesStable := Iter.toArray(trialBalances.entries());
        adjustmentsStable := Iter.toArray(adjustments.entries());
        financialStatementsStable := Iter.toArray(financialStatements.entries());
        formDataStable := Iter.toArray(formData.entries());
        userPrefsStable := Iter.toArray(userPrefs.entries());
    };

    system func postupgrade() {
        for ((k, v) in usersStable.vals()) { users.put(k, v) };
        for ((k, v) in orgsStable.vals()) { orgs.put(k, v) };
        for ((k, v) in entitiesStable.vals()) { entities.put(k, v) };
        for ((k, v) in clientsStable.vals()) { clients.put(k, v) };
        for ((k, v) in engagementsStable.vals()) { engagements.put(k, v) };
        for ((k, v) in trialBalancesStable.vals()) { trialBalances.put(k, v) };
        for ((k, v) in adjustmentsStable.vals()) { adjustments.put(k, v) };
        for ((k, v) in financialStatementsStable.vals()) {
            financialStatements.put(k, v);
        };
        for ((k, v) in formDataStable.vals()) { formData.put(k, v) };
        for ((k, v) in userPrefsStable.vals()) { userPrefs.put(k, v) };
    };

    // ===== Helper: Authenticate caller =====
    private func authCaller(caller : Principal) : Types.ApiResult<Types.User> {
        switch (users.get(caller)) {
            case (?user) { #ok(user) };
            case null { #err("Not authenticated") };
        };
    };

    // ===== Helper: Log to audit trail =====
    private func logAudit(caller : Principal, action : Text, resourceType : Text, resourceId : Nat, details : Text) {
        let entry = AuditTrail.createEntry(
            auditTrailStable,
            nextAuditTrailId,
            caller,
            action,
            resourceType,
            resourceId,
            details,
            Time.now(),
        );
        let buf = Buffer.fromArray<Types.AuditTrailEntry>(auditTrailStable);
        buf.add(entry);
        auditTrailStable := Buffer.toArray(buf);
        nextAuditTrailId += 1;
    };

    // =========================================================
    // USER MANAGEMENT
    // =========================================================

    public shared (msg) func getCurrentUser() : async ?Types.User {
        // Auto-create on first call
        let (user, isNew) = Auth.getOrCreateUser(usersStable, msg.caller);
        if (isNew) {
            let u : Types.User = {
                principal = user.principal;
                role = user.role;
                name = user.name;
                email = user.email;
                createdAt = Time.now();
                languagePreference = user.languagePreference;
                profileCompleted = user.profileCompleted;
            };
            users.put(msg.caller, u);
            usersStable := Iter.toArray(users.entries());
            ?u;
        } else {
            users.get(msg.caller);
        };
    };

    public shared (msg) func completeProfile(req : Types.CompleteProfileRequest) : async Types.ApiResult<Types.User> {
        switch (users.get(msg.caller)) {
            case null { #err("User not found. Call getCurrentUser first.") };
            case (?user) {
                let updated : Types.User = {
                    principal = user.principal;
                    role = user.role;
                    name = req.name;
                    email = req.email;
                    createdAt = user.createdAt;
                    languagePreference = user.languagePreference;
                    profileCompleted = true;
                };
                users.put(msg.caller, updated);
                logAudit(msg.caller, "complete_profile", "user", 0, req.name);
                #ok(updated);
            };
        };
    };

    public shared (msg) func updateUserRole(target : Principal, newRole : Types.UserRole) : async Types.ApiResult<()> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(callerUser)) {
                if (not Auth.isAdmin(callerUser)) {
                    return #err("Only Admin can change roles");
                };
                switch (users.get(target)) {
                    case null { #err("Target user not found") };
                    case (?targetUser) {
                        let updated : Types.User = {
                            principal = targetUser.principal;
                            role = newRole;
                            name = targetUser.name;
                            email = targetUser.email;
                            createdAt = targetUser.createdAt;
                            languagePreference = targetUser.languagePreference;
                            profileCompleted = targetUser.profileCompleted;
                        };
                        users.put(target, updated);
                        logAudit(msg.caller, "update_role", "user", 0, Principal.toText(target));
                        #ok(());
                    };
                };
            };
        };
    };

    public query func listUsers() : async [(Principal, Types.User)] {
        Iter.toArray(users.entries());
    };

    // =========================================================
    // ORGANIZATIONS
    // =========================================================

    public shared (msg) func createOrganization(name : Text, description : Text) : async Types.ApiResult<Types.Organization> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.canManageOrganizations(user)) {
                    return #err("Requires Manager or above");
                };
                if (Text.size(name) == 0) {
                    return #err("Organization name cannot be empty");
                };
                let org : Types.Organization = {
                    id = nextOrgId;
                    name = name;
                    description = description;
                    createdAt = Time.now();
                    createdBy = msg.caller;
                    entityIds = [];
                };
                orgs.put(nextOrgId, org);
                logAudit(msg.caller, "create", "organization", nextOrgId, name);
                nextOrgId += 1;
                #ok(org);
            };
        };
    };

    public query func getOrganization(id : Nat) : async ?Types.Organization {
        orgs.get(id);
    };

    public query func listOrganizations() : async [(Nat, Types.Organization)] {
        Iter.toArray(orgs.entries());
    };

    // =========================================================
    // ENGAGEMENTS
    // =========================================================

    public shared (msg) func createEngagement(req : Types.CreateEngagementRequest) : async Types.ApiResult<Types.Engagement> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.canCreateEngagement(user)) {
                    return #err("Requires Senior or above");
                };
                if (Text.size(req.name) == 0) {
                    return #err("Engagement name cannot be empty");
                };
                let eng : Types.Engagement = {
                    id = nextEngagementId;
                    name = req.name;
                    description = req.description;
                    link = req.link;
                    status = #Planning;
                    startDate = req.startDate;
                    endDate = req.endDate;
                    createdAt = Time.now();
                    createdBy = msg.caller;
                    clientName = req.clientName;
                    yearEnd = req.yearEnd;
                    reportingFramework = req.reportingFramework;
                    entityType = req.entityType;
                    currency = req.currency;
                    industrySector = req.industrySector;
                    materialityOverall = req.materialityOverall;
                    materialityPerformance = req.materialityPerformance;
                    materialityTrivial = req.materialityTrivial;
                    riskProfile = req.riskProfile;
                    isGroupAudit = req.isGroupAudit;
                    isFirstYear = req.isFirstYear;
                };
                engagements.put(nextEngagementId, eng);
                logAudit(msg.caller, "create", "engagement", nextEngagementId, req.name);
                nextEngagementId += 1;
                #ok(eng);
            };
        };
    };

    public query func getEngagement(id : Nat) : async ?Types.Engagement {
        engagements.get(id);
    };

    public query func listEngagements() : async [(Nat, Types.Engagement)] {
        Iter.toArray(engagements.entries());
    };

    public shared (msg) func updateEngagement(id : Nat, req : Types.UpdateEngagementRequest) : async Types.ApiResult<Types.Engagement> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.canCreateEngagement(user)) {
                    return #err("Requires Senior or above");
                };
                switch (engagements.get(id)) {
                    case null { #err("Engagement not found") };
                    case (?eng) {
                        let updated : Types.Engagement = {
                            id = eng.id;
                            name = switch (req.name) {
                                case (?v) v;
                                case null eng.name;
                            };
                            description = switch (req.description) {
                                case (?v) v;
                                case null eng.description;
                            };
                            link = eng.link;
                            status = switch (req.status) {
                                case (?v) v;
                                case null eng.status;
                            };
                            startDate = eng.startDate;
                            endDate = switch (req.endDate) {
                                case (?v) v;
                                case null eng.endDate;
                            };
                            createdAt = eng.createdAt;
                            createdBy = eng.createdBy;
                            clientName = switch (req.clientName) {
                                case (?v) v;
                                case null eng.clientName;
                            };
                            yearEnd = switch (req.yearEnd) {
                                case (?v) v;
                                case null eng.yearEnd;
                            };
                            reportingFramework = switch (req.reportingFramework) {
                                case (?v) v;
                                case null eng.reportingFramework;
                            };
                            entityType = switch (req.entityType) {
                                case (?v) v;
                                case null eng.entityType;
                            };
                            currency = switch (req.currency) {
                                case (?v) v;
                                case null eng.currency;
                            };
                            industrySector = switch (req.industrySector) {
                                case (?v) v;
                                case null eng.industrySector;
                            };
                            materialityOverall = switch (req.materialityOverall) {
                                case (?v) v;
                                case null eng.materialityOverall;
                            };
                            materialityPerformance = switch (req.materialityPerformance) {
                                case (?v) v;
                                case null eng.materialityPerformance;
                            };
                            materialityTrivial = switch (req.materialityTrivial) {
                                case (?v) v;
                                case null eng.materialityTrivial;
                            };
                            riskProfile = switch (req.riskProfile) {
                                case (?v) v;
                                case null eng.riskProfile;
                            };
                            isGroupAudit = switch (req.isGroupAudit) {
                                case (?v) v;
                                case null eng.isGroupAudit;
                            };
                            isFirstYear = switch (req.isFirstYear) {
                                case (?v) v;
                                case null eng.isFirstYear;
                            };
                        };
                        engagements.put(id, updated);
                        logAudit(msg.caller, "update", "engagement", id, switch (req.name) { case (?v) v; case null eng.name });
                        #ok(updated);
                    };
                };
            };
        };
    };

    // =========================================================
    // TRIAL BALANCE
    // =========================================================

    public shared (msg) func createTrialBalance(req : Types.CreateTrialBalanceRequest) : async Types.ApiResult<Types.TrialBalance> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.isStaffOrAbove(user)) {
                    return #err("Requires Staff or above");
                };
                let tb : Types.TrialBalance = {
                    id = nextTBId;
                    engagementId = req.engagementId;
                    periodEndDate = req.periodEndDate;
                    description = req.description;
                    currency = req.currency;
                    accounts = [];
                    createdAt = Time.now();
                    createdBy = msg.caller;
                };
                trialBalances.put(nextTBId, tb);
                logAudit(msg.caller, "create", "trial_balance", nextTBId, req.description);
                nextTBId += 1;
                #ok(tb);
            };
        };
    };

    public query func getTrialBalance(id : Nat) : async ?Types.TrialBalance {
        trialBalances.get(id);
    };

    public query func listTrialBalances() : async [(Nat, Types.TrialBalance)] {
        Iter.toArray(trialBalances.entries());
    };

    // Validate if a trial balance is balanced (debits == credits)
    public query func validateTrialBalance(id : Nat) : async Types.ApiResult<TrialBalance.ValidationResult> {
        switch (trialBalances.get(id)) {
            case null { #err("Trial balance not found") };
            case (?tb) {
                #ok(TrialBalance.validate(tb));
            };
        };
    };

    public shared (msg) func updateTrialBalanceAccounts(tbId : Nat, accounts : [Types.TrialBalanceAccount]) : async Types.ApiResult<Types.TrialBalance> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.isStaffOrAbove(user)) {
                    return #err("Requires Staff or above");
                };
                switch (trialBalances.get(tbId)) {
                    case null { #err("Trial balance not found") };
                    case (?tb) {
                        let updated : Types.TrialBalance = {
                            id = tb.id;
                            engagementId = tb.engagementId;
                            periodEndDate = tb.periodEndDate;
                            description = tb.description;
                            currency = tb.currency;
                            accounts = accounts;
                            createdAt = tb.createdAt;
                            createdBy = tb.createdBy;
                        };
                        trialBalances.put(tbId, updated);
                        logAudit(msg.caller, "update_accounts", "trial_balance", tbId, Nat.toText(accounts.size()) # " accounts");
                        #ok(updated);
                    };
                };
            };
        };
    };

    // =========================================================
    // ADJUSTMENTS (AJE)
    // =========================================================

    public shared (msg) func createAdjustment(req : Types.CreateAjeRequest) : async Types.ApiResult<Types.Adjustment> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.isStaffOrAbove(user)) {
                    return #err("Requires Staff or above");
                };
                // Validate balanced entries
                var totalDebit : Float = 0;
                var totalCredit : Float = 0;
                for (item in req.lineItems.vals()) {
                    totalDebit += item.debit;
                    totalCredit += item.credit;
                };
                let diff = if (totalDebit > totalCredit) {
                    totalDebit - totalCredit;
                } else { totalCredit - totalDebit };
                if (diff > 0.01) {
                    return #err("AJE must balance: debits and credits must be equal");
                };
                let adj : Types.Adjustment = {
                    id = nextAdjId;
                    engagementId = req.engagementId;
                    trialBalanceId = req.trialBalanceId;
                    description = req.description;
                    status = #Draft;
                    lineItems = req.lineItems;
                    createdAt = Time.now();
                    createdBy = msg.caller;
                    reviewedBy = null;
                    approvedBy = null;
                    blockchainHash = Adjustments.generateHash(nextAdjId, req.engagementId, req.trialBalanceId, req.description, totalDebit);
                };
                adjustments.put(nextAdjId, adj);
                logAudit(msg.caller, "create", "adjustment", nextAdjId, req.description);
                nextAdjId += 1;
                #ok(adj);
            };
        };
    };

    public shared (msg) func updateAdjustmentStatus(adjId : Nat, newStatus : Types.AjeStatus) : async Types.ApiResult<Types.Adjustment> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                switch (adjustments.get(adjId)) {
                    case null { #err("Adjustment not found") };
                    case (?adj) {
                        // Check permissions based on status transition
                        switch (newStatus) {
                            case (#Approved or #Rejected) {
                                if (not Auth.canApproveAje(user)) {
                                    return #err("Requires Manager or above to approve/reject");
                                };
                            };
                            case _ {};
                        };
                        let updated : Types.Adjustment = {
                            id = adj.id;
                            engagementId = adj.engagementId;
                            trialBalanceId = adj.trialBalanceId;
                            description = adj.description;
                            status = newStatus;
                            lineItems = adj.lineItems;
                            createdAt = adj.createdAt;
                            createdBy = adj.createdBy;
                            reviewedBy = switch (newStatus) {
                                case (#Reviewed) { ?msg.caller };
                                case _ { adj.reviewedBy };
                            };
                            approvedBy = switch (newStatus) {
                                case (#Approved) { ?msg.caller };
                                case _ { adj.approvedBy };
                            };
                            blockchainHash = adj.blockchainHash;
                        };

                        // If status is Posted, update the trial balance accounts
                        switch (newStatus) {
                            case (#Posted) {
                                switch (trialBalances.get(adj.trialBalanceId)) {
                                    case null {
                                        return #err("Trial balance not found for posting");
                                    };
                                    case (?tb) {
                                        let updatedTB = Adjustments.postAje(updated, tb);
                                        trialBalances.put(tb.id, updatedTB);
                                        logAudit(msg.caller, "post_aje", "trial_balance", tb.id, "Posted AJE " # Nat.toText(adjId));
                                    };
                                };
                            };
                            case _ {};
                        };

                        adjustments.put(adjId, updated);
                        logAudit(msg.caller, "update_status", "adjustment", adjId, debug_show (newStatus));
                        #ok(updated);
                    };
                };
            };
        };
    };

    public query func getAdjustment(id : Nat) : async ?Types.Adjustment {
        adjustments.get(id);
    };

    public query func listAdjustments() : async [(Nat, Types.Adjustment)] {
        Iter.toArray(adjustments.entries());
    };

    // =========================================================
    // FINANCIAL STATEMENTS
    // =========================================================

    public shared (msg) func createFinancialStatement(
        engagementId : Nat,
        trialBalanceId : Nat,
        taxonomy : Types.XBRLTaxonomy,
        title : Text,
    ) : async Types.ApiResult<Types.FinancialStatement> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(user)) {
                if (not Auth.isManagerOrAbove(user)) {
                    return #err("Requires Manager or above");
                };
                let fs : Types.FinancialStatement = {
                    id = nextFSId;
                    engagementId = engagementId;
                    trialBalanceId = trialBalanceId;
                    taxonomy = taxonomy;
                    title = title;
                    lineItems = []; // Populated by FS generation logic
                    generatedAt = Time.now();
                    generatedBy = msg.caller;
                };
                financialStatements.put(nextFSId, fs);
                logAudit(msg.caller, "create", "financial_statement", nextFSId, title);
                nextFSId += 1;
                #ok(fs);
            };
        };
    };

    public query func getFinancialStatement(id : Nat) : async ?Types.FinancialStatement {
        financialStatements.get(id);
    };

    public query func listFinancialStatements() : async [(Nat, Types.FinancialStatement)] {
        Iter.toArray(financialStatements.entries());
    };

    // =========================================================
    // FORM DATA (Audit form field persistence)
    // =========================================================

    private func formDataKey(engagementId : Nat, formId : Text) : Text {
        Nat.toText(engagementId) # "_" # formId;
    };

    public shared (msg) func saveFormData(engagementId : Nat, formId : Text, values : Text, status : Types.FormStatus) : async Types.ApiResult<Types.FormData> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(_user)) {
                let key = formDataKey(engagementId, formId);
                let existing = formData.get(key);
                let fd : Types.FormData = {
                    engagementId = engagementId;
                    formId = formId;
                    status = status;
                    values = values;
                    preparedBy = switch (existing) {
                        case (?prev) {
                            switch (status) {
                                case (#Prepared) { ?msg.caller };
                                case _ { prev.preparedBy };
                            };
                        };
                        case null {
                            switch (status) {
                                case (#Prepared) { ?msg.caller };
                                case _ { null };
                            };
                        };
                    };
                    reviewedBy = switch (existing) {
                        case (?prev) {
                            switch (status) {
                                case (#Reviewed) { ?msg.caller };
                                case _ { prev.reviewedBy };
                            };
                        };
                        case null {
                            switch (status) {
                                case (#Reviewed) { ?msg.caller };
                                case _ { null };
                            };
                        };
                    };
                    lastUpdated = Time.now();
                    updatedBy = msg.caller;
                };
                formData.put(key, fd);
                logAudit(msg.caller, "save", "form_data", engagementId, formId);
                #ok(fd);
            };
        };
    };

    public query func getFormData(engagementId : Nat, formId : Text) : async ?Types.FormData {
        formData.get(formDataKey(engagementId, formId));
    };

    public query func listFormData(engagementId : Nat) : async [Types.FormData] {
        let prefix = Nat.toText(engagementId) # "_";
        let buf = Buffer.Buffer<Types.FormData>(16);
        for ((key, fd) in formData.entries()) {
            if (Text.startsWith(key, #text prefix)) {
                buf.add(fd);
            };
        };
        Buffer.toArray(buf);
    };

    public shared (msg) func updateFormStatus(engagementId : Nat, formId : Text, status : Types.FormStatus) : async Types.ApiResult<Types.FormData> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(_user)) {
                let key = formDataKey(engagementId, formId);
                switch (formData.get(key)) {
                    case null { #err("Form data not found") };
                    case (?fd) {
                        let updated : Types.FormData = {
                            engagementId = fd.engagementId;
                            formId = fd.formId;
                            status = status;
                            values = fd.values;
                            preparedBy = switch (status) {
                                case (#Prepared) { ?msg.caller };
                                case _ { fd.preparedBy };
                            };
                            reviewedBy = switch (status) {
                                case (#Reviewed) { ?msg.caller };
                                case _ { fd.reviewedBy };
                            };
                            lastUpdated = Time.now();
                            updatedBy = msg.caller;
                        };
                        formData.put(key, updated);
                        logAudit(msg.caller, "update_status", "form_data", engagementId, formId # " -> " # debug_show (status));
                        #ok(updated);
                    };
                };
            };
        };
    };

    public shared (msg) func batchSaveFormData(engagementId : Nat, entries : [Types.SaveFormDataRequest]) : async Types.ApiResult<Nat> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(_user)) {
                if (entries.size() > 20) {
                    return #err("Batch limit: max 20 forms per call");
                };
                var saved : Nat = 0;
                for (entry in entries.vals()) {
                    let key = formDataKey(engagementId, entry.formId);
                    let existing = formData.get(key);
                    let fd : Types.FormData = {
                        engagementId = engagementId;
                        formId = entry.formId;
                        status = entry.status;
                        values = entry.values;
                        preparedBy = switch (existing) {
                            case (?prev) { prev.preparedBy };
                            case null { null };
                        };
                        reviewedBy = switch (existing) {
                            case (?prev) { prev.reviewedBy };
                            case null { null };
                        };
                        lastUpdated = Time.now();
                        updatedBy = msg.caller;
                    };
                    formData.put(key, fd);
                    saved += 1;
                };
                logAudit(msg.caller, "batch_save", "form_data", engagementId, Nat.toText(saved) # " forms");
                #ok(saved);
            };
        };
    };

    // =========================================================
    // USER PREFERENCES
    // =========================================================

    public shared (msg) func getUserPreferences() : async Types.UserPreferences {
        switch (userPrefs.get(msg.caller)) {
            case (?prefs) { prefs };
            case null {
                let defaults : Types.UserPreferences = {
                    dismissedTooltips = [];
                    seenPhaseIntros = [];
                    lastEngagementId = null;
                };
                defaults;
            };
        };
    };

    public shared (msg) func updateUserPreferences(prefs : Types.UserPreferences) : async Types.ApiResult<Types.UserPreferences> {
        switch (authCaller(msg.caller)) {
            case (#err(e)) { #err(e) };
            case (#ok(_user)) {
                userPrefs.put(msg.caller, prefs);
                #ok(prefs);
            };
        };
    };

    // =========================================================
    // AUDIT TRAIL
    // =========================================================

    public query func getAuditTrail() : async [Types.AuditTrailEntry] {
        auditTrailStable;
    };

    public query func verifyAuditTrailIntegrity() : async Bool {
        AuditTrail.verifyChain(auditTrailStable);
    };
};
