import React, { useState, useRef, useEffect } from 'react';
import { useAuditData } from '../../hooks/useAuditData';
import { FieldRenderer } from './FieldRenderer';
import { ProcedureRow } from './ProcedureRow';

// Assertion type mapping (Dark Mode compatible)
const ASSERTION_STYLES: Record<string, string> = {
  C: 'text-purple-300 border-purple-800 bg-purple-900/30',
  E: 'text-blue-300 border-blue-800 bg-blue-900/30',
  V: 'text-orange-300 border-orange-800 bg-orange-900/30',
  PD: 'text-pink-300 border-pink-800 bg-pink-900/30',
  RO: 'text-teal-300 border-teal-800 bg-teal-900/30',
  A: 'text-cyan-300 border-cyan-800 bg-cyan-900/30',
};

const ASSERTION_LABELS: Record<string, string> = {
  C: 'ness', // Completeness (truncated for badge)
  E: 'xi', // Existence
  V: 'val', // Valuation
};

// Form type icons
const FORM_TYPE_ICONS: Record<string, string> = {
  worksheet: 'table_chart',
  procedure: 'checklist',
  leadsheet: 'summarize',
};

const AuditFormViewer: React.FC<{
  formId: string;
  values: Record<string, any>;
  onSave: (formId: string, values: Record<string, any>) => void;
  onNavigate: (formId: string) => void;
}> = ({ formId, values, onSave, onNavigate }) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

  // Get form data from context
  const { forms, fields: allFields } = useAuditData();

  if (!forms || !allFields) {
    return <div className="flex items-center justify-center h-full text-slate-500">Loading form definition...</div>;
  }

  const form = forms[formId];
  const rawFields = allFields[formId] || [];

  const fields = rawFields.map((f: any, idx: number) => ({
    ...f,
    id: f.id || `${formId}-${idx}`,
    label: f.label || f.name,
    sectionId: f.sectionId || f.section,
    required: f.required ?? f.validation?.required ?? false,
  }));

  const adaptedSections = (form?.sections || []).map((s: any, idx: number) => ({
    ...s,
    id: s.id || `section-${idx}`,
    title: s.title || s.section_name,
    type: s.type || s.section_type,
  }));

  const [expandedSections, setExpandedSections] = useState<Set<string>>(() =>
    new Set(adaptedSections.map((s: any) => s.id))
  );

  useEffect(() => {
    setExpandedSections(new Set(adaptedSections.map((s: any) => s.id)));
  }, [formId]);

  const filledCount = fields.filter((field: any) => {
    const value = values[field.id];
    return value !== undefined && value !== null && value !== '' &&
      (typeof value !== 'object' || Object.keys(value).length > 0);
  }).length;
  const completionPercentage = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) newExpanded.delete(sectionId);
    else newExpanded.add(sectionId);
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSave = () => {
    onSave(formId, values);
    setLastSaved(new Date());
  };

  const getSectionFields = (sectionTitle: string) =>
    fields.filter((field: any) => field.sectionId === sectionTitle);

  const renderAssertionBadge = (assertion: string) => {
    const style = ASSERTION_STYLES[assertion] || 'text-slate-400 border-slate-700 bg-slate-800/50';
    return (
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${style}`}
        title={assertion}
      >
        {assertion}
      </span>
    );
  };

  const renderSectionContent = (section: any) => {
    if (section.type === 'procedure' || section.type === 'procedure_list' || section.type === 'narrative') {
      return (
        <div className="space-y-6 pl-14">
          {(section.procedures || []).map((proc: any, pIdx: number) => (
            <ProcedureRow
              key={proc.step_id || pIdx}
              procedure={{ id: proc.step_id, text: proc.description, assertions: proc.assertions, hierarchy: proc.hierarchy }}
              completed={!!values[`${formId}-proc-${proc.step_id || pIdx}`]}
              response={values[`${formId}-resp-${proc.step_id || pIdx}`] || ''}
              onToggle={() => onSave(formId, { ...values, [`${formId}-proc-${proc.step_id || pIdx}`]: !values[`${formId}-proc-${proc.step_id || pIdx}`] })}
              onResponseChange={(val) => onSave(formId, { ...values, [`${formId}-resp-${proc.step_id || pIdx}`]: val })}
            />
          ))}
          {(!section.procedures || section.procedures.length === 0) && getSectionFields(section.title).map((field: any) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 text-sm font-medium text-slate-300 pt-2">
                {field.label}
              </div>
              <div className="md:col-span-3">
                <FieldRenderer field={field} value={values[field.id]} onChange={(val) => onSave(formId, { ...values, [field.id]: val })} hideLabel />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (section.type === 'data_table') {
      return (
        <div className="pl-14">
          <div className="border border-slate-800 rounded-sm overflow-hidden bg-surface-darker">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-10">#</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {getSectionFields(section.title).map((field: any, idx: number) => (
                  <tr key={field.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">{idx + 1}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-300">{field.label}</td>
                    <td className="px-4 py-3 text-xs">
                      <FieldRenderer field={field} value={values[field.id]} onChange={(val) => onSave(formId, { ...values, [field.id]: val })} hideLabel />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Default: render fields
    return (
      <div className="space-y-6 pl-14">
        {getSectionFields(section.title).map((field: any) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 text-sm font-medium text-slate-300 pt-2">
              {field.label}
            </div>
            <div className="md:col-span-3">
              <FieldRenderer field={field} value={values[field.id]} onChange={(val) => onSave(formId, { ...values, [field.id]: val })} hideLabel />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex bg-background-dark text-slate-100 overflow-hidden">
      {/* ── Left Panel: Link Sidebar (Mocking the 'Index' from Stitch) ────────────────── */}
      <aside className="w-72 bg-surface-darker border-r border-slate-800 flex flex-col shrink-0 z-20 hidden md:flex">
        <div className="p-4 bg-slate-900/50 border-b border-slate-800">
          <div className="relative">
            <span className="material-icons absolute left-2.5 top-2.5 text-slate-500 text-sm">search</span>
            <input className="w-full bg-background-dark border border-slate-800 rounded-md pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-inflo-blue focus:border-inflo-blue outline-none placeholder-slate-600 text-slate-200" placeholder="Jump to section..." type="text" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="mb-6">
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              Index
            </div>
            <div className="space-y-0.5">
              {adaptedSections.map((section: any) => {
                const isExpanded = expandedSections.has(section.id);
                return (
                  <div key={section.id} className="group">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all ${isExpanded ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                      onClick={() => scrollToSection(section.id)}
                    >
                      <div className={`w-1 h-full absolute left-0 ${isExpanded ? 'bg-inflo-blue' : 'bg-transparent'}`} />
                      <span className={`material-icons text-[18px] ${isExpanded ? 'text-inflo-blue' : 'text-slate-500'}`}>folder_open</span>
                      <span className={`font-medium text-[13px] truncate ${isExpanded ? 'font-bold' : ''}`}>{section.title}</span>
                    </div>
                    {/* Simple nesting visual for demo */}
                    {isExpanded && (
                      <div className="ml-4 relative">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-800" />
                        <div className="pl-5 space-y-0.5 mt-0.5 pb-2">
                          <div className="relative flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-inflo-blue cursor-pointer">
                            <div className="absolute left-3 top-1/2 w-3 h-px bg-slate-800" />
                            <span className="text-xs">Overview</span>
                          </div>
                          <div className="relative flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-inflo-blue cursor-pointer">
                            <div className="absolute left-3 top-1/2 w-3 h-px bg-slate-800" />
                            <span className="text-xs">Details</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span>FORM COMPLETION</span>
            <span className="font-bold text-slate-300">{completionPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-inflo-teal transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </aside>

      {/* ── Center Panel: Form Content ──────────────── */}
      <section className="flex-1 bg-background-dark overflow-y-auto px-4 py-8 lg:px-12 scroll-smooth text-slate-200" ref={centerPanelRef}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-6 px-1">
            <span>Engagements</span>
            <span className="material-icons text-xs">chevron_right</span>
            <span>Acme Corp FY2024</span>
            <span className="material-icons text-xs">chevron_right</span>
            <span className="text-slate-400">{form.id} {form.title}</span>
          </div>

          {/* Main Paper Container */}
          <div className="bg-surface-darker shadow-2xl shadow-black/50 rounded-lg flex flex-col border border-slate-800">

            {/* Paper Header */}
            <div className="px-10 py-10 border-b border-slate-800 bg-surface-darker rounded-t-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-inflo-blue bg-inflo-blue/10 px-3 py-1 rounded-sm mb-4 border border-inflo-blue/20">
                    <span className="material-icons text-sm">{FORM_TYPE_ICONS[form.type] || 'description'}</span>
                    {form.id}
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{form.title}</h1>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 rounded bg-red-900/30 text-red-400 border border-red-900/50 text-[10px] font-bold uppercase tracking-wider">High Risk</span>
                  <div className="flex -space-x-1.5 mt-2">
                    <div className="w-7 h-7 rounded-full border-2 border-surface-darker bg-inflo-blue text-white flex items-center justify-center text-xs font-bold" title="You">ME</div>
                    <div className="w-7 h-7 rounded-full border-2 border-surface-darker bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400" title="Review Pending">JP</div>
                  </div>
                </div>
              </div>

              {/* Info Bar */}
              <div className="flex items-center gap-8 py-4 px-6 bg-slate-900/50 border border-slate-800 rounded-md">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Entity</span>
                  <span className="text-xs font-semibold text-slate-300">Acme Global S.A.</span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Period End</span>
                  <span className="text-xs font-semibold text-slate-300">31 Dec 2024</span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Last Edited</span>
                  <span className="text-xs font-semibold text-slate-300">{lastSaved ? lastSaved.toLocaleTimeString() : 'Just now'}</span>
                </div>
              </div>
            </div>

            {/* Paper Content */}
            <div className="p-10 space-y-12">
              {adaptedSections.map((section: any, idx: number) => {
                // Always render all sections in the print view, but we can jump to them
                return (
                  <div key={section.id} id={`section-${section.id}`}>
                    {idx > 0 && <div className="border-t border-slate-800 mb-8"></div>}
                    <section className="relative group">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-800 text-slate-200 rounded flex items-center justify-center font-bold text-lg border border-slate-700">{idx + 1}</div>
                          <h2 className="text-xl font-bold text-white">{section.title}</h2>
                        </div>
                        <div className="flex items-center gap-4">
                          {section.assertion && (
                            <div className="flex gap-1.5">
                              {renderAssertionBadge(section.assertion)}
                            </div>
                          )}
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="text-inflo-teal text-[11px] font-bold uppercase tracking-wider hover:text-emerald-400 flex items-center gap-1 transition-colors"
                          >
                            <span className="material-icons text-sm">verified</span>
                            Sign Off
                          </button>
                        </div>
                      </div>

                      {renderSectionContent(section)}
                    </section>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-10 py-8 bg-slate-900/50 border-t border-slate-800 mt-auto rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">history</span> History (12)</span>
                  <span className="flex items-center gap-1"><span className="material-icons text-[14px]">chat_bubble</span> Comments (2)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleSave} className="px-5 py-2 border border-slate-700 bg-surface-darker text-slate-300 font-bold text-xs rounded-sm hover:bg-slate-800 transition-colors">
                    Save as Draft
                  </button>
                  <button onClick={() => { handleSave(); onNavigate('next'); }} className="px-5 py-2 bg-inflo-teal text-white font-bold text-xs rounded-sm shadow-sm hover:bg-teal-600 transition-colors shadow-teal-900/20">
                    Submit for Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Footer */}
          <div className="mt-8 flex justify-between items-center text-[10px] text-slate-600 font-medium uppercase tracking-widest px-1 pb-10">
            <div>Internal Working Paper • Restricted Access</div>
            <div className="flex gap-4">
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
              <span>© 2024 AUDITORBOX DIGITAL</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuditFormViewer;
