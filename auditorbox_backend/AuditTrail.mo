// AuditTrail.mo — Blockchain-chained activity logging
// Each entry includes a hash of the previous entry for tamper evidence.
import Types "./Types";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

module {
    // Simple hash function for chain integrity
    // In production, use ic-sha256 or similar. This is a placeholder.
    public func hashText(t : Text) : Text {
        var h : Nat = 5381;
        for (c in t.chars()) {
            let charNat = Nat32.toNat(Char.toNat32(c));
            h := h * 33 + charNat;
        };
        Nat.toText(h)
    };

    // Create a new audit trail entry with hash chain
    public func createEntry(
        entries : [Types.AuditTrailEntry],
        nextId : Nat,
        principal : Principal,
        action : Text,
        resourceType : Text,
        resourceId : Nat,
        details : Text,
        timestamp : Int
    ) : Types.AuditTrailEntry {
        // Get hash of previous entry (empty string if first)
        let previousHash = if (entries.size() == 0) {
            ""
        } else {
            entries[entries.size() - 1].hash
        };

        // Build content string for hashing
        let content = Nat.toText(nextId)
            # "|" # Principal.toText(principal)
            # "|" # action
            # "|" # resourceType
            # "|" # Nat.toText(resourceId)
            # "|" # details
            # "|" # Int.toText(timestamp)
            # "|" # previousHash;

        let hash = hashText(content);

        {
            id = nextId;
            principal = principal;
            action = action;
            resourceType = resourceType;
            resourceId = resourceId;
            details = details;
            timestamp = timestamp;
            previousHash = previousHash;
            hash = hash;
        }
    };

    // Verify chain integrity
    public func verifyChain(entries : [Types.AuditTrailEntry]) : Bool {
        if (entries.size() <= 1) return true;

        var i = 1;
        while (i < entries.size()) {
            if (entries[i].previousHash != entries[i - 1].hash) {
                return false;
            };
            i += 1;
        };
        true
    };

    // Get entries by resource
    public func getByResource(
        entries : [Types.AuditTrailEntry],
        resourceType : Text,
        resourceId : Nat
    ) : [Types.AuditTrailEntry] {
        Array.filter<Types.AuditTrailEntry>(entries, func (e : Types.AuditTrailEntry) : Bool {
            e.resourceType == resourceType and e.resourceId == resourceId
        })
    };

    // Get entries by principal
    public func getByPrincipal(
        entries : [Types.AuditTrailEntry],
        principal : Principal
    ) : [Types.AuditTrailEntry] {
        Array.filter<Types.AuditTrailEntry>(entries, func (e : Types.AuditTrailEntry) : Bool {
            e.principal == principal
        })
    };
};
