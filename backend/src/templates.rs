use candid::{encode_args, CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use serde::Serialize;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::STORAGE;
use crate::types::Result;

// Template Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum TemplateType {
    Audit,
    Review,
    Compilation,
    TaxPreparation,
    Custom,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ChecklistItemStatus {
    NotStarted,
    InProgress,
    Completed,
    NotApplicable,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ComplianceStatus {
    NotStarted,
    InProgress,
    Compliant,
    NonCompliant,
    PartiallyCompliant,
}

// Standard Compliance Tracking
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct StandardCompliance {
    pub standard_code: String, // e.g., "ISA 200"
    pub standard_name: String,
    pub checklist_item_ids: Vec<String>,
    pub compliance_status: ComplianceStatus,
    pub last_reviewed: Option<u64>,
    pub reviewed_by: Option<Principal>,
    pub notes: String,
}

// Template Checklist Item
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ChecklistItem {
    pub id: String,
    pub title: String,
    pub description: String,
    pub section: String, // e.g., "Planning", "Testing", "Reporting"
    pub order: u32,
    pub is_required: bool,
    pub reference: Option<String>, // Reference to standards (e.g., "ISA 315")
    pub estimated_hours: Option<f64>,
    pub compliance_requirements: Option<Vec<String>>, // Specific requirements per standard
    pub documentation_required: Option<Vec<String>>, // Required documentation templates
    pub evidence_types: Option<Vec<String>>, // Types of evidence needed
}

// Template
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AuditTemplate {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub template_type: TemplateType,
    pub checklist_items: Vec<ChecklistItem>,
    pub is_default: bool,
    pub is_public: bool, // Public templates available to all firms
    pub created_by: Principal,
    pub created_at: u64,
    pub updated_at: u64,
    pub firm_id: Option<u64>, // If firm-specific
    pub jurisdiction: Option<String>, // e.g., "Egypt", "GCC", for jurisdiction-specific templates
}

// Engagement Checklist Instance - template applied to specific engagement
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementChecklist {
    pub id: u64,
    pub engagement_id: u64,
    pub template_id: u64,
    pub name: String,
    pub items: Vec<ChecklistItemInstance>,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ChecklistItemInstance {
    pub item_id: String, // Reference to template item
    pub title: String,
    pub description: String,
    pub section: String,
    pub order: u32,
    pub status: ChecklistItemStatus,
    pub assigned_to: Option<Principal>,
    pub completed_by: Option<Principal>,
    pub completed_at: Option<u64>,
    pub notes: String,
    pub actual_hours: Option<f64>,
}

// Request/Response types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateTemplateRequest {
    pub name: String,
    pub description: String,
    pub template_type: TemplateType,
    pub checklist_items: Vec<ChecklistItem>,
    pub is_public: bool,
    pub firm_id: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ApplyTemplateRequest {
    pub engagement_id: u64,
    pub template_id: u64,
    pub name: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateChecklistItemRequest {
    pub checklist_id: u64,
    pub item_id: String,
    pub status: Option<ChecklistItemStatus>,
    pub assigned_to: Option<Principal>,
    pub notes: Option<String>,
    pub actual_hours: Option<f64>,
}

// Create a new template
pub fn create_template(caller: Principal, req: CreateTemplateRequest) -> Result<AuditTemplate> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Only manager and above can create templates
    if !auth::is_manager_or_above(&user) {
        return Err("Insufficient permissions to create templates".to_string());
    }

    let id = STORAGE.with(|storage| {
        let borrowed = storage.borrow_mut();
        let current_max = borrowed
            .audit_templates
            .iter()
            .map(|(_, t)| t.id)
            .max()
            .unwrap_or(0);
        current_max + 1
    });

    let template = AuditTemplate {
        id,
        name: req.name.clone(),
        description: req.description,
        template_type: req.template_type,
        checklist_items: req.checklist_items,
        is_default: false,
        is_public: req.is_public,
        created_by: caller,
        created_at: time(),
        updated_at: time(),
        firm_id: req.firm_id,
        jurisdiction: None,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .audit_templates
            .insert(template.id, template.clone());
    });

    let snapshot = encode_args((template.clone(),)).ok();
    log_activity(
        caller,
        "create_template".to_string(),
        "template".to_string(),
        template.id.to_string(),
        format!("Template {} created", template.name),
        snapshot,
    );

    Ok(template)
}

// Get all templates
pub fn list_templates(caller: Principal) -> Result<Vec<AuditTemplate>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let templates = STORAGE.with(|storage| {
        storage
            .borrow()
            .audit_templates
            .iter()
            .filter(|(_, template)| {
                // Show public templates or templates created by user
                template.is_public || template.created_by == caller
            })
            .map(|(_, template)| template)
            .collect()
    });

    Ok(templates)
}

// Get template by ID
pub fn get_template(caller: Principal, template_id: u64) -> Result<AuditTemplate> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let template = STORAGE
        .with(|storage| storage.borrow().audit_templates.get(&template_id))
        .ok_or_else(|| "Template not found".to_string())?;

    // Check access
    if !template.is_public && template.created_by != caller {
        return Err("No access to this template".to_string());
    }

    Ok(template)
}

