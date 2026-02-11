import { AuthClient } from '@dfinity/auth-client';
import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { initializeBackend } from './api/backend';
import { CONFIG } from './config';
import * as api from './api/api-functions';
import { EngagementContext, DEFAULT_ENGAGEMENT, useBackendEngagement, type EngagementConfig } from './hooks/useEngagement';
import { JourneyProvider, useJourney } from './hooks/useJourneyState';
import { HUB_FORMS } from './data/hubForms';
import AppLayout from './components/layout/AppLayout';
import Sidebar from './components/layout/Sidebar';
import CommandPalette from './components/layout/CommandPalette';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#050810] text-inflo-text-main p-8 font-sans">
          <h1 className="text-2xl font-bold text-red-500 mb-4 tracking-tight">Something went wrong</h1>
          <pre className="text-sm text-slate-400 max-w-2xl overflow-auto whitespace-pre-wrap bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            {this.state.error.message}
          </pre>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-inflo-blue text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-inflo-blue/20">
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-loaded views (code-split heavy components)
const PhaseIntro = lazy(() => import('./components/wizard/PhaseIntro'));
const PhaseNavigator = lazy(() => import('./components/wizard/PhaseNavigator'));
const AuditFormViewer = lazy(() => import('./components/forms/AuditFormViewer'));
const AuditGraph = lazy(() => import('./components/graph/AuditGraph'));
const TrialBalanceView = lazy(() => import('./components/financials/TrialBalanceView'));
const AdjustmentsPage = lazy(() => import('./pages/AdjustmentsPage'));
const WorkbookList = lazy(() => import('./components/excel/WorkbookList'));
const ExpertGuidance = lazy(() => import('./components/forms/ExpertGuidance'));
const GuidanceTooltip = lazy(() => import('./components/wizard/GuidanceTooltip'));
const UserManagement = lazy(() => import('./components/admin/UserManagement'));
const ClientOrgManagement = lazy(() => import('./components/admin/ClientOrgManagement'));
const AuditCalculator = lazy(() => import('./components/demo/AuditCalculator'));
const EngagementSelector = lazy(() => import('./components/engagement/EngagementSelector'));

const ViewSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

type View = 'phase-intro' | 'phase-forms' | 'form' | 'graph' | 'financials' | 'adjustments' | 'users' | 'clients' | 'calculator';

