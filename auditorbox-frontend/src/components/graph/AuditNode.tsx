import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface AuditNodeData {
  id: string;
  label: string;
  type: string;
  area: string;
  cycle: string;
  inDegree: number;
  outDegree: number;
  isHub: boolean;
  [key: string]: unknown;
}

const TYPE_STYLES: Record<string, { bg: string; border: string; icon: string; color: string }> = {
  leadsheet: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'table_chart', color: 'text-emerald-400' },
  worksheet: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'description', color: 'text-blue-400' },
  procedure: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'list_alt', color: 'text-purple-400' },
  checklist: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'fact_check', color: 'text-amber-400' },
  report: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: 'assessment', color: 'text-red-400' },
};

const DEFAULT_STYLE = { bg: 'bg-slate-800/50', border: 'border-slate-700', icon: 'description', color: 'text-slate-400' };

const AuditNodeComponent = ({ data, selected }: NodeProps) => {
  const d = data as AuditNodeData;
  const style = TYPE_STYLES[d.type] || DEFAULT_STYLE;
  const hubClass = d.isHub ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark' : '';
  const selectedClass = selected ? 'border-primary ring-2 ring-primary/20' : 'border-border-dark';

  return (
    <div
      className={`min-w-[180px] max-w-[220px] rounded-lg px-3 py-2.5 bg-surface-darker/60 backdrop-blur-sm border transition-all duration-200 ${selectedClass} ${hubClass}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-600 !w-2 !h-2 !border-none" />

      <div className="flex items-center justify-between mb-2">
        <div className={`p-1 rounded-md ${style.bg} ${style.color}`}>
          <span className="material-icons text-base block">{style.icon}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-1 rounded uppercase tracking-tighter">{d.id}</span>
          {d.isHub && (
            <span className="material-icons text-primary text-xs">hub</span>
          )}
        </div>
      </div>

      <div className="text-xs font-semibold text-white truncate mb-1" title={d.label}>
        {d.label}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-dark">
        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span className="material-icons text-[10px]">login</span>
            {d.inDegree}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons text-[10px]">logout</span>
            {d.outDegree}
          </div>
        </div>
        <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">{d.area.replace('_', ' ')}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-600 !w-2 !h-2 !border-none" />
    </div>
  );
};

export const AuditNode = memo(AuditNodeComponent);
export default AuditNode;
