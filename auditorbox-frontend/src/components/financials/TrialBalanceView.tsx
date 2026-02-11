import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ACCOUNT_RANGES, TB_FORMAT, SAMPLE_TB } from '../../data/tbSchema';

// Types
type Account = {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  prior_debit?: number;
  prior_credit?: number;
  leadsheet?: string;
};

type TrialBalanceRow = Account & {
  net_balance: number;
  prior_net: number;
  change: number;
  pct_change: number;
  status: 'balanced' | 'material' | 'warning';
};

type SortState = {
  id: string;
  desc: boolean;
};

// Currency formatter
const formatCurrency = (value: number): string => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absValue);
  return isNegative ? `(${formatted})` : formatted;
};

// Determine leadsheet from account code
const mapToLeadsheet = (accountCode: string): string => {
  const codeNum = parseInt(accountCode, 10);
  if (isNaN(codeNum)) return 'General';
  for (const [rangeKey, rangeData] of Object.entries(ACCOUNT_RANGES)) {
    const [startStr, endStr] = rangeKey.split('-');
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (codeNum >= start && codeNum <= end) {
      return (rangeData as any).leadsheet;
    }
  }
  return 'General';
};

// Process raw accounts into trial balance rows
const processAccounts = (accounts: Account[], materiality: number): TrialBalanceRow[] => {
  return accounts.map((acc) => {
    const netBalance = acc.debit - acc.credit;
    const priorNet = (acc.prior_debit ?? 0) - (acc.prior_credit ?? 0);
    const change = netBalance - priorNet;
    const pctChange = priorNet !== 0 ? (change / Math.abs(priorNet)) * 100 : (netBalance !== 0 ? 100 : 0);

    let status: TrialBalanceRow['status'] = 'balanced';
    if (Math.abs(netBalance) > materiality) {
      status = 'material';
    } else if (Math.abs(netBalance) > materiality * 0.5) {
      status = 'warning';
    }

    return {
      ...acc,
      net_balance: netBalance,
      prior_net: priorNet,
      change,
      pct_change: pctChange,
      leadsheet: acc.leadsheet || mapToLeadsheet(acc.account_code),
      status,
    };
  });
};

// CSV parser
const parseCSV = (csvText: string): Account[] => {
  console.log('Raw CSV content length:', csvText.length);
  const lines = csvText.trim().split(/\r\n|\n/); // Handle both line endings
  console.log('Number of lines:', lines.length);
  if (lines.length < 2) {
    console.warn('CSV has fewer than 2 lines, returning empty.');
    return [];
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  console.log('Headers detected:', headers);

  const data: Account[] = [];

  // Detect format
  const isCaseware = headers.includes('accountnumber') && headers.includes('accountname');
  console.log('Format detection:', { isCaseware });

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());

    // Skip empty lines
    if (values.length < 2 || (values.length === 1 && values[0] === '')) continue;

    // Caseware row usually has many columns, but at least 2 are needed for code/name
    const isCasewareRow = isCaseware && values.length >= 2;

    const row: Record<string, string | number> = {};

    if (isCaseware) {
      const getVal = (key: string) => {
        const idx = headers.indexOf(key.toLowerCase());
        return idx !== -1 ? values[idx] : '';
      };

      // Log first row for debug
      if (i === 1) console.log('Parsing first Caseware row values:', values);

      data.push({
        account_code: getVal('accountnumber') as string,
        account_name: getVal('accountname') as string,
        debit: parseFloat(getVal('ytddebit') as string) || 0,
        credit: parseFloat(getVal('ytdcredit') as string) || 0,
        prior_debit: parseFloat(getVal('openingdebit') as string) || 0,
        prior_credit: parseFloat(getVal('openingcredit') as string) || 0,
        leadsheet: 'General'
      });
    } else {
      // Fallback to original simple format
      headers.forEach((header, idx) => {
        if (['debit', 'credit', 'prior_debit', 'prior_credit'].includes(header)) {
          row[header] = parseFloat(values[idx]) || 0;
        } else {
          row[header] = values[idx] || '';
        }
      });

      // Try to find code/name in likely columns if not explicit
      const code = row['account_code'] || row['code'] || row['account'] || values[0];
      const name = row['account_name'] || row['name'] || row['description'] || values[1];

      data.push({
        account_code: String(code),
        account_name: String(name),
        debit: (row.debit as number) || 0,
        credit: (row.credit as number) || 0,
        prior_debit: (row.prior_debit as number) || 0,
        prior_credit: (row.prior_credit as number) || 0,
        leadsheet: (row.leadsheet as string) || ''
      });
    }
  }
  console.log('Parsed items count:', data.length);
  return data;
};

