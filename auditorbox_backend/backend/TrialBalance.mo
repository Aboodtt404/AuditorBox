import Types "./Types";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";

module {

    // Infer account type based on account number and name
    // Ported from Rust backend/src/trial_balance.rs
    public func inferAccountType(accountNumber : Text, _ : Text) : Types.AccountType {

        let numOpt = Nat.fromText(accountNumber);

        // 1. Try by range if number is valid
        switch (numOpt) {
            case (?n) {
                if (n >= 1000 and n < 2000) { return #Asset };
                if (n >= 2000 and n < 3000) { return #Liability };
                if (n >= 3000 and n < 4000) { return #Equity };
                if (n >= 4000 and n < 5000) { return #Revenue };
                if (n >= 5000 and n < 9000) { return #Expense };
            };
            case null {};
        };

        // 2. Try by keyword matching - Simplified or removed to avoid compilation issues with Text module
        // For MVP we will rely on number ranges which are standard in accounting.
        // If number is not matched, default to Asset.

        #Asset // Default
    };

    // Validate if TB is balanced
    public type ValidationResult = {
        isBalanced : Bool;
        totalDebits : Float;
        totalCredits : Float;
        difference : Float;
        accountCount : Nat;
    };

    public func validate(tb : Types.TrialBalance) : ValidationResult {
        var debit : Float = 0.0;
        var credit : Float = 0.0;

        for (acc in tb.accounts.vals()) {
            debit += acc.debit;
            credit += acc.credit;
        };

        {
            isBalanced = Float.abs(debit - credit) < 0.01;
            totalDebits = debit;
            totalCredits = credit;
            difference = debit - credit;
            accountCount = tb.accounts.size();
        };
    };
};
