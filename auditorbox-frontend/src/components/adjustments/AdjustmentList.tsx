import React, { useState, useMemo } from 'react';

// Types
type AdjustmentEntry = {
  account: string;
  debit: number;
  credit: number;
};

type Adjustment = {
  id: string;
  description: string;
  entries: AdjustmentEntry[];
  status: string;
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; order: number }> = {
  Draft: { label: 'Draft', color: 'bg-slate-800 text-slate-300 border-slate-700', icon: 'schedule', order: 0 },
  Proposed: { label: 'Proposed', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: 'arrow_forward', order: 1 },
  Reviewed: { label: 'Reviewed', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30', icon: 'fact_check', order: 2 },
  Approved: { label: 'Approved', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30', icon: 'check_circle', order: 3 },
  Posted: { label: 'Posted', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', icon: 'description', order: 4 },
};

const STATUS_PIPELINE = ['Draft', 'Proposed', 'Reviewed', 'Approved', 'Posted'];

const STATUS_DOT_COLORS: Record<string, string> = {
  Draft: 'bg-slate-400',
  Proposed: 'bg-blue-500',
  Reviewed: 'bg-purple-500',
  Approved: 'bg-amber-500',
  Posted: 'bg-emerald-500',
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const AdjustmentList: React.FC<{
  adjustments: Adjustment[];
  onCreateNew: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onSelect: (id: string) => void;
}> = ({ adjustments, onCreateNew, onUpdateStatus, onSelect }) => {
  const [activeStatus, setActiveStatus] = useState<string>('Draft');

  const filteredAdjustments = useMemo(() =>
    adjustments.filter(adj => adj.status === activeStatus),
    [adjustments, activeStatus]
  );

  const stats = useMemo(() => {
    const statusCounts = STATUS_PIPELINE.reduce((acc, status) => {
      acc[status] = adjustments.filter(a => a.status === status).length;
      return acc;
    }, {} as Record<string, number>);
    const totalAmount = adjustments.reduce((sum, adj) => {
      const totalDebits = adj.entries.reduce((s, e) => s + e.debit, 0);
      const totalCredits = adj.entries.reduce((s, e) => s + e.credit, 0);
      return sum + Math.abs(totalDebits - totalCredits);
    }, 0);
    return { statusCounts, totalAmount };
  }, [adjustments]);

  const handleStatusUpdate = (id: string, currentStatus: string) => {
    const currentIndex = STATUS_PIPELINE.indexOf(currentStatus);
    if (currentIndex < STATUS_PIPELINE.length - 1) {
      onUpdateStatus(id, STATUS_PIPELINE[currentIndex + 1]);
    }
  };

  const getStatusActions = (status: string) => {
    const currentIndex = STATUS_PIPELINE.indexOf(status);
    if (currentIndex === STATUS_PIPELINE.length - 1) return [];
    return [{ status: STATUS_PIPELINE[currentIndex + 1], label: STATUS_PIPELINE[currentIndex + 1] }];
  };

  return (
    <div className="min-h-full bg-background-dark">
      {/* Top Bar */}
      <div className="bg-surface-darker border-b border-slate-800 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="material-icons text-primary">receipt_long</span>
              Adjustments
            </h1>
            <p className="text-sm text-slate-400 mt-1">Audit journal entries pipeline</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            <span className="material-icons text-lg">add</span>
            New AJE
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-surface-darker/50 border-b border-slate-800 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {STATUS_PIPELINE.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[status]}`} />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{status}</div>
                <div className="text-lg font-bold text-white">{stats.statusCounts[status]}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            Total adjustments: <span className="font-semibold text-white">{adjustments.length}</span>
          </div>
          <div className="text-sm text-slate-400">
            Total amount adjusted: <span className="font-semibold text-white">{formatCurrency(stats.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Status Pipeline Tabs */}
      <div className="border-b border-slate-800 px-6 py-3 overflow-x-auto bg-surface-darker/30">
        <div className="flex gap-2 min-w-max">
          {STATUS_PIPELINE.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${activeStatus === status
                ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
                : 'text-slate-400 hover:bg-slate-800'
                }`}
            >
              <span className="material-icons text-base">{STATUS_CONFIG[status].icon}</span>
              <span className="font-medium">{status}</span>
              <span className="ml-1 bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                {stats.statusCounts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Adjustments List */}
      <div className="px-6 py-8">
        {filteredAdjustments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-surface-dark p-6 rounded-full mb-4">
              <span className="material-icons text-5xl text-slate-500">description</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No adjustments yet</h3>
            <p className="text-slate-400 max-w-md text-center">
              There are no {activeStatus.toLowerCase()} adjustments. Create a new adjustment to get started.
            </p>
            <button
              onClick={onCreateNew}
              className="mt-6 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors shadow-sm font-medium"
            >
              <span className="material-icons text-lg">add</span>
              Create New AJE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdjustments.map((adjustment) => {
              const totalDebits = adjustment.entries.reduce((sum, e) => sum + e.debit, 0);
              const totalCredits = adjustment.entries.reduce((sum, e) => sum + e.credit, 0);
              const isBalanced = Math.abs(totalDebits - totalCredits) < 0.005;

              return (
                <div
                  key={adjustment.id}
                  className="bg-surface-darker rounded-xl border border-slate-800 hover:border-slate-600 transition-all overflow-hidden"
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-400">AJE #{adjustment.id.slice(-6)}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[adjustment.status].color}`}>
                            <span className="material-icons text-xs">{STATUS_CONFIG[adjustment.status].icon}</span>
                            {STATUS_CONFIG[adjustment.status].label}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-white">{adjustment.description}</h3>
                      </div>
                      <button
                        onClick={() => onSelect(adjustment.id)}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
                        title="View details"
                      >
                        <span className="material-icons text-xl">visibility</span>
                      </button>
                    </div>

                    {/* Entries */}
                    <div className="mb-4 space-y-2">
                      {adjustment.entries.map((entry, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-slate-300 truncate max-w-[120px]">{entry.account}</span>
                          <div className="flex gap-4 font-mono text-xs">
                            <span className="text-slate-400">{formatCurrency(entry.debit)}</span>
                            <span className="text-slate-400">{formatCurrency(entry.credit)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Amount Summary */}
                    <div className={`flex justify-between items-center py-2 border-t ${isBalanced ? 'border-slate-800' : 'border-amber-500/30 bg-amber-500/5'}`}>
                      <span className="text-sm font-medium text-slate-400">Total:</span>
                      <div className="flex gap-4 font-mono text-xs">
                        <span className={`font-semibold ${isBalanced ? 'text-white' : 'text-amber-400'}`}>{formatCurrency(totalDebits)}</span>
                        <span className={`font-semibold ${isBalanced ? 'text-white' : 'text-amber-400'}`}>{formatCurrency(totalCredits)}</span>
                      </div>
                    </div>
                    {!isBalanced && (
                      <div className="mt-2 flex items-center gap-1.5 text-amber-400 text-xs">
                        <span className="material-icons text-sm">warning</span>
                        Unbalanced entry
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">person</span>
                        {adjustment.createdBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">schedule</span>
                        {formatDate(adjustment.createdAt)}
                      </div>
                      {adjustment.reviewedBy && (
                        <div className="flex items-center gap-1">
                          <span className="material-icons text-sm">fact_check</span>
                          {adjustment.reviewedBy}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
                      {getStatusActions(adjustment.status).map((action) => (
                        <button
                          key={action.status}
                          onClick={() => handleStatusUpdate(adjustment.id, adjustment.status)}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          <span className="material-icons text-base">{STATUS_CONFIG[action.status]?.icon || 'arrow_forward'}</span>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ISA 450 Misstatement Summary */}
      <div className="bg-surface-darker border-t border-slate-800 px-6 py-8">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="material-icons text-lg text-primary">assessment</span>
          ISA 450 Misstatement Summary
        </h2>
        <div className="bg-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Adjustments</span>
            <span className="text-white font-mono">{adjustments.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Amount</span>
            <span className="text-white font-mono">
              {adjustments.reduce((sum, a) => sum + (a.entries || []).reduce((s: number, e: any) => s + (e.debit || 0), 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentList;
