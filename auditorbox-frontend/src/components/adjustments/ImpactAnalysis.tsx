import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface ImpactAnalysisProps {
  adjustment: {
    id: string;
    description: string;
    entries: Array<{ account: string; debit: number; credit: number }>;
  };
  materiality: number;
  tbAccounts: Array<{ code: string; name: string; balance: number }>;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);

const classifyAccount = (code: string) => {
  const firstDigit = code.charAt(0);
  switch (firstDigit) {
    case '1': return 'Assets';
    case '2': return 'Liabilities';
    case '3': return 'Equity';
    case '4': return 'Revenue';
    default: return 'Expenses';
  }
};

const getImpactDirection = (entry: { debit: number; credit: number }, balance: number) => {
  const netChange = entry.debit - entry.credit;
  return netChange > 0 ? 'up' : netChange < 0 ? 'down' : 'neutral';
};

const ImpactAnalysis: React.FC<ImpactAnalysisProps> = ({ adjustment, materiality, tbAccounts }) => {
  const [tbWithImpact, categoryImpact] = React.useMemo(() => {
    const impactMap: Record<string, number> = {};
    const tbWithImpact = tbAccounts.map(account => {
      const entry = adjustment.entries.find(e => e.account === account.code);
      if (entry) {
        const netChange = entry.debit - entry.credit;
        impactMap[account.code] = netChange;
        return { ...account, before: account.balance, after: account.balance + netChange, impact: netChange };
      }
      return { ...account, before: account.balance, after: account.balance, impact: 0 };
    });
    
    const categoryTotals: Record<string, number> = {};
    tbWithImpact.forEach(acc => {
      const category = classifyAccount(acc.code);
      categoryTotals[category] = (categoryTotals[category] || 0) + acc.impact;
    });
    
    return [tbWithImpact, categoryTotals];
  }, [adjustment, tbAccounts]);

  const totalImpact = Object.values(categoryImpact).reduce((sum, val) => sum + Math.abs(val), 0);
  const exceedsMateriality = totalImpact > materiality;

  const categories = ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'];
  const categoryColors = {
    Assets: 'bg-emerald-500',
    Liabilities: 'bg-amber-500',
    Equity: 'bg-blue-500',
    Revenue: 'bg-indigo-500',
    Expenses: 'bg-rose-500'
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold">Impact Analysis</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Adjustment Details</h3>
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-gray-300 mb-2">{adjustment.description}</p>
          <div className="space-y-2">
            {adjustment.entries.map((entry, idx) => {
              const account = tbAccounts.find(a => a.code === entry.account);
              const direction = getImpactDirection(entry, account?.balance || 0);
              return (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-400">{entry.account}</span>
                    <span className="text-gray-300">{account?.name || 'Unknown Account'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      {entry.debit > 0 && `Dr ${formatCurrency(entry.debit)}`}
                      {entry.credit > 0 && `Cr ${formatCurrency(entry.credit)}`}
                    </span>
                    {direction === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : 
                     direction === 'down' ? <TrendingDown className="w-4 h-4 text-rose-400" /> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Trial Balance Impact</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Account</th>
                <th className="text-right py-2">Before</th>
                <th className="text-right py-2">Adjustment</th>
                <th className="text-right py-2">After</th>
              </tr>
            </thead>
            <tbody>
              {tbWithImpact.filter(a => a.impact !== 0).map((acc) => (
                <tr key={acc.code} className="border-b border-gray-800">
                  <td className="py-2">
                    <div className="font-mono text-gray-400">{acc.code}</div>
                    <div>{acc.name}</div>
                  </td>
                  <td className="text-right py-2">{formatCurrency(acc.before)}</td>
                  <td className={`text-right py-2 ${acc.impact > 0 ? 'text-emerald-400' : acc.impact < 0 ? 'text-rose-400' : ''}`}>
                    {acc.impact > 0 ? '+' : ''}{formatCurrency(acc.impact)}
                  </td>
                  <td className="text-right py-2 font-medium">{formatCurrency(acc.after)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Financial Statement Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => {
            const impact = categoryImpact[cat] || 0;
            const maxImpact = Math.max(...Object.values(categoryImpact).map(Math.abs), 1);
            const barWidth = maxImpact > 0 ? (Math.abs(impact) / maxImpact) * 100 : 0;
            return (
              <div key={cat} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat}</span>
                  <span className={`${impact > 0 ? 'text-emerald-400' : impact < 0 ? 'text-rose-400' : 'text-gray-400'}`}>
                    {impact > 0 ? '+' : ''}{formatCurrency(impact)}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${categoryColors[cat as keyof typeof categoryColors]} transition-all duration-500`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {exceedsMateriality ? (
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            )}
            <div>
              <div className="text-sm text-gray-400">Total Impact vs Materiality</div>
              <div className="font-medium">
                {formatCurrency(totalImpact)} {exceedsMateriality ? 'exceeds' : 'within'} 
                {' '}{formatCurrency(materiality)} materiality
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ImpactAnalysis;