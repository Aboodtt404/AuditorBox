import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, AlertTriangle, DollarSign, Percent, BarChart3, PieChart, Activity } from 'lucide-react';
import { BarChart, DonutChart, AreaChart } from '@tremor/react';

// Demo financial data that responds to calculator inputs
const generateDemoAccounts = (revenue: number, assets: number, liabilities: number) => {
  const equity = assets - liabilities;
  const cogs = revenue * 0.62;
  const grossProfit = revenue - cogs;
  const opex = revenue * 0.22;
  const netIncome = grossProfit - opex;

  return {
    revenue, assets, liabilities, equity,
    cogs, grossProfit, opex, netIncome,
    currentAssets: assets * 0.45,
    fixedAssets: assets * 0.55,
    currentLiabilities: liabilities * 0.40,
    longTermDebt: liabilities * 0.60,
    cash: assets * 0.12,
    receivables: assets * 0.18,
    inventory: assets * 0.15,
    payables: liabilities * 0.15,
  };
};

const formatM = (n: number) => {
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const formatPct = (n: number) => `${(n * 100).toFixed(1)}%`;

const AuditCalculator: React.FC = () => {
  // Input state
  const [revenue, setRevenue] = useState(50_000_000);
  const [totalAssets, setTotalAssets] = useState(85_000_000);
  const [totalLiabilities, setTotalLiabilities] = useState(42_000_000);
  const [materialityPct, setMaterialityPct] = useState(1.5);
  const [riskFactor, setRiskFactor] = useState(1.0);

  // Derived calculations
  const data = useMemo(() => generateDemoAccounts(revenue, totalAssets, totalLiabilities), [revenue, totalAssets, totalLiabilities]);

  const materiality = useMemo(() => {
    const overall = revenue * (materialityPct / 100) * riskFactor;
    const performance = overall * 0.75;
    const trivial = overall * 0.05;
    return { overall, performance, trivial };
  }, [revenue, materialityPct, riskFactor]);

  const ratios = useMemo(() => ({
    currentRatio: data.currentAssets / data.currentLiabilities,
    debtToEquity: data.liabilities / data.equity,
    grossMargin: data.grossProfit / data.revenue,
    netMargin: data.netIncome / data.revenue,
    roe: data.netIncome / data.equity,
    assetTurnover: data.revenue / data.assets,
  }), [data]);

  // Chart data
  const balanceSheetData = [
    { name: 'Cash', value: data.cash, category: 'Assets' },
    { name: 'Receivables', value: data.receivables, category: 'Assets' },
    { name: 'Inventory', value: data.inventory, category: 'Assets' },
    { name: 'Fixed Assets', value: data.fixedAssets, category: 'Assets' },
    { name: 'Payables', value: data.payables, category: 'Liabilities' },
    { name: 'Current Liab.', value: data.currentLiabilities - data.payables, category: 'Liabilities' },
    { name: 'Long-term Debt', value: data.longTermDebt, category: 'Liabilities' },
    { name: 'Equity', value: data.equity, category: 'Equity' },
  ];

  const incomeData = [
    { name: 'Revenue', amount: data.revenue },
    { name: 'COGS', amount: -data.cogs },
    { name: 'Gross Profit', amount: data.grossProfit },
    { name: 'Operating Exp.', amount: -data.opex },
    { name: 'Net Income', amount: data.netIncome },
  ];

  const trendData = [
    { month: 'Jul', Revenue: revenue * 0.85, Expenses: (data.cogs + data.opex) * 0.83, 'Net Income': data.netIncome * 0.78 },
    { month: 'Aug', Revenue: revenue * 0.88, Expenses: (data.cogs + data.opex) * 0.87, 'Net Income': data.netIncome * 0.82 },
    { month: 'Sep', Revenue: revenue * 0.92, Expenses: (data.cogs + data.opex) * 0.90, 'Net Income': data.netIncome * 0.88 },
    { month: 'Oct', Revenue: revenue * 0.96, Expenses: (data.cogs + data.opex) * 0.94, 'Net Income': data.netIncome * 0.93 },
    { month: 'Nov', Revenue: revenue * 0.98, Expenses: (data.cogs + data.opex) * 0.97, 'Net Income': data.netIncome * 0.97 },
    { month: 'Dec', Revenue: revenue, Expenses: data.cogs + data.opex, 'Net Income': data.netIncome },
  ];

  const donutData = [
    { name: 'Current Assets', value: data.currentAssets },
    { name: 'Fixed Assets', value: data.fixedAssets },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-700/30 flex items-center justify-center">
              <Calculator size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Audit Calculator</h1>
              <p className="text-sm text-gray-400">Input financial data and watch audit metrics update live</p>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Financial Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total Revenue</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={revenue}
                  onChange={e => setRevenue(Number(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input type="range" min={1_000_000} max={500_000_000} step={1_000_000} value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full mt-2 accent-blue-500" />
              <div className="text-xs text-gray-500 text-center">{formatM(revenue)}</div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total Assets</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={totalAssets}
                  onChange={e => setTotalAssets(Number(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input type="range" min={1_000_000} max={1_000_000_000} step={1_000_000} value={totalAssets} onChange={e => setTotalAssets(Number(e.target.value))} className="w-full mt-2 accent-blue-500" />
              <div className="text-xs text-gray-500 text-center">{formatM(totalAssets)}</div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total Liabilities</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={totalLiabilities}
                  onChange={e => setTotalLiabilities(Number(e.target.value) || 0)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input type="range" min={0} max={totalAssets} step={1_000_000} value={totalLiabilities} onChange={e => setTotalLiabilities(Number(e.target.value))} className="w-full mt-2 accent-blue-500" />
              <div className="text-xs text-gray-500 text-center">{formatM(totalLiabilities)}</div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Materiality %</label>
              <div className="relative">
                <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={materialityPct}
                  onChange={e => setMaterialityPct(Number(e.target.value) || 0)}
                  step={0.1}
                  min={0.1}
                  max={10}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input type="range" min={0.1} max={5} step={0.1} value={materialityPct} onChange={e => setMaterialityPct(Number(e.target.value))} className="w-full mt-2 accent-amber-500" />
              <div className="text-xs text-gray-500 text-center">{materialityPct}%</div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Risk Factor</label>
              <div className="relative">
                <AlertTriangle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  value={riskFactor}
                  onChange={e => setRiskFactor(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value={0.7}>Low (0.7x)</option>
                  <option value={1.0}>Normal (1.0x)</option>
                  <option value={1.3}>Elevated (1.3x)</option>
                  <option value={1.5}>High (1.5x)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Materiality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            key={materiality.overall}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="rounded-xl border border-blue-700/30 bg-blue-900/10 p-5"
          >
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <BarChart3 size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Overall Materiality</span>
            </div>
            <div className="text-3xl font-bold text-gray-100">{formatM(materiality.overall)}</div>
            <div className="text-xs text-gray-400 mt-1">{materialityPct}% of revenue &times; {riskFactor}x risk</div>
          </motion.div>
          <motion.div
            key={materiality.performance}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-5"
          >
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Activity size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Performance Materiality</span>
            </div>
            <div className="text-3xl font-bold text-gray-100">{formatM(materiality.performance)}</div>
            <div className="text-xs text-gray-400 mt-1">75% of overall materiality</div>
          </motion.div>
          <motion.div
            key={materiality.trivial}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="rounded-xl border border-gray-700/30 bg-gray-900/50 p-5"
          >
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <DollarSign size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Trivial Threshold</span>
            </div>
            <div className="text-3xl font-bold text-gray-100">{formatM(materiality.trivial)}</div>
            <div className="text-xs text-gray-400 mt-1">5% of overall — below this, ignore</div>
          </motion.div>
        </div>

        {/* Key Ratios */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: 'Current Ratio', value: ratios.currentRatio.toFixed(2), warn: ratios.currentRatio < 1, color: ratios.currentRatio >= 1.5 ? 'text-emerald-400' : ratios.currentRatio >= 1 ? 'text-amber-400' : 'text-red-400' },
            { label: 'Debt/Equity', value: ratios.debtToEquity.toFixed(2), warn: ratios.debtToEquity > 2, color: ratios.debtToEquity <= 1 ? 'text-emerald-400' : ratios.debtToEquity <= 2 ? 'text-amber-400' : 'text-red-400' },
            { label: 'Gross Margin', value: formatPct(ratios.grossMargin), warn: false, color: 'text-blue-400' },
            { label: 'Net Margin', value: formatPct(ratios.netMargin), warn: ratios.netMargin < 0, color: ratios.netMargin >= 0.1 ? 'text-emerald-400' : ratios.netMargin >= 0 ? 'text-amber-400' : 'text-red-400' },
            { label: 'ROE', value: formatPct(ratios.roe), warn: false, color: 'text-purple-400' },
            { label: 'Asset Turnover', value: ratios.assetTurnover.toFixed(2), warn: false, color: 'text-cyan-400' },
          ].map(r => (
            <div key={r.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">{r.label}</div>
              <div className={`text-xl font-bold ${r.color}`}>
                {r.value}
                {r.warn && <AlertTriangle size={12} className="inline ml-1 text-amber-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balance Sheet Composition */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 size={14} />
              Balance Sheet Composition
            </h3>
            <BarChart
              data={balanceSheetData}
              index="name"
              categories={['value']}
              colors={['blue']}
              valueFormatter={formatM}
              className="h-64"
              showAnimation
            />
            <div className="mt-3 h-0.5 bg-gray-800 relative">
              <div
                className="absolute top-0 h-0.5 bg-red-500"
                style={{ width: `${Math.min(100, (materiality.overall / (data.assets * 0.3)) * 100)}%` }}
              />
              <span className="absolute -top-4 right-0 text-xs text-red-400">Materiality: {formatM(materiality.overall)}</span>
            </div>
          </div>

          {/* Asset Composition Donut */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PieChart size={14} />
              Asset Composition
            </h3>
            <DonutChart
              data={donutData}
              index="name"
              category="value"
              colors={['blue', 'cyan']}
              valueFormatter={formatM}
              className="h-64"
              showAnimation
            />
          </div>

          {/* Income Waterfall */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={14} />
              Income Statement
            </h3>
            <BarChart
              data={incomeData}
              index="name"
              categories={['amount']}
              colors={['emerald']}
              valueFormatter={formatM}
              className="h-64"
              showAnimation
            />
          </div>

          {/* Trend Chart */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={14} />
              6-Month Trend
            </h3>
            <AreaChart
              data={trendData}
              index="month"
              categories={['Revenue', 'Expenses', 'Net Income']}
              colors={['blue', 'red', 'emerald']}
              valueFormatter={formatM}
              className="h-64"
              showAnimation
              curveType="monotone"
            />
          </div>
        </div>

        {/* Sampling Calculator */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sampling & Testing Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-xs text-gray-400 mb-1">Items &gt; Materiality</div>
              <div className="text-2xl font-bold text-red-400">
                {Math.max(0, Math.round(data.revenue / materiality.overall * 0.3))}
              </div>
              <div className="text-xs text-gray-500">Test 100%</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-xs text-gray-400 mb-1">Items &gt; Performance</div>
              <div className="text-2xl font-bold text-amber-400">
                {Math.round(data.revenue / materiality.performance * 0.5)}
              </div>
              <div className="text-xs text-gray-500">Sample-based testing</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-xs text-gray-400 mb-1">Suggested Sample Size</div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(25 + (riskFactor - 0.7) * 50)}
              </div>
              <div className="text-xs text-gray-500">Based on risk factor</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-800/50">
              <div className="text-xs text-gray-400 mb-1">Tolerable Error Rate</div>
              <div className="text-2xl font-bold text-emerald-400">
                {(materiality.performance / data.revenue * 100).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500">Of total revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCalculator;