// CSV exporter
const exportToCSV = (rows: TrialBalanceRow[]): string => {
  const headers = ['account_code', 'account_name', 'debit', 'credit', 'prior_debit', 'prior_credit', 'leadsheet'];
  const csvRows = [
    headers.join(','),
    ...rows.map((row) => [
      row.account_code,
      `"${row.account_name.replace(/"/g, '""')}"`,
      row.debit.toFixed(2),
      row.credit.toFixed(2),
      (row.prior_debit ?? 0).toFixed(2),
      (row.prior_credit ?? 0).toFixed(2),
      row.leadsheet || '',
    ].join(','))
  ];
  return csvRows.join('\n');
};

// File input component
const FileUploadZone = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log('File dropped', e.dataTransfer.files);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) onFileSelect(e.dataTransfer.files[0]);
  };
  const handleClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected via input', e.target.files);
    if (e.target.files && e.target.files.length > 0) onFileSelect(e.target.files[0]);
  };

  return (
    <div className="mb-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-slate-500'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="material-icons text-4xl text-slate-400">cloud_upload</span>
          <p className="text-slate-300 font-medium">Drag & drop CSV or XLSX here</p>
          <p className="text-slate-500 text-sm">or click to browse</p>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
        </div>
      </div>
    </div>
  );
};

