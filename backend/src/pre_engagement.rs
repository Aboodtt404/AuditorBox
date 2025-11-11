use candid::{encode_args, Principal};
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{STORAGE};
use crate::types::{
    AcceptanceDecision, ClientAcceptance, ClientAcceptanceQuestionnaire, ConflictCheck,
    CreateClientAcceptanceRequest, CreateConflictCheckRequest, CreateEngagementLetterRequest,
    EngagementLetter, EngagementLetterStatus, EngagementType, Result, RiskLevel,
    SignEngagementLetterRequest,
};

thread_local! {
    static NEXT_ACCEPTANCE_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
    static NEXT_LETTER_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
    static NEXT_CONFLICT_CHECK_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(1);
}

fn next_acceptance_id() -> u64 {
    NEXT_ACCEPTANCE_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

fn next_letter_id() -> u64 {
    NEXT_LETTER_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

fn next_conflict_check_id() -> u64 {
    NEXT_CONFLICT_CHECK_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn create_client_acceptance(
    caller: Principal,
    req: CreateClientAcceptanceRequest,
) -> Result<ClientAcceptance> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_manager_or_above(&user) {
        return Err("Only managers and above can create client acceptances".to_string());
    }

    let _client = STORAGE
        .with(|storage| storage.borrow().clients.get(&req.client_id))
        .ok_or("Client not found")?;

    let overall_risk = calculate_overall_risk(&req.questionnaire);

    let decision = determine_acceptance_decision(&req.questionnaire, &overall_risk, &user);

    let acceptance = ClientAcceptance {
        id: next_acceptance_id(),
        client_id: req.client_id,
        questionnaire: req.questionnaire,
        overall_risk,
        decision: decision.clone(),
        decision_rationale: req.decision_rationale.clone(),
        reviewed_by: caller,
        reviewed_at: time(),
        partner_approved_by: if decision == AcceptanceDecision::Accepted {
            Some(caller)
        } else {
            None
        },
        partner_approved_at: if decision == AcceptanceDecision::Accepted {
            Some(time())
        } else {
            None
        },
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().client_acceptances.insert(acceptance.id, acceptance.clone());
    });

    let snapshot = encode_args((acceptance.clone(),)).ok();
    log_activity(
        caller,
        "create_client_acceptance".to_string(),
        "client_acceptance".to_string(),
        acceptance.id.to_string(),
        format!("Client acceptance created for client {}", acceptance.client_id),
        snapshot,
    );

    Ok(acceptance)
}

fn calculate_overall_risk(questionnaire: &ClientAcceptanceQuestionnaire) -> RiskLevel {
    let risks = vec![
        &questionnaire.management_integrity_risk,
        &questionnaire.financial_stability_risk,
        &questionnaire.industry_risk,
        &questionnaire.regulatory_complexity_risk,
        &questionnaire.fee_collection_risk,
    ];

    let high_risk_count = risks.iter().filter(|&&r| r == &RiskLevel::High || r == &RiskLevel::Unacceptable).count();
    let medium_risk_count = risks.iter().filter(|&&r| r == &RiskLevel::Medium).count();

    if risks.iter().any(|&r| r == &RiskLevel::Unacceptable) {
        RiskLevel::Unacceptable
    } else if high_risk_count >= 3 {
        RiskLevel::High
    } else if high_risk_count >= 1 || medium_risk_count >= 3 {
        RiskLevel::Medium
    } else {
        RiskLevel::Low
    }
}

fn determine_acceptance_decision(
    questionnaire: &ClientAcceptanceQuestionnaire,
    overall_risk: &RiskLevel,
    user: &crate::types::User,
) -> AcceptanceDecision {
    if questionnaire.conflicts_of_interest {
        return AcceptanceDecision::Rejected;
    }

    if questionnaire.independence_threats && overall_risk != &RiskLevel::Low {
        return AcceptanceDecision::Rejected;
    }

    if !questionnaire.resources_available || !questionnaire.technical_expertise_available {
        return AcceptanceDecision::RequiresPartnerReview;
    }

    match overall_risk {
        RiskLevel::Unacceptable => AcceptanceDecision::Rejected,
        RiskLevel::High => {
            if auth::is_partner(&user) {
                AcceptanceDecision::Accepted
            } else {
                AcceptanceDecision::RequiresPartnerReview
            }
        }
        RiskLevel::Medium | RiskLevel::Low => AcceptanceDecision::Accepted,
    }
}

pub fn approve_client_acceptance(caller: Principal, acceptance_id: u64) -> Result<ClientAcceptance> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_partner(&user) {
        return Err("Only partners can approve client acceptances".to_string());
    }

    let mut acceptance = get_client_acceptance_by_id(acceptance_id)?;

    if acceptance.decision != AcceptanceDecision::RequiresPartnerReview
        && acceptance.decision != AcceptanceDecision::Pending
    {
        return Err("Acceptance is not pending partner review".to_string());
    }

    acceptance.decision = AcceptanceDecision::Accepted;
    acceptance.partner_approved_by = Some(caller);
    acceptance.partner_approved_at = Some(time());

    STORAGE.with(|storage| {
        storage.borrow_mut().client_acceptances.insert(acceptance.id, acceptance.clone());
    });

    let snapshot = encode_args((acceptance.clone(),)).ok();
    log_activity(
        caller,
        "approve_client_acceptance".to_string(),
        "client_acceptance".to_string(),
        acceptance.id.to_string(),
        format!("Client acceptance {} approved", acceptance.id),
        snapshot,
    );

    Ok(acceptance)
}

fn get_client_acceptance_by_id(id: u64) -> Result<ClientAcceptance> {
    STORAGE
        .with(|storage| storage.borrow().client_acceptances.get(&id))
        .ok_or_else(|| format!("Client acceptance {} not found", id))
}

pub fn create_engagement_letter(
    caller: Principal,
    req: CreateEngagementLetterRequest,
) -> Result<EngagementLetter> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_manager_or_above(&user) {
        return Err("Only managers and above can create engagement letters".to_string());
    }

    let _client = STORAGE
        .with(|storage| storage.borrow().clients.get(&req.client_id))
        .ok_or("Client not found")?;

    let (mgmt_resp, auditor_resp, limitations) = get_standard_terms(&req.engagement_type);

    let letter = EngagementLetter {
        id: next_letter_id(),
        engagement_id: None,
        client_id: req.client_id,
        engagement_type: req.engagement_type.clone(),
        scope_of_services: req.scope_of_services,
        management_responsibilities: mgmt_resp,
        auditor_responsibilities: auditor_resp,
        limitations_of_engagement: limitations,
        fee_structure: req.fee_structure,
        estimated_completion_date: req.estimated_completion_date,
        special_terms: req.special_terms.unwrap_or_default(),
        status: EngagementLetterStatus::Draft,
        sent_date: None,
        signed_date: None,
        signed_by_client_name: None,
        created_at: time(),
        created_by: caller,
        last_modified_at: time(),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_letters.insert(letter.id, letter.clone());
    });

    let snapshot = encode_args((letter.clone(),)).ok();
    log_activity(
        caller,
        "create_engagement_letter".to_string(),
        "engagement_letter".to_string(),
        letter.id.to_string(),
        format!("Engagement letter {} created", letter.id),
        snapshot,
    );

    Ok(letter)
}

fn get_standard_terms(engagement_type: &EngagementType) -> (String, String, String) {
    match engagement_type {
        EngagementType::Audit => (
            "Management is responsible for: (1) the preparation and fair presentation of the financial statements, (2) establishing and maintaining effective internal control over financial reporting, (3) providing us with access to all information relevant to the audit.".to_string(),
            "Our responsibility is to express an opinion on these financial statements based on our audit conducted in accordance with auditing standards generally accepted in the United States of America.".to_string(),
            "Because of the inherent limitations of an audit, together with the inherent limitations of internal control, an unavoidable risk exists that some material misstatements may not be detected, even though the audit is properly planned and performed.".to_string(),
        ),
        EngagementType::Review => (
            "Management is responsible for the preparation and fair presentation of the financial statements and providing us with all information relevant to the review.".to_string(),
            "Our responsibility is to conduct a review in accordance with Statements on Standards for Accounting and Review Services issued by the AICPA. We will issue a review report providing limited assurance.".to_string(),
            "A review is substantially less in scope than an audit and does not provide a basis for expressing an opinion on the financial statements as a whole.".to_string(),
        ),
        EngagementType::Compilation => (
            "Management is responsible for the preparation and fair presentation of the financial statements.".to_string(),
            "Our responsibility is to compile the financial statements in accordance with Statements on Standards for Accounting and Review Services issued by the AICPA. We will not audit or review the financial statements.".to_string(),
            "A compilation is limited to presenting information that is the representation of management. We will not express an opinion or provide any form of assurance on the financial statements.".to_string(),
        ),
        _ => (
            "Management is responsible for providing all necessary information for this engagement.".to_string(),
            "Our responsibility is to perform the agreed-upon services in accordance with professional standards.".to_string(),
            "The scope and limitations of this engagement are as described in this letter.".to_string(),
        ),
    }
}

