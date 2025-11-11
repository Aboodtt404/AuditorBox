use candid::{encode_args, Principal};
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::STORAGE;
use crate::types::{
    CreateBudgetRequest, CreateEngagementFromTemplateRequest, CreateEngagementSetupTemplateRequest,
    CreateMilestoneRequest, CreateTimeEntryRequest, Engagement, EngagementBudget,
    EngagementDashboard, EngagementMilestone, EngagementSetupTemplate,
    EngagementType, MilestoneStatus, MilestoneTemplate, Result, TimeEntry, UpdateMilestoneRequest,
};

thread_local! {
    static NEXT_TEMPLATE_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
    static NEXT_MILESTONE_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
    static NEXT_BUDGET_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
    static NEXT_TIME_ENTRY_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
}

fn next_template_id() -> u64 {
    NEXT_TEMPLATE_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

fn next_milestone_id() -> u64 {
    NEXT_MILESTONE_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

fn next_budget_id() -> u64 {
    NEXT_BUDGET_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

fn next_time_entry_id() -> u64 {
    NEXT_TIME_ENTRY_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn create_engagement_setup_template(
    caller: Principal,
    req: CreateEngagementSetupTemplateRequest,
) -> Result<EngagementSetupTemplate> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_manager_or_above(&user) {
        return Err("Only managers and above can create engagement templates".to_string());
    }

    let template = EngagementSetupTemplate {
        id: next_template_id(),
        name: req.name,
        engagement_type: req.engagement_type.clone(),
        description: req.description,
        default_procedures: req.default_procedures,
        required_documents: req.required_documents,
        default_milestones: req.default_milestones,
        estimated_hours: req.estimated_hours,
        is_default: false,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_templates.insert(template.id, template.clone());
    });

    let snapshot = encode_args((template.clone(),)).ok();
    log_activity(
        caller,
        "create_engagement_setup_template".to_string(),
        "engagement_template".to_string(),
        template.id.to_string(),
        format!("Engagement template {} created", template.id),
        snapshot,
    );

    Ok(template)
}

pub fn create_engagement_from_template(
    caller: Principal,
    req: CreateEngagementFromTemplateRequest,
) -> Result<(Engagement, Vec<EngagementMilestone>)> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_engagement(&user) {
        return Err("Insufficient permissions to create engagement".to_string());
    }

    let template = get_template_by_id(req.template_id)?;

    let engagement = Engagement {
        id: crate::storage::next_engagement_id(),
        name: req.name.clone(),
        description: req.description,
        link: req.link,
        start_date: req.start_date,
        end_date: req.end_date,
        status: "Planning".to_string(),
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagements
            .insert(engagement.id, engagement.clone());
    });

    let mut milestones = Vec::new();
    for milestone_template in template.default_milestones.iter() {
        let due_date = req.start_date + (milestone_template.days_from_start * 86400);
        
        let milestone = EngagementMilestone {
            id: next_milestone_id(),
            engagement_id: engagement.id,
            name: milestone_template.name.clone(),
            description: milestone_template.description.clone(),
            due_date,
            status: MilestoneStatus::NotStarted,
            assigned_to: None,
            estimated_hours: milestone_template.estimated_hours,
            actual_hours: 0.0,
            completed_date: None,
            completed_by: None,
            dependencies: Vec::new(),
            created_at: time(),
            created_by: caller,
        };

        STORAGE.with(|storage| {
            storage.borrow_mut().engagement_milestones.insert(milestone.id, milestone.clone());
        });

        milestones.push(milestone);
    }

    if let Some(py_engagement_id) = req.prior_year_engagement_id {
        copy_prior_year_data(engagement.id, py_engagement_id)?;
    }

    let snapshot = encode_args((milestones.clone(),)).ok();
    log_activity(
        caller,
        "create_engagement_from_template".to_string(),
        "engagement".to_string(),
        engagement.id.to_string(),
        format!(
            "Engagement {} created from template {} with {} milestones",
            engagement.id,
            template.id,
            milestones.len()
        ),
        snapshot,
    );

    Ok((engagement, milestones))
}

