use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    storable::Bound,
    DefaultMemoryImpl, StableBTreeMap, Storable,
};
use std::borrow::Cow;
use std::cell::RefCell;
use candid::{Principal, Encode, Decode};

use crate::types::*;

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