// Apply template to engagement
pub fn apply_template_to_engagement(
    caller: Principal,
    req: ApplyTemplateRequest,
) -> Result<EngagementChecklist> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to apply templates".to_string());
    }

    // Verify engagement exists
    STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.engagement_id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    // Get template
    let template = STORAGE
        .with(|storage| storage.borrow().audit_templates.get(&req.template_id))
        .ok_or_else(|| "Template not found".to_string())?;

    // Check access to template
    if !template.is_public && template.created_by != caller {
        return Err("No access to this template".to_string());
    }

    let id = STORAGE.with(|storage| {
        let borrowed = storage.borrow_mut();
        let current_max = borrowed
            .engagement_checklists
            .iter()
            .map(|(_, c)| c.id)
            .max()
            .unwrap_or(0);
        current_max + 1
    });

    // Convert template items to instances
    let items: Vec<ChecklistItemInstance> = template
        .checklist_items
        .iter()
        .map(|item| ChecklistItemInstance {
            item_id: item.id.clone(),
            title: item.title.clone(),
            description: item.description.clone(),
            section: item.section.clone(),
            order: item.order,
            status: ChecklistItemStatus::NotStarted,
            assigned_to: None,
            completed_by: None,
            completed_at: None,
            notes: String::new(),
            actual_hours: None,
        })
        .collect();

    let checklist = EngagementChecklist {
        id,
        engagement_id: req.engagement_id,
        template_id: req.template_id,
        name: req.name.unwrap_or_else(|| template.name.clone()),
        items,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagement_checklists
            .insert(checklist.id, checklist.clone());
    });

    log_activity(
        caller,
        "apply_template_to_engagement".to_string(),
        "engagement".to_string(),
        req.engagement_id.to_string(),
        format!(
            "Applied template {} to engagement {}",
            template.name, req.engagement_id
        ),
        None,
    );

    Ok(checklist)
}

// Get checklists for an engagement
pub fn get_engagement_checklists(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<EngagementChecklist>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions".to_string());
    }

    // Verify engagement exists
    STORAGE
        .with(|storage| storage.borrow().engagements.get(&engagement_id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    let checklists = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagement_checklists
            .iter()
            .filter(|(_, checklist)| checklist.engagement_id == engagement_id)
            .map(|(_, checklist)| checklist)
            .collect()
    });

    Ok(checklists)
}

// Update checklist item
pub fn update_checklist_item(
    caller: Principal,
    req: UpdateChecklistItemRequest,
) -> Result<EngagementChecklist> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to update checklist items".to_string());
    }

    let mut checklist = STORAGE
        .with(|storage| storage.borrow().engagement_checklists.get(&req.checklist_id))
        .ok_or_else(|| "Checklist not found".to_string())?;

    // Find and update the item
    let item = checklist
        .items
        .iter_mut()
        .find(|i| i.item_id == req.item_id)
        .ok_or_else(|| "Checklist item not found".to_string())?;

    if let Some(status) = req.status {
        item.status = status.clone();
        if status == ChecklistItemStatus::Completed {
            item.completed_by = Some(caller);
            item.completed_at = Some(time());
        }
    }

    if let Some(assigned_to) = req.assigned_to {
        item.assigned_to = Some(assigned_to);
    }

    if let Some(notes) = req.notes {
        item.notes = notes;
    }

    if let Some(hours) = req.actual_hours {
        item.actual_hours = Some(hours);
    }

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagement_checklists
            .insert(checklist.id, checklist.clone());
    });

    log_activity(
        caller,
        "update_checklist_item".to_string(),
        "checklist_item".to_string(),
        req.item_id,
        format!("Updated checklist item in checklist {}", checklist.id),
        None,
    );

    Ok(checklist)
}

