import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Activity, FileText, Layers } from 'lucide-react';
import { GRAPH_NODES, GRAPH_EDGES } from '../../data/graph';
import { FORM_INDEX } from '../../data/forms';

interface LinkagePanelProps {
  nodeId: string | null;
  onClose: () => void;
  onNavigate: (formId: string) => void;
}

export const LinkagePanel = ({ nodeId, onClose, onNavigate }: LinkagePanelProps) => {
  const node = nodeId ? GRAPH_NODES.find((n) => n.id === nodeId) as any : null;

  if (!node) return null;

  const outgoingEdges = GRAPH_EDGES.filter((edge) => edge.source === nodeId);
  const incomingEdges = GRAPH_EDGES.filter((edge) => edge.target === nodeId);

  const getFormTitle = (formId: string) => {
    const form = FORM_INDEX[formId];
    return form?.title || formId;
  };

  const isHub = node.isHub || false;
  const centrality = node.centrality || 0;

  return (
    <AnimatePresence>
      {nodeId && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed right-0 top-0 h-full w-[320px] bg-gray-900 border-l border-gray-700 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white truncate pr-2">{node.title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Details Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-500">Form Type:</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 text-xs border border-blue-800/50">
                    {node.formType}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-500">Area:</span>
                  <span>{node.area || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-gray-500">Cycle:</span>
                  <span>{node.cycle || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Outgoing References */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider flex items-center gap-2">
                <ArrowRight size={14} /> Outgoing References
              </h3>
              {outgoingEdges.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No outgoing references</p>
              ) : (
                <div className="space-y-2">
                  {outgoingEdges.map((edge) => {
                    const targetFormId = edge.target;
                    const targetFormTitle = getFormTitle(targetFormId);
                    return (
                      <button
                        key={edge.id}
                        onClick={() => onNavigate(targetFormId)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 group-hover:text-green-300">
                            <ArrowRight size={14} />
                          </span>
                          <span className="text-sm text-gray-300 group-hover:text-white">
                            {targetFormId}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                          {targetFormTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Incoming References */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <ArrowLeft size={14} /> Incoming References
              </h3>
              {incomingEdges.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No incoming references</p>
              ) : (
                <div className="space-y-2">
                  {incomingEdges.map((edge) => {
                    const sourceFormId = edge.source;
                    const sourceFormTitle = getFormTitle(sourceFormId);
                    return (
                      <button
                        key={edge.id}
                        onClick={() => onNavigate(sourceFormId)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 group-hover:text-amber-300">
                            <ArrowLeft size={14} />
                          </span>
                          <span className="text-sm text-gray-300 group-hover:text-white">
                            {sourceFormId}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                          {sourceFormTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hub Status */}
            {isHub && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} /> Hub Status
                </h3>
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Centrality Score</span>
                    <span className="text-purple-300 font-medium">{centrality.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Connections</span>
                    <span className="text-purple-300 font-medium">
                      {outgoingEdges.length + incomingEdges.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Role</span>
                    <span className="text-purple-300 font-medium">Hub Node</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
