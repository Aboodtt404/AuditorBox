import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, UserPlus, Settings, Shield, Eye, Edit, MoreHorizontal, Crown, User, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'manager' | 'senior' | 'staff' | 'client';
  status: 'active' | 'inactive' | 'pending';
  lastActive: Date;
  permissions: string[];
}

const USER_ROLES = [
  { value: 'admin', label: 'Admin', icon: Crown, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { value: 'partner', label: 'Partner', icon: Shield, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'manager', label: 'Manager', icon: UserCheck, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'senior', label: 'Senior', icon: User, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'staff', label: 'Staff', icon: User, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'client', label: 'Client User', icon: User, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
];

const PERMISSIONS = [
  'view_clients',
  'create_clients',
  'edit_clients',
  'delete_clients',
  'view_engagements',
  'create_engagements',
  'edit_engagements',
  'delete_engagements',
  'view_documents',
  'upload_documents',
  'approve_documents',
  'view_reports',
  'create_reports',
  'manage_users',
  'system_admin'
];

export default function UserManagementPage() {
  const { t } = useLanguage();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserData['role']>('staff');

  // Mock data for demonstration - in real app this would come from backend
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@auditorbox.com',
      role: 'admin',
      status: 'active',
      lastActive: new Date('2024-12-15T10:30:00'),
      permissions: ['system_admin', 'manage_users', 'view_clients', 'create_clients', 'edit_clients', 'delete_clients']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@auditorbox.com',
      role: 'partner',
      status: 'active',
      lastActive: new Date('2024-12-15T09:15:00'),
      permissions: ['view_clients', 'create_clients', 'edit_clients', 'view_engagements', 'create_engagements', 'edit_engagements']
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@auditorbox.com',
      role: 'manager',
      status: 'active',
      lastActive: new Date('2024-12-14T16:45:00'),
      permissions: ['view_clients', 'view_engagements', 'create_engagements', 'view_documents', 'upload_documents']
    },
    {
      id: '4',
      name: 'Emily Chen',
      email: 'emily.chen@auditorbox.com',
      role: 'senior',
      status: 'active',
      lastActive: new Date('2024-12-15T08:20:00'),
      permissions: ['view_clients', 'view_engagements', 'view_documents', 'upload_documents']
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@client.com',
      role: 'client',
      status: 'pending',
      lastActive: new Date('2024-12-10T14:30:00'),
      permissions: ['view_documents', 'upload_documents']
    }
  ]);

  const getRoleInfo = (role: UserData['role']) => {
    return USER_ROLES.find(r => r.value === role) || USER_ROLES[4];
  };

  const getStatusBadge = (status: UserData['status']) => {
    const statusMap = {
      active: { variant: 'secondary' as const, label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      inactive: { variant: 'secondary' as const, label: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
      pending: { variant: 'outline' as const, label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    };
    
    const statusInfo = statusMap[status];
    
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'pending',
      lastActive: new Date(),
      permissions: getDefaultPermissions(newUserRole)
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('staff');
    setShowAddUser(false);
    toast.success('User added successfully');
  };

  const getDefaultPermissions = (role: UserData['role']): string[] => {
    switch (role) {
      case 'admin':
        return PERMISSIONS;
      case 'partner':
        return ['view_clients', 'create_clients', 'edit_clients', 'view_engagements', 'create_engagements', 'edit_engagements', 'view_documents', 'approve_documents', 'view_reports', 'create_reports'];
      case 'manager':
        return ['view_clients', 'view_engagements', 'create_engagements', 'edit_engagements', 'view_documents', 'upload_documents', 'view_reports'];
      case 'senior':
        return ['view_clients', 'view_engagements', 'view_documents', 'upload_documents', 'view_reports'];
      case 'staff':
        return ['view_clients', 'view_engagements', 'view_documents', 'upload_documents'];
      case 'client':
        return ['view_documents', 'upload_documents'];
      default:
        return [];
    }
  };

  const handleRoleChange = (userId: string, newRole: UserData['role']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, permissions: getDefaultPermissions(newRole) }
        : user
    ));
    toast.success('User role updated successfully');
  };

  const handleStatusChange = (userId: string, newStatus: UserData['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus }
        : user
    ));
    toast.success('User status updated successfully');
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage user roles, permissions, and access control
            </p>
          </div>
        </div>
        
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign their role
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name *</Label>
                <Input
                  id="user-name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address *</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <Select value={newUserRole} onValueChange={(value: UserData['role']) => setNewUserRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {role.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  className="flex-1"
                  disabled={!newUserName.trim() || !newUserEmail.trim()}
                >
                  Add User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            All Users
          </CardTitle>
          <CardDescription className="text-base">
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold min-w-[200px]">User</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Role</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Last Active</TableHead>
                  <TableHead className="font-semibold min-w-[150px]">Permissions</TableHead>
                  <TableHead className="font-semibold min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors duration-150">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${roleInfo.color}`}>
                          <RoleIcon className="h-3 w-3" />
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatLastActive(user.lastActive)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {user.permissions.length} permissions
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}>
                              <Settings className="h-4 w-4 mr-2" />
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User: {editingUser.name}</DialogTitle>
              <DialogDescription>
                Update user role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Role</Label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value: UserData['role']) => handleRoleChange(editingUser.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {role.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={editingUser.status} 
                  onValueChange={(value: UserData['status']) => handleStatusChange(editingUser.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Permissions ({editingUser.permissions.length})</Label>
                <div className="max-h-32 overflow-y-auto space-y-1 p-2 border rounded">
                  {editingUser.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs mr-1 mb-1">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => setEditingUser(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
