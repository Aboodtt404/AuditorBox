import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type LinkedForm = {
  formId: string;
  title: string;
  direction: 'in' | 'out';
};

type IsaStandard = {
  standard: string;
  title: string;
  scope: string;
  when_used: string;
};

type ExpertGuidanceProps = {
  expertNote: string;
  linkedForms: LinkedForm[];
  isaStandards: (string | IsaStandard)[];
  onNavigateForm: (formId: string) => void;
  currentFormId?: string;
  isHubForm?: boolean;
  onViewFullGraph?: () => void;
};

const parseMarkdown = (text: string): React.ReactNode[] => {
  if (!text.trim()) return [];

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  const processInline = (text: string): React.ReactNode[] => {
    // Handle bold (**text**) and italic (*text*)
    let parts: (string | React.ReactNode)[] = [text];

    // Bold
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return [part];
      const subParts = part.split(/(\*\*[^*]+\*\*)/g);
      return subParts.map((sp, i): string | React.ReactNode => {
        if (sp.startsWith('**') && sp.endsWith('**')) {
          return <strong key={`b-${i}`} className="font-bold text-slate-100">{sp.slice(2, -2)}</strong>;
        }
        return sp;
      });
    });

    // Italic
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return [part];
      const subParts = part.split(/(\*[^*]+\*)/g);
      return subParts.map((sp, i): string | React.ReactNode => {
        if (sp.startsWith('*') && sp.endsWith('*')) {
          return <em key={`i-${i}`} className="italic text-slate-300">{sp.slice(1, -1)}</em>;
        }
        return sp;
      });
    });

    return parts;
  };

  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (inList) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul';
      const listClass = listType === 'ol' ? 'list-decimal ml-6 space-y-1 mb-4' : 'list-disc ml-6 space-y-1 mb-4';
      elements.push(
        <ListTag key={`list-${elements.length}`} className={listClass}>
          {listItems}
        </ListTag>
      );
      inList = false;
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Headers
    const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const content = processInline(headerMatch[2]);
      const classes = [
        '',
        'text-lg font-bold text-white mt-6 mb-3 border-b border-border-dark pb-1', // H1
        'text-base font-bold text-white mt-5 mb-2', // H2
        'text-sm font-bold text-primary-light mt-4 mb-2 uppercase tracking-wider', // H3
        'text-sm font-semibold text-slate-200 mt-3 mb-1', // H4
      ][level];

      const Tag = `h${level + 1}` as keyof JSX.IntrinsicElements; // Map H1-H4 to h2-h5 for internal hierarchy
      elements.push(<Tag key={i} className={classes}>{content}</Tag>);
      continue;
    }

    // Horizontal rule
    if (trimmedLine === '---' || trimmedLine === '***') {
      flushList();
      elements.push(<hr key={i} className="border-border-dark my-4" />);
      continue;
    }

    // Bullet list
    const bulletMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(<li key={i} className="text-sm text-slate-300 leading-relaxed">{processInline(bulletMatch[1])}</li>);
      continue;
    }

    // Numbered list
    const numberMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    if (numberMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(<li key={i} className="text-sm text-slate-300 leading-relaxed">{processInline(numberMatch[1])}</li>);
      continue;
    }

    // Empty line
    if (trimmedLine === '') {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(<p key={i} className="text-sm text-slate-400 leading-relaxed mb-4">{processInline(line)}</p>);
  }

  flushList();
  return elements;
};

// Mini-graph component showing immediate connections
function DataFlowGraph({
  currentFormId,
  linkedForms,
  isHub,
  onNavigateForm,
}: {
  currentFormId: string;
  linkedForms: LinkedForm[];
  isHub: boolean;
  onNavigateForm: (formId: string) => void;
}) {
  const limited = linkedForms.slice(0, 10);
  const centerX = 200;
  const centerY = 75;
  const radius = 120;

  const nodes: Node[] = useMemo(() => {
    const result: Node[] = [
      {
        id: currentFormId,
        position: { x: centerX - 40, y: centerY - 15 },
        data: { label: currentFormId },
        style: {
          background: isHub ? '#3c83f6' : '#1e293b',
          color: 'white',
          border: isHub ? '2px solid #60a5fa' : '1px solid #334155',
          borderRadius: '8px',
          fontSize: '11px',
          padding: '4px 8px',
          fontWeight: isHub ? 700 : 500,
        },
      },
    ];

    limited.forEach((form, idx) => {
      const angle = (2 * Math.PI * idx) / limited.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle) - 30;
      const y = centerY + radius * Math.sin(angle) - 10;
      result.push({
        id: form.formId,
        position: { x, y },
        data: { label: form.formId },
        style: {
          background: '#0f172a',
          color: '#94a3b8',
          border: form.direction === 'out' ? '1px solid #22c55e' : '1px solid #f59e0b',
          borderRadius: '6px',
          fontSize: '10px',
          padding: '3px 6px',
          cursor: 'pointer',
        },
      });
    });

    return result;
  }, [currentFormId, limited, isHub]);

  const edges: Edge[] = useMemo(() => {
    return limited.map((form, idx) => ({
      id: `e-${idx}`,
      source: form.direction === 'out' ? currentFormId : form.formId,
      target: form.direction === 'out' ? form.formId : currentFormId,
      animated: true,
      style: { stroke: form.direction === 'out' ? '#22c55e' : '#f59e0b', strokeWidth: 1 },
    }));
  }, [currentFormId, limited]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.id !== currentFormId) {
      onNavigateForm(node.id);
    }
  }, [currentFormId, onNavigateForm]);

  return (
    <div className="h-[150px] w-full rounded-lg overflow-hidden bg-background-dark border border-border-dark">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={20} />
      </ReactFlow>
    </div>
  );
}

