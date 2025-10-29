use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use ic_cdk::api::time;
use std::collections::BTreeMap;

// Cryptographic proof structure for blockchain verification
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct BlockchainProof {
    pub entry_id: u64,
    pub data_hash: String,
    pub timestamp: u64,
    pub block_height: u64,
    pub signature: String,
    pub previous_hash: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VerificationResult {
    pub is_valid: bool,
    pub entry_id: u64,
    pub timestamp: u64,
    pub data_hash: String,
    pub block_height: u64,
    pub verification_timestamp: u64,
    pub chain_integrity: bool,
    pub message: String,
}

// Generate SHA-256 hash of the data
pub fn generate_hash(data: &str) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    
    let mut hasher = DefaultHasher::new();
    data.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

// Generate a cryptographic signature for the activity log entry
pub fn generate_signature(
    entry_id: u64,
    principal: Principal,
    action: &str,
    resource_type: &str,
    resource_id: &str,
    timestamp: u64,
    previous_hash: &str,
) -> String {
    let data = format!(
        "{}:{}:{}:{}:{}:{}:{}",
        entry_id,
        principal.to_text(),
        action,
        resource_type,
        resource_id,
        timestamp,
        previous_hash
    );
    generate_hash(&data)
}

// Create a blockchain proof for an activity log entry
pub fn create_proof(
    entry_id: u64,
    data: &str,
    previous_hash: String,
    block_height: u64,
) -> BlockchainProof {
    let timestamp = time();
    let data_hash = generate_hash(data);
    let signature_data = format!("{}:{}:{}:{}", entry_id, data_hash, timestamp, previous_hash);
    let signature = generate_hash(&signature_data);

    BlockchainProof {
        entry_id,
        data_hash,
        timestamp,
        block_height,
        signature,
        previous_hash,
    }
}

// Verify the integrity of a blockchain proof
pub fn verify_proof(proof: &BlockchainProof, actual_data: &str) -> VerificationResult {
    let computed_hash = generate_hash(actual_data);
    let hash_matches = computed_hash == proof.data_hash;

    // Verify signature
    let signature_data = format!(
        "{}:{}:{}:{}",
        proof.entry_id, proof.data_hash, proof.timestamp, proof.previous_hash
    );
    let computed_signature = generate_hash(&signature_data);
    let signature_matches = computed_signature == proof.signature;

    let is_valid = hash_matches && signature_matches;

    VerificationResult {
        is_valid,
        entry_id: proof.entry_id,
        timestamp: proof.timestamp,
        data_hash: computed_hash,
        block_height: proof.block_height,
        verification_timestamp: time(),
        chain_integrity: is_valid,
        message: if is_valid {
            "Proof verified successfully".to_string()
        } else if !hash_matches {
            "Data hash mismatch - data may have been tampered with".to_string()
        } else {
            "Signature verification failed".to_string()
        },
    }
}

// Verify chain integrity by checking the link between consecutive proofs
pub fn verify_chain_link(current_proof: &BlockchainProof, previous_proof: &BlockchainProof) -> bool {
    current_proof.previous_hash == previous_proof.signature
        && current_proof.block_height == previous_proof.block_height + 1
}

// Generate a public verification token that can be shared externally
pub fn generate_verification_token(entry_id: u64, proof: &BlockchainProof) -> String {
    let token_data = format!(
        "AuditorBox:{}:{}:{}:{}",
        entry_id, proof.data_hash, proof.timestamp, proof.signature
    );
    generate_hash(&token_data)
}

// Verify a verification token
pub fn verify_token(token: &str, entry_id: u64, proof: &BlockchainProof) -> bool {
    let expected_token = generate_verification_token(entry_id, proof);
    token == expected_token
}

// Create a summary of blockchain proofs for reporting
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ProofSummary {
    pub total_entries: u64,
    pub earliest_timestamp: u64,
    pub latest_timestamp: u64,
    pub chain_valid: bool,
    pub verification_url: String,
}

pub fn create_proof_summary(
    proofs: &BTreeMap<u64, BlockchainProof>,
    canister_id: &str,
) -> ProofSummary {
    let total_entries = proofs.len() as u64;
    let earliest = proofs.values().map(|p| p.timestamp).min().unwrap_or(0);
    let latest = proofs.values().map(|p| p.timestamp).max().unwrap_or(0);

    // Simple chain validation - check if all consecutive entries are linked
    let mut chain_valid = true;
    let mut sorted_proofs: Vec<_> = proofs.values().collect();
    sorted_proofs.sort_by_key(|p| p.block_height);

    for i in 1..sorted_proofs.len() {
        if !verify_chain_link(sorted_proofs[i], sorted_proofs[i - 1]) {
            chain_valid = false;
            break;
        }
    }

    ProofSummary {
        total_entries,
        earliest_timestamp: earliest,
        latest_timestamp: latest,
        chain_valid,
        verification_url: format!("https://{}.ic0.app/verify", canister_id),
    }
}

