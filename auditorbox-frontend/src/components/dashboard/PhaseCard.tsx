import { motion } from 'framer-motion';
import { Briefcase, Target, Shield, FlaskConical, CheckCircle2 } from 'lucide-react';
import React from 'react';

type Category = {
  formCount: number;
};

type Phase = {
  id: string;
  name: string;
  categoryCount: number;
  categories: Category[];
};

type PhaseCardProps = {
  phase: Phase;
  color: string;
  completedCount: number;
  totalCount: number;
  onClick: () => void;
};

const getPhaseIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'onboarding':
      return <Briefcase className="w-5 h-5" />;
    case 'planning':
      return <Target className="w-5 h-5" />;
    case 'risk':
      return <Shield className="w-5 h-5" />;
    case 'testing':
      return <FlaskConical className="w-5 h-5" />;
    case 'completion':
      return <CheckCircle2 className="w-5 h-5" />;
    default:
      return <Briefcase className="w-5 h-5" />;
  }
};

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  color,
  completedCount,
  totalCount,
  onClick,
}) => {
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const truncatedName = phase.name.length > 20 
    ? `${phase.name.substring(0, 17)}...` 
    : phase.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-[var(--phase-color)] transition cursor-pointer relative"
      style={{ '--phase-color': color } as React.CSSProperties}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <div className="text-[color]">{getPhaseIcon(phase.name)}</div>
          </div>
          <div>
            <h3 className="text-gray-100 font-medium truncate max-w-[180px]">
              {truncatedName}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {phase.categoryCount} categories
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-gray-100">{progress}%</span>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="mt-3 flex justify-between items-center text-sm">
        <span className="text-gray-400">
          Forms: <span className="text-gray-200 font-medium">{completedCount}</span> / {totalCount}
        </span>
        <span className="text-xs text-gray-500">Click to view details</span>
      </div>
    </motion.div>
  );
};
