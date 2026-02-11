import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { GRAPH_NODES, GRAPH_EDGES } from '../../data/graph';
import { AuditNode } from './AuditNode';
import { GraphFilters } from './GraphFilters';

// Area color mapping
const AREA_COLORS: Record<string, string> = {
  general: '#3c83f6',
  substantive_testing: '#10b981',
  risk_assessment: '#ef4444',
  planning: '#8b5cf6',
  controls_testing: '#f97316',
  completion: '#f59e0b',
  reporting: '#06b6d4',
};

const getAreaColor = (area: string): string =>
  AREA_COLORS[area] || '#6b7280';

const nodeTypes: NodeTypes = {
  auditNode: AuditNode,
};

export default function AuditGraph({ onSelectForm }: { onSelectForm: (formId: string) => void }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    phase: 'All',
    type: 'All',
    hubsOnly: false,
    search: '',
  });

  const filteredNodes = useMemo(() => {
    return GRAPH_NODES.filter(node => {
      if (filters.phase !== 'All') {
        if (node.area !== filters.phase) return false;
      }
      if (filters.type !== 'All') {
        if ((node.type || '') !== filters.type) return false;
      }
      if (filters.hubsOnly && !node.isHub) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!node.id.toLowerCase().includes(s) && !(node.label || '').toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [filters]);

  const rfNodes: Node[] = useMemo(() => {
    const cols = Math.max(6, Math.ceil(Math.sqrt(filteredNodes.length)));
    return filteredNodes.map((node, i) => ({
      id: node.id,
      type: 'auditNode',
      position: { x: (i % cols) * 260, y: Math.floor(i / cols) * 120 },
      data: { ...node },
    }));
  }, [filteredNodes]);

  const rfEdges: Edge[] = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return GRAPH_EDGES
      .filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label || undefined,
        animated: filteredNodes.some(n => n.id === e.target && n.isHub),
        style: { stroke: '#334155' },
        markerEnd: { type: 'arrowclosed' as const, color: '#334155' },
      }));
  }, [filteredNodes]);

  const [nodes, , onNodesChange] = useNodesState(rfNodes);
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);

  const selectedNode = useMemo(
    () => selectedNodeId ? GRAPH_NODES.find(n => n.id === selectedNodeId) : null,
    [selectedNodeId]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const getMiniMapNodeColor = useCallback((node: Node): string => {
    return getAreaColor((node.data as any)?.area || 'general');
  }, []);

  return (
    <div className="flex h-full w-full bg-background-dark relative">
      {/* Main graph area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="p-4 z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-icons text-primary">hub</span>
              Audit Graph — {filteredNodes.length} nodes, {rfEdges.length} edges
            </h1>
          </div>
          <GraphFilters filters={filters} onChange={setFilters} />
        </div>

        {/* ReactFlow */}
        <div className="flex-1">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
            className="bg-background-dark"
          >
            <Background color="#1e293b" gap={16} size={1} />
            <Controls className="bg-slate-900 rounded-lg border border-slate-700 [&>button]:bg-slate-900 [&>button]:text-slate-300 [&>button]:border-slate-700 hover:[&>button]:bg-slate-800" />
            <MiniMap
              className="bg-slate-900 border border-slate-700 rounded-lg"
              nodeColor={getMiniMapNodeColor}
              nodeStrokeWidth={2}
              maskColor="rgba(0,0,0,0.5)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Right panel for node details */}
      {selectedNode && (
        <div className="w-80 bg-surface-darker border-l border-slate-800 overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="material-icons text-base text-primary">description</span>
              {selectedNode.label}
            </h2>
            <button onClick={() => setSelectedNodeId(null)} className="p-1 rounded hover:bg-slate-800 text-slate-500 transition-colors">
              <span className="material-icons text-lg">close</span>
            </button>
          </div>
          <div className="p-4 space-y-3 text-sm">
            {[
              { label: 'ID', value: <span className="font-mono text-slate-300">{selectedNode.id}</span> },
              { label: 'Type', value: <span className="capitalize text-slate-300">{selectedNode.type || 'unknown'}</span> },
              { label: 'Area', value: <span className="capitalize text-slate-300">{selectedNode.area}</span> },
              { label: 'Cycle', value: <span className="text-slate-300">{selectedNode.cycle}</span> },
              { label: 'Hub', value: <span className={selectedNode.isHub ? 'text-primary font-medium' : 'text-slate-500'}>{selectedNode.isHub ? 'Yes' : 'No'}</span> },
              { label: 'In / Out', value: <span className="text-slate-300">{selectedNode.inDegree} / {selectedNode.outDegree}</span> },
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <span className="text-slate-500">{item.label}</span>
                {item.value}
              </div>
            ))}
            <button
              onClick={() => onSelectForm(selectedNode.id)}
              className="w-full mt-4 py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-icons text-lg">open_in_new</span>
              Open Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