// Get standard compliance for an engagement checklist
pub fn get_standard_compliance(
    caller: Principal,
    checklist_id: u64,
    standard_code: String,
) -> Result<StandardCompliance> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let checklist = STORAGE
        .with(|storage| storage.borrow().engagement_checklists.get(&checklist_id))
        .ok_or_else(|| "Checklist not found".to_string())?;

    // Get template to find items for this standard
    let template = STORAGE
        .with(|storage| storage.borrow().audit_templates.get(&checklist.template_id))
        .ok_or_else(|| "Template not found".to_string())?;

    // Find all checklist items for this standard
    let standard_items: Vec<String> = template
        .checklist_items
        .iter()
        .filter(|item| {
            item.reference
                .as_ref()
                .map(|ref_str| ref_str.starts_with(&standard_code))
                .unwrap_or(false)
        })
        .map(|item| item.id.clone())
        .collect();

    // Calculate compliance status based on checklist item statuses
    let checklist_item_map: std::collections::HashMap<String, &ChecklistItemInstance> = checklist
        .items
        .iter()
        .map(|item| (item.item_id.clone(), item))
        .collect();

    let completed_count = standard_items
        .iter()
        .filter(|item_id| {
            checklist_item_map
                .get(*item_id)
                .map(|item| matches!(item.status, ChecklistItemStatus::Completed))
                .unwrap_or(false)
        })
        .count();

    let total_count = standard_items.len();
    let in_progress_count = standard_items
        .iter()
        .filter(|item_id| {
            checklist_item_map
                .get(*item_id)
                .map(|item| matches!(item.status, ChecklistItemStatus::InProgress))
                .unwrap_or(false)
        })
        .count();

    let compliance_status = if total_count == 0 {
        ComplianceStatus::NotStarted
    } else if completed_count == total_count {
        ComplianceStatus::Compliant
    } else if completed_count > 0 || in_progress_count > 0 {
        ComplianceStatus::PartiallyCompliant
    } else {
        ComplianceStatus::NotStarted
    };

    // Get standard name from metadata (simplified - in production, use proper lookup)
    let standard_name = match standard_code.as_str() {
        "ISA 200" => "Overall Objectives of the Independent Auditor",
        "ISA 210" => "Agreeing the Terms of Audit Engagements",
        "ISA 220" => "Quality Control for an Audit of Financial Statements",
        "ISA 230" => "Audit Documentation",
        "ISA 240" => "The Auditor's Responsibilities Relating to Fraud",
        "ISA 250" => "Consideration of Laws and Regulations",
        "ISA 260" => "Communication with Those Charged with Governance",
        "ISA 265" => "Communicating Deficiencies in Internal Control",
        "ISA 300" => "Planning an Audit of Financial Statements",
        "ISA 315" => "Identifying and Assessing the Risks of Material Misstatement",
        _ => "Unknown Standard",
    };

    Ok(StandardCompliance {
        standard_code,
        standard_name: standard_name.to_string(),
        checklist_item_ids: standard_items,
        compliance_status,
        last_reviewed: None,
        reviewed_by: None,
        notes: String::new(),
    })
}

// Update standard compliance
pub fn update_standard_compliance(
    caller: Principal,
    checklist_id: u64,
    standard_code: String,
    status: ComplianceStatus,
    notes: Option<String>,
) -> Result<StandardCompliance> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    // Verify checklist exists
    let _checklist = STORAGE
        .with(|storage| storage.borrow().engagement_checklists.get(&checklist_id))
        .ok_or_else(|| "Checklist not found".to_string())?;

    // Get current compliance
    let mut compliance = get_standard_compliance(caller, checklist_id, standard_code.clone())?;

    // Update status
    compliance.compliance_status = status;
    compliance.last_reviewed = Some(time());
    compliance.reviewed_by = Some(caller);
    if let Some(notes_text) = notes {
        compliance.notes = notes_text;
    }

    // In a full implementation, we would store this in a separate compliance tracking structure
    // For now, we return the updated compliance object
    Ok(compliance)
}

// Get compliance report for an engagement
pub fn get_compliance_report(caller: Principal, engagement_id: u64) -> Result<Vec<StandardCompliance>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    // Find checklist for this engagement
    let checklist = STORAGE
        .with(|storage| {
            storage
                .borrow()
                .engagement_checklists
                .iter()
                .find(|(_, c)| c.engagement_id == engagement_id)
                .map(|(_, c)| c.clone())
        })
        .ok_or_else(|| "No checklist found for this engagement".to_string())?;

    // Get compliance for all 10 standards
    let standard_codes = vec![
        "ISA 200".to_string(),
        "ISA 210".to_string(),
        "ISA 220".to_string(),
        "ISA 230".to_string(),
        "ISA 240".to_string(),
        "ISA 250".to_string(),
        "ISA 260".to_string(),
        "ISA 265".to_string(),
        "ISA 300".to_string(),
        "ISA 315".to_string(),
    ];

    let mut compliance_report = Vec::new();
    for standard_code in standard_codes {
        match get_standard_compliance(caller, checklist.id, standard_code) {
            Ok(compliance) => compliance_report.push(compliance),
            Err(_) => continue, // Skip if standard not found
        }
    }

    Ok(compliance_report)
}

