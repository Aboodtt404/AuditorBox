import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, CheckCircle, XCircle, Save } from 'lucide-react';

interface JournalEntryProps {
  adjustment?: {
    id: string;
    description: string;
    entries: Array<{ account: string; debit: number; credit: number }>;
    status: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};

const JournalEntry: React.FC<JournalEntryProps> = ({
  adjustment,
  onSave,
  onCancel,
}) => {
  const [description, setDescription] = useState(
    adjustment?.description || ''
  );
  const [entries, setEntries] = useState<
    Array<{ id: string; account: string; debit: number; credit: number }>
  >(
    adjustment?.entries.map((entry) => ({
      id: entry.account + Math.random().toString(36).substr(2, 9),
      account: entry.account,
      debit: entry.debit,
      credit: entry.credit,
    })) || [
      { id: 'init1', account: '', debit: 0, credit: 0 },
      { id: 'init2', account: '', debit: 0, credit: 0 },
    ]
  );

  const [errors, setErrors] = useState<{ description?: string; balance?: string }>({});

  // Calculate totals
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        debit: acc.debit + entry.debit,
        credit: acc.credit + entry.credit,
      }),
      { debit: 0, credit: 0 }
    );
  }, [entries]);

  const isBalanced = totals.debit === totals.credit;
  const imbalanceAmount = Math.abs(totals.debit - totals.credit);

  // Validation
  useEffect(() => {
    const newErrors: { description?: string; balance?: string } = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (entries.length < 2) {
      newErrors.balance = 'At least 2 journal entries required';
    } else if (!isBalanced) {
      newErrors.balance = `Entries must balance. Imbalance: ${formatCurrency(imbalanceAmount)}`;
    }
    
    setErrors(newErrors);
  }, [description, entries, isBalanced, imbalanceAmount]);

  const isValid = !errors.description && !errors.balance && entries.length >= 2 && isBalanced;

  const handleAddLine = () => {
    setEntries([
      ...entries,
      { id: Math.random().toString(36).substr(2, 9), account: '', debit: 0, credit: 0 },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleAccountChange = (id: string, value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, account: value } : entry
      )
    );
  };

  const handleDebitChange = (id: string, value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, debit: parseCurrency(value) } : entry
      )
    );
  };

  const handleCreditChange = (id: string, value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, credit: parseCurrency(value) } : entry
      )
    );
  };

  const handleSave = () => {
    if (!isValid) return;
    
    onSave({
      id: adjustment?.id || Date.now().toString(),
      description,
      entries: entries.map(({ id, ...rest }) => rest),
      status: adjustment?.status || 'draft',
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 rounded-lg border border-gray-700 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            {adjustment ? 'Edit Journal Entry' : 'Create Journal Entry'}
          </h2>
          {adjustment && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              adjustment.status === 'approved' ? 'bg-green-900/30 text-green-400' :
              adjustment.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
              'bg-yellow-900/30 text-yellow-400'
            }`}>
              {adjustment.status.toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter journal entry description..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Entries Table */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-1/3">
                  Account
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 w-1/4">
                  Debit
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 w-1/4">
                  Credit
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="border-b border-gray-700/50">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={entry.account}
                      onChange={(e) => handleAccountChange(entry.id, e.target.value)}
                      placeholder="Account name"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formatCurrency(entry.debit)}
                      onChange={(e) => handleDebitChange(entry.id, e.target.value)}
                      step="0.01"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-right text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formatCurrency(entry.credit)}
                      onChange={(e) => handleCreditChange(entry.id, e.target.value)}
                      step="0.01"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-right text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </td>
                  <td className="py-3 px-2 text-center">
                    {entries.length > 2 && (
                      <button
                        onClick={() => handleRemoveLine(entry.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove line"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Line Button */}
          <div className="mt-4">
            <button
              onClick={handleAddLine}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-gray-300 transition-colors"
            >
              <Plus size={16} />
              <span>Add Line</span>
            </button>
          </div>

          {/* Totals Row */}
          <div className="mt-8 border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">Totals:</span>
              <div className="flex gap-8">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Debits</div>
                  <div className="text-xl font-mono font-semibold text-gray-200">
                    {formatCurrency(totals.debit)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Credits</div>
                  <div className="text-xl font-mono font-semibold text-gray-200">
                    {formatCurrency(totals.credit)}
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Indicator */}
            <div className="mt-4 flex items-center gap-3">
              {isBalanced ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={20} />
                  <span className="font-medium">Entries are balanced</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle size={20} />
                  <span className="font-medium">
                    Entries are unbalanced: {formatCurrency(imbalanceAmount)}
                  </span>
                </div>
              )}
            </div>
            {errors.balance && (
              <p className="mt-1 text-sm text-red-400">{errors.balance}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700 bg-gray-800/50 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition ${
            isValid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Entry
        </button>
      </div>
    </div>
  );
};

export { JournalEntry };
export default JournalEntry;