// Main component
const TrialBalanceView: React.FC<{
  accounts: Account[];
  onImport: (accounts: any[]) => void;
  onExport: () => void;
  materiality: number;
  validationResult?: {
    isBalanced: boolean;
    difference: number;
    totalDebits: number;
    totalCredits: number;
  } | null;
  isValidating?: boolean;
}> = ({ accounts, onImport, onExport, materiality, validationResult, isValidating }) => {
  const [processedAccounts, setProcessedAccounts] = useState<TrialBalanceRow[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showUploadZone, setShowUploadZone] = useState(false);

  useEffect(() => {
    setProcessedAccounts(processAccounts(accounts, materiality));
  }, [accounts, materiality]);

  const totals = useMemo(() => {
    return processedAccounts.reduce(
      (acc, row) => ({
        debit: acc.debit + row.debit,
        credit: acc.credit + row.credit,
        net: acc.net + row.net_balance,
      }),
      { debit: 0, credit: 0, net: 0 }
    );
  }, [processedAccounts]);

  // Use backend validation if available, otherwise client calc
  const isBalanced = validationResult ? validationResult.isBalanced : Math.abs(totals.debit - totals.credit) < 0.01;
  const difference = validationResult ? validationResult.difference : totals.debit - totals.credit;

  const columnHelper = createColumnHelper<TrialBalanceRow>();

  const makeEditableCell = (columnId: 'debit' | 'credit') => (info: any) => {
    const value = info.getValue();
    return (
      <div className="text-right text-slate-300">
        {editingCell?.rowId === info.row.original.account_code && editingCell?.columnId === columnId ? (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => {
              const newValue = parseFloat(editValue);
              if (!isNaN(newValue)) {
                const updatedAccounts = [...accounts];
                const accountIndex = updatedAccounts.findIndex((a) => a.account_code === info.row.original.account_code);
                if (accountIndex !== -1) {
                  (updatedAccounts[accountIndex] as any)[columnId] = newValue;
                  onImport(updatedAccounts);
                }
              }
              setEditingCell(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newValue = parseFloat(editValue);
                if (!isNaN(newValue)) {
                  const updatedAccounts = [...accounts];
                  const accountIndex = updatedAccounts.findIndex((a) => a.account_code === info.row.original.account_code);
                  if (accountIndex !== -1) {
                    (updatedAccounts[accountIndex] as any)[columnId] = newValue;
                    onImport(updatedAccounts);
                  }
                }
                setEditingCell(null);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            autoFocus
            className="w-full bg-surface-dark border border-primary rounded px-1 py-0.5 text-right text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <div
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              setEditValue(value.toString());
              setEditingCell({ rowId: info.row.original.account_code, columnId });
            }}
          >
            {formatCurrency(value)}
          </div>
        )}
      </div>
    );
  };

  const columns = [
    columnHelper.accessor('account_code', {
      header: 'Code',
      cell: (info) => <div className="font-medium text-slate-200 font-mono text-xs">{info.getValue()}</div>,
      meta: { width: '100px' },
    }),
    columnHelper.accessor('account_name', {
      header: 'Account Name',
      cell: (info) => <div className="text-slate-300">{info.getValue()}</div>,
    }),
    columnHelper.accessor('debit', {
      header: 'Debit',
      cell: makeEditableCell('debit'),
      meta: { width: '120px' },
    }),
    columnHelper.accessor('credit', {
      header: 'Credit',
      cell: makeEditableCell('credit'),
      meta: { width: '120px' },
    }),
    columnHelper.accessor('net_balance', {
      header: 'Net Balance',
      cell: (info) => {
        const value = info.getValue();
        return <div className={`text-right ${value < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(value)}</div>;
      },
      meta: { width: '120px' },
    }),
    columnHelper.accessor('prior_net', {
      header: 'Prior Net',
      cell: (info) => {
        const value = info.getValue();
        return <div className={`text-right ${value < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(value)}</div>;
      },
      meta: { width: '120px' },
    }),
    columnHelper.accessor('change', {
      header: 'Change',
      cell: (info) => {
        const value = info.getValue();
        return <div className={`text-right ${value < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatCurrency(value)}</div>;
      },
      meta: { width: '120px' },
    }),
    columnHelper.accessor('pct_change', {
      header: '% Change',
      cell: (info) => {
        const value = info.getValue();
        const isMaterial = Math.abs(value) > (materiality / (totals.debit || 1)) * 100;
        let colorClass = isMaterial ? 'text-amber-400' : (value < 0 ? 'text-emerald-400' : 'text-red-400');
        return <div className={`text-right ${colorClass}`}>{value.toFixed(2)}%</div>;
      },
      meta: { width: '100px' },
    }),
    columnHelper.accessor('leadsheet', {
      header: 'Leadsheet',
      cell: (info) => (
        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">{info.getValue() || '-'}</span>
      ),
      meta: { width: '100px' },
    }),
  ];

  const table = useReactTable({
    data: processedAccounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="p-6 bg-background-dark min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="material-icons text-primary">table_chart</span>
          Trial Balance
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-darker hover:bg-slate-800 border border-slate-800 rounded-lg text-sm text-slate-300 transition-colors"
          >
            <span className="material-icons text-base">upload</span>
            Import
          </button>
          <button
            onClick={() => {
              const csv = exportToCSV(processedAccounts);
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'trial_balance.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-darker hover:bg-slate-800 border border-slate-800 rounded-lg text-sm text-slate-300 transition-colors"
          >
            <span className="material-icons text-base">download</span>
            Export
          </button>
        </div>
      </div>

      {showUploadZone && (
        <FileUploadZone
          onFileSelect={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const csvText = e.target?.result as string;
                const parsed = parseCSV(csvText);
                onImport(parsed);
                setShowUploadZone(false);
                setImportError(null);
              } catch (err) {
                setImportError(`Import failed: ${err}`);
              }
            };
            reader.readAsText(file);
          }}
        />
      )}

      {importError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
          <span className="material-icons text-base">error</span>
          {importError}
        </div>
      )}

      {!isBalanced && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
          <span className="material-icons text-base">warning</span>
          Trial balance is not balanced. Difference: {formatCurrency(Math.abs(totals.debit - totals.credit))}
        </div>
      )}

      {/* Search */}
      <div className="mb-4 relative">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-500">search</span>
        <input
          type="text"
          placeholder="Filter accounts..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full bg-surface-darker border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/50 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-darker rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 border-b border-slate-800">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-800">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-900 font-medium text-white border-t border-slate-800">
            <tr>
              <td className="px-4 py-3 font-semibold" colSpan={2}>Totals</td>
              <td className="px-4 py-3 text-right font-mono">{formatCurrency(totals.debit)}</td>
              <td className="px-4 py-3 text-right font-mono">{formatCurrency(totals.credit)}</td>
              <td className="px-4 py-3 text-right font-mono">{formatCurrency(totals.debit - totals.credit)}</td>
              <td colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TrialBalanceView;