const ExpertGuidance: React.FC<ExpertGuidanceProps> = ({
  expertNote,
  linkedForms,
  isaStandards,
  onNavigateForm,
  currentFormId,
  isHubForm = false,
  onViewFullGraph,
}) => {
  const [isExpertNoteOpen, setIsExpertNoteOpen] = useState(true);
  const [isIsaStandardsOpen, setIsIsaStandardsOpen] = useState(true);
  const [isLinkedFormsOpen, setIsLinkedFormsOpen] = useState(true);
  const [isDataFlowOpen, setIsDataFlowOpen] = useState(true);

  const outgoingForms = linkedForms.filter(f => f.direction === 'out');
  const incomingForms = linkedForms.filter(f => f.direction === 'in');

  const SectionToggle = ({ open, onToggle, icon, label, extra }: { open: boolean; onToggle: () => void; icon: string; label: string; extra?: React.ReactNode }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className={`material-icons text-base text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`}>chevron_right</span>
        <span className="material-icons text-base text-primary">{icon}</span>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      {extra}
    </button>
  );

  return (
    <div className="flex flex-col h-full text-slate-300">
      {/* Data Flow Section */}
      {currentFormId && linkedForms.length > 0 && (
        <div className="flex flex-col border-b border-border-dark">
          <SectionToggle
            open={isDataFlowOpen}
            onToggle={() => setIsDataFlowOpen(!isDataFlowOpen)}
            icon="device_hub"
            label="Data Flow"
            extra={onViewFullGraph ? (
              <button
                onClick={(e) => { e.stopPropagation(); onViewFullGraph(); }}
                className="text-xs text-primary hover:text-primary-light flex items-center gap-1"
              >
                <span className="material-icons text-sm">open_in_full</span>
                Full Graph
              </button>
            ) : undefined}
          />
          {isDataFlowOpen && (
            <div className="px-4 pb-3">
              <DataFlowGraph
                currentFormId={currentFormId}
                linkedForms={linkedForms}
                isHub={isHubForm}
                onNavigateForm={onNavigateForm}
              />
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-emerald-500" />
                  <span>References to</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-0.5 bg-amber-500" />
                  <span>Referenced by</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expert Note Section */}
      <div className="flex flex-col border-b border-border-dark">
        <SectionToggle
          open={isExpertNoteOpen}
          onToggle={() => setIsExpertNoteOpen(!isExpertNoteOpen)}
          icon="auto_awesome"
          label="Expert Note"
        />
        {isExpertNoteOpen && (
          <div className="px-4 pb-4">
            {(expertNote || '').trim() ? (
              <div className="space-y-1">{parseMarkdown(expertNote)}</div>
            ) : (
              <p className="text-sm text-slate-500 italic">No expert notes available</p>
            )}
          </div>
        )}
      </div>

      {/* ISA Standards Section */}
      <div className="flex flex-col border-b border-border-dark">
        <SectionToggle
          open={isIsaStandardsOpen}
          onToggle={() => setIsIsaStandardsOpen(!isIsaStandardsOpen)}
          icon="menu_book"
          label="ISA Standards"
        />
        {isIsaStandardsOpen && (
          <div className="px-4 pb-4">
            {isaStandards.length > 0 ? (
              <div className="space-y-2">
                {isaStandards.map((standard, idx) => {
                  const isObj = typeof standard === 'object' && standard !== null;
                  const label = isObj ? (standard as IsaStandard).standard : String(standard);
                  const title = isObj ? (standard as IsaStandard).title : '';
                  const scope = isObj ? (standard as IsaStandard).scope : '';
                  return (
                    <div key={idx} className="bg-primary/10 border border-primary/20 rounded-lg p-2.5">
                      <span className="text-primary font-medium text-xs">{label}</span>
                      {title && <span className="text-slate-400 text-xs ml-1">— {title}</span>}
                      {scope && <p className="text-slate-500 text-xs mt-1">{scope}</p>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No ISA standards specified</p>
            )}
          </div>
        )}
      </div>

      {/* Linked Forms Section */}
      <div className="flex flex-col">
        <SectionToggle
          open={isLinkedFormsOpen}
          onToggle={() => setIsLinkedFormsOpen(!isLinkedFormsOpen)}
          icon="link"
          label="Linked Forms"
        />
        {isLinkedFormsOpen && (
          <div className="px-4 pb-4 space-y-4">
            {linkedForms.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No linked forms</p>
            ) : (
              <>
                {outgoingForms.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-icons text-sm">arrow_forward</span>
                      References to
                    </h4>
                    <div className="space-y-1">
                      {outgoingForms.map(form => (
                        <button
                          key={form.formId}
                          onClick={() => onNavigateForm(form.formId)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 group"
                        >
                          <span className="text-xs font-mono text-slate-500 group-hover:text-emerald-300">{form.formId}</span>
                          <span className="text-sm text-slate-300 group-hover:text-emerald-200 truncate">{form.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {incomingForms.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-icons text-sm">arrow_back</span>
                      Referenced by
                    </h4>
                    <div className="space-y-1">
                      {incomingForms.map(form => (
                        <button
                          key={form.formId}
                          onClick={() => onNavigateForm(form.formId)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 group"
                        >
                          <span className="text-xs font-mono text-slate-500 group-hover:text-amber-300">{form.formId}</span>
                          <span className="text-sm text-slate-300 group-hover:text-amber-200 truncate">{form.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertGuidance;
