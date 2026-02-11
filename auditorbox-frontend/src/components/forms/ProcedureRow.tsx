import { Check } from 'lucide-react';
import React, { useState } from 'react';

type Procedure = {
  id?: string;
  text: string;
  assertions?: string[];
  hierarchy?: string;
};

type Props = {
  procedure: Procedure;
  completed: boolean;
  response: string;
  onToggle: () => void;
  onResponseChange: (val: string) => void;
};

const assertionLabels: Record<string, string> = {
  C: 'Completeness',
  E: 'Existence',
  V: 'Valuation',
  PD: 'Presentation & Disclosure',
  RO: 'Rights & Obligations',
  A: 'Accuracy',
  CO: 'Cut-off',
  O: 'Occurrence',
  CL: 'Classification',
};

const getAssertionStyle = (assertion: string): string => {
  const styleMap: Record<string, string> = {
    C: 'text-purple-300 border-purple-800 bg-purple-900/40',
    E: 'text-blue-300 border-blue-800 bg-blue-900/40',
    V: 'text-orange-300 border-orange-800 bg-orange-900/40',
    PD: 'text-pink-300 border-pink-800 bg-pink-900/40',
    RO: 'text-teal-300 border-teal-800 bg-teal-900/40',
    A: 'text-cyan-300 border-cyan-800 bg-cyan-900/40',
    CO: 'text-amber-300 border-amber-800 bg-amber-900/40',
    O: 'text-rose-300 border-rose-800 bg-rose-900/40',
    CL: 'text-indigo-300 border-indigo-800 bg-indigo-900/40',
  };
  return styleMap[assertion] || 'text-slate-400 border-slate-700 bg-slate-800/50';
};

const getIndentLevel = (hierarchy?: string): number => {
  if (!hierarchy) return 0;
  if (hierarchy.match(/^\d+\./)) return 0;
  if (hierarchy.match(/^[a-z]\./)) return 24;
  if (hierarchy.match(/^\([a-z]\)$/)) return 48;
  return 0;
};

export const ProcedureRow: React.FC<Props> = ({
  procedure,
  completed,
  response,
  onToggle,
  onResponseChange,
}) => {
  const indent = getIndentLevel(procedure.hierarchy);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleResponseClick = (value: string) => {
    onResponseChange(value);
  };

  return (
    <div
      className={`rounded-sm border transition-all ${completed
        ? 'border-emerald-800 bg-emerald-900/10'
        : 'border-slate-800 bg-surface-darker hover:border-inflo-blue/30'
        }`}
      style={{ marginLeft: `${indent}px` }}
    >
      {/* Main row */}
      <div
        className="flex items-start gap-4 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Step number */}
        {procedure.id && (
          <span className="font-mono text-xs font-bold text-slate-500 mt-1 flex-shrink-0 w-8">
            {procedure.id}
          </span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Procedure text */}
          <p
            className={`text-sm font-medium leading-relaxed transition-colors ${completed ? 'text-slate-500' : 'text-slate-200'
              }`}
          >
            {procedure.text}
          </p>

          {/* Assertions row */}
          {procedure.assertions && procedure.assertions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {procedure.assertions.map((assertion, idx) => (
                <span
                  key={idx}
                  className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${getAssertionStyle(assertion)}`}
                  title={assertionLabels[assertion] || assertion}
                >
                  {assertion}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 ml-4">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`w-8 h-8 rounded border flex items-center justify-center transition-all shadow-sm ${completed
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-inflo-blue hover:text-inflo-blue'
              }`}
            title={completed ? "Mark as incomplete" : "Mark as complete"}
          >
            <span className="material-icons text-lg">check</span>
          </button>

          {/* Expand indicator */}
          <button
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <span className="material-icons text-lg">expand_more</span>
          </button>
        </div>
      </div>

      {/* Collapsible response area */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-12 pt-2 border-t border-slate-800 mt-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Auditor Response
            </label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <textarea
                  value={response}
                  onChange={(e) => onResponseChange(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Enter findings or observations here..."
                  rows={3}
                  className="w-full text-xs text-slate-200 bg-slate-900 border border-slate-700 rounded-sm p-3 focus:outline-none focus:ring-1 focus:ring-inflo-blue focus:border-inflo-blue placeholder-slate-600 transition-all resize-none shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                {['YES', 'NO', 'N/A'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleResponseClick(opt)}
                    className={`flex items-center justify-center px-4 py-2 border rounded-sm text-xs font-bold transition-all shadow-sm ${response === opt
                      ? (opt === 'YES' ? 'bg-inflo-blue border-inflo-blue text-white' :
                        opt === 'NO' ? 'bg-red-600 border-red-600 text-white' :
                          'bg-slate-700 border-slate-600 text-white')
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
