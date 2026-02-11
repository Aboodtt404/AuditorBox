import React from 'react';

export interface AppLayoutProps {
    /** Left sidebar navigation */
    sidebar: React.ReactNode;
    /** Optional right-side context panel (guidance, details, etc.) */
    rightPanel?: React.ReactNode;
    /** Main content area */
    children: React.ReactNode;
    /** Top bar extras (breadcrumbs, engagement context, actions) */
    topBarContent?: React.ReactNode;
}

/**
 * Root layout shell for the AuditorBox app.
 * Fixed 3-column layout: sidebar (w-64) | main content | optional right panel.
 * Replaces the old AppShell that used resizable panels.
 */
const AppLayout: React.FC<AppLayoutProps> = ({
    sidebar,
    rightPanel,
    children,
    topBarContent,
}) => {
    return (
        <div className="flex h-screen overflow-hidden bg-background-dark text-slate-100 font-display">
            {/* ── Sidebar ──────────────────────────────────── */}
            <aside className="w-64 bg-surface-darker border-r border-slate-800 flex-shrink-0 hidden md:flex flex-col">
                {sidebar}
            </aside>

            {/* ── Main area ────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                {topBarContent && (
                    <header className="h-16 flex-shrink-0 px-6 flex items-center justify-between border-b border-slate-800/60 bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
                        {topBarContent}
                    </header>
                )}

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* ── Right panel (optional) ───────────────────── */}
            {rightPanel && (
                <aside className="w-80 xl:w-96 border-l border-slate-800 bg-surface-darker flex-shrink-0 overflow-y-auto hidden lg:block">
                    {rightPanel}
                </aside>
            )}
        </div>
    );
};

export default AppLayout;
