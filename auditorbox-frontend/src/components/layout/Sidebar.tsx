import React, { useState, useMemo } from 'react';
import { PHASES } from '../../data/phases';
import { FORM_COUNT } from '../../data/forms';
import { HUB_FORMS, PHASE_COLORS, PHASE_IDS } from '../../data/hubForms';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string, filter?: any) => void;
  completedForms: string[];
  onSelectForm?: (formId: string) => void;
  currentPhaseId?: string;
  unlockedPhases?: Set<string>;
  onPhaseSelect?: (phaseId: string) => void;
}

const NAV_ITEMS = [
  { id: 'phase-intro', label: 'Dashboard', icon: 'dashboard' },
  { id: 'phase-forms', label: 'Engagements', icon: 'folder_open' },
  { id: 'clients', label: 'Clients', icon: 'business_center' },
  { id: 'financials', label: 'Financials', icon: 'account_balance' },
  { id: 'adjustments', label: 'Adjustments', icon: 'swap_horiz' },
  { id: 'graph', label: 'Audit Graph', icon: 'hub' },
  { id: 'users', label: 'Team', icon: 'groups' },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  completedForms,
  onSelectForm,
  currentPhaseId = '1_onboarding',
  unlockedPhases,
  onPhaseSelect,
}) => {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([currentPhaseId]);

  const currentPhase = PHASES.find(p => p.id === currentPhaseId);
  const totalForms = FORM_COUNT;
  const completedCount = completedForms.length;

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(p => p !== phaseId)
        : [...prev, phaseId]
    );
  };

  // Is the user currently in an engagement view (forms, form detail, phase intro)?
  const isEngagementView = ['phase-intro', 'phase-forms', 'form'].includes(activeView);

  return (
    <>
      {/* ── Brand ──────────────────────────────────── */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <span className="material-icons text-3xl">token</span>
          AuditorBox
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {/* Main nav items */}
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.id || (item.id === 'phase-forms' && activeView === 'form');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <span className={`material-icons text-xl ${isActive ? 'text-primary' : 'group-hover:text-primary'} transition-colors`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}

        {/* Phase tree (visible when in engagement context) */}
        {isEngagementView && (
          <>
            <div className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Engagement
            </div>

            {PHASE_IDS.map((phaseId, idx) => {
              const phase = PHASES.find(p => p.id === phaseId);
              if (!phase) return null;

              const isActive = phaseId === currentPhaseId;
              const isExpanded = expandedPhases.includes(phaseId);
              const isUnlocked = unlockedPhases ? unlockedPhases.has(phaseId) : true;
              const phaseCompleted = phase.categories
                .flatMap(c => c.forms)
                .every(f => completedForms.includes(f.formId));

              return (
                <div key={phaseId}>
                  <button
                    onClick={() => {
                      if (isUnlocked) {
                        togglePhase(phaseId);
                        onPhaseSelect?.(phaseId);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                        ? 'text-primary bg-primary/10'
                        : isUnlocked
                          ? 'text-slate-400 hover:bg-slate-800'
                          : 'text-slate-600 cursor-not-allowed'
                      }`}
                  >
                    {/* Status icon */}
                    {phaseCompleted ? (
                      <span className="material-icons text-lg text-emerald-500">check_circle</span>
                    ) : isActive ? (
                      <span className={`material-icons text-lg transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                        chevron_right
                      </span>
                    ) : (
                      <span className="material-icons text-lg text-slate-500">chevron_right</span>
                    )}

                    <span className="flex-1 text-left">{phase.name}</span>

                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>

                  {/* Sub-items (categories) */}
                  {isExpanded && isUnlocked && (
                    <div className="pl-9 pr-2 mt-1 space-y-1">
                      {phase.categories.map(cat => {
                        const catCompleted = cat.forms.every(f => completedForms.includes(f.formId));
                        return (
                          <button
                            key={cat.name}
                            onClick={() => {
                              onPhaseSelect?.(phaseId);
                              if (cat.forms.length > 0) {
                                onSelectForm?.(cat.forms[0].formId);
                              }
                            }}
                            className={`block w-full text-left px-3 py-1.5 text-xs font-medium rounded transition-colors ${catCompleted
                                ? 'text-emerald-400'
                                : 'text-slate-300 hover:text-primary hover:bg-slate-800/50'
                              }`}
                          >
                            {cat.name}
                            {catCompleted && (
                              <span className="material-icons text-xs ml-1 align-middle text-emerald-500">check</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </nav>

      {/* ── User profile footer ────────────────────── */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs text-white font-bold">
            AB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">Auditor</p>
            <p className="text-xs text-slate-400 truncate">
              {completedCount}/{totalForms} forms
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-200">
            <span className="material-icons text-sm">settings</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