fn copy_prior_year_data(new_engagement_id: u64, prior_year_id: u64) -> Result<()> {
    let _py_engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&prior_year_id))
        .ok_or("Prior year engagement not found")?;

    Ok(())
}

fn get_template_by_id(id: u64) -> Result<EngagementSetupTemplate> {
    STORAGE
        .with(|storage| storage.borrow().engagement_templates.get(&id))
        .ok_or_else(|| format!("Template {} not found", id))
}

pub fn create_milestone(
    caller: Principal,
    req: CreateMilestoneRequest,
) -> Result<EngagementMilestone> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to create milestones".to_string());
    }

    let _engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.engagement_id))
        .ok_or("Engagement not found")?;

    let milestone = EngagementMilestone {
        id: next_milestone_id(),
        engagement_id: req.engagement_id,
        name: req.name.clone(),
        description: req.description,
        due_date: req.due_date,
        status: MilestoneStatus::NotStarted,
        assigned_to: req.assigned_to,
        estimated_hours: req.estimated_hours,
        actual_hours: 0.0,
        completed_date: None,
        completed_by: None,
        dependencies: Vec::new(),
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_milestones.insert(milestone.id, milestone.clone());
    });

    let snapshot = encode_args((milestone.clone(),)).ok();
    log_activity(
        caller,
        "create_milestone".to_string(),
        "engagement_milestone".to_string(),
        milestone.id.to_string(),
        format!("Milestone {} created for engagement {}", milestone.id, milestone.engagement_id),
        snapshot,
    );

    Ok(milestone)
}

pub fn update_milestone(
    caller: Principal,
    req: UpdateMilestoneRequest,
) -> Result<EngagementMilestone> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to update milestones".to_string());
    }

    let mut milestone = get_milestone_by_id(req.milestone_id)?;

    if let Some(status) = req.status {
        milestone.status = status.clone();
        if status == MilestoneStatus::Completed {
            milestone.completed_date = Some(time());
            milestone.completed_by = Some(caller);
        }
    }

    if let Some(actual_hours) = req.actual_hours {
        milestone.actual_hours = actual_hours;
    }

    if let Some(assigned_to) = req.assigned_to {
        milestone.assigned_to = Some(assigned_to);
    }

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_milestones.insert(milestone.id, milestone.clone());
    });

    let snapshot = encode_args((milestone.clone(),)).ok();
    log_activity(
        caller,
        "update_milestone".to_string(),
        "engagement_milestone".to_string(),
        milestone.id.to_string(),
        format!("Milestone {} updated", milestone.id),
        snapshot,
    );

    Ok(milestone)
}

fn get_milestone_by_id(id: u64) -> Result<EngagementMilestone> {
    STORAGE
        .with(|storage| storage.borrow().engagement_milestones.get(&id))
        .ok_or_else(|| format!("Milestone {} not found", id))
}

pub fn create_budget(
    caller: Principal,
    req: CreateBudgetRequest,
) -> Result<EngagementBudget> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_manager_or_above(&user) {
        return Err("Only managers and above can create budgets".to_string());
    }

    let _engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.engagement_id))
        .ok_or("Engagement not found")?;

    let total_budgeted_fee = (req.partner_hours * req.partner_rate)
        + (req.manager_hours * req.manager_rate)
        + (req.senior_hours * req.senior_rate)
        + (req.staff_hours * req.staff_rate);

    let budget = EngagementBudget {
        id: next_budget_id(),
        engagement_id: req.engagement_id,
        total_budgeted_hours: req.total_budgeted_hours,
        total_actual_hours: 0.0,
        partner_hours: req.partner_hours,
        manager_hours: req.manager_hours,
        senior_hours: req.senior_hours,
        staff_hours: req.staff_hours,
        partner_rate: req.partner_rate,
        manager_rate: req.manager_rate,
        senior_rate: req.senior_rate,
        staff_rate: req.staff_rate,
        total_budgeted_fee,
        total_actual_fee: 0.0,
        created_at: time(),
        created_by: caller,
        last_updated_at: time(),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_budgets.insert(budget.id, budget.clone());
    });

    let snapshot = encode_args((budget.clone(),)).ok();
    log_activity(
        caller,
        "create_budget".to_string(),
        "engagement_budget".to_string(),
        budget.id.to_string(),
        format!("Budget {} created for engagement {}", budget.id, budget.engagement_id),
        snapshot,
    );

    Ok(budget)
}

