// Auth.mo — Stateless role-based access control module
// All storage lives in main.mo actor. Auth only provides permission check functions.
import Types "./Types";

module {
    // Role hierarchy checks
    public func isAdmin(user : Types.User) : Bool {
        user.role == #Admin
    };

    public func isPartnerOrAbove(user : Types.User) : Bool {
        switch (user.role) {
            case (#Admin or #Partner) true;
            case _ false;
        }
    };

    public func isManagerOrAbove(user : Types.User) : Bool {
        switch (user.role) {
            case (#Admin or #Partner or #Manager) true;
            case _ false;
        }
    };

    public func isSeniorOrAbove(user : Types.User) : Bool {
        switch (user.role) {
            case (#Admin or #Partner or #Manager or #Senior) true;
            case _ false;
        }
    };

    public func isStaffOrAbove(user : Types.User) : Bool {
        switch (user.role) {
            case (#ClientUser) false;
            case _ true;
        }
    };

    // Permission checks for specific operations
    public func canCreateEngagement(user : Types.User) : Bool {
        isSeniorOrAbove(user)
    };

    public func canApproveAje(user : Types.User) : Bool {
        isManagerOrAbove(user)
    };

    public func canManageUsers(user : Types.User) : Bool {
        isAdmin(user)
    };

    public func canManageOrganizations(user : Types.User) : Bool {
        isManagerOrAbove(user)
    };

    public func canManageTemplates(user : Types.User) : Bool {
        isPartnerOrAbove(user)
    };

    public func canViewAuditTrail(user : Types.User) : Bool {
        isStaffOrAbove(user)
    };

    // Authenticate caller: returns user or error
    public func requireAuth(
        users : [(Principal, Types.User)],
        caller : Principal
    ) : Types.ApiResult<Types.User> {
        for ((p, u) in users.vals()) {
            if (p == caller) {
                return #ok(u);
            };
        };
        #err("Not authenticated: caller not found")
    };

    // Get or create user (first user becomes Admin)
    public func getOrCreateUser(
        users : [(Principal, Types.User)],
        caller : Principal
    ) : (Types.User, Bool) {  // (user, isNew)
        // Check if exists
        for ((p, u) in users.vals()) {
            if (p == caller) {
                return (u, false);
            };
        };
        // Create new user
        let role : Types.UserRole = if (users.size() == 0) #Admin else #Staff;
        let profileCompleted = users.size() == 0; // Admin auto-completed
        let newUser : Types.User = {
            principal = caller;
            role = role;
            name = "New User";
            email = "";
            createdAt = 0; // main.mo sets the real time
            languagePreference = "en";
            profileCompleted = profileCompleted;
        };
        (newUser, true)
    };
};
