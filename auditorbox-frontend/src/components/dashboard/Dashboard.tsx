import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Hash, DollarSign, GitBranch } from 'lucide-react';
import { PHASES } from '../../data/phases';
import { FORM_COUNT } from '../../data/forms';
import { TOTAL_FIELDS } from '../../data/fields';
import { GRAPH_STATS } from '../../data/graph';
import { PhaseCard } from './PhaseCard';
import { ActivityFeed } from './ActivityFeed';

const PHASE_COLORS: Record<string, string> = {
  '1_onboarding': '#3b82f6',
  '2_planning': '#8b5cf6',
  '3_risk': '#ef4444',
  '4_testing': '#f59e0b',
  '5_completion': '#10b981',
};

interface DashboardProps {
  completedForms: string[];
  materiality: number;
  onNavigate: (view: string, filter?: any) => void;
  recentActivity: any[];
}

export default function Dashboard({
  completedForms,
  materiality,
  onNavigate,
  recentActivity,
}: DashboardProps) {
  const stats = [
    { label: 'Forms', value: FORM_COUNT, icon: FileText },
    { label: 'Fields', value: TOTAL_FIELDS, icon: Hash },
    { label: 'Materiality', value: `$${materiality.toLocaleString()}`, icon: DollarSign },
    { label: 'Graph Nodes', value: GRAPH_STATS.total_nodes, icon: GitBranch },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top Section: Phase Cards */}
      <motion.div
        className="px-6 py-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {PHASES.map((phase) => {
            const totalCount = phase.categories.reduce((acc: number, cat: any) => acc + cat.formCount, 0);
            const completedCount = completedForms.filter((fid: string) =>
              phase.categories.some((cat: any) => cat.forms.some((f: any) => f.formId === fid))
            ).length;
            return (
              <motion.div key={phase.id} variants={phaseVariants}>
                <PhaseCard
                  phase={phase}
                  color={PHASE_COLORS[phase.id] || '#6b7280'}
                  completedCount={completedCount}
                  totalCount={totalCount}
                  onClick={() => onNavigate('phases', { phaseId: phase.id })}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Middle Section: Stats & Activity */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Quick Stats */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-200">Quick Stats</h2>
              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-800 rounded-lg text-blue-400">
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-100">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Completed Forms: <span className="text-green-400">{completedForms.length}</span> / {FORM_COUNT}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Activity Feed */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ActivityFeed activities={recentActivity} />
          </motion.div>
        </div>
      </div>

      {/* Bottom Section: Mini Audit Flow Graph */}
      <div className="px-6 pb-10">
        <motion.div
          className="bg-gray-900 rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-200">Audit Flow</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PHASES.map((phase, idx) => (
              <React.Fragment key={phase.id}>
                <motion.button
                  onClick={() => onNavigate('phases', { phaseId: phase.id })}
                  className="flex items-center justify-center w-24 h-16 rounded-lg shadow-md transition-all duration-200 hover:scale-105 text-white font-medium text-xs"
                  style={{ backgroundColor: PHASE_COLORS[phase.id] || '#6b7280' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {phase.name.replace(/^Phase \d+: /, '')}
                </motion.button>
                {idx < PHASES.length - 1 && (
                  <span className="text-gray-500 text-xl">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Animation variants for staggered entrance
const phaseVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
