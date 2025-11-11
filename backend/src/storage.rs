use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    storable::Bound,
    DefaultMemoryImpl, StableBTreeMap, Storable,
};
use std::borrow::Cow;
use std::cell::RefCell;
use candid::{Principal, Encode, Decode};

use crate::types::*;
use crate::client_portal::{DocumentRequest, ClientAccess};
use crate::templates::{AuditTemplate, EngagementChecklist};

type Memory = VirtualMemory<DefaultMemoryImpl>;

// Newtype wrapper for Principal to implement Storable
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct StorablePrincipal(pub Principal);

impl Storable for StorablePrincipal {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(self.0.as_slice().to_vec())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        StorablePrincipal(Principal::from_slice(bytes.as_ref()))
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 29,
        is_fixed_size: false,
    };
}

// Storable implementations for our types
impl Storable for User {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for Organization {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for Entity {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for Client {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for Engagement {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for ImportedDataset {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for WorkingPaper {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for Document {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for ActivityLogEntry {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for DocumentRequest {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for ClientAccess {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for AuditTemplate {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for EngagementChecklist {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Trial Balance
impl Storable for TrialBalance {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for TrialBalanceAccount {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Adjusting Journal Entries
impl Storable for AdjustingJournalEntry {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for AjeLineItem {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for FinancialStatement {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for ClientAcceptance {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for EngagementLetter {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for ConflictCheck {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for EngagementSetupTemplate {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for EngagementMilestone {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for EngagementBudget {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

impl Storable for TimeEntry {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Storable for String keys
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct StorableString(pub String);

impl Storable for StorableString {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(self.0.as_bytes().to_vec())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        StorableString(String::from_utf8(bytes.to_vec()).unwrap())
    }

