import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from '../../api/api-functions';
import type { CreateEngagementRequest, EngagementLink, User } from '../../declarations/auditorbox_backend/auditorbox_backend.did';

interface Props {
    onSelect: (engagementId: bigint) => void;
    onLogout: () => void;
}

const EngagementSelector: React.FC<Props> = ({ onSelect, onLogout }) => {
    const queryClient = useQueryClient();
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({
        name: '',
        clientName: '',
        yearEnd: new Date().getFullYear() + '-12-31',
        reportingFramework: 'IFRS',
        entityType: 'private',
        currency: 'USD',
        industrySector: 'manufacturing',
        materialityOverall: 500000,
        materialityPerformance: 375000,
        materialityTrivial: 25000,
        riskProfile: 'medium',
        isGroupAudit: false,
        isFirstYear: false,
    });

    const { data: engagements, isLoading } = useQuery({
        queryKey: ['listEngagements'],
        queryFn: async () => {
            console.log('Fetching engagements...');
            const res = await api.listEngagements();
            console.log('Engagements fetched:', res);
            return res;
        },
    });

    const createMutation = useMutation({
        mutationFn: (req: CreateEngagementRequest) => api.createEngagement(req),
        onSuccess: (result: Record<string, any>) => {
            console.log('Create result:', result);
            if ('ok' in result && result.ok && typeof result.ok === 'object' && 'id' in result.ok) {
                toast.success('Engagement created successfully');
                queryClient.invalidateQueries({ queryKey: ['listEngagements'] });
                onSelect(result.ok.id as bigint);
            } else if ('err' in result) {
                toast.error(`Failed to create engagement: ${result.err}`);
            } else {
                toast.error('Engagement created but result unknown');
            }
            setShowCreate(false);
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
        }
    });

    const handleCreate = () => {
        const link: EngagementLink = { Organization: BigInt(1) };
        const now = BigInt(Date.now()) * BigInt(1_000_000);
        createMutation.mutate({
            name: form.name || form.clientName + ' Audit',
            description: `Audit engagement for ${form.clientName}`,
            link,
            startDate: now,
            endDate: now + BigInt(365 * 24 * 60 * 60 * 1_000_000_000),
            clientName: form.clientName,
            yearEnd: form.yearEnd,
            reportingFramework: form.reportingFramework,
            entityType: form.entityType,
            currency: form.currency,
            industrySector: form.industrySector,
            materialityOverall: form.materialityOverall,
            materialityPerformance: form.materialityPerformance,
            materialityTrivial: form.materialityTrivial,
            riskProfile: form.riskProfile,
            isGroupAudit: form.isGroupAudit,
            isFirstYear: form.isFirstYear,
        });
    };

    return (
        <div className="min-h-screen bg-background-dark text-white">
            {/* Header */}
            <header className="border-b border-slate-800 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span className="material-icons text-2xl text-primary">verified_user</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">
                            <span className="text-primary">Auditor</span>Box
                        </h1>
                        <p className="text-xs text-slate-500">Select an engagement</p>
                    </div>
                </div>
                <button onClick={onLogout} className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                    <span className="material-icons text-base mr-1 align-middle">logout</span>
                    Sign Out
                </button>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Engagements</h2>
                        <p className="text-slate-400">Select an existing engagement or create a new one</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                try {
                                    const user = await api.getCurrentUser();
                                    if (user && 'ok' in user) {
                                        // Try completeProfile first (if new/incomplete)
                                        console.log('Attempting to upgrade to Admin...');
                                        const userData = user.ok as User;
                                        const res = await api.completeProfile({
                                            name: userData.name || 'Dev Admin',
                                            email: userData.email || 'admin@example.com',
                                            requestedRole: { 'Admin': null }
                                        });
                                        console.log('Complete Profile Result:', res);

                                        // If that implies success or if we need to force update (though update usually requires admin)
                                        // We can't easily self-promote via updateUserRole if we aren't admin, 
                                        // but completeProfile might allow "requestedRole" on first run.

                                        if ('ok' in res) {
                                            toast.success('Promoted to Admin via Profile Completion');
                                        } else {
                                            toast.error(`Failed: ${res.err}`);
                                        }
                                        queryClient.invalidateQueries({ queryKey: ['listEngagements'] });
                                    } else {
                                        // No user found, try creating one
                                        const res = await api.completeProfile({
                                            name: 'Dev Admin',
                                            email: 'admin@example.com',
                                            requestedRole: { 'Admin': null }
                                        });
                                        if ('ok' in res) {
                                            toast.success('Created Admin Profile');
                                        } else {
                                            toast.error(`Failed: ${res.err}`);
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                    toast.error('Error upgrading user');
                                }
                            }}
                            className="p-2.5 text-amber-400 hover:text-amber-300 border border-amber-500/30 bg-amber-500/10 rounded-xl transition-colors"
                            title="Dev: Make Admin"
                        >
                            <span className="material-icons">admin_panel_settings</span>
                        </button>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['listEngagements'] })}
                            className="p-2.5 text-slate-400 hover:text-white border border-slate-700 rounded-xl hover:border-slate-600 transition-colors"
                            title="Refresh List"
                        >
                            <span className="material-icons">refresh</span>
                        </button>
                        <button
                            onClick={() => setShowCreate(!showCreate)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary/20"
                        >
                            <span className="material-icons text-lg">{showCreate ? 'close' : 'add'}</span>
                            {showCreate ? 'Cancel' : 'New Engagement'}
                        </button>
                    </div>
                </div>

                {/* Create form */}
                {showCreate && (
                    <div className="mb-8 p-6 bg-surface-dark border border-slate-800 rounded-2xl">
                        <h3 className="text-lg font-semibold mb-4">Create New Engagement</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Client Name *</label>
                                <input
                                    value={form.clientName}
                                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                    placeholder="e.g. Acme Corporation"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Engagement Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Year End</label>
                                <input
                                    type="date"
                                    value={form.yearEnd}
                                    onChange={(e) => setForm({ ...form, yearEnd: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Framework</label>
                                <select
                                    value={form.reportingFramework}
                                    onChange={(e) => setForm({ ...form, reportingFramework: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="IFRS">IFRS</option>
                                    <option value="EAS">EAS (Egyptian)</option>
                                    <option value="GCC">GCC</option>
                                    <option value="US_GAAP">US GAAP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Entity Type</label>
                                <select
                                    value={form.entityType}
                                    onChange={(e) => setForm({ ...form, entityType: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="listed">Listed</option>
                                    <option value="private">Private</option>
                                    <option value="nfp">Not-for-Profit</option>
                                    <option value="government">Government</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Currency</label>
                                <select
                                    value={form.currency}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="EGP">EGP</option>
                                    <option value="SAR">SAR</option>
                                    <option value="AED">AED</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Industry Sector</label>
                                <select
                                    value={form.industrySector}
                                    onChange={(e) => setForm({ ...form, industrySector: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="financial_services">Financial Services</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="retail">Retail</option>
                                    <option value="real_estate">Real Estate</option>
                                    <option value="energy">Energy</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Risk Profile</label>
                                <select
                                    value={form.riskProfile}
                                    onChange={(e) => setForm({ ...form, riskProfile: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex items-end gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isGroupAudit}
                                        onChange={(e) => setForm({ ...form, isGroupAudit: e.target.checked })}
                                        className="rounded border-slate-700"
                                    />
                                    <span className="text-sm text-slate-300">Group Audit</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isFirstYear}
                                        onChange={(e) => setForm({ ...form, isFirstYear: e.target.checked })}
                                        className="rounded border-slate-700"
                                    />
                                    <span className="text-sm text-slate-300">First Year</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!form.clientName || createMutation.isPending}
                                className="px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Engagement'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Engagement list */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : !engagements || engagements.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="material-icons text-5xl text-slate-600 mb-4 block">folder_open</span>
                        <p className="text-slate-400 mb-2">No engagements yet</p>
                        <p className="text-slate-500 text-sm">Create your first engagement to get started</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {engagements.map(([id, eng]) => (
                            <button
                                key={id.toString()}
                                onClick={() => onSelect(id)}
                                className="group w-full text-left p-5 bg-surface-dark border border-slate-800 rounded-xl hover:border-primary/40 hover:bg-surface-dark/80 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-base font-semibold text-white group-hover:text-primary transition-colors">
                                                {eng.clientName || eng.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${'Planning' in eng.status ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                                                'InProgress' in eng.status ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                                    'Review' in eng.status ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' :
                                                        'Completed' in eng.status ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                                            'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                                                }`}>
                                                {'Planning' in eng.status ? 'Planning' :
                                                    'InProgress' in eng.status ? 'In Progress' :
                                                        'Review' in eng.status ? 'Review' :
                                                            'Completed' in eng.status ? 'Completed' : 'Archived'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons text-sm">calendar_today</span>
                                                FY {eng.yearEnd}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons text-sm">account_balance</span>
                                                {eng.reportingFramework}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons text-sm">attach_money</span>
                                                {eng.currency}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons text-sm">business</span>
                                                {eng.industrySector.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="material-icons text-slate-600 group-hover:text-primary transition-colors">
                                        arrow_forward
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngagementSelector;
