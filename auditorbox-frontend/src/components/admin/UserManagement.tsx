import React, { useState } from 'react';

// Demo data for platform showcase
const DEMO_USERS = [
  { id: '1', principal: 'abc12-defgh-...', name: 'Kareem Menese', email: 'kareem@mercatura.io', role: 'Admin', status: 'Active', lastLogin: '2026-02-08T14:30:00Z', engagements: 3 },
  { id: '2', principal: 'xyz34-klmno-...', name: 'Sarah Chen', email: 'sarah@auditorbox.io', role: 'Partner', status: 'Active', lastLogin: '2026-02-07T09:15:00Z', engagements: 5 },
  { id: '3', principal: 'mno56-pqrst-...', name: 'Ahmed Hassan', email: 'ahmed@auditorbox.io', role: 'Manager', status: 'Active', lastLogin: '2026-02-08T11:00:00Z', engagements: 8 },
  { id: '4', principal: 'rst78-uvwxy-...', name: 'Lisa Park', email: 'lisa@auditorbox.io', role: 'Senior', status: 'Active', lastLogin: '2026-02-06T16:45:00Z', engagements: 4 },
  { id: '5', principal: 'efg90-hijkl-...', name: 'James Wilson', email: 'james@auditorbox.io', role: 'Staff', status: 'Active', lastLogin: '2026-02-08T08:20:00Z', engagements: 2 },
  { id: '6', principal: 'uvw12-xyzab-...', name: 'Maria Lopez', email: 'maria@client.com', role: 'ClientUser', status: 'Invited', lastLogin: '', engagements: 1 },
];

const ROLES = ['Admin', 'Partner', 'Manager', 'Senior', 'Staff', 'ClientUser'] as const;

const ROLE_COLORS: Record<string, string> = {
  Admin: 'bg-red-500/10 text-red-300 border-red-500/30',
  Partner: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  Manager: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  Senior: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  Staff: 'bg-slate-800 text-slate-300 border-slate-700',
  ClientUser: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
};

const ROLE_ICONS: Record<string, string> = {
  Admin: 'admin_panel_settings',
  Partner: 'shield',
  Manager: 'settings',
  Senior: 'visibility',
  Staff: 'group',
  ClientUser: 'person',
};

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(DEMO_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Staff' });

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {} as Record<string, number>);

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingUser(null);
  };

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email) return;
    setUsers(prev => [...prev, {
      id: String(prev.length + 1),
      principal: `new${prev.length}-xxxxx-...`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'Invited',
      lastLogin: '',
      engagements: 0,
    }]);
    setInviteForm({ name: '', email: '', role: 'Staff' });
    setShowInvite(false);
  };

  return (
    <div className="min-h-full bg-background-dark p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="material-icons text-primary">groups</span>
              User Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage team members and role-based access control</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
          >
            <span className="material-icons text-lg">person_add</span>
            Invite User
          </button>
        </div>

        {/* Role Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
              className={`rounded-xl border p-3 transition-all ${roleFilter === role
                ? 'ring-2 ring-primary border-primary/30 bg-surface-dark'
                : 'border-slate-800 bg-surface-darker hover:border-slate-600'
                }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons text-base text-slate-400">{ROLE_ICONS[role]}</span>
                <span className="text-xs text-slate-400">{role}</span>
              </div>
              <div className="text-xl font-bold text-white">{roleCounts[role]}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500">search</span>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-darker text-sm text-slate-200 rounded-lg pl-10 pr-3 py-2.5 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-slate-500"
          />
        </div>

        {/* Users Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Engagements</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Last Login</th>
                <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingUser === user.id ? (
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        onBlur={() => setEditingUser(null)}
                        autoFocus
                        className="bg-slate-900 border border-slate-700 rounded text-sm text-slate-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[user.role]}`}>
                        <span className="material-icons text-sm">{ROLE_ICONS[user.role]}</span>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'bg-amber-500/10 text-amber-300'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{user.engagements}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(user.lastLogin)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="text-xs text-slate-400 hover:text-primary transition-colors px-2 py-1 rounded hover:bg-slate-800"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RBAC Hierarchy */}
        <div className="rounded-xl border border-slate-800 bg-surface-darker p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-icons text-lg text-primary">account_tree</span>
            Role Hierarchy (RBAC)
          </h3>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {ROLES.map((role, idx) => (
              <React.Fragment key={role}>
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border ${ROLE_COLORS[role]}`}>
                  <span className="material-icons text-sm">{ROLE_ICONS[role]}</span>
                  <span className="text-sm font-medium">{role}</span>
                </div>
                {idx < ROLES.length - 1 && <span className="material-icons text-base text-slate-600">arrow_forward</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-3">Higher roles inherit all permissions of lower roles</p>
        </div>

        {/* Invite Modal */}
        {showInvite && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowInvite(false)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-icons text-primary">person_add</span>
                Invite Team Member
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={inviteForm.name}
                  onChange={e => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-surface-darker border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-surface-darker border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select
                  value={inviteForm.role}
                  onChange={e => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-surface-darker border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowInvite(false)} className="flex-1 px-4 py-2 bg-surface-darker hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">Cancel</button>
                <button onClick={handleInvite} className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium">Send Invite</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