    const BOUND: Bound = Bound::Unbounded;
}

// Storage structure
pub struct Storage {
    pub users: StableBTreeMap<StorablePrincipal, User, Memory>,
    pub organizations: StableBTreeMap<u64, Organization, Memory>,
    pub entities: StableBTreeMap<u64, Entity, Memory>,
    pub clients: StableBTreeMap<u64, Client, Memory>,
    pub engagements: StableBTreeMap<u64, Engagement, Memory>,
    pub datasets: StableBTreeMap<u64, ImportedDataset, Memory>,
    pub working_papers: StableBTreeMap<u64, WorkingPaper, Memory>,
    pub documents: StableBTreeMap<u64, Document, Memory>,
    pub activity_logs: StableBTreeMap<u64, ActivityLogEntry, Memory>,
    pub client_portal_requests: StableBTreeMap<u64, DocumentRequest, Memory>,
    pub client_access: StableBTreeMap<StorableString, ClientAccess, Memory>,
    pub audit_templates: StableBTreeMap<u64, AuditTemplate, Memory>,
    pub engagement_checklists: StableBTreeMap<u64, EngagementChecklist, Memory>,
    pub trial_balances: StableBTreeMap<u64, TrialBalance, Memory>,
    pub trial_balance_accounts: StableBTreeMap<u64, TrialBalanceAccount, Memory>,
    pub adjusting_entries: StableBTreeMap<u64, AdjustingJournalEntry, Memory>,
    pub aje_line_items: StableBTreeMap<u64, AjeLineItem, Memory>,
    pub financial_statements: StableBTreeMap<u64, FinancialStatement, Memory>,
    pub client_acceptances: StableBTreeMap<u64, ClientAcceptance, Memory>,
    pub engagement_letters: StableBTreeMap<u64, EngagementLetter, Memory>,
    pub conflict_checks: StableBTreeMap<u64, ConflictCheck, Memory>,
    pub engagement_templates: StableBTreeMap<u64, EngagementSetupTemplate, Memory>,
    pub engagement_milestones: StableBTreeMap<u64, EngagementMilestone, Memory>,
    pub engagement_budgets: StableBTreeMap<u64, EngagementBudget, Memory>,
    pub time_entries: StableBTreeMap<u64, TimeEntry, Memory>,
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    pub static STORAGE: RefCell<Storage> = RefCell::new(
        MEMORY_MANAGER.with(|m| {
            let m = m.borrow();
            Storage {
                users: StableBTreeMap::init(m.get(MemoryId::new(0))),
                organizations: StableBTreeMap::init(m.get(MemoryId::new(1))),
                entities: StableBTreeMap::init(m.get(MemoryId::new(2))),
                clients: StableBTreeMap::init(m.get(MemoryId::new(3))),
                engagements: StableBTreeMap::init(m.get(MemoryId::new(4))),
                datasets: StableBTreeMap::init(m.get(MemoryId::new(5))),
                working_papers: StableBTreeMap::init(m.get(MemoryId::new(6))),
                documents: StableBTreeMap::init(m.get(MemoryId::new(7))),
                activity_logs: StableBTreeMap::init(m.get(MemoryId::new(8))),
                client_portal_requests: StableBTreeMap::init(m.get(MemoryId::new(9))),
                client_access: StableBTreeMap::init(m.get(MemoryId::new(10))),
                audit_templates: StableBTreeMap::init(m.get(MemoryId::new(11))),
                engagement_checklists: StableBTreeMap::init(m.get(MemoryId::new(12))),
                trial_balances: StableBTreeMap::init(m.get(MemoryId::new(13))),
                trial_balance_accounts: StableBTreeMap::init(m.get(MemoryId::new(14))),
                adjusting_entries: StableBTreeMap::init(m.get(MemoryId::new(15))),
                aje_line_items: StableBTreeMap::init(m.get(MemoryId::new(16))),
                financial_statements: StableBTreeMap::init(m.get(MemoryId::new(17))),
                client_acceptances: StableBTreeMap::init(m.get(MemoryId::new(18))),
                engagement_letters: StableBTreeMap::init(m.get(MemoryId::new(19))),
                conflict_checks: StableBTreeMap::init(m.get(MemoryId::new(20))),
                engagement_templates: StableBTreeMap::init(m.get(MemoryId::new(21))),
                engagement_milestones: StableBTreeMap::init(m.get(MemoryId::new(22))),
                engagement_budgets: StableBTreeMap::init(m.get(MemoryId::new(23))),
                time_entries: StableBTreeMap::init(m.get(MemoryId::new(24))),
            }
        })
    );

    // ID counters
    pub static NEXT_ORG_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_ENTITY_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_CLIENT_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_ENGAGEMENT_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_DATASET_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_WORKING_PAPER_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_DOCUMENT_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_ACTIVITY_LOG_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_TRIAL_BALANCE_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_ACCOUNT_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_AJE_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_AJE_LINE_ITEM_ID: RefCell<u64> = RefCell::new(1);
    pub static NEXT_FS_ID: RefCell<u64> = RefCell::new(1);
}

// Helper functions for ID generation
pub fn next_org_id() -> u64 {
    NEXT_ORG_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_entity_id() -> u64 {
    NEXT_ENTITY_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_client_id() -> u64 {
    NEXT_CLIENT_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_engagement_id() -> u64 {
    NEXT_ENGAGEMENT_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_dataset_id() -> u64 {
    NEXT_DATASET_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_working_paper_id() -> u64 {
    NEXT_WORKING_PAPER_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_document_id() -> u64 {
    NEXT_DOCUMENT_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_activity_log_id() -> u64 {
    NEXT_ACTIVITY_LOG_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_trial_balance_id() -> u64 {
    NEXT_TRIAL_BALANCE_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_account_id() -> u64 {
    NEXT_ACCOUNT_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_aje_id() -> u64 {
    NEXT_AJE_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_aje_line_item_id() -> u64 {
    NEXT_AJE_LINE_ITEM_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

pub fn next_fs_id() -> u64 {
    NEXT_FS_ID.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    })
}

