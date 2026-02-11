import { HUB_FLOW, PHASE_NARRATIVES, HUB_FORMS, PHASE_COLORS } from '../../data/hubForms';
import { PHASES } from '../../data/phases';

interface PhaseIntroProps {
  phaseId: string;
  activePhaseIndex: number;
  phaseProgress: Record<string, { completed: number; total: number }>;
  completedFormIds: string[];
  onStart: () => void;
  onSelectForm: (formId: string) => void;
}

export default function PhaseIntro({
  phaseId,
  activePhaseIndex,
  phaseProgress,
  completedFormIds,
  onStart,
  onSelectForm,
}: PhaseIntroProps) {
  // const activePhaseIndex = PHASES.findIndex(p => p.id === phaseId); // Removed internal calculation

  // Calculate overall progress
  const totalForms = PHASES.reduce((acc, phase) => {
    const progress = phaseProgress[phase.id];
    return acc + (progress?.total || 0);
  }, 0);

  const totalCompleted = PHASES.reduce((acc, phase) => {
    const progress = phaseProgress[phase.id];
    return acc + (progress?.completed || 0);
  }, 0);

  const overallProgress = totalForms > 0 ? Math.round((totalCompleted / totalForms) * 100) : 0;

  return (
    <div className="min-h-full bg-background-dark p-8 animate-in fade-in space-y-8 text-slate-100">

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Acme Corp</span>
            <span className="material-icons text-[10px]">chevron_right</span>
            <span className="text-slate-500">FY2024 Audit</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Engagement Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors shadow-sm">
            <span className="material-icons text-lg">share</span>
            Share Engagement
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-inflo-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-900/50">
            <span className="material-icons text-lg">add_circle</span>
            Request Node Access
          </button>
        </div>
      </div>

      {/* ── Hero Progress Card ───────────────────────── */}
      <div className="bg-surface-darker rounded-xl p-8 text-white shadow-lg relative overflow-hidden border border-slate-800">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-inflo-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Stepper */}
          <div className="flex-1">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />

              {PHASES.map((p, idx) => {
                const isActive = idx === activePhaseIndex;
                const isCompleted = idx < activePhaseIndex;

                return (
                  <div key={p.id} className="flex flex-col items-center gap-3 bg-surface-darker px-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                      ${isActive ? 'bg-inflo-blue border-inflo-blue text-white shadow-lg shadow-inflo-blue/50' :
                        isCompleted ? 'bg-slate-800 border-slate-700 text-slate-400' :
                          'bg-surface-darker border-slate-800 text-slate-600'}
                    `}>
                      {isCompleted ? <span className="material-icons text-base">check</span> : idx + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-600'}`}>
                      {p.name.split(' ')[0]} {/* Shorten name for stepper */}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <span className="text-xs font-bold text-inflo-blue uppercase tracking-wider mb-1 block">Current Phase</span>
              <h3 className="text-xl font-bold">{PHASE_NARRATIVES[phaseId]?.title || 'Audit Phase'}</h3>
            </div>
          </div>

          {/* KPI Widget */}
          <div className="w-px bg-slate-800 hidden lg:block" />

          <div className="lg:w-72 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
              <span className="text-2xl font-bold text-slate-100">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-inflo-blue rounded-full" style={{ width: `${overallProgress}%` }} />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500/20 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Blockchain Sync</div>
                <div className="text-sm font-bold text-emerald-400">Live • Block 18,245,901</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase Cards Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {PHASES.map((p, idx) => {
          const isActive = idx === activePhaseIndex;
          const isLocked = idx > activePhaseIndex;
          const colors = PHASE_COLORS[p.id] || PHASE_COLORS['1_onboarding'];

          return (
            <div
              key={p.id}
              className={`
                group bg-surface-darker rounded-xl border-t-4 shadow-lg hover:shadow-xl transition-all relative overflow-hidden
                ${isActive ? 'ring-1 ring-inflo-blue ring-offset-1 ring-offset-background-dark' : 'border-slate-800'}
              `}
              style={{ borderColor: isActive ? colors.accent : undefined, borderTopColor: colors.accent }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${colors.accent}1a`, color: colors.accent }}>
                    <span className="material-icons">
                      {idx === 0 ? 'assignment_turned_in' : idx === 1 ? 'calendar_today' : idx === 2 ? 'timeline' : 'verified'}
                    </span>
                  </div>
                  {isActive && (
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-900/50">
                      Active Phase
                    </span>
                  )}
                  {isLocked && (
                    <span className="px-2 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded border border-slate-700">
                      Locked
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-2">{p.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">
                  {PHASE_NARRATIVES[p.id]?.description || 'Phase description goes here...'}
                </p>

                {isActive ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        <span>Progress</span>
                        <span>{phaseProgress[p.id]?.total ? Math.round((phaseProgress[p.id].completed / phaseProgress[p.id].total) * 100) : 0}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${phaseProgress[p.id]?.total ? Math.round((phaseProgress[p.id].completed / phaseProgress[p.id].total) * 100) : 0}%`, backgroundColor: colors.accent }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={onStart}
                      className="w-full py-2.5 rounded-lg text-sm font-bold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:text-white transition-all"
                    >
                      Finalize Setup
                    </button>
                  </div>
                ) : isLocked ? (
                  <button disabled className="w-full py-2.5 rounded-lg text-sm font-bold text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed">
                    Locked
                  </button>
                ) : (
                  <button className="w-full py-2.5 rounded-lg text-sm font-bold text-inflo-blue bg-blue-900/10 border border-blue-900/30 hover:bg-blue-900/20 transition-all">
                    View Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Widget: Blockchain Status ─────────── */}
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100 mt-8 mb-4">
        <span className="material-icons text-inflo-blue">hub</span>
        Blockchain Node Status
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-darker border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node #01</span>
              <h4 className="text-base font-bold text-slate-200">ICP Mainnet Connection</h4>
            </div>
            <span className="material-icons text-emerald-400 bg-emerald-500/10 rounded-full p-1 text-sm border border-emerald-500/20">check</span>
          </div>
          <div className="flex items-end justify-between mt-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs border border-indigo-500/20">A</div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-600">CANISTER ID</span>
                <span className="text-xs font-mono text-slate-400">bkyz2...cai</span>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">Latency: 24ms</span>
          </div>
          <div className="mt-4 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full opacity-50" />
        </div>

        <div className="bg-surface-darker border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Module</span>
              <h4 className="text-base font-bold text-slate-200">Wallet Screening</h4>
            </div>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-700">Idle</span>
          </div>
          <p className="text-xs text-slate-500 mt-6 mb-4">Automated AML/KYC screening for participating wallet addresses.</p>
          <div className="w-full flex justify-end">
            <span className="text-[10px] text-slate-600 font-medium">Last scan: 2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
