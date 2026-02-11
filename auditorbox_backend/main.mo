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
    };

    system func postupgrade() {
        for ((k, v) in usersStable.vals()) { users.put(k, v) };
        for ((k, v) in orgsStable.vals()) { orgs.put(k, v) };
        for ((k, v) in entitiesStable.vals()) { entities.put(k, v) };
        for ((k, v) in clientsStable.vals()) { clients.put(k, v) };
        for ((k, v) in engagementsStable.vals()) { engagements.put(k, v) };
        for ((k, v) in trialBalancesStable.vals()) { trialBalances.put(k, v) };
        for ((k, v) in adjustmentsStable.vals()) { adjustments.put(k, v) };
        for ((k, v) in financialStatementsStable.vals()) { financialStatements.put(k, v) };
    };

    // ===== Helper: Authenticate caller =====
    private func authCaller(caller : Principal) : Types.ApiResult<Types.User> {
        switch (users.get(caller)) {
            case (?user) { #ok(user) };
            case null { #err("Not authenticated") };
        }
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
            Time.now()
        );
        let buf = Buffer.fromArray<Types.AuditTrailEntry>(auditTrailStable);
        buf.add(entry);
        auditTrailStable := Buffer.toArray(buf);
        nextAuditTrailId += 1;
    };

    // =========================================================
    // USER MANAGEMENT
    // =========================================================

    public shared(msg) func getCurrentUser() : async ?Types.User {
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
            ?u
        } else {
            users.get(msg.caller)
        }
    };

    public shared(msg) func completeProfile(req : Types.CompleteProfileRequest) : async Types.ApiResult<Types.User> {
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
                #ok(updated)
            };
        }
    };

    public shared(msg) func updateUserRole(target : Principal, newRole : Types.UserRole) : async Types.ApiResult<()> {
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
                        #ok(())
                    };
                }
            };
        }
    };

    public query func listUsers() : async [(Principal, Types.User)] {
        Iter.toArray(users.entries())
    };

    // =========================================================
    // ORGANIZATIONS
    // =========================================================

    public shared(msg) func createOrganization(name : Text, description : Text) : async Types.ApiResult<Types.Organization> {
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
                #ok(org)
            };
        }
    };

    public query func getOrganization(id : Nat) : async ?Types.Organization {
        orgs.get(id)
    };

    public query func listOrganizations() : async [(Nat, Types.Organization)] {
        Iter.toArray(orgs.entries())
    };

    // =========================================================
    // ENGAGEMENTS
    // =========================================================

    public shared(msg) func createEngagement(req : Types.CreateEngagementRequest) : async Types.ApiResult<Types.Engagement> {
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
                };
                engagements.put(nextEngagementId, eng);
                logAudit(msg.caller, "create", "engagement", nextEngagementId, req.name);
                nextEngagementId += 1;
                #ok(eng)
            };
        }
    };

    public query func getEngagement(id : Nat) : async ?Types.Engagement {
        engagements.get(id)
    };

    public query func listEngagements() : async [(Nat, Types.Engagement)] {
        Iter.toArray(engagements.entries())
    };

    // =========================================================
    // TRIAL BALANCE
    // =========================================================

    public shared(msg) func createTrialBalance(req : Types.CreateTrialBalanceRequest) : async Types.ApiResult<Types.TrialBalance> {
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
                #ok(tb)
            };
        }
    };

    public query func getTrialBalance(id : Nat) : async ?Types.TrialBalance {
        trialBalances.get(id)
    };

    public query func listTrialBalances() : async [(Nat, Types.TrialBalance)] {
        Iter.toArray(trialBalances.entries())
    };

    // =========================================================
    // ADJUSTMENTS (AJE)
    // =========================================================

    public shared(msg) func createAdjustment(req : Types.CreateAjeRequest) : async Types.ApiResult<Types.Adjustment> {
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
                let diff = if (totalDebit > totalCredit) { totalDebit - totalCredit } else { totalCredit - totalDebit };
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
                    blockchainHash = "";
                };
                adjustments.put(nextAdjId, adj);
                logAudit(msg.caller, "create", "adjustment", nextAdjId, req.description);
                nextAdjId += 1;
                #ok(adj)
            };
        }
    };

    public shared(msg) func updateAdjustmentStatus(adjId : Nat, newStatus : Types.AjeStatus) : async Types.ApiResult<Types.Adjustment> {
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
                        adjustments.put(adjId, updated);
                        logAudit(msg.caller, "update_status", "adjustment", adjId, debug_show(newStatus));
                        #ok(updated)
                    };
                }
            };
        }
    };

    public query func getAdjustment(id : Nat) : async ?Types.Adjustment {
        adjustments.get(id)
    };

    public query func listAdjustments() : async [(Nat, Types.Adjustment)] {
        Iter.toArray(adjustments.entries())
    };

    // =========================================================
    // FINANCIAL STATEMENTS
    // =========================================================

    public shared(msg) func createFinancialStatement(
        engagementId : Nat,
        trialBalanceId : Nat,
        taxonomy : Types.XBRLTaxonomy,
        title : Text
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
                #ok(fs)
            };
        }
    };

    public query func getFinancialStatement(id : Nat) : async ?Types.FinancialStatement {
        financialStatements.get(id)
    };

    public query func listFinancialStatements() : async [(Nat, Types.FinancialStatement)] {
        Iter.toArray(financialStatements.entries())
    };

    // =========================================================
    // AUDIT TRAIL
    // =========================================================

    public query func getAuditTrail() : async [Types.AuditTrailEntry] {
        auditTrailStable
    };

    public query func verifyAuditTrailIntegrity() : async Bool {
        AuditTrail.verifyChain(auditTrailStable)
    };
};
