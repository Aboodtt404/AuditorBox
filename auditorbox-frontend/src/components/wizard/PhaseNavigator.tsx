import React, { useState, useMemo } from 'react';
import { PHASES } from '../../data/phases';
import { PHASE_IDS, PHASE_COLORS, PHASE_NARRATIVES } from '../../data/hubForms';
import StageCard from './StageCard';

const getPhaseProgress = (phaseId: string, completedForms: string[]): number => {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return 0;
  const totalForms = phase.categories.reduce((acc, cat) => acc + cat.forms.length, 0);
  if (totalForms === 0) return 100;
  const completedCount = completedForms.filter(formId =>
    phase.categories.some(cat => cat.forms.some(f => f.formId === formId))
  ).length;
  return Math.round((completedCount / totalForms) * 100);
};

const PhaseNavigator: React.FC<{
  completedForms: string[];
  onSelectForm: (formId: string) => void;
  onNavigate: (view: string) => void;
  unlockedPhases?: Set<string>;
  currentPhaseIndex?: number;
  onPhaseSelect?: (phaseId: string) => void;
}> = ({ completedForms, onSelectForm, onNavigate, unlockedPhases, currentPhaseIndex: externalIdx, onPhaseSelect }) => {
  const [internalIndex, setInternalIndex] = useState(externalIdx ?? 0);
  const activePhaseIndex = Math.min(Math.max(0, externalIdx ?? internalIndex), PHASES.length - 1);

  const activePhase = PHASES[activePhaseIndex];
  const isLastPhase = activePhaseIndex === PHASES.length - 1;
  const isFirstPhase = activePhaseIndex === 0;

  const phaseProgress = useMemo(() =>
    getPhaseProgress(activePhase.id, completedForms),
    [activePhase.id, completedForms]
  );

  const handlePhaseClick = (phaseId: string, idx: number) => {
    const isUnlocked = unlockedPhases ? unlockedPhases.has(phaseId) : true;
    if (!isUnlocked) return;
    if (onPhaseSelect) {
      onPhaseSelect(phaseId);
    } else {
      setInternalIndex(idx);
    }
  };

  const handleNext = () => {
    const nextIdx = activePhaseIndex + 1;
    if (nextIdx < PHASES.length) {
      const nextPhaseId = PHASE_IDS[nextIdx];
      const isUnlocked = unlockedPhases ? unlockedPhases.has(nextPhaseId) : true;
      if (isUnlocked) handlePhaseClick(nextPhaseId, nextIdx);
    }
  };

  const handlePrevious = () => {
    if (activePhaseIndex > 0) {
      handlePhaseClick(PHASE_IDS[activePhaseIndex - 1], activePhaseIndex - 1);
    }
  };

  return (
    <div className="min-h-full bg-background-dark flex flex-col font-sans text-slate-100">
      {/* ── Phase Stepper ────────────────────────────── */}
      <div className="px-6 py-6 border-b border-slate-800 bg-surface-darker/50">
        <div className="flex justify-between items-center relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 -z-10" />

          {PHASES.map((phase, index) => {
            const isActive = index === activePhaseIndex;
            const isUnlocked = unlockedPhases ? unlockedPhases.has(phase.id) : true;
            const colors = PHASE_COLORS[phase.id] || PHASE_COLORS['1_onboarding'];
            const progress = getPhaseProgress(phase.id, completedForms);
            const isComplete = progress === 100;

            return (
              <button
                key={phase.id}
                onClick={() => handlePhaseClick(phase.id, index)}
                disabled={!isUnlocked}
                className={`flex flex-col items-center group z-10 ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="relative w-10 h-10">
                  {/* Progress ring */}
                  {isUnlocked && !isComplete && progress > 0 && (
                    <svg className="absolute inset-0 w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="17" fill="none" stroke="#1e293b" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="17" fill="none"
                        stroke={colors.accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 17}`}
                        strokeDashoffset={`${2 * Math.PI * 17 * (1 - progress / 100)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                  )}
                  <div
                    className={`absolute inset-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isComplete
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isActive
                        ? 'text-white ring-4 ring-offset-2 ring-offset-background-dark'
                        : isUnlocked
                          ? 'border-slate-600 bg-surface-darker text-slate-400 group-hover:border-slate-500'
                          : 'border-slate-700 bg-surface-darker text-slate-600'
                      }`}
                    style={isActive && !isComplete ? { borderColor: colors.accent, outlineColor: `${colors.accent}40`, outlineWidth: '4px', outlineStyle: 'solid', outlineOffset: '2px' } : undefined}
                  >
                    {isComplete ? (
                      <span className="material-icons text-xl">check</span>
                    ) : !isUnlocked ? (
                      <span className="material-icons text-base">lock</span>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Active pulse */}
                  {isActive && !isComplete && (
                    <div
                      className="absolute inset-0 w-10 h-10 rounded-full border-2 animate-ping opacity-30"
                      style={{ borderColor: colors.accent }}
                    />
                  )}
                </div>

                <div className="mt-2 text-center max-w-[100px]">
                  <p className={`text-xs font-medium leading-tight ${isActive ? 'text-white font-bold' : isUnlocked ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                    {PHASE_NARRATIVES[phase.id]?.title || phase.name}
                  </p>
                  {isUnlocked && progress > 0 && !isComplete && (
                    <p className="text-xs mt-0.5" style={{ color: colors.accent }}>{progress}%</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 px-6 pb-6 max-w-7xl mx-auto w-full space-y-6 mt-6">
        {/* Phase header */}
        <div className="rounded-xl border border-slate-800 bg-surface-darker p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{activePhase.name}</h2>
              <p className="mt-2 text-slate-400 max-w-3xl">{activePhase.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400">Progress</span>
                <span className={`text-lg font-bold ${phaseProgress === 100 ? 'text-emerald-400' : 'text-primary'}`}>
                  {phaseProgress}%
                </span>
              </div>
              <div className="w-48 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${phaseProgress === 100 ? 'bg-emerald-500' : ''}`}
                  style={phaseProgress < 100 ? { backgroundColor: PHASE_COLORS[activePhase.id]?.accent || '#3c83f6', width: `${phaseProgress}%` } : { width: `${phaseProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePhase.categories.map((category) => (
            <StageCard
              key={category.id}
              category={category}
              phaseColor={PHASE_COLORS[activePhase.id]?.accent || '#6b7280'}
              completedForms={completedForms}
              onSelectForm={onSelectForm}
            />
          ))}
        </div>
      </div>

      {/* ── Navigation Footer ────────────────────────── */}
      <div className="border-t border-slate-800 bg-surface-darker/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={isFirstPhase}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${isFirstPhase
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <span className="material-icons text-xl">arrow_back</span>
            Previous
          </button>

          <div className="text-sm text-slate-500">
            Phase {activePhaseIndex + 1} of {PHASES.length}
          </div>

          <button
            onClick={handleNext}
            disabled={isLastPhase || (unlockedPhases ? !unlockedPhases.has(PHASE_IDS[activePhaseIndex + 1]) : false)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all text-white shadow-sm hover:shadow-md active:scale-[0.98] ${isLastPhase
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : ''
              }`}
            style={!isLastPhase ? { backgroundColor: PHASE_COLORS[activePhase.id]?.accent || '#3c83f6' } : undefined}
          >
            {isLastPhase ? 'Finish Audit' : 'Next Phase'}
            {!isLastPhase && <span className="material-icons text-xl">arrow_forward</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhaseNavigator;
