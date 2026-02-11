import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { motion } from 'framer-motion';
import { Bell, Menu, Lock, Check, DollarSign, FileSpreadsheet, Users, Building2, Calculator } from 'lucide-react';
import { PHASE_IDS, PHASE_NARRATIVES, PHASE_COLORS, type PhaseId } from '../../data/hubForms';

interface AppShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  guidance: React.ReactNode;
  clientName?: string;
  yearEnd?: string;
  activeView: string;
  onNavigate: (view: string) => void;
  // Journey state
  currentPhaseId?: string;
  unlockedPhases?: Set<string>;
  onPhaseSelect?: (phaseId: string) => void;
  getPhaseProgress?: (phaseId: string) => number;
}

export default function AppShell({
  children,
  sidebar,
  guidance,
  clientName,
  yearEnd,
  activeView,
  onNavigate,
  currentPhaseId = '1_onboarding',
  unlockedPhases,
  onPhaseSelect,
  getPhaseProgress,
}: AppShellProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800">
        {/* Top bar */}
        <div className="h-14 flex items-center px-4 justify-between">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-blue-400">
              <Menu size={20} />
            </button>
            <span className="font-bold text-xl text-blue-400">AuditorBox</span>
          </div>

          {/* Phase Stepper */}
          <div className="flex items-center gap-1">
            {PHASE_IDS.map((phaseId, idx) => {
              const isActive = phaseId === currentPhaseId;
              const isUnlocked = unlockedPhases ? unlockedPhases.has(phaseId) : true;
              const colors = PHASE_COLORS[phaseId];
              const progress = getPhaseProgress ? getPhaseProgress(phaseId) : 0;
              const isComplete = progress === 100;
              const narrative = PHASE_NARRATIVES[phaseId];

              return (
                <React.Fragment key={phaseId}>
                  {idx > 0 && (
                    <div className={`w-6 h-0.5 ${isUnlocked ? 'bg-gray-600' : 'bg-gray-800'}`} />
                  )}
                  <button
                    onClick={() => isUnlocked && onPhaseSelect?.(phaseId)}
                    disabled={!isUnlocked}
                    className={`relative group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gray-800'
                        : isUnlocked
                        ? 'hover:bg-gray-800/50'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    title={narrative?.title || phaseId}
                  >
                    {/* Phase circle with progress ring */}
                    <div className="relative w-7 h-7">
                      {/* Progress ring */}
                      {isUnlocked && !isComplete && progress > 0 && (
                        <svg className="absolute inset-0 w-7 h-7 transform -rotate-90" viewBox="0 0 28 28">
                          <circle cx="14" cy="14" r="12" fill="none" stroke="#374151" strokeWidth="2" />
                          <circle
                            cx="14" cy="14" r="12" fill="none"
                            stroke={colors.accent}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 12}`}
                            strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress / 100)}`}
                          />
                        </svg>
                      )}
                      <div
                        className={`absolute inset-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all ${
                          isComplete
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : isActive
                            ? `border-2 text-white`
                            : isUnlocked
                            ? 'border-gray-600 text-gray-400'
                            : 'border-gray-700 text-gray-500'
                        }`}
                        style={isActive && !isComplete ? { borderColor: colors.accent, color: colors.accent } : undefined}
                      >
                        {isComplete ? (
                          <Check size={14} strokeWidth={3} />
                        ) : !isUnlocked ? (
                          <Lock size={12} />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Phase label (show for active, hide on small screens for others) */}
                    <span
                      className={`text-xs font-medium hidden lg:inline ${
                        isActive ? 'text-white' : isUnlocked ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {narrative?.title || `Phase ${idx + 1}`}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activePhase"
                        className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Right side: utility buttons + client info */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('financials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === 'financials'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <DollarSign size={14} />
              <span className="hidden md:inline">Financials</span>
            </button>
            <button
              onClick={() => onNavigate('adjustments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === 'adjustments'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <FileSpreadsheet size={14} />
              <span className="hidden md:inline">Adjustments</span>
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === 'calculator'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Calculator size={14} />
              <span className="hidden md:inline">Calculator</span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <button
              onClick={() => onNavigate('users')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === 'users'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Users size={14} />
              <span className="hidden lg:inline">Team</span>
            </button>
            <button
              onClick={() => onNavigate('clients')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === 'clients'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Building2 size={14} />
              <span className="hidden lg:inline">Clients</span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">{clientName}</div>
              <div className="text-xs text-gray-500">YE {yearEnd}</div>
            </div>
            <button className="text-gray-400 hover:text-blue-400">
              <Bell size={20} />
            </button>
          </div>
        </div>
      </header>
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={18} minSize={0} collapsible>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full border-r border-gray-800 bg-gray-900/50"
          >
            {sidebar}
          </motion.div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-500 transition-colors flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-600 rounded-full" />
        </PanelResizeHandle>
        <Panel>
          <div className="h-full overflow-auto">{children}</div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-gray-800 hover:bg-blue-500 transition-colors flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-600 rounded-full" />
        </PanelResizeHandle>
        <Panel defaultSize={20} minSize={0} collapsible>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full border-l border-gray-800 bg-gray-900/50"
          >
            {guidance}
          </motion.div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
