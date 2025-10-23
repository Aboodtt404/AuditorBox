use candid::Principal;
use ic_cdk::api::time;

use crate::storage::{STORAGE, StorablePrincipal};
use crate::types::{Result, User, UserRole};

// Check if a user exists
pub fn get_user(principal: Principal) -> Option<User> {
    STORAGE.with(|storage| storage.borrow().users.get(&StorablePrincipal(principal)))
}

// Create or update user
pub fn upsert_user(principal: Principal, role: UserRole, name: String, email: String, language: String) -> Result<User> {
    let user = User {
        principal: principal.clone(),
        role,
        name,
        email,
        created_at: time(),
        language_preference: language,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().users.insert(StorablePrincipal(principal), user.clone());
    });

    Ok(user)
}

// Get or create user with default role
pub fn get_or_create_user(principal: Principal) -> User {
    if let Some(user) = get_user(principal) {
        return user;
    }

    // Check if this is the first user - if so, make them Admin
    let is_first_user = STORAGE.with(|storage| storage.borrow().users.is_empty());
    let role = if is_first_user {
        UserRole::Admin
    } else {
        UserRole::Staff
    };

    let user = User {
        principal: principal.clone(),
        role,
        name: String::from("New User"),
        email: String::new(),
        created_at: time(),
        language_preference: String::from("en"),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().users.insert(StorablePrincipal(principal), user.clone());
    });

    user
}

// Update user role (Admin only)
pub fn update_user_role(caller: Principal, target_principal: Principal, new_role: UserRole) -> Result<()> {
    let caller_user = get_user(caller).ok_or("Caller not found")?;
    
    if !is_admin(&caller_user) {
        return Err("Only administrators can update user roles".to_string());
    }

    let mut target_user = get_user(target_principal).ok_or("Target user not found")?;
    target_user.role = new_role;

    STORAGE.with(|storage| {
        storage.borrow_mut().users.insert(StorablePrincipal(target_principal), target_user);
    });

    Ok(())
}

// Update user language preference
pub fn update_user_language(principal: Principal, language: String) -> Result<()> {
    let mut user = get_user(principal).ok_or("User not found")?;
    user.language_preference = language;

    STORAGE.with(|storage| {
        storage.borrow_mut().users.insert(StorablePrincipal(principal), user);
    });

    Ok(())
}

// Update user name
pub fn update_user_name(principal: Principal, name: String) -> Result<()> {
    let mut user = get_user(principal).ok_or("User not found")?;
    user.name = name;

    STORAGE.with(|storage| {
        storage.borrow_mut().users.insert(StorablePrincipal(principal), user);
    });

    Ok(())
}

// Update user email
pub fn update_user_email(principal: Principal, email: String) -> Result<()> {
    let mut user = get_user(principal).ok_or("User not found")?;
    user.email = email;

    STORAGE.with(|storage| {
        storage.borrow_mut().users.insert(StorablePrincipal(principal), user);
    });

    Ok(())
}

// List all users (Admin only)
pub fn list_users(caller: Principal) -> Result<Vec<User>> {
    let caller_user = get_user(caller).ok_or("Caller not found")?;
    
    if !is_admin(&caller_user) {
        return Err("Only administrators can list users".to_string());
    }

    let users = STORAGE.with(|storage| {
        storage
            .borrow()
            .users
            .iter()
            .map(|(_, user)| user)
            .collect()
    });

    Ok(users)
}

// Permission checks
pub fn is_admin(user: &User) -> bool {
    user.role == UserRole::Admin
}

pub fn is_partner_or_above(user: &User) -> bool {
    matches!(user.role, UserRole::Admin | UserRole::Partner)
}

pub fn is_manager_or_above(user: &User) -> bool {
    matches!(user.role, UserRole::Admin | UserRole::Partner | UserRole::Manager)
}

pub fn is_senior_or_above(user: &User) -> bool {
    matches!(
        user.role,
        UserRole::Admin | UserRole::Partner | UserRole::Manager | UserRole::Senior
    )
}

pub fn is_staff_or_above(user: &User) -> bool {
    matches!(
        user.role,
        UserRole::Admin | UserRole::Partner | UserRole::Manager | UserRole::Senior | UserRole::Staff
    )
}

pub fn is_client_user(user: &User) -> bool {
    user.role == UserRole::ClientUser
}

// Check permissions for various operations
pub fn can_create_organization(user: &User) -> bool {
    is_manager_or_above(user)
}

pub fn can_edit_organization(user: &User) -> bool {
    is_manager_or_above(user)
}

pub fn can_delete_organization(user: &User) -> bool {
    is_partner_or_above(user)
}

pub fn can_create_entity(user: &User) -> bool {
    is_manager_or_above(user)
}

pub fn can_edit_entity(user: &User) -> bool {
    is_manager_or_above(user)
}

pub fn can_create_engagement(user: &User) -> bool {
    is_senior_or_above(user)
}

pub fn can_edit_engagement(user: &User) -> bool {
    is_senior_or_above(user)
}

pub fn can_import_data(user: &User) -> bool {
    is_staff_or_above(user)
}

pub fn can_create_working_paper(user: &User) -> bool {
    is_staff_or_above(user)
}

pub fn can_upload_document(user: &User) -> bool {
    // Both staff and client users can upload documents
    is_staff_or_above(user) || is_client_user(user)
}

pub fn can_manage_users(user: &User) -> bool {
    is_admin(user)
}

pub fn can_view_activity_log(_user: &User) -> bool {
    // All authenticated users can view activity logs
    true
}

