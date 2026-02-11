interface GuidanceTooltipProps {
  title: string;
  message: string;
  onDismiss: () => void;
  onDontShowAgain: () => void;
  visible: boolean;
}

export default function GuidanceTooltip({
  title,
  message,
  onDismiss,
  onDontShowAgain,
  visible,
}: GuidanceTooltipProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="bg-surface-dark/95 backdrop-blur-xl border border-border-dark rounded-xl shadow-2xl shadow-black/40 p-5 ring-1 ring-white/5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="material-icons text-lg text-primary">lightbulb</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <button
                onClick={onDismiss}
                className="text-slate-500 hover:text-slate-300 transition-colors -mr-1"
              >
                <span className="material-icons text-lg">close</span>
              </button>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={onDismiss}
                className="px-3 py-1.5 text-xs font-medium bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Got it
              </button>
              <button
                onClick={onDontShowAgain}
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Don't show again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
