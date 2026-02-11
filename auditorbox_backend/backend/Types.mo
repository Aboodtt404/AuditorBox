// Types.mo — AuditorBox shared type definitions
// All types used across modules. Variant types for enums, records for structs.
module {
    // ===== Core Enums =====
    public type UserRole = {
        #Admin;
        #Partner;
        #Manager;
        #Senior;
        #Staff;
        #ClientUser;
    };

    public type XBRLTaxonomy = {
        #EAS;   // Egyptian Accounting Standards
        #IFRS;  // International Financial Reporting Standards
        #GCC;   // GCC Financial Reporting Standards
        #Custom : Text;
    };

    public type EngagementLink = {
        #Organization : Nat;
        #Entity : Nat;
        #Client : Nat;
    };

    public type EngagementStatus = {
        #Planning;
        #InProgress;
        #Review;
        #Completed;
        #Archived;
    };

    public type AccountType = {
        #Asset;
        #Liability;
        #Equity;
        #Revenue;
        #Expense;
        #Other;
    };

    public type AjeStatus = {
        #Draft;
        #Proposed;
        #Reviewed;
        #Approved;
        #Posted;
        #Rejected;
    };

    // ===== Result Type =====
    public type ApiResult<T> = {
        #ok : T;
        #err : Text;
    };

    // ===== User Types =====
    public type User = {
        principal : Principal;
        role : UserRole;
        name : Text;
        email : Text;
        createdAt : Int;
        languagePreference : Text;
        profileCompleted : Bool;
    };

    public type CompleteProfileRequest = {
        name : Text;
        email : Text;
        requestedRole : UserRole;
    };

    // ===== Organization Types =====
    public type Organization = {
        id : Nat;
        name : Text;
        description : Text;
        createdAt : Int;
        createdBy : Principal;
        entityIds : [Nat];
    };

    public type CreateOrganizationRequest = {
        name : Text;
        description : Text;
    };

    // ===== Entity Types =====
    public type Entity = {
        id : Nat;
        organizationId : Nat;
        name : Text;
        description : Text;
        taxonomy : ?XBRLTaxonomy;
        taxonomyConfig : Text;
        createdAt : Int;
        createdBy : Principal;
    };

    // ===== Client Types =====
    public type Client = {
        id : Nat;
        name : Text;
        nameAr : ?Text;
        contactEmail : Text;
        contactPhone : Text;
        address : Text;
        taxRegistrationNumber : ?Text;
        commercialRegistration : ?Text;
        industryCode : ?Text;
        organizationId : ?Nat;
        entityId : ?Nat;
        createdAt : Int;
        createdBy : Principal;
    };

    // ===== Engagement Types =====
    public type Engagement = {
        id : Nat;
        name : Text;
        description : Text;
        link : EngagementLink;
        status : EngagementStatus;
        startDate : Int;
        endDate : Int;
        createdAt : Int;
        createdBy : Principal;
        // Engagement configuration
        clientName : Text;
        yearEnd : Text;
        reportingFramework : Text;  // "IFRS", "EAS", "GCC", etc.
        entityType : Text;          // "listed", "private", "nfp"
        currency : Text;
        industrySector : Text;      // "manufacturing", "financial_services", etc.
        materialityOverall : Float;
        materialityPerformance : Float;
        materialityTrivial : Float;
        riskProfile : Text;         // "low", "medium", "high"
        isGroupAudit : Bool;
        isFirstYear : Bool;
    };

    public type CreateEngagementRequest = {
        name : Text;
        description : Text;
        link : EngagementLink;
        startDate : Int;
        endDate : Int;
        // Engagement configuration
        clientName : Text;
        yearEnd : Text;
        reportingFramework : Text;
        entityType : Text;
        currency : Text;
        industrySector : Text;
        materialityOverall : Float;
        materialityPerformance : Float;
        materialityTrivial : Float;
        riskProfile : Text;
        isGroupAudit : Bool;
        isFirstYear : Bool;
    };

    public type UpdateEngagementRequest = {
        name : ?Text;
        description : ?Text;
        status : ?EngagementStatus;
        endDate : ?Int;
        clientName : ?Text;
        yearEnd : ?Text;
        reportingFramework : ?Text;
        entityType : ?Text;
        currency : ?Text;
        industrySector : ?Text;
        materialityOverall : ?Float;
        materialityPerformance : ?Float;
        materialityTrivial : ?Float;
        riskProfile : ?Text;
        isGroupAudit : ?Bool;
        isFirstYear : ?Bool;
    };

    // ===== Trial Balance Types =====
    public type TrialBalanceAccount = {
        accountNumber : Text;
        accountName : Text;
        accountType : AccountType;
        beginningBalance : Float;
        debit : Float;
        credit : Float;
        endingBalance : Float;
        fsLineItem : Text;
    };

    public type TrialBalance = {
        id : Nat;
        engagementId : Nat;
        periodEndDate : Text;
        description : Text;
        currency : Text;
        accounts : [TrialBalanceAccount];
        createdAt : Int;
        createdBy : Principal;
    };

    public type CreateTrialBalanceRequest = {
        engagementId : Nat;
        periodEndDate : Text;
        description : Text;
        currency : Text;
    };

    public type UpdateAccountRequest = {
        accountNumber : Text;
        accountName : Text;
        debit : Float;
        credit : Float;
    };

    // ===== Adjustment (AJE) Types =====
    public type AjeLineItem = {
        accountNumber : Text;
        accountName : Text;
        debit : Float;
        credit : Float;
        description : Text;
    };

    public type Adjustment = {
        id : Nat;
        engagementId : Nat;
        trialBalanceId : Nat;
        description : Text;
        status : AjeStatus;
        lineItems : [AjeLineItem];
        createdAt : Int;
        createdBy : Principal;
        reviewedBy : ?Principal;
        approvedBy : ?Principal;
        blockchainHash : Text;
    };

    public type AdjustingJournalEntry = Adjustment;

    public type CreateAjeRequest = {
        engagementId : Nat;
        trialBalanceId : Nat;
        description : Text;
        lineItems : [AjeLineItem];
    };

    // ===== Financial Statement Types =====
    public type FSLineItem = {
        code : Text;
        name : Text;
        nameAr : ?Text;
        amount : Float;
        category : Text;
    };

    public type FinancialStatement = {
        id : Nat;
        engagementId : Nat;
        trialBalanceId : Nat;
        taxonomy : XBRLTaxonomy;
        title : Text;
        lineItems : [FSLineItem];
        generatedAt : Int;
        generatedBy : Principal;
    };

    // ===== Audit Trail Types =====
    public type AuditTrailEntry = {
        id : Nat;
        principal : Principal;
        action : Text;
        resourceType : Text;
        resourceId : Nat;
        details : Text;
        timestamp : Int;
        previousHash : Text;
        hash : Text;
    };

    public type ActivityLogEntry = AuditTrailEntry;

    // ===== Template Types =====
    public type TemplateType = {
        #ISA;
        #Checklist;
        #Procedure;
        #Report;
        #Letter;
        #Custom : Text;
    };

    public type ChecklistItemStatus = {
        #Pending;
        #InProgress;
        #Completed;
        #NotApplicable;
    };

    public type ChecklistItem = {
        id : Nat;
        templateId : Nat;
        description : Text;
        status : ChecklistItemStatus;
        order : Nat;
        notes : Text;
        assignedTo : ?Principal;
    };

    public type AuditTemplate = {
        id : Nat;
        name : Text;
        templateType : TemplateType;
        description : Text;
        jurisdiction : Text;
        version : Nat;
        isPublic : Bool;
        checklistItems : [ChecklistItem];
        createdAt : Int;
        createdBy : Principal;
        firmId : ?Nat;
    };

    // ===== Form Data Types =====
    public type FormStatus = {
        #NotStarted;
        #InProgress;
        #Prepared;
        #Reviewed;
        #SignedOff;
    };

    public type FormData = {
        engagementId : Nat;
        formId : Text;              // e.g. "140", "520E", "Q"
        status : FormStatus;
        values : Text;              // JSON-encoded field values
        preparedBy : ?Principal;
        reviewedBy : ?Principal;
        lastUpdated : Int;
        updatedBy : Principal;
    };

    public type SaveFormDataRequest = {
        formId : Text;
        values : Text;
        status : FormStatus;
    };

    // ===== User Preferences =====
    public type UserPreferences = {
        dismissedTooltips : [Text];
        seenPhaseIntros : [Text];
        lastEngagementId : ?Nat;
    };
};