// Initialize default templates
pub fn initialize_default_templates() {
    // Basic Audit Template
    let basic_audit_items = vec![
        ChecklistItem {
            id: "plan-1".to_string(),
            title: "Obtain understanding of entity and environment".to_string(),
            description: "Understand the entity, its operations, and its environment".to_string(),
            section: "Planning".to_string(),
            order: 1,
            is_required: true,
            reference: Some("ISA 315".to_string()),
            estimated_hours: Some(4.0),
            compliance_requirements: None,
            documentation_required: None,
            evidence_types: None,
        },
        ChecklistItem {
            id: "plan-2".to_string(),
            title: "Assess risks of material misstatement".to_string(),
            description: "Identify and assess risks at financial statement and assertion levels".to_string(),
            section: "Planning".to_string(),
            order: 2,
            is_required: true,
            reference: Some("ISA 315".to_string()),
            estimated_hours: Some(6.0),
            compliance_requirements: None,
            documentation_required: None,
            evidence_types: None,
        },
        ChecklistItem {
            id: "test-1".to_string(),
            title: "Test internal controls".to_string(),
            description: "Perform tests of controls for key processes".to_string(),
            section: "Testing".to_string(),
            order: 3,
            is_required: false,
            reference: Some("ISA 330".to_string()),
            estimated_hours: Some(8.0),
            compliance_requirements: None,
            documentation_required: None,
            evidence_types: None,
        },
        ChecklistItem {
            id: "test-2".to_string(),
            title: "Perform substantive procedures".to_string(),
            description: "Conduct substantive analytical procedures and tests of details".to_string(),
            section: "Testing".to_string(),
            order: 4,
            is_required: true,
            reference: Some("ISA 330".to_string()),
            estimated_hours: Some(16.0),
            compliance_requirements: None,
            documentation_required: None,
            evidence_types: None,
        },
        ChecklistItem {
            id: "report-1".to_string(),
            title: "Prepare audit report".to_string(),
            description: "Draft and finalize audit opinion".to_string(),
            section: "Reporting".to_string(),
            order: 5,
            is_required: true,
            reference: Some("ISA 700".to_string()),
            estimated_hours: Some(4.0),
            compliance_requirements: None,
            documentation_required: None,
            evidence_types: None,
        },
    ];

    let basic_audit = AuditTemplate {
        id: 1,
        name: "Basic Audit Program".to_string(),
        description: "Standard audit program for financial statement audits".to_string(),
        template_type: TemplateType::Audit,
        checklist_items: basic_audit_items,
        is_default: true,
        is_public: true,
        created_by: Principal::anonymous(),
        created_at: time(),
        updated_at: time(),
        firm_id: None,
        jurisdiction: None,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .audit_templates
            .insert(basic_audit.id, basic_audit);
    });
    
    // Initialize Egyptian Standards template
    create_egyptian_standards_template();
}

// Create comprehensive Egyptian Audit Standards template based on ISA 2015/ESAROAS
pub fn create_egyptian_standards_template() {
    let egyptian_items = create_egyptian_standard_items();
    
    let egyptian_template = AuditTemplate {
        id: 2,
        name: "Egyptian Audit Standards (ESAROAS)".to_string(),
        description: "Comprehensive audit program based on Egyptian Standards on Auditing, Review, and Other Assurance Services (ESAROAS), aligned with ISA 2015. Covers all 10 core ISA standards for Egyptian audit engagements.".to_string(),
        template_type: TemplateType::Audit,
        checklist_items: egyptian_items,
        is_default: false,
        is_public: true,
        created_by: Principal::anonymous(),
        created_at: time(),
        updated_at: time(),
        firm_id: None,
        jurisdiction: Some("Egypt".to_string()),
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .audit_templates
            .insert(egyptian_template.id, egyptian_template);
    });
}

fn create_egyptian_standard_items() -> Vec<ChecklistItem> {
    let mut items = Vec::new();
    let mut order = 1;

    // ISA 200: Overall Objectives of the Independent Auditor
    items.push(ChecklistItem {
        id: "isa200-1".to_string(),
        title: "Overall objectives".to_string(),
        description: "Set reasonable assurance objective, emphasize ethics and professional skepticism across the engagement".to_string(),
        section: "Quality Control".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 200".to_string()),
        estimated_hours: Some(1.0),
        compliance_requirements: Some(vec![
            "Apply ethical requirements and skepticism throughout planning and execution".to_string(),
        ]),
        documentation_required: Some(vec![
            "Ethics confirmations".to_string(),
            "Team briefing on objectives and skepticism".to_string(),
        ]),
        evidence_types: Some(vec![
            "Ethics confirmation forms".to_string(),
            "Team briefing notes".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa200-2".to_string(),
        title: "Preconditions".to_string(),
        description: "Confirm preconditions (acceptable framework and management's responsibilities) before accepting/continuing".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 200".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Proceed only when preconditions are present and acknowledged".to_string(),
        ]),
        documentation_required: Some(vec![
            "Preconditions checklist".to_string(),
            "Management acknowledgments".to_string(),
        ]),
        evidence_types: Some(vec![
            "Preconditions assessment".to_string(),
            "Signed management acknowledgment".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa200-3".to_string(),
        title: "Materiality".to_string(),
        description: "Set overall/performance materiality and revise if circumstances change".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 200".to_string()),
        estimated_hours: Some(0.9),
        compliance_requirements: Some(vec![
            "Use materiality to design procedures and evaluate misstatements".to_string(),
        ]),
        documentation_required: Some(vec![
            "Materiality memo".to_string(),
            "Thresholds".to_string(),
            "Benchmarks".to_string(),
        ]),
        evidence_types: Some(vec![
            "Materiality calculation documentation".to_string(),
            "Materiality thresholds worksheet".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa200-4".to_string(),
        title: "Strategy linkage".to_string(),
        description: "Link overall strategy to evidence needs to achieve reasonable assurance".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 200".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Align nature, timing, extent of procedures to achieve assurance".to_string(),
        ]),
        documentation_required: Some(vec![
            "Strategy memo with evidence map".to_string(),
        ]),
        evidence_types: Some(vec![
            "Audit strategy document".to_string(),
            "Evidence mapping".to_string(),
        ]),
    });
    order += 1;

    // ISA 210: Agreeing the Terms of Audit Engagements
    items.push(ChecklistItem {
        id: "isa210-1".to_string(),
        title: "Engagement terms".to_string(),
        description: "Agree and document objective, scope, responsibilities, reporting framework and form of reports".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 210".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Obtain signed engagement letter before work".to_string(),
        ]),
        documentation_required: Some(vec![
            "Signed letter".to_string(),
            "Scope annex".to_string(),
            "Framework reference".to_string(),
        ]),
        evidence_types: Some(vec![
            "Executed engagement letter".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa210-2".to_string(),
        title: "Acceptance/continuance".to_string(),
        description: "Perform integrity, independence, and preconditions checks".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 210".to_string()),
        estimated_hours: Some(0.9),
        compliance_requirements: Some(vec![
            "Accept/continue only if criteria are met".to_string(),
        ]),
        documentation_required: Some(vec![
            "Acceptance form".to_string(),
            "Conflict checks".to_string(),
            "Independence screen".to_string(),
        ]),
        evidence_types: Some(vec![
            "Acceptance documentation".to_string(),
            "Conflict check results".to_string(),
            "Independence confirmation".to_string(),
        ]),
    });
    order += 1;

    // ISA 220 (Revised): Quality Control for an Audit of Financial Statements
    items.push(ChecklistItem {
        id: "isa220-1".to_string(),
        title: "Direction/supervision".to_string(),
        description: "Tailor direction, supervision, and review to engagement risks and team capabilities".to_string(),
        section: "Quality Control".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 220 (Revised)".to_string()),
        estimated_hours: Some(0.9),
        compliance_requirements: Some(vec![
            "Evidence partner's active oversight of quality".to_string(),
        ]),
        documentation_required: Some(vec![
            "Supervision plan".to_string(),
            "Review milestones".to_string(),
            "Partner review notes".to_string(),
        ]),
        evidence_types: Some(vec![
            "Supervision documentation".to_string(),
            "Partner review sign-offs".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa220-2".to_string(),
        title: "Resources/experts".to_string(),
        description: "Confirm team competence and need for specialists or component auditors".to_string(),
        section: "Quality Control".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 220 (Revised)".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Assign adequate resources and specialists as needed".to_string(),
        ]),
        documentation_required: Some(vec![
            "Staffing plan".to_string(),
            "Competency matrix".to_string(),
            "Specialist rationale".to_string(),
        ]),
        evidence_types: Some(vec![
            "Team assignment documentation".to_string(),
            "Specialist engagement letters".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa220-3".to_string(),
        title: "EQR".to_string(),
        description: "Determine if an engagement quality review is required and perform it when applicable".to_string(),
        section: "Quality Control".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 220 (Revised)".to_string()),
        estimated_hours: Some(1.1),
        compliance_requirements: Some(vec![
            "Apply EQR per firm/regulatory criteria (e.g., PIE/high risk)".to_string(),
        ]),
        documentation_required: Some(vec![
            "EQR designation".to_string(),
            "Reviewer notes".to_string(),
            "Issue resolution".to_string(),
        ]),
        evidence_types: Some(vec![
            "EQR documentation".to_string(),
            "Reviewer sign-offs".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa220-4".to_string(),
        title: "Independence".to_string(),
        description: "Monitor independence and address threats with safeguards during the engagement".to_string(),
        section: "Quality Control".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 220 (Revised)".to_string()),
        estimated_hours: Some(0.6),
        compliance_requirements: Some(vec![
            "Maintain independence and apply safeguards".to_string(),
        ]),
        documentation_required: Some(vec![
            "Periodic confirmations".to_string(),
            "Threats/safeguards register".to_string(),
        ]),
        evidence_types: Some(vec![
            "Independence confirmations".to_string(),
            "Safeguards documentation".to_string(),
        ]),
    });
    order += 1;

    // ISA 230: Audit Documentation
    items.push(ChecklistItem {
        id: "isa230-1".to_string(),
        title: "Sufficiency of documentation".to_string(),
        description: "Prepare timely documentation sufficient for an experienced auditor to understand work and conclusions".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 230".to_string()),
        estimated_hours: Some(1.2),
        compliance_requirements: Some(vec![
            "Record procedures, evidence, and judgments supporting the report".to_string(),
        ]),
        documentation_required: Some(vec![
            "Workpapers with objective, procedures, results, cross-references".to_string(),
        ]),
        evidence_types: Some(vec![
            "Complete audit working papers".to_string(),
            "Review documentation".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa230-2".to_string(),
        title: "Significant judgments".to_string(),
        description: "Capture significant professional judgments and matters influencing conclusions".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 230".to_string()),
        estimated_hours: Some(0.7),
        compliance_requirements: Some(vec![
            "Document key judgments and alternatives considered".to_string(),
        ]),
        documentation_required: Some(vec![
            "Significant matters memo".to_string(),
            "Judgment rationale".to_string(),
        ]),
        evidence_types: Some(vec![
            "Judgment documentation".to_string(),
            "Alternative analysis".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa230-3".to_string(),
        title: "File assembly".to_string(),
        description: "Complete file assembly and control post‑assembly changes per policy/law".to_string(),
        section: "Reporting".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 230".to_string()),
        estimated_hours: Some(0.6),
        compliance_requirements: Some(vec![
            "Finalize file and preserve integrity".to_string(),
        ]),
        documentation_required: Some(vec![
            "Completion checklist".to_string(),
            "Lock‑down record".to_string(),
            "Change log".to_string(),
        ]),
        evidence_types: Some(vec![
            "Complete audit file".to_string(),
            "File completion sign-off".to_string(),
        ]),
    });
    order += 1;

    // ISA 240 (Revised): The Auditor's Responsibilities Relating to Fraud
    items.push(ChecklistItem {
        id: "isa240-1".to_string(),
        title: "Fraud brainstorming".to_string(),
        description: "Hold team session to set fraud mindset and identify fraud risk areas (including revenue)".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 240 (Revised)".to_string()),
        estimated_hours: Some(1.0),
        compliance_requirements: Some(vec![
            "Plan targeted procedures responsive to fraud risks".to_string(),
        ]),
        documentation_required: Some(vec![
            "Brainstorming minutes".to_string(),
            "Fraud risks".to_string(),
            "Planned responses".to_string(),
        ]),
        evidence_types: Some(vec![
            "Brainstorming session notes".to_string(),
            "Fraud risk identification".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa240-2".to_string(),
        title: "Inquiries and external info".to_string(),
        description: "Make inquiries of management/governance and consider external information and analytics".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 240 (Revised)".to_string()),
        estimated_hours: Some(0.9),
        compliance_requirements: Some(vec![
            "Broaden sources to identify fraud indicators".to_string(),
        ]),
        documentation_required: Some(vec![
            "Inquiry notes".to_string(),
            "External info considered".to_string(),
            "Analytics outputs".to_string(),
        ]),
        evidence_types: Some(vec![
            "Interview documentation".to_string(),
            "External information sources".to_string(),
            "Analytics results".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa240-3".to_string(),
        title: "Unpredictability".to_string(),
        description: "Incorporate unpredictable procedures and expanded testing in high‑risk areas".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 240 (Revised)".to_string()),
        estimated_hours: Some(1.0),
        compliance_requirements: Some(vec![
            "Include unpredictability to address management anticipation".to_string(),
        ]),
        documentation_required: Some(vec![
            "Unpredictable procedures list".to_string(),
            "Results".to_string(),
            "Conclusions".to_string(),
        ]),
        evidence_types: Some(vec![
            "Unpredictable testing documentation".to_string(),
            "Testing results".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa240-4".to_string(),
        title: "Management override".to_string(),
        description: "Evaluate journals, estimates, and unusual adjustments for override risks".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 240 (Revised)".to_string()),
        estimated_hours: Some(1.3),
        compliance_requirements: Some(vec![
            "Address override through targeted testing and evaluation".to_string(),
        ]),
        documentation_required: Some(vec![
            "Journal testing program".to_string(),
            "Estimates review".to_string(),
            "Override indicators".to_string(),
        ]),
        evidence_types: Some(vec![
            "Journal testing results".to_string(),
            "Estimates review documentation".to_string(),
            "Override assessment".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa240-5".to_string(),
        title: "Stand‑back and communicate".to_string(),
        description: "Perform a stand‑back evaluation and communicate identified/suspected fraud appropriately".to_string(),
        section: "Reporting".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 240 (Revised)".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Conclude holistically and report per requirements".to_string(),
        ]),
        documentation_required: Some(vec![
            "Stand‑back memo".to_string(),
            "Fraud communication records".to_string(),
        ]),
        evidence_types: Some(vec![
            "Stand-back evaluation".to_string(),
            "Communication documentation".to_string(),
        ]),
    });
    order += 1;

    // ISA 250: Consideration of Laws and Regulations
    items.push(ChecklistItem {
        id: "isa250-1".to_string(),
        title: "Identify laws/regulations".to_string(),
        description: "Identify applicable laws/regulations with direct and indirect effects".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 250".to_string()),
        estimated_hours: Some(0.9),
        compliance_requirements: Some(vec![
            "Design procedures responsive to non‑compliance risks".to_string(),
        ]),
        documentation_required: Some(vec![
            "Laws register".to_string(),
            "Compliance risk assessment".to_string(),
        ]),
        evidence_types: Some(vec![
            "Legal requirements list".to_string(),
            "Risk assessment documentation".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa250-2".to_string(),
        title: "Respond to non‑compliance".to_string(),
        description: "Perform procedures where risks indicate possible non‑compliance".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 250".to_string()),
        estimated_hours: Some(1.1),
        compliance_requirements: Some(vec![
            "Respond appropriately to suspected non‑compliance".to_string(),
        ]),
        documentation_required: Some(vec![
            "Testing results".to_string(),
            "Legal correspondence if applicable".to_string(),
        ]),
        evidence_types: Some(vec![
            "Testing documentation".to_string(),
            "Legal confirmations".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa250-3".to_string(),
        title: "Communicate/report".to_string(),
        description: "Communicate identified non‑compliance and consider legal/regulatory reporting duties".to_string(),
        section: "Reporting".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 250".to_string()),
        estimated_hours: Some(0.6),
        compliance_requirements: Some(vec![
            "Fulfill communication and reporting obligations".to_string(),
        ]),
        documentation_required: Some(vec![
            "Non‑compliance memo".to_string(),
            "Regulatory notifications if required".to_string(),
        ]),
        evidence_types: Some(vec![
            "Communication documentation".to_string(),
            "Regulatory filings".to_string(),
        ]),
    });
    order += 1;

    // ISA 260: Communication with Those Charged with Governance
    items.push(ChecklistItem {
        id: "isa260-1".to_string(),
        title: "Plan communications".to_string(),
        description: "Plan two‑way communication with governance on scope, timing, and key matters".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 260".to_string()),
        estimated_hours: Some(0.7),
        compliance_requirements: Some(vec![
            "Ensure timely dialogue with those charged with governance".to_string(),
        ]),
        documentation_required: Some(vec![
            "TCWG communication plan".to_string(),
            "Agendas".to_string(),
            "Timelines".to_string(),
        ]),
        evidence_types: Some(vec![
            "Communication plan documentation".to_string(),
            "Meeting schedules".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa260-2".to_string(),
        title: "Required communications".to_string(),
        description: "Deliver required communications (significant risks, materiality, uncorrected misstatements, independence)".to_string(),
        section: "Reporting".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 260".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Provide required matters before the report date".to_string(),
        ]),
        documentation_required: Some(vec![
            "Governance letter".to_string(),
            "Summary of uncorrected misstatements".to_string(),
            "Independence statement".to_string(),
        ]),
        evidence_types: Some(vec![
            "Signed communications".to_string(),
            "Meeting minutes".to_string(),
        ]),
    });
    order += 1;

    // ISA 265: Communicating Deficiencies in Internal Control
    items.push(ChecklistItem {
        id: "isa265-1".to_string(),
        title: "Evaluate deficiencies".to_string(),
        description: "Define criteria for significant deficiencies and aggregate control issues".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 265".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Evaluate and classify deficiencies for communication".to_string(),
        ]),
        documentation_required: Some(vec![
            "Deficiency matrix".to_string(),
            "Aggregation worksheet".to_string(),
        ]),
        evidence_types: Some(vec![
            "Deficiency evaluation documentation".to_string(),
            "Classification records".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa265-2".to_string(),
        title: "Communicate in writing".to_string(),
        description: "Communicate significant deficiencies in writing to governance and management".to_string(),
        section: "Reporting".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 265".to_string()),
        estimated_hours: Some(0.6),
        compliance_requirements: Some(vec![
            "Provide timely written communication".to_string(),
        ]),
        documentation_required: Some(vec![
            "Written communication".to_string(),
            "Management responses".to_string(),
        ]),
        evidence_types: Some(vec![
            "Signed communication to governance".to_string(),
            "Management acknowledgment".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa265-3".to_string(),
        title: "Remediation follow‑up".to_string(),
        description: "Track remediation plans and follow‑up actions to closure".to_string(),
        section: "Reporting".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 265".to_string()),
        estimated_hours: Some(0.6),
        compliance_requirements: Some(vec![
            "Monitor and encourage corrective actions".to_string(),
        ]),
        documentation_required: Some(vec![
            "Remediation tracker".to_string(),
            "Follow‑up notes".to_string(),
        ]),
        evidence_types: Some(vec![
            "Remediation tracking documentation".to_string(),
            "Follow-up records".to_string(),
        ]),
    });
    order += 1;

    // ISA 300: Planning an Audit of Financial Statements
    items.push(ChecklistItem {
        id: "isa300-1".to_string(),
        title: "Strategy and plan".to_string(),
        description: "Develop overall audit strategy and detailed plan linked to assessed risks".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 300".to_string()),
        estimated_hours: Some(1.2),
        compliance_requirements: Some(vec![
            "Plan nature, timing, extent of procedures commensurate with risk".to_string(),
        ]),
        documentation_required: Some(vec![
            "Strategy memo".to_string(),
            "Detailed plan".to_string(),
            "Timetable".to_string(),
        ]),
        evidence_types: Some(vec![
            "Audit strategy document".to_string(),
            "Detailed audit plan".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa300-2".to_string(),
        title: "Supervision in plan".to_string(),
        description: "Build direction, supervision, and review into the plan considering team experience/complexity".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 300".to_string()),
        estimated_hours: Some(0.7),
        compliance_requirements: Some(vec![
            "Ensure appropriate supervision and review".to_string(),
        ]),
        documentation_required: Some(vec![
            "Supervision plan".to_string(),
            "Review milestones".to_string(),
            "Staffing schedule".to_string(),
        ]),
        evidence_types: Some(vec![
            "Supervision documentation".to_string(),
            "Review schedule".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa300-3".to_string(),
        title: "Dynamic updates".to_string(),
        description: "Update strategy/plan when circumstances or risk assessments change".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 300".to_string()),
        estimated_hours: Some(0.6),
        compliance_requirements: Some(vec![
            "Revise approach promptly and document changes".to_string(),
        ]),
        documentation_required: Some(vec![
            "Planning updates log".to_string(),
            "Revised procedures".to_string(),
        ]),
        evidence_types: Some(vec![
            "Change documentation".to_string(),
            "Updated planning documents".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa300-4".to_string(),
        title: "Specialists/DA".to_string(),
        description: "Integrate specialists, component auditors, and data analytics where relevant".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 300".to_string()),
        estimated_hours: Some(0.8),
        compliance_requirements: Some(vec![
            "Coordinate resources to address risks efficiently".to_string(),
        ]),
        documentation_required: Some(vec![
            "Specialist engagement memo".to_string(),
            "Analytics plan".to_string(),
        ]),
        evidence_types: Some(vec![
            "Specialist engagement documentation".to_string(),
            "Analytics plan documentation".to_string(),
        ]),
    });
    order += 1;

    // ISA 315 (Revised 2019): Identifying and Assessing the Risks of Material Misstatement
    items.push(ChecklistItem {
        id: "isa315-1".to_string(),
        title: "Entity and environment".to_string(),
        description: "Understand the entity, industry, applicable framework, and business model".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 315 (Revised 2019)".to_string()),
        estimated_hours: Some(1.3),
        compliance_requirements: Some(vec![
            "Establish basis to identify/assess risks of material misstatement".to_string(),
        ]),
        documentation_required: Some(vec![
            "Understanding memo".to_string(),
            "External factors analysis".to_string(),
        ]),
        evidence_types: Some(vec![
            "Entity documentation".to_string(),
            "Industry research".to_string(),
            "Business model analysis".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa315-2".to_string(),
        title: "IT environment/ITGCs".to_string(),
        description: "Understand the IT landscape, relevant applications, data flows, and ITGCs".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 315 (Revised 2019)".to_string()),
        estimated_hours: Some(1.5),
        compliance_requirements: Some(vec![
            "Evaluate design and implementation of relevant controls".to_string(),
        ]),
        documentation_required: Some(vec![
            "IT walkthroughs".to_string(),
            "System maps".to_string(),
            "D&I conclusions".to_string(),
        ]),
        evidence_types: Some(vec![
            "IT documentation".to_string(),
            "Walkthrough notes".to_string(),
            "Control evaluation".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa315-3".to_string(),
        title: "Significant classes".to_string(),
        description: "Identify significant classes of transactions, account balances, and disclosures with assertions".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 315 (Revised 2019)".to_string()),
        estimated_hours: Some(1.0),
        compliance_requirements: Some(vec![
            "Focus risk assessment on significant areas".to_string(),
        ]),
        documentation_required: Some(vec![
            "Significant accounts map".to_string(),
            "Assertions matrix".to_string(),
        ]),
        evidence_types: Some(vec![
            "Significant accounts documentation".to_string(),
            "Assertions mapping".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa315-4".to_string(),
        title: "Inherent risk factors".to_string(),
        description: "Assess inherent risk using factors (complexity, subjectivity, change, uncertainty, susceptibility)".to_string(),
        section: "Planning".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 315 (Revised 2019)".to_string()),
        estimated_hours: Some(1.2),
        compliance_requirements: Some(vec![
            "Determine spectrum of inherent risk and significant risks".to_string(),
        ]),
        documentation_required: Some(vec![
            "RMM assessments".to_string(),
            "Significant risk rationale".to_string(),
        ]),
        evidence_types: Some(vec![
            "Risk assessment documentation".to_string(),
            "Inherent risk evaluation".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa315-5".to_string(),
        title: "Risk‑procedure linkage".to_string(),
        description: "Design further procedures that clearly respond to assessed risks".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 315 (Revised 2019)".to_string()),
        estimated_hours: Some(1.0),
        compliance_requirements: Some(vec![
            "Link procedures to risks with rationale".to_string(),
        ]),
        documentation_required: Some(vec![
            "Risk–procedure linkage matrix".to_string(),
            "Sampling plans".to_string(),
        ]),
        evidence_types: Some(vec![
            "Procedure design documentation".to_string(),
            "Risk-response mapping".to_string(),
        ]),
    });
    order += 1;

    items.push(ChecklistItem {
        id: "isa315-6".to_string(),
        title: "Reassess as you go".to_string(),
        description: "Update risk assessments based on evidence and unexpected results".to_string(),
        section: "Testing".to_string(),
        order,
        is_required: true,
        reference: Some("ISA 315 (Revised 2019)".to_string()),
        estimated_hours: Some(0.7),
        compliance_requirements: Some(vec![
            "Modify approach when new risks emerge".to_string(),
        ]),
        documentation_required: Some(vec![
            "Risk reassessment log".to_string(),
            "Modified procedures".to_string(),
        ]),
        evidence_types: Some(vec![
            "Risk update documentation".to_string(),
            "Procedure modifications".to_string(),
        ]),
    });
    order += 1;

    items
}

