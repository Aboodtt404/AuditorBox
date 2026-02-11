import Types "./Types";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Float "mo:base/Float";
import Char "mo:base/Char";
import Int "mo:base/Int";
import Principal "mo:base/Principal";

import Buffer "mo:base/Buffer";

module {

    // Mock hashing function (matches AuditTrail implementation)
    // In production, use properly imported crypto library
    public func hashText(t : Text) : Text {
        var h : Nat32 = 5381;
        for (c in t.chars()) {
            h := h *% 33 +% Char.toNat32(c);
        };
        Nat.toText(Nat32.toNat(h));
    };

    // Generate hash for AJE content
    public func generateHash(ajeId : Nat, engagementId : Nat, tbId : Nat, desc : Text, amount : Float) : Text {
        let content = Nat.toText(ajeId)
        # ":" # Nat.toText(engagementId)
        # ":" # Nat.toText(tbId)
        # ":" # desc
        # ":" # Float.toText(amount);

        hashText(content);
    };

    // Generate mock signature
    public func generateSignature(ajeId : Nat, caller : Principal, timestamp : Int, hash : Text) : Text {
        let sigContent = Nat.toText(ajeId)
        # ":" # Principal.toText(caller)
        # ":" # Int.toText(timestamp)
        # ":" # hash;

        "SIG_" # hashText(sigContent);
    };

    // Post AJE to Trial Balance
    // Returns updated TrialBalance with adjusted accounts
    public func postAje(aje : Types.Adjustment, tb : Types.TrialBalance) : Types.TrialBalance {
        // Clone accounts to a buffer for mutation
        // Since Types.TrialBalance has accounts as [TrialBalanceAccount] (immutable array),
        // we need to rebuild it.

        let newAccounts = Buffer.Buffer<Types.TrialBalanceAccount>(tb.accounts.size());

        // Map account ID (or number?) AJE Line Item refers to Account Number usually in this simple schema
        // In Types.mo: AjeLineItem has `accountNumber`. TrialBalanceAccount has `accountNumber`.

        for (acc in tb.accounts.vals()) {
            var newAcc = acc;

            // Check if this account is affected by the AJE
            for (lineItem in aje.lineItems.vals()) {
                if (lineItem.accountNumber == acc.accountNumber) {
                    newAcc := {
                        accountNumber = acc.accountNumber;
                        accountName = acc.accountName;
                        accountType = acc.accountType;
                        beginningBalance = acc.beginningBalance;
                        debit = acc.debit + lineItem.debit; // Add adjustments
                        credit = acc.credit + lineItem.credit; // Add adjustments
                        endingBalance = acc.endingBalance; // Should recompute?
                        // Note: endingBalance logic strictly depends on account type (Asset=Dr-Cr, Liab=Cr-Dr)
                        // For now we just update debits/credits.
                        // Ideally we recompute ending balance here.
                        fsLineItem = acc.fsLineItem;
                    };
                };
            };

            // Recompute ending balance
            // Simple logic: Assets/Expenses (Dr normal), Liabilities/Equity/Revenue (Cr normal)
            let net = newAcc.debit - newAcc.credit;
            let endBal = switch (newAcc.accountType) {
                case (#Asset or #Expense) { net };
                case _ { 0.0 - net };
            };

            let finalAcc : Types.TrialBalanceAccount = {
                accountNumber = newAcc.accountNumber;
                accountName = newAcc.accountName;
                accountType = newAcc.accountType;
                beginningBalance = newAcc.beginningBalance;
                debit = newAcc.debit;
                credit = newAcc.credit;
                endingBalance = endBal;
                fsLineItem = newAcc.fsLineItem;
            };

            newAccounts.add(finalAcc);
        };

        {
            id = tb.id;
            engagementId = tb.engagementId;
            periodEndDate = tb.periodEndDate;
            description = tb.description;
            currency = tb.currency;
            accounts = Buffer.toArray(newAccounts);
            createdAt = tb.createdAt;
            createdBy = tb.createdBy;
        };
    };
};
