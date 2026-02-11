// TrialBalance page
import React, { useState, useEffect } from 'react';
import * as api from '../api/api-functions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TrialBalanceView from '../components/financials/TrialBalanceView';
import { SAMPLE_TB } from '../data/tbSchema';

export const TrialBalancePage: React.FC = () => {
  const [selectedTbId, setSelectedTbId] = useState<bigint | null>(null);

  const { data: tbList, isLoading: isLoadingList, error: listError } = useQuery({
    queryKey: ['listTrialBalances'],
    queryFn: () => api.listTrialBalances(),
  });

  // Default to first TB if available
  useEffect(() => {
    if (tbList && Array.isArray(tbList) && tbList.length > 0 && !selectedTbId) {
      setSelectedTbId(tbList[0][0]);
    }
  }, [tbList, selectedTbId]);

  // Fetch validation result if we have a selected TB
  const { data: validationResult, isLoading: isValidating } = useQuery({
    queryKey: ['validateTrialBalance', selectedTbId ? selectedTbId.toString() : ''],
    queryFn: () => api.validateTrialBalance(selectedTbId!),
    enabled: !!selectedTbId,
  });

  const qc = useQueryClient();

  // Extract accounts from selected TB
  const selectedTb = tbList?.find(([id]) => id === selectedTbId)?.[1];

  // Map backend accounts to view model
  // Backend Account: { accountNumber, accountName, debit, credit, ... }
  // View Model: { account_code, account_name, debit, credit, ... }
  const accounts = selectedTb
    ? selectedTb.accounts.map((a: any) => ({
      account_code: a.accountNumber,
      account_name: a.accountName,
      debit: a.debit,
      credit: a.credit,
      prior_debit: 0, // Not in current backend model yet
      prior_credit: 0,
      leadsheet: a.fsLineItem || 'General'
    }))
    : (SAMPLE_TB.accounts as any[]);

  // Mutation to update backend
  const updateMutation = useMutation({
    mutationFn: (args: { tbId: bigint, accounts: any[] }) => api.updateTrialBalanceAccounts(args.tbId, args.accounts),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['listTrialBalances'] });
      qc.invalidateQueries({ queryKey: ['validateTrialBalance'] });
    },
  });

  const handleImport = (importedAccounts: any[]) => {
    console.log('handleImport called with accounts:', importedAccounts.length);
    console.log('Current selectedTbId:', selectedTbId);

    if (!selectedTbId) {
      console.error("No Trial Balance selected.");
      alert("No Trial Balance selected.");
      return;
    }

    // Map frontend View Model (CSV structure) to Backend DTO
    const backendAccounts = importedAccounts.map(acc => {
      // Simple client-side inference for MVP
      const code = parseInt(acc.account_code);
      let type: any = { 'Asset': null };
      if (code >= 2000 && code < 3000) type = { 'Liability': null };
      else if (code >= 3000 && code < 4000) type = { 'Equity': null };
      else if (code >= 4000 && code < 5000) type = { 'Revenue': null };
      else if (code >= 5000) type = { 'Expense': null };

      return {
        accountNumber: acc.account_code,
        accountName: acc.account_name,
        accountType: type,
        debit: parseFloat(acc.debit) || 0,
        credit: parseFloat(acc.credit) || 0,
        beginningBalance: 0, // Default for now
        endingBalance: (parseFloat(acc.debit) || 0) - (parseFloat(acc.credit) || 0), // Simple net
        fsLineItem: acc.leadsheet || "" // Backend expects string
      };
    });

    console.log('Mapped backend accounts sample:', backendAccounts.slice(0, 3));
    console.log('Mutating updateTrialBalanceAccounts...');

    updateMutation.mutate({ tbId: selectedTbId, accounts: backendAccounts });
  };

  const handleExport = () => {
    console.log('Exporting...');
  };

  if (isLoadingList) {
    return (
      <div className="flex h-full items-center justify-center bg-background-dark text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <span className="material-icons animate-spin text-4xl">sync</span>
          <span>Loading Trial Balances...</span>
        </div>
      </div>
    );
  }

  if (listError) {
    return (
      <div className="p-6 bg-background-dark text-red-400">
        Error loading trial balances: {String(listError)}
      </div>
    );
  }

  // Parse validation result
  // Result is { ok: ValidationResult } or { err: string }
  const validationData = validationResult && 'ok' in validationResult ? validationResult.ok : null;
  const validationError = validationResult && 'err' in validationResult ? validationResult.err : null;

  return (
    <div className="h-full flex flex-col bg-background-dark">
      {/* TB Selector if multiple */}
      {tbList && tbList.length > 1 && (
        <div className="px-6 pt-4">
          <select
            className="bg-surface-dark border border-slate-700 rounded px-3 py-2 text-white"
            value={selectedTbId?.toString() || ''}
            onChange={(e) => setSelectedTbId(BigInt(e.target.value))}
          >
            {tbList.map(([id, tb]) => (
              <option key={id.toString()} value={id.toString()}>
                TB #{id.toString()} - {tb.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Import Loading State overlay */}
      {updateMutation.isPending && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-surface-dark p-6 rounded-xl border border-slate-700 flex flex-col items-center shadow-2xl">
            <span className="material-icons animate-spin text-4xl text-primary mb-2">cloud_upload</span>
            <span className="text-white font-bold">Importing Accounts...</span>
          </div>
        </div>
      )}

      {/* Import Error Toast */}
      {updateMutation.isError && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Error importing: {String(updateMutation.error)}
        </div>
      )}

      <TrialBalanceView
        accounts={accounts}
        onImport={handleImport}
        onExport={handleExport}
        materiality={50000}
        validationResult={validationData as any} // Pass backend validation
        isValidating={isValidating || updateMutation.isPending}
      />
    </div>
  );
};

export default TrialBalancePage;