pub fn create_time_entry(
    caller: Principal,
    req: CreateTimeEntryRequest,
) -> Result<TimeEntry> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to create time entries".to_string());
    }

    let _engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.engagement_id))
        .ok_or("Engagement not found")?;

    let time_entry = TimeEntry {
        id: next_time_entry_id(),
        engagement_id: req.engagement_id,
        milestone_id: req.milestone_id,
        user: caller,
        date: req.date,
        hours: req.hours,
        description: req.description.clone(),
        billable: req.billable,
        created_at: time(),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().time_entries.insert(time_entry.id, time_entry.clone());
    });

    let snapshot = encode_args((time_entry.clone(),)).ok();
    log_activity(
        caller,
        "create_time_entry".to_string(),
        "time_entry".to_string(),
        time_entry.id.to_string(),
        format!("Time entry {} logged for engagement {}", time_entry.id, time_entry.engagement_id),
        snapshot,
    );

    Ok(time_entry)
}

pub fn get_engagement_dashboard(
    caller: Principal,
    engagement_id: u64,
) -> Result<EngagementDashboard> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&engagement_id))
        .ok_or("Engagement not found")?;

    let milestones: Vec<EngagementMilestone> = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .engagement_milestones
            .iter()
            .filter(|(_, m)| m.engagement_id == engagement_id)
            .map(|(_, m)| m.clone())
            .collect()
    });

    let time_entries: Vec<TimeEntry> = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .time_entries
            .iter()
            .filter(|(_, te)| te.engagement_id == engagement_id)
            .map(|(_, te)| te.clone())
            .collect()
    });

    let completed_milestones = milestones
        .iter()
        .filter(|m| m.status == MilestoneStatus::Completed)
        .count();
    let completion_percentage = if !milestones.is_empty() {
        (completed_milestones as f64 / milestones.len() as f64) * 100.0
    } else {
        0.0
    };

    let budget = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .engagement_budgets
            .iter()
            .find(|(_, b)| b.engagement_id == engagement_id)
            .map(|(_, b)| b.clone())
    });

    let total_actual_hours: f64 = time_entries.iter().map(|te| te.hours).sum();
    let budget_utilization = if let Some(ref b) = budget {
        if b.total_budgeted_hours > 0.0 {
            (total_actual_hours / b.total_budgeted_hours) * 100.0
        } else {
            0.0
        }
    } else {
        0.0
    };

    let now = time();
    let at_risk_milestones: Vec<EngagementMilestone> = milestones
        .iter()
        .filter(|m| {
            m.status != MilestoneStatus::Completed
                && m.due_date < now
                && m.status != MilestoneStatus::Cancelled
        })
        .cloned()
        .collect();

    let on_schedule = at_risk_milestones.is_empty();

    let dashboard = EngagementDashboard {
        engagement,
        budget,
        milestones,
        completion_percentage,
        budget_utilization,
        on_schedule,
        at_risk_milestones,
        recent_time_entries: time_entries.into_iter().take(10).collect(),
    };

    Ok(dashboard)
}

pub fn list_engagement_templates(caller: Principal) -> Result<Vec<EngagementSetupTemplate>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;
    
    let templates = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .engagement_templates
            .iter()
            .map(|(_, template)| template.clone())
            .collect::<Vec<EngagementSetupTemplate>>()
    });
    
    Ok(templates)
}

