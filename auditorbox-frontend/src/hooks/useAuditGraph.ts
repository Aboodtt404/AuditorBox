import { useMemo, useState, useCallback } from 'react';
import { GRAPH_NODES, GRAPH_EDGES } from '../data/graph';
import type { Node, Edge } from '@xyflow/react';

export interface GraphFilters {
  phase: string;
  type: string;
  hubsOnly: boolean;
  search: string;
}

const INITIAL_FILTERS: GraphFilters = { phase: '', type: '', hubsOnly: false, search: '' };

export function useAuditGraph() {
  const [filters, setFilters] = useState<GraphFilters>(INITIAL_FILTERS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const filteredNodes = useMemo(() => {
    return GRAPH_NODES.filter(n => {
      if (filters.phase && n.area !== filters.phase) return false;
      if (filters.type && n.type !== filters.type) return false;
      if (filters.hubsOnly && !n.isHub) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!n.id.toLowerCase().includes(s) && !n.label.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [filters]);

  const nodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const rfNodes: Node[] = useMemo(() => {
    const cols = 6;
    return filteredNodes.map((n, i) => ({
      id: n.id,
      type: 'auditNode',
      position: { x: (i % cols) * 260, y: Math.floor(i / cols) * 120 },
      data: n,
    }));
  }, [filteredNodes]);

  const rfEdges: Edge[] = useMemo(() => {
    return GRAPH_EDGES
      .filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label || undefined,
        animated: filteredNodes.some(n => n.id === e.target && n.isHub),
        style: { stroke: '#4b5563' },
        markerEnd: { type: 'arrowclosed' as const, color: '#4b5563' },
      }));
  }, [nodeIds, filteredNodes]);

  const getNodeConnections = useCallback((nodeId: string) => {
    const outgoing = GRAPH_EDGES.filter(e => e.source === nodeId);
    const incoming = GRAPH_EDGES.filter(e => e.target === nodeId);
    return { outgoing, incoming };
  }, []);

  const resetFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  return {
    filters, setFilters, resetFilters,
    rfNodes, rfEdges,
    selectedNodeId, setSelectedNodeId,
    getNodeConnections,
    nodeCount: filteredNodes.length,
    edgeCount: rfEdges.length,
  };
}
