import { useState } from 'react';

interface Form {
  formId: string;
  title: string;
  type: string;
}

interface Category {
  id: string;
  name: string;
  formCount: number;
  forms: Form[];
}

interface Props {
  category: Category;
  phaseColor?: string;
  completedForms: string[];
  onSelectForm: (formId: string) => void;
}

const FORM_TYPE_ICONS: Record<string, string> = {
  worksheet: 'table_chart',
  procedure: 'checklist',
  leadsheet: 'summarize',
  checklist: 'task_alt',
};

export default function StageCard({ category, phaseColor = '#3c83f6', completedForms, onSelectForm }: Props) {
  const [expanded, setExpanded] = useState(false);
  const completedCount = completedForms.filter(id => category.forms.some(f => f.formId === id)).length;
  const progress = category.formCount ? (completedCount / category.formCount) * 100 : 0;
  const allDone = progress === 100 && category.formCount > 0;

  return (
    <div
      className={`bg-surface-darker rounded-xl border transition-all ${allDone ? 'border-emerald-500/30' : 'border-slate-800 hover:border-slate-600'
        }`}
    >
      {/* Header */}
      <button
        className="w-full p-5 flex items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${allDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-primary'
              }`}
          >
            {allDone ? (
              <span className="material-icons text-xl">check_circle</span>
            ) : (
              <span>{completedCount}/{category.formCount}</span>
            )}
          </div>
          <div className="min-w-0">
            <span className="block font-medium text-sm text-white truncate">{category.name}</span>
            <span className="block text-xs text-slate-500">{category.formCount} forms</span>
          </div>
        </div>

        <span className={`material-icons text-xl text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Progress bar */}
      <div className="px-5 pb-4">
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: allDone ? '#10b981' : phaseColor,
            }}
          />
        </div>
      </div>

      {/* Expanded form list */}
      {expanded && (
        <div className="px-4 pb-4 space-y-1 border-t border-slate-800 pt-3">
          {category.forms.map(form => {
            const done = completedForms.includes(form.formId);
            return (
              <button
                key={form.formId}
                onClick={(e) => { e.stopPropagation(); onSelectForm(form.formId); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors text-left group"
              >
                <span className={`material-icons text-lg ${done ? 'text-emerald-500' : 'text-slate-600'}`}>
                  {done ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm truncate ${done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {form.title}
                  </span>
                  <span className="block text-[10px] text-slate-600 font-mono">{form.formId}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 capitalize">
                  {form.type}
                </span>
                <span className="material-icons text-base text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