pub fn list_milestones_by_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<EngagementMilestone>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;
    let _ = STORAGE
        .with(|storage| storage.borrow().engagements.get(&engagement_id))
        .ok_or("Engagement not found")?;
    
    let milestones = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .engagement_milestones
            .iter()
            .filter(|(_, m)| m.engagement_id == engagement_id)
            .map(|(_, m)| m.clone())
            .collect::<Vec<EngagementMilestone>>()
    });
    
    Ok(milestones)
}

pub fn list_time_entries_by_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<TimeEntry>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;
    
    let time_entries = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .time_entries
            .iter()
            .filter(|(_, te)| te.engagement_id == engagement_id)
            .map(|(_, te)| te.clone())
            .collect::<Vec<TimeEntry>>()
    });
    
    Ok(time_entries)
}

pub fn initialize_default_engagement_templates() {
    let default_templates = get_default_templates();
    for _ in default_templates {
    }
}

fn get_default_templates() -> Vec<EngagementSetupTemplate> {
    let audit_milestones = vec![
        MilestoneTemplate {
            name: "Client Acceptance & Continuance".to_string(),
            description: "Complete client acceptance procedures".to_string(),
            days_from_start: 0,
            estimated_hours: 4.0,
        },
        MilestoneTemplate {
            name: "Engagement Letter Signed".to_string(),
            description: "Obtain signed engagement letter".to_string(),
            days_from_start: 3,
            estimated_hours: 2.0,
        },
        MilestoneTemplate {
            name: "Planning & Risk Assessment".to_string(),
            description: "Understand entity, assess risks, determine materiality".to_string(),
            days_from_start: 7,
            estimated_hours: 16.0,
        },
        MilestoneTemplate {
            name: "Trial Balance Obtained".to_string(),
            description: "Import and review trial balance".to_string(),
            days_from_start: 14,
            estimated_hours: 4.0,
        },
        MilestoneTemplate {
            name: "Substantive Testing".to_string(),
            description: "Perform substantive audit procedures".to_string(),
            days_from_start: 21,
            estimated_hours: 40.0,
        },
        MilestoneTemplate {
            name: "Adjusting Entries Proposed".to_string(),
            description: "Prepare and review adjusting journal entries".to_string(),
            days_from_start: 42,
            estimated_hours: 8.0,
        },
        MilestoneTemplate {
            name: "Financial Statements Drafted".to_string(),
            description: "Generate financial statements and notes".to_string(),
            days_from_start: 49,
            estimated_hours: 12.0,
        },
        MilestoneTemplate {
            name: "Manager Review".to_string(),
            description: "Manager review of workpapers and statements".to_string(),
            days_from_start: 56,
            estimated_hours: 8.0,
        },
        MilestoneTemplate {
            name: "Partner Review & Approval".to_string(),
            description: "Partner final review and sign-off".to_string(),
            days_from_start: 60,
            estimated_hours: 6.0,
        },
        MilestoneTemplate {
            name: "Report Issuance".to_string(),
            description: "Issue audit report to client".to_string(),
            days_from_start: 63,
            estimated_hours: 2.0,
        },
    ];

    vec![
        EngagementSetupTemplate {
            id: 1,
            name: "Standard Audit Engagement".to_string(),
            engagement_type: EngagementType::Audit,
            description: "Full financial statement audit per GAAS".to_string(),
            default_procedures: vec![
                "Risk Assessment Procedures".to_string(),
                "Tests of Controls".to_string(),
                "Substantive Analytical Procedures".to_string(),
                "Tests of Details".to_string(),
            ],
            required_documents: vec![
                "Prior Year Financial Statements".to_string(),
                "Trial Balance".to_string(),
                "Bank Statements".to_string(),
                "Board Minutes".to_string(),
            ],
            default_milestones: audit_milestones,
            estimated_hours: 100.0,
            is_default: true,
            created_at: time(),
            created_by: Principal::anonymous(),
        },
    ]
}