const AuditApp: React.FC<{ principal: string; onLogout: () => void; engagementId: bigint }> = ({ principal, onLogout, engagementId }) => {
  const journey = useJourney();
  const [activeView, setActiveView] = useState<View>('phase-intro');
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const { config: engagement, setConfig: setEngagement } = useBackendEngagement(engagementId);
  const [formsData, setFormsData] = useState<Record<string, any> | null>(null);

  // Lazy-load forms data on first use
  useEffect(() => {
    import('./data/forms').then(mod => setFormsData(mod.FORMS));
  }, []);

  // Cmd+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navigate = useCallback((view: string) => {
    const v = view.toLowerCase();
    if (v === 'financials') setActiveView('financials');
    else if (v === 'adjustments') setActiveView('adjustments');
    else if (v === 'graph') setActiveView('graph');
    else if (v === 'users') setActiveView('users');
    else if (v === 'clients') setActiveView('clients');
    else if (v === 'calculator') setActiveView('calculator');
    else if (v === 'forms' || v === 'phase-forms') setActiveView('phase-forms');
    else if (v === 'phases' || v === 'dashboard' || v === 'phase-intro') setActiveView('phase-intro');
    else setActiveView('phase-intro');
  }, []);

  const selectForm = useCallback((formId: string) => {
    journey.setSelectedFormId(formId);
    setActiveView('form');
  }, [journey]);

  const handlePhaseSelect = useCallback((phaseId: string) => {
    journey.navigateToPhase(phaseId);
    setActiveView('phase-intro');
  }, [journey]);

  const handlePhaseIntroStart = useCallback(() => {
    journey.dismissPhaseIntro();
    setActiveView('phase-forms');
  }, [journey]);

  const selectedFormId = journey.selectedFormId;
  const selectedForm = selectedFormId && formsData ? formsData[selectedFormId] : null;

  const isHubForm = selectedFormId
    ? Object.values(HUB_FORMS).some(forms => forms.includes(selectedFormId))
    : false;

  const renderView = () => {
    const viewContent = (() => {
      switch (activeView) {
        case 'phase-intro':
          return (
            <PhaseIntro
              phaseId={journey.currentPhaseId}
              activePhaseIndex={journey.currentPhaseIndex}
              phaseProgress={journey.phaseProgress}
              completedFormIds={journey.completedFormIds}
              onStart={handlePhaseIntroStart}
              onSelectForm={selectForm}
            />
          );
        case 'phase-forms':
          return (
            <PhaseNavigator
              completedForms={journey.completedFormIds}
              onSelectForm={selectForm}
              onNavigate={navigate}
              unlockedPhases={journey.unlockedPhases}
              currentPhaseIndex={journey.currentPhaseIndex}
              onPhaseSelect={handlePhaseSelect}
            />
          );
        case 'form':
          return selectedFormId ? (
            <AuditFormViewer
              formId={selectedFormId}
              values={journey.getFormValues(selectedFormId)}
              onSave={(fid: string, vals: any) => journey.updateForm(fid, vals)}
              onNavigate={selectForm}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              Select a form from the sidebar
            </div>
          );
        case 'graph':
          return <AuditGraph onSelectForm={selectForm} />;
        case 'financials':
          return (
            <TrialBalanceView
              accounts={[]}
              onImport={() => { }}
              onExport={() => { }}
              materiality={engagement.materiality.overall}
            />
          );
        case 'adjustments':
          return <AdjustmentsPage />;
        case 'users':
          return <UserManagement />;
        case 'clients':
          return <ClientOrgManagement />;
        case 'calculator':
          return <AuditCalculator />;
        default:
          return null;
      }
    })();
    return <Suspense fallback={<ViewSpinner />}>{viewContent}</Suspense>;
  };

  const guidancePanel = (activeView === 'form' && selectedForm) ? (
    <Suspense fallback={<ViewSpinner />}>
      <ExpertGuidance
        expertNote={selectedForm.expertNote || ''}
        linkedForms={[
          ...(selectedForm.graph?.edgesOut || []).map((edge: any) => ({ formId: edge.target, title: formsData?.[edge.target]?.title || edge.target, direction: 'out' as const })),
          ...(selectedForm.graph?.edgesIn || []).map((edge: any) => ({ formId: edge.source || edge.target, title: formsData?.[edge.source || edge.target]?.title || edge.source || edge.target, direction: 'in' as const })),
        ]}
        isaStandards={selectedForm.isaStandards || []}
        onNavigateForm={selectForm}
        currentFormId={selectedFormId || undefined}
        isHubForm={isHubForm}
        onViewFullGraph={() => setActiveView('graph')}
      />
    </Suspense>
  ) : null;

  // Top bar content
  const topBar = (
    <>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">{engagement.clientName}</h2>
        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400">
          FY {engagement.yearEnd}
        </span>
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Node Synced
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCmdPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-dark border border-slate-700 rounded-lg text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
        >
          <span className="material-icons text-base">search</span>
          <span>Search</span>
          <kbd className="ml-2 px-1.5 text-[10px] font-mono bg-slate-800 border border-slate-600 rounded">⌘K</kbd>
        </button>
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <span className="material-icons text-xl">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs text-white font-bold cursor-pointer">
          AB
        </div>
      </div>
    </>
  );

  return (
    <EngagementContext.Provider value={{ config: engagement, setConfig: setEngagement, engagementId }}>
      <AppLayout
        sidebar={
          <Sidebar
            activeView={activeView}
            onNavigate={navigate}
            completedForms={journey.completedFormIds}
            onSelectForm={selectForm}
            currentPhaseId={journey.currentPhaseId}
            unlockedPhases={journey.unlockedPhases}
            onPhaseSelect={handlePhaseSelect}
          />
        }
        rightPanel={guidancePanel}
        topBarContent={topBar}
      >
        {renderView()}
      </AppLayout>

      {/* Guidance Tooltip */}
      {journey.guidancePopup && (
        <Suspense fallback={null}>
          <GuidanceTooltip
            title={journey.guidancePopup.title}
            message={journey.guidancePopup.message}
            onDismiss={journey.dismissGuidancePopup}
            onDontShowAgain={() => journey.permanentlyDismissTooltip(journey.guidancePopup!.id)}
            visible={true}
          />
        </Suspense>
      )}

      <CommandPalette
        open={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onNavigate={navigate}
        onSelectForm={selectForm}
      />
      <Toaster position="bottom-right" theme="dark" />
    </EngagementContext.Provider>
  );
};