pub fn send_engagement_letter(caller: Principal, letter_id: u64) -> Result<EngagementLetter> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_manager_or_above(&user) {
        return Err("Only managers and above can send engagement letters".to_string());
    }

    let mut letter = get_engagement_letter_by_id(letter_id)?;

    if letter.status != EngagementLetterStatus::Draft {
        return Err("Only draft letters can be sent".to_string());
    }

    letter.status = EngagementLetterStatus::SentToClient;
    letter.sent_date = Some(time());
    letter.last_modified_at = time();

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_letters.insert(letter.id, letter.clone());
    });

    let snapshot = encode_args((letter.clone(),)).ok();
    log_activity(
        caller,
        "send_engagement_letter".to_string(),
        "engagement_letter".to_string(),
        letter.id.to_string(),
        format!("Engagement letter {} sent", letter.id),
        snapshot,
    );

    Ok(letter)
}

pub fn sign_engagement_letter(
    caller: Principal,
    req: SignEngagementLetterRequest,
) -> Result<EngagementLetter> {
    let mut letter = get_engagement_letter_by_id(req.letter_id)?;

    if letter.status != EngagementLetterStatus::SentToClient {
        return Err("Letter must be sent before it can be signed".to_string());
    }

    letter.status = EngagementLetterStatus::Signed;
    letter.signed_date = Some(time());
    letter.signed_by_client_name = Some(req.client_name.clone());
    letter.last_modified_at = time();

    STORAGE.with(|storage| {
        storage.borrow_mut().engagement_letters.insert(letter.id, letter.clone());
    });

    let snapshot = encode_args((letter.clone(),)).ok();
    log_activity(
        caller,
        "sign_engagement_letter".to_string(),
        "engagement_letter".to_string(),
        letter.id.to_string(),
        format!("Engagement letter {} signed", letter.id),
        snapshot,
    );

    Ok(letter)
}

fn get_engagement_letter_by_id(id: u64) -> Result<EngagementLetter> {
    STORAGE
        .with(|storage| storage.borrow().engagement_letters.get(&id))
        .ok_or_else(|| format!("Engagement letter {} not found", id))
}

pub fn create_conflict_check(
    caller: Principal,
    req: CreateConflictCheckRequest,
) -> Result<ConflictCheck> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to create conflict checks".to_string());
    }

    let _client = STORAGE
        .with(|storage| storage.borrow().clients.get(&req.client_id))
        .ok_or("Client not found")?;

    let has_conflicts = !req.potential_conflicts.is_empty();
    
    let conflict_check = ConflictCheck {
        id: next_conflict_check_id(),
        client_id: req.client_id,
        related_parties: req.related_parties.clone(),
        conflicts_found: has_conflicts,
        conflict_details: req.potential_conflicts.clone(),
        resolution_notes: req.resolution_notes.clone(),
        cleared: !has_conflicts,
        cleared_by: if !has_conflicts { Some(caller) } else { None },
        cleared_at: if !has_conflicts { Some(time()) } else { None },
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().conflict_checks.insert(conflict_check.id, conflict_check.clone());
    });

    let snapshot = encode_args((conflict_check.clone(),)).ok();
    log_activity(
        caller,
        "create_conflict_check".to_string(),
        "conflict_check".to_string(),
        conflict_check.id.to_string(),
        format!("Conflict check {} created", conflict_check.id),
        snapshot,
    );

    Ok(conflict_check)
}

pub fn list_client_acceptances_by_client(
    caller: Principal,
    client_id: u64,
) -> Result<Vec<ClientAcceptance>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;
    
    let acceptances = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .client_acceptances
            .iter()
            .filter(|(_, acceptance)| acceptance.client_id == client_id)
            .map(|(_, acceptance)| acceptance.clone())
            .collect::<Vec<ClientAcceptance>>()
    });
    
    Ok(acceptances)
}

pub fn list_engagement_letters_by_client(
    caller: Principal,
    client_id: u64,
) -> Result<Vec<EngagementLetter>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;
    
    let letters = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .engagement_letters
            .iter()
            .filter(|(_, letter)| letter.client_id == client_id)
            .map(|(_, letter)| letter.clone())
            .collect::<Vec<EngagementLetter>>()
    });
    
    Ok(letters)
}

pub fn list_conflict_checks_by_client(
    caller: Principal,
    client_id: u64,
) -> Result<Vec<ConflictCheck>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;
    
    let checks = STORAGE.with(|storage| {
        let storage = storage.borrow();
        storage
            .conflict_checks
            .iter()
            .filter(|(_, check)| check.client_id == client_id)
            .map(|(_, check)| check.clone())
            .collect::<Vec<ConflictCheck>>()
    });
    
    Ok(checks)
}

