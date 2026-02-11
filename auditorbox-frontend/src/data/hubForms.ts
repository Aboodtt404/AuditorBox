// Hub forms: key milestone forms that define each audit phase
// These are the critical forms that drive the audit workflow

export const HUB_FORMS: Record<string, string[]> = {
  '1_onboarding': ['Q'],
  '2_planning': ['420.', '520E'],
  '3_risk': ['605', 'CTRLM.'],
  '4_testing': ['335', '530'],
  '5_completion': ['360-3'],
};

// The linear flow of hub forms through the audit
export const HUB_FLOW = ['Q', '420.', '520E', '605', '335', '360-3'];

export const PHASE_NARRATIVES: Record<string, { title: string; description: string }> = {
  '1_onboarding': {
    title: 'Engagement Setup',
    description:
      "Let's set up your engagement and understand the client. Review acceptance criteria, confirm independence, and establish the terms of engagement.",
  },
  '2_planning': {
    title: 'Audit Planning',
    description:
      "Now let's plan our approach and set materiality thresholds. Define the overall audit strategy, identify significant accounts, and establish the scope of work.",
  },
  '3_risk': {
    title: 'Risk Assessment',
    description:
      "Let's assess risks and design our testing response. Evaluate inherent and control risks, identify significant risks, and map controls to assertions.",
  },
  '4_testing': {
    title: 'Evidence Gathering',
    description:
      "Time to execute \u2014 test balances and gather evidence. Perform substantive procedures, tests of details, and analytical procedures to obtain sufficient appropriate audit evidence.",
  },
  '5_completion': {
    title: 'Completion & Reporting',
    description:
      "Wrap up findings, evaluate misstatements, form your opinion. Review subsequent events, obtain management representations, and prepare the audit report.",
  },
};

export const PHASE_IDS = ['1_onboarding', '2_planning', '3_risk', '4_testing', '5_completion'] as const;
export type PhaseId = (typeof PHASE_IDS)[number];

export const PHASE_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  '1_onboarding': { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500', accent: '#3b82f6' },
  '2_planning': { bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500', accent: '#8b5cf6' },
  '3_risk': { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500', accent: '#ef4444' },
  '4_testing': { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500', accent: '#f59e0b' },
  '5_completion': { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', accent: '#10b981' },
};
