// FinancialStatement page — auto-generated from .did
// Generated: 2026-02-08T19:16:01.410524

import React, { useState } from 'react';
import * as api from '../api/api-functions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// FinancialStatementPage
import React, { useState, useEffect } from 'react';
import * as api from '../api/api-functions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FinancialStatementView, { FinancialStatementData } from '../components/financials/FinancialStatementView';

export const FinancialStatementPage: React.FC = () => {
  const [selectedFsId, setSelectedFsId] = useState<bigint | null>(null);

  const { data: fsList, isLoading: isLoadingList, error: listError } = useQuery({
    queryKey: ['listFinancialStatements'],
    queryFn: () => api.listFinancialStatements(),
  });

  const { data: selectedFs, isLoading: isLoadingFs } = useQuery({
    queryKey: ['getFinancialStatement', selectedFsId?.toString()],
    queryFn: () => api.getFinancialStatement(selectedFsId!),
    enabled: !!selectedFsId,
  });

  // Default to first FS if available
  useEffect(() => {
    if (fsList && Array.isArray(fsList) && fsList.length > 0 && !selectedFsId) {
      setSelectedFsId(fsList[0][0]);
    }
  }, [fsList, selectedFsId]);

  const qc = useQueryClient();
  const generateMutation = useMutation({
    mutationFn: async () => {
      // Hardcoded for MVP: Generate based on first TB found (assuming active one)
      // Really we should pick the TB.
      const tbs = await api.listTrialBalances();
      if (tbs.length === 0) throw new Error("No Trial Balance found to generate from.");
      const tbId = tbs[0][0]; // Pick first TB

      // Create FS (Status Pending/Generated)
      // We assume engagementId 0 for demo or fetch from TB.
      // The createFinancialStatement args: engagementId, trialBalanceId, taxonomy, title
      const engagementId = tbs[0][1].engagementId;
      return api.createFinancialStatement(engagementId, tbId, { 'IFRS': null }, "Financial Statements 2024");
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['listFinancialStatements'] });
      // Logic to auto-select new one could go here
    },
  });

  if (isLoadingList) {
    return (
      <div className="flex h-full items-center justify-center bg-background-dark text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <span className="material-icons animate-spin text-4xl">sync</span>
          <span>Loading Financial Statements...</span>
        </div>
      </div>
    );
  }

  // If no FS exists, show generate empty state
  if (!fsList || fsList.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background-dark text-slate-400 p-8">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-surface-darker rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <span className="material-icons text-4xl text-slate-500">article</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Financial Statements Yet</h2>
          <p className="text-slate-400 mb-8">Generate your first set of financial statements from the Trial Balance data.</p>

          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 transition-all mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`material-icons text-xl ${generateMutation.isPending ? 'animate-spin' : ''}`}>
              {generateMutation.isPending ? 'sync' : 'auto_fix_high'}
            </span>
            {generateMutation.isPending ? 'Generating...' : 'Generate Financial Statements'}
          </button>
        </div>
      </div>
    );
  }

  // View Mode
  // Mapping backend FS to View Props
  // selectedFs is `[FinancialStatement]` (optional array/variant from backend optional return?)
  // Actually getFinancialStatement returns `[] | [FinancialStatement]` (opt)
  const fsData = Array.isArray(selectedFs) && selectedFs.length > 0 ? selectedFs[0] : null;

  if (!fsData) {
    return <div className="p-6 text-slate-400">Select a statement to view.</div>;
  }

  const viewData: FinancialStatementData = {
    id: fsData.id,
    title: fsData.title,
    generatedAt: fsData.generatedAt,
    lineItems: fsData.lineItems.map((li: any) => ({
      code: li.code,
      name: li.name,
      category: li.category,
      amount: li.amount,
      nameAr: li.nameAr?.[0] || null
    })),
    taxonomy: fsData.taxonomy
  };

  return (
    <div className="h-full bg-background-dark">
      <FinancialStatementView
        data={viewData}
        onGenerate={() => generateMutation.mutate()}
        onExport={() => console.log('Exporting PDF...')}
        isGenerating={generateMutation.isPending}
      />
    </div>
  );
};

export default FinancialStatementPage;