import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { PHASE_IDS, HUB_FORMS, type PhaseId } from '../data/hubForms';
import { useFormCompletion } from './useFormCompletion';
import * as api from '../api/api-functions';

const UNLOCK_THRESHOLD = 0.6; // 60% completion to unlock next phase
const LS_KEY_DISMISSED = 'auditorbox_dismissed_tooltips';
const LS_KEY_PHASE_INTROS = 'auditorbox_seen_phase_intros';

export interface GuidancePopup {
  id: string;
  title: string;
  message: string;
}

export interface JourneyState {
  currentPhaseIndex: number;
  currentPhaseId: PhaseId;
  unlockedPhases: Set<string>;
  showPhaseIntro: boolean;
  guidancePopup: GuidancePopup | null;
  phaseProgress: Record<string, { completed: number; total: number }>;
  completedFormIds: string[];
  // Actions
  setCurrentPhaseIndex: (index: number) => void;
  navigateToPhase: (phaseId: string) => void;
  dismissPhaseIntro: () => void;
  dismissGuidancePopup: () => void;
  permanentlyDismissTooltip: (id: string) => void;
  isPhaseUnlocked: (phaseId: string) => boolean;
  getPhaseProgress: (phaseId: string) => number;
  selectForm: (formId: string) => void;
  updateForm: (formId: string, values: Record<string, unknown>) => void;
  getFormValues: (formId: string) => Record<string, any>;
  isHubForm: (formId: string) => boolean;
  selectedFormId: string | null;
  setSelectedFormId: (id: string | null) => void;
}

const JourneyContext = createContext<JourneyState | null>(null);

function loadDismissedTooltips(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY_DISMISSED);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function loadSeenIntros(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY_PHASE_INTROS);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/** Save preferences to backend (fire-and-forget) */
function savePrefsToBackend(dismissed: Set<string>, seenIntros: Set<string>) {
  try {
    api.updateUserPreferences({
      dismissedTooltips: [...dismissed],
      seenPhaseIntros: [...seenIntros],
      lastEngagementId: [],
    }).catch(() => { /* silent fail — localStorage is the fallback */ });
  } catch {
    // ignore
  }
}

