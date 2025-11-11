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
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .audit_templates
            .insert(basic_audit.id, basic_audit);
    });
}

