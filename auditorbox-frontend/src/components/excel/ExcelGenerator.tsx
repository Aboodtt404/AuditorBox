import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, Loader2, Eye, Table2 } from 'lucide-react';

interface ExcelGeneratorProps {
  workbookId: string;
  workbookName: string;
  accounts: Array<{ code: string; name: string; prelim: number; adjustments: number; reported: number }>;
  engagement: { clientName: string; yearEnd: string; materiality: number };
}

const ExcelGenerator: React.FC<ExcelGeneratorProps> = ({ workbookId, workbookName, accounts, engagement }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateWorkbook = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const wb = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ['Client Name', engagement.clientName],
        ['Year End', engagement.yearEnd],
        ['Materiality', engagement.materiality],
        ['Date Generated', new Date().toLocaleString()],
      ];
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 20 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

      // Trial Balance sheet
      const tbData = [
        ['Code', 'Name', 'Preliminary', 'Adjustments', 'Reported'],
        ...accounts.map(a => [a.code, a.name, a.prelim, a.adjustments, a.reported])
      ];
      const tbWs = XLSX.utils.aoa_to_sheet(tbData);
      tbWs['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      
      // Style header row bold
      const headerStyle = { font: { bold: true } };
      for (let i = 0; i < 5; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        if (tbWs[cellRef]) tbWs[cellRef].s = headerStyle;
      }
      XLSX.utils.book_append_sheet(wb, tbWs, 'Trial Balance');

      // Analysis sheet
      const analysisData = [
        ['Code', 'Name', 'Preliminary', 'Adjustments', 'Reported', 'Variance %', 'Flagged'],
        ...accounts.map(a => {
          const variance = a.prelim !== 0 ? (a.adjustments / Math.abs(a.prelim)) * 100 : 0;
          const flagged = Math.abs(variance) > (engagement.materiality / Math.abs(a.prelim || 1)) * 100 ? 'Yes' : 'No';
          return [a.code, a.name, a.prelim, a.adjustments, a.reported, `${variance.toFixed(2)}%`, flagged];
        })
      ];
      const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
      analysisWs['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];
      
      // Style header row bold
      for (let i = 0; i < 7; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        if (analysisWs[cellRef]) analysisWs[cellRef].s = headerStyle;
      }
      XLSX.utils.book_append_sheet(wb, analysisWs, 'Analysis');

      XLSX.writeFile(wb, `${workbookName}.xlsx`);
      setIsGenerating(false);
    }, 500);
  };

  const previewRows = accounts.slice(0, 5);

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <FileSpreadsheet className="text-blue-400" size={28} />
        <div>
          <h2 className="text-xl font-semibold text-white">{workbookName}</h2>
          <p className="text-gray-400 text-sm">ID: {workbookId}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-300">
            <Table2 size={16} />
            <span className="text-sm">Preview (first 5 accounts)</span>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
          >
            <Eye size={14} />
            <span>{showPreview ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {showPreview && (
          <div className="bg-gray-800 rounded-md overflow-hidden border border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2 text-right">Preliminary</th>
                  <th className="px-4 py-2 text-right">Adjustments</th>
                  <th className="px-4 py-2 text-right">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-300">
                {previewRows.map((account, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{account.code}</td>
                    <td className="px-4 py-2">{account.name}</td>
                    <td className="px-4 py-2 text-right">{account.prelim.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{account.adjustments.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{account.reported.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={generateWorkbook}
          disabled={isGenerating}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
            isGenerating 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download size={20} />
              <span>Download Excel Workbook</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExcelGenerator;