import React, { useState } from 'react';

// Demo data
const DEMO_ORGS = [
  { id: 1, name: 'Menese & Partners', description: 'Certified Public Accountants', members: 12, engagements: 8, created: '2025-06-15' },
  { id: 2, name: 'Cairo Audit Group', description: 'Regional audit consortium', members: 25, engagements: 15, created: '2025-03-20' },
];

const DEMO_CLIENTS = [
  { id: 1, name: 'Acme Corporation', industry: 'Manufacturing', revenue: 45_000_000, yearEnd: '2025-12-31', status: 'Active', riskLevel: 'Medium', contact: 'John Smith', email: 'john@acme.com', phone: '+1-555-0123', location: 'New York, USA', engagements: 3 },
  { id: 2, name: 'TechVentures Inc.', industry: 'Technology', revenue: 120_000_000, yearEnd: '2025-12-31', status: 'Active', riskLevel: 'High', contact: 'Sarah Lee', email: 'sarah@techventures.com', phone: '+1-555-0456', location: 'San Francisco, USA', engagements: 2 },
  { id: 3, name: 'Global Logistics Ltd.', industry: 'Transportation', revenue: 78_000_000, yearEnd: '2026-03-31', status: 'Active', riskLevel: 'Low', contact: 'Mike Brown', email: 'mike@globallog.com', phone: '+44-20-7946-0958', location: 'London, UK', engagements: 1 },
  { id: 4, name: 'Desert Pharma SAE', industry: 'Healthcare', revenue: 32_000_000, yearEnd: '2025-12-31', status: 'Prospect', riskLevel: 'Medium', contact: 'Nadia Abdel', email: 'nadia@desertpharma.eg', phone: '+20-2-2345-6789', location: 'Cairo, Egypt', engagements: 0 },
  { id: 5, name: 'Green Energy Co.', industry: 'Utilities', revenue: 95_000_000, yearEnd: '2025-06-30', status: 'Active', riskLevel: 'Low', contact: 'Emma Wilson', email: 'emma@greenenergy.com', phone: '+1-555-0789', location: 'Austin, USA', engagements: 4 },
];

const RISK_COLORS: Record<string, string> = {
  Low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Medium: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  High: 'bg-red-500/10 text-red-300 border-red-500/30',
};

const RISK_ICONS: Record<string, string> = {
  Low: 'verified_user',
  Medium: 'warning',
  High: 'error',
};

const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

const ClientOrgManagement: React.FC = () => {
  const [tab, setTab] = useState<'clients' | 'organizations'>('clients');
  const [clients] = useState(DEMO_CLIENTS);
  const [orgs] = useState(DEMO_ORGS);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const selectedClientData = clients.find(c => c.id === selectedClient);

  return (
    <div className="min-h-full bg-background-dark p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="material-icons text-primary">{tab === 'clients' ? 'business' : 'apartment'}</span>
              {tab === 'clients' ? 'Client Management' : 'Organizations'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {tab === 'clients' ? 'Manage audit clients and entity profiles' : 'Manage firm organizations and teams'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-darker rounded-lg border border-slate-800 p-0.5">
              <button
                onClick={() => setTab('clients')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'clients' ? 'bg-surface-dark text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <span className="material-icons text-base">business_center</span>
                Clients
              </button>
              <button
                onClick={() => setTab('organizations')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'organizations' ? 'bg-surface-dark text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <span className="material-icons text-base">apartment</span>
                Organizations
              </button>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <span className="material-icons text-lg">add</span>
              Add {tab === 'clients' ? 'Client' : 'Organization'}
            </button>
          </div>
        </div>

        {tab === 'clients' ? (
          <div className="flex gap-6">
            {/* Client List */}
            <div className="flex-1 space-y-4">
              {/* Summary stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Clients', value: clients.length, icon: 'people', color: 'text-white' },
                  { label: 'Active', value: clients.filter(c => c.status === 'Active').length, icon: 'check_circle', color: 'text-emerald-400' },
                  { label: 'High Risk', value: clients.filter(c => c.riskLevel === 'High').length, icon: 'error', color: 'text-red-400' },
                  { label: 'Total Revenue', value: formatCurrency(clients.reduce((s, c) => s + c.revenue, 0)), icon: 'payments', color: 'text-primary' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-slate-800 bg-surface-darker p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`material-icons text-base ${stat.color}`}>{stat.icon}</span>
                      <span className="text-xs text-slate-400">{stat.label}</span>
                    </div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Client Cards */}
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${selectedClient === client.id
                    ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/30'
                    : 'border-slate-800 bg-surface-darker hover:border-slate-600'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.industry} &middot; {client.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${RISK_COLORS[client.riskLevel]}`}>
                        <span className="material-icons text-xs">{RISK_ICONS[client.riskLevel]}</span>
                        {client.riskLevel}
                      </span>
                      <span className="text-sm font-medium text-slate-400">{formatCurrency(client.revenue)}</span>
                      <span className="material-icons text-base text-slate-600">chevron_right</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Client Detail Panel */}
            {selectedClientData && (
              <div className="w-80 rounded-xl border border-slate-800 bg-surface-darker p-5 space-y-5 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedClientData.name}</h3>
                  <p className="text-sm text-slate-400">{selectedClientData.industry}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: 'location_on', value: selectedClientData.location },
                    { icon: 'mail', value: selectedClientData.email },
                    { icon: 'phone', value: selectedClientData.phone },
                    { icon: 'person', value: selectedClientData.contact },
                    { icon: 'event', value: `YE: ${selectedClientData.yearEnd}` },
                  ].map(item => (
                    <div key={item.icon} className="flex items-center gap-2 text-sm">
                      <span className="material-icons text-base text-slate-500">{item.icon}</span>
                      <span className="text-slate-300">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-800 bg-slate-800 p-3 text-center">
                    <div className="text-lg font-bold text-white">{selectedClientData.engagements}</div>
                    <div className="text-xs text-slate-400">Engagements</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-800 p-3 text-center">
                    <div className="text-lg font-bold text-primary">{formatCurrency(selectedClientData.revenue)}</div>
                    <div className="text-xs text-slate-400">Revenue</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm transition-colors font-medium">
                    <span className="material-icons text-lg">add_circle</span>
                    Start New Engagement
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                    <span className="material-icons text-lg">history</span>
                    View History
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Organizations Tab */
          <div className="space-y-4">
            {orgs.map(org => (
              <div key={org.id} className="rounded-xl border border-slate-800 bg-surface-darker p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="material-icons text-2xl text-primary">apartment</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                      <p className="text-sm text-slate-400">{org.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{org.members}</div>
                      <div className="text-xs text-slate-500">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{org.engagements}</div>
                      <div className="text-xs text-slate-500">Engagements</div>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientOrgManagement;