const GUIDANCE_MESSAGES: Record<string, GuidancePopup> = {
  phase_enter_1_onboarding: {
    id: 'phase_enter_1_onboarding',
    title: 'Welcome to Engagement Setup',
    message: 'Start by reviewing the acceptance questionnaire (Form Q). This form drives your entire engagement setup.',
  },
  phase_enter_2_planning: {
    id: 'phase_enter_2_planning',
    title: 'Planning Phase Unlocked',
    message: 'Great progress! Now set materiality thresholds in Form 420 and document your audit strategy in Form 520E.',
  },
  phase_enter_3_risk: {
    id: 'phase_enter_3_risk',
    title: 'Risk Assessment Phase',
    message: 'Identify and assess risks of material misstatement. Form 605 is your risk register hub.',
  },
  phase_enter_4_testing: {
    id: 'phase_enter_4_testing',
    title: 'Evidence Gathering Phase',
    message: 'Execute your planned procedures. Form 335 tracks substantive testing and Form 530 handles sampling.',
  },
  phase_enter_5_completion: {
    id: 'phase_enter_5_completion',
    title: 'Almost Done!',
    message: 'Review your findings, evaluate misstatements in Form 360-3, and prepare your audit opinion.',
  },
  unlock_next: {
    id: 'unlock_next',
    title: 'Phase Unlocked!',
    message: 'You\'ve made enough progress to move to the next phase. Keep going!',
  },
};

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const { completedFormIds, completions, updateForm, phaseProgress } = useFormCompletion();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [guidancePopup, setGuidancePopup] = useState<GuidancePopup | null>(null);
  const [dismissedTooltips, setDismissedTooltips] = useState<Set<string>>(loadDismissedTooltips);
  const [seenIntros, setSeenIntros] = useState<Set<string>>(loadSeenIntros);

  // Hydrate from backend preferences on mount
  useEffect(() => {
    api.getUserPreferences().then(prefs => {
      if (prefs.dismissedTooltips.length > 0 || prefs.seenPhaseIntros.length > 0) {
        setDismissedTooltips(prev => {
          const merged = new Set([...prev, ...prefs.dismissedTooltips]);
          localStorage.setItem(LS_KEY_DISMISSED, JSON.stringify([...merged]));
          return merged;
        });
        setSeenIntros(prev => {
          const merged = new Set([...prev, ...prefs.seenPhaseIntros]);
          localStorage.setItem(LS_KEY_PHASE_INTROS, JSON.stringify([...merged]));
          return merged;
        });
      }
    }).catch(() => { /* use localStorage fallback */ });
  }, []);

  const currentPhaseId = PHASE_IDS[currentPhaseIndex];

  // Demo mode: all phases unlocked for platform demonstration
  // TODO: Re-enable progressive unlocking for production
  const unlockedPhases = useMemo(() => {
    return new Set<string>(PHASE_IDS);
  }, []);

  // Show phase intro if we haven't seen it yet
  const showPhaseIntro = !seenIntros.has(currentPhaseId);

  // Show guidance popup when entering a new phase
  useEffect(() => {
    const popupId = `phase_enter_${currentPhaseId}`;
    if (!dismissedTooltips.has(popupId) && GUIDANCE_MESSAGES[popupId]) {
      setGuidancePopup(GUIDANCE_MESSAGES[popupId]);
    }
  }, [currentPhaseId, dismissedTooltips]);

  const dismissPhaseIntro = useCallback(() => {
    setSeenIntros(prev => {
      const next = new Set(prev);
      next.add(currentPhaseId);
      localStorage.setItem(LS_KEY_PHASE_INTROS, JSON.stringify([...next]));
      savePrefsToBackend(dismissedTooltips, next);
      return next;
    });
  }, [currentPhaseId, dismissedTooltips]);

  const dismissGuidancePopup = useCallback(() => {
    setGuidancePopup(null);
  }, []);

  const permanentlyDismissTooltip = useCallback((id: string) => {
    setDismissedTooltips(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(LS_KEY_DISMISSED, JSON.stringify([...next]));
      savePrefsToBackend(next, seenIntros);
      return next;
    });
    setGuidancePopup(null);
  }, [seenIntros]);

  const isPhaseUnlocked = useCallback(
    (phaseId: string) => unlockedPhases.has(phaseId),
    [unlockedPhases],
  );

  const getPhaseProgressPct = useCallback(
    (phaseId: string): number => {
      const p = phaseProgress[phaseId];
      if (!p || p.total === 0) return 0;
      return Math.round((p.completed / p.total) * 100);
    },
    [phaseProgress],
  );

  const navigateToPhase = useCallback(
    (phaseId: string) => {
      const idx = PHASE_IDS.indexOf(phaseId as PhaseId);
      if (idx >= 0 && unlockedPhases.has(phaseId)) {
        setCurrentPhaseIndex(idx);
      }
    },
    [unlockedPhases],
  );

  const selectForm = useCallback((formId: string) => {
    setSelectedFormId(formId);
  }, []);

  const isHubForm = useCallback((formId: string): boolean => {
    return Object.values(HUB_FORMS).some(forms => forms.includes(formId));
  }, []);

  const getFormValues = useCallback((formId: string): Record<string, any> => {
    return (completions[formId]?.values as Record<string, any>) || {};
  }, [completions]);

  const value: JourneyState = {
    currentPhaseIndex,
    currentPhaseId,
    unlockedPhases,
    showPhaseIntro,
    guidancePopup,
    phaseProgress,
    completedFormIds,
    setCurrentPhaseIndex,
    navigateToPhase,
    dismissPhaseIntro,
    dismissGuidancePopup,
    permanentlyDismissTooltip,
    isPhaseUnlocked,
    getPhaseProgress: getPhaseProgressPct,
    selectForm,
    updateForm,
    getFormValues,
    isHubForm,
    selectedFormId,
    setSelectedFormId,
  };

  return React.createElement(JourneyContext.Provider, { value }, children);
}

export function useJourney(): JourneyState {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider');
  return ctx;
}