const AuditAppWithJourney: React.FC<{ principal: string; onLogout: () => void; engagementId: bigint }> = (props) => (
  <JourneyProvider>
    <AuditApp {...props} />
  </JourneyProvider>
);

// ─── Login Screen ───────────────────────────────────────────────────────────

const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="relative flex flex-col items-center justify-center h-screen bg-[#050810] text-inflo-text-main overflow-hidden font-sans">
    {/* Background Gradients */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-inflo-blue/5 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-inflo-teal/5 rounded-full blur-3xl opacity-30" />
    </div>

    {/* Main Card */}
    <div className="relative z-10 flex flex-col items-center">

      {/* Logo Section */}
      <div className="mb-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-inflo-blue to-inflo-blue/80 rounded-2xl flex items-center justify-center shadow-lg shadow-inflo-blue/20 mb-6">
          <span className="material-icons text-white text-3xl">verified_user</span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          Auditor<span className="text-inflo-blue">Box</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-wide">Professional Audit Management Platform</p>
      </div>

      {/* Login Button */}
      <button
        onClick={onLogin}
        className="group relative flex items-center gap-3 px-8 py-4 bg-inflo-blue hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-inflo-blue/25 hover:shadow-inflo-blue/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="material-icons text-2xl">fingerprint</span>
        <span className="text-[15px] font-semibold tracking-wide">Sign in with Internet Identity</span>
      </button>

      {/* Security Badge */}
      <div className="mt-12 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800/50 text-slate-500 text-xs font-medium">
        <span className="material-icons text-[14px]">lock</span>
        <span>End-to-end encrypted session</span>
      </div>
    </div>

    {/* Footer */}
    <div className="absolute bottom-8 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-slate-400 tracking-wider">
        <span className="material-icons text-[12px] text-inflo-teal">bolt</span>
        POWERED BY INTERNET COMPUTER
      </div>
      <div className="flex items-center gap-6 text-[11px] text-slate-600 font-medium">
        <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
        <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-slate-400 cursor-pointer transition-colors">Support</span>
      </div>
    </div>
  </div>
);

// ─── App Root ───────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [engagementId, setEngagementId] = useState<bigint | null>(null);

  const initAuth = useCallback(async () => {
    try {
      const ac = await AuthClient.create();
      setAuthClient(ac);
      if (await ac.isAuthenticated()) {
        const identity = ac.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
        await initializeBackend(identity);
        try {
          await api.getCurrentUser();
        } catch (e) {
          console.error("Failed to register user in backend:", e);
        }
      }
    } catch (err) {
      console.error('Auth init failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { initAuth(); }, [initAuth]);

  const login = useCallback(() => {
    if (!authClient) return;
    authClient.login({
      identityProvider: CONFIG.IDENTITY_PROVIDER,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1_000_000_000),
      onSuccess: async () => {
        try {
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toText());
          await initializeBackend(identity);
          await api.getCurrentUser();
        } catch (err) {
          console.error('Login onSuccess error:', err);
          setPrincipal(authClient.getIdentity().getPrincipal().toText());
        }
      },
      onError: (err) => {
        console.error('II login error:', err);
      },
    });
  }, [authClient]);

  const logout = useCallback(async () => {
    if (!authClient) return;
    await authClient.logout();
    setPrincipal('');
    setEngagementId(null);
  }, [authClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050810] text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-inflo-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">Initializing AuditorBox...</p>
        </div>
      </div>
    );
  }

  // Dev bypass: ?dev=1 on localhost skips II auth for testing
  const isDevBypass = CONFIG.IS_LOCAL && new URLSearchParams(window.location.search).get('dev') === '1';

  if (!principal && !isDevBypass) {
    return <LoginScreen onLogin={login} />;
  }

  // Engagement selection screen
  if (!engagementId) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#050810]"><div className="w-8 h-8 border-2 border-inflo-blue border-t-transparent rounded-full animate-spin" /></div>}>
        <EngagementSelector onSelect={setEngagementId} onLogout={logout} />
      </Suspense>
    );
  }

  return <AuditAppWithJourney principal={principal || 'dev-test-principal'} onLogout={logout} engagementId={engagementId} />;
};

// Fix for "Do not know how to serialize a BigInt" errors
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
