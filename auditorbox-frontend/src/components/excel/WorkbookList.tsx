import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import React from 'react';

interface Workbook {
  id: string;
  name: string;
  sheetCount: number;
  priority: 'P0' | 'P1' | 'P2';
  description: string;
}

interface WorkbookListProps {
  onGenerate: (workbookId: string) => void;
  generatingId?: string;
}

const WORKBOOKS: Workbook[] = [
  // P0 (Critical)
  { id: 'Materiality_420', name: 'Materiality_420', sheetCount: 3, priority: 'P0', description: 'Materiality thresholds and allocation methodology' },
  { id: 'Misstatements_335', name: 'Misstatements_335', sheetCount: 4, priority: 'P0', description: 'Misstatement tracking and aggregation worksheet' },
  { id: 'Sampling_610', name: 'Sampling_610', sheetCount: 3, priority: 'P0', description: 'Statistical sampling plan and results' },
  { id: 'Sampling_615', name: 'Sampling_615', sheetCount: 2, priority: 'P0', description: 'Attribute sampling for controls testing' },
  { id: 'Analytical_1000', name: 'Analytical_1000', sheetCount: 2, priority: 'P0', description: 'Analytical procedures and trend analysis' },
  { id: 'Leadsheets_x12', name: 'Leadsheets x12', sheetCount: 18, priority: 'P0', description: '12 monthly leadsheets for journal entries' },
  
  // P1 (Important)
  { id: 'Ratios_665', name: 'Ratios_665', sheetCount: 1, priority: 'P1', description: 'Key financial ratios and benchmarks' },
  { id: 'Controls_x6', name: 'Controls x6', sheetCount: 6, priority: 'P1', description: '6 core control testing worksheets' },
  { id: 'Estimates_523', name: 'Estimates_523', sheetCount: 1, priority: 'P1', description: 'Accounting estimates documentation' },
  { id: 'Going_Concern_525', name: 'Going_Concern_525', sheetCount: 1, priority: 'P1', description: 'Going concern assessment and evidence' },
  { id: 'Dashboard_00', name: 'Dashboard_00', sheetCount: 1, priority: 'P1', description: 'Audit progress and status dashboard' },
  
  // P2 (Nice-to-have)
  { id: 'Confirmations_630', name: 'Confirmations_630', sheetCount: 1, priority: 'P2', description: 'Third-party confirmation templates' },
  { id: 'Group_420.600', name: 'Group_420.600', sheetCount: 1, priority: 'P2', description: 'Group consolidation adjustments' },
];

const getPriorityColor = (priority: 'P0' | 'P1' | 'P2') => {
  switch (priority) {
    case 'P0': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'P1': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'P2': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getPriorityLabel = (priority: 'P0' | 'P1' | 'P2') => {
  switch (priority) {
    case 'P0': return 'Critical';
    case 'P1': return 'Important';
    case 'P2': return 'Nice-to-have';
  }
};

const WorkbookList: React.FC<WorkbookListProps> = ({ onGenerate, generatingId }) => {
  // Calculate totals
  const totalWorkbooks = WORKBOOKS.length;
  const totalSheets = WORKBOOKS.reduce((sum, wb) => sum + wb.sheetCount, 0);

  // Group by priority
  const criticalWorkbooks = WORKBOOKS.filter(w => w.priority === 'P0');
  const importantWorkbooks = WORKBOOKS.filter(w => w.priority === 'P1');
  const additionalWorkbooks = WORKBOOKS.filter(w => w.priority === 'P2');

  const renderWorkbookCard = (workbook: Workbook) => {
    const isGenerating = generatingId === workbook.id;
    
    return (
      <div key={workbook.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-3 hover:bg-gray-800/50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-800 rounded-lg text-gray-300">
            <FileSpreadsheet size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-100">{workbook.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(workbook.priority)}`}>
                {workbook.priority}
              </span>
            </div>
            <p className="text-sm text-gray-400">{workbook.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            {workbook.sheetCount} sheet{workbook.sheetCount !== 1 ? 's' : ''}
          </span>
          
          <button
            onClick={() => onGenerate(workbook.id)}
            disabled={isGenerating}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${isGenerating 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white active:bg-blue-700'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Excel Workbooks</h1>
          <p className="text-gray-400 mt-1">Audit-ready Excel templates for engagement documentation</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg">
            <FileSpreadsheet size={16} className="text-blue-400" />
            <span className="text-gray-300">{totalWorkbooks} workbooks</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg">
            <FileSpreadsheet size={16} className="text-blue-400" />
            <span className="text-gray-300">{totalSheets} sheets</span>
          </div>
        </div>
      </div>

      {/* Critical Workbooks */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Critical Workbooks (P0)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {criticalWorkbooks.map(renderWorkbookCard)}
        </div>
      </section>

      {/* Important Workbooks */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Important Workbooks (P1)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {importantWorkbooks.map(renderWorkbookCard)}
        </div>
      </section>

      {/* Additional Workbooks */}
      <section>
        <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
          Additional Workbooks (P2)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {additionalWorkbooks.map(renderWorkbookCard)}
        </div>
      </section>
    </div>
  );
};

export default WorkbookList;
