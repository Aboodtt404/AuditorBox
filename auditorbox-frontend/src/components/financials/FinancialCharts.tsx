import React, { useState, useMemo } from 'react';
import {
  BarChart,
  DonutChart,
  AreaChart,
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
  Grid,
} from '@tremor/react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Percent,
  Layers,
  FileText,
  PieChart,
  Activity,
} from 'lucide-react';

type Account = {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  prior_debit?: number;
  prior_credit?: number;
  category?: string;
};

type FinancialChartsProps = {
  accounts: Account[];
  materiality: number;
};

const FinancialCharts: React.FC<FinancialChartsProps> = ({
  accounts,
  materiality,
}) => {
  const [tab, setTab] = useState<'Balance Sheet' | 'Income Statement' | 'Ratios'>('Balance Sheet');

  // Helper to calculate totals and categorize accounts
  const categorizedAccounts = useMemo(() => {
    const categories = {
      assets: [] as Account[],
      liabilities: [] as Account[],
      equity: [] as Account[],
      income: [] as Account[],
      expenses: [] as Account[],
    };

    accounts.forEach((account) => {
      const category = (account.category || '').toLowerCase();
      if (category.includes('asset')) {
        categories.assets.push(account);
      } else if (category.includes('liability')) {
        categories.liabilities.push(account);
      } else if (category.includes('equity')) {
        categories.equity.push(account);
      } else if (category.includes('income') || category.includes('revenue')) {
        categories.income.push(account);
      } else {
        categories.expenses.push(account);
      }
    });

    return categories;
  }, [accounts]);

  // Calculate totals
  const totals = useMemo(() => {
    const assetsTotal = categorizedAccounts.assets.reduce(
      (sum, acc) => sum + acc.debit - acc.credit,
      0
    );
    const liabilitiesTotal = categorizedAccounts.liabilities.reduce(
      (sum, acc) => sum + acc.credit - acc.debit,
      0
    );
    const equityTotal = categorizedAccounts.equity.reduce(
      (sum, acc) => sum + acc.credit - acc.debit,
      0
    );
    const incomeTotal = categorizedAccounts.income.reduce(
      (sum, acc) => sum + acc.credit - acc.debit,
      0
    );
    const expensesTotal = categorizedAccounts.expenses.reduce(
      (sum, acc) => sum + acc.debit - acc.credit,
      0
    );

    const netIncome = incomeTotal - expensesTotal;
    const netEquity = equityTotal + netIncome;

    const currentAssets = categorizedAccounts.assets.filter(acc =>
      (acc.category || '').toLowerCase().includes('current')
    ).reduce((sum, acc) => sum + acc.debit - acc.credit, 0);

    const currentLiabilities = categorizedAccounts.liabilities.filter(acc =>
      (acc.category || '').toLowerCase().includes('current')
    ).reduce((sum, acc) => sum + acc.credit - acc.debit, 0);

    const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;

    return {
      assets: assetsTotal,
      liabilities: liabilitiesTotal,
      equity: netEquity,
      currentRatio,
      income: incomeTotal,
      expenses: expensesTotal,
      netIncome,
    };
  }, [categorizedAccounts]);

  // Calculate prior totals for delta
  const priorTotals = useMemo(() => {
    const assetsTotal = categorizedAccounts.assets.reduce(
      (sum, acc) => sum + (acc.prior_debit || 0) - (acc.prior_credit || 0),
      0
    );
    const liabilitiesTotal = categorizedAccounts.liabilities.reduce(
      (sum, acc) => sum + (acc.prior_credit || 0) - (acc.prior_debit || 0),
      0
    );
    const equityTotal = categorizedAccounts.equity.reduce(
      (sum, acc) => sum + (acc.prior_credit || 0) - (acc.prior_debit || 0),
      0
    );
    const incomeTotal = categorizedAccounts.income.reduce(
      (sum, acc) => sum + (acc.prior_credit || 0) - (acc.prior_debit || 0),
      0
    );
    const expensesTotal = categorizedAccounts.expenses.reduce(
      (sum, acc) => sum + (acc.prior_debit || 0) - (acc.prior_credit || 0),
      0
    );

    const netIncome = incomeTotal - expensesTotal;
    const netEquity = equityTotal + netIncome;

    const currentAssets = categorizedAccounts.assets.filter(acc =>
      (acc.category || '').toLowerCase().includes('current')
    ).reduce((sum, acc) => sum + (acc.prior_debit || 0) - (acc.prior_credit || 0), 0);

    const currentLiabilities = categorizedAccounts.liabilities.filter(acc =>
      (acc.category || '').toLowerCase().includes('current')
    ).reduce((sum, acc) => sum + (acc.prior_credit || 0) - (acc.prior_debit || 0), 0);

    const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;

    return {
      assets: assetsTotal,
      liabilities: liabilitiesTotal,
      equity: netEquity,
      currentRatio,
      income: incomeTotal,
      expenses: expensesTotal,
      netIncome,
    };
  }, [categorizedAccounts]);

  // Helper to calculate delta percentage
  const getDelta = (current: number, prior: number) => {
    if (prior === 0) return current > 0 ? 100 : current < 0 ? -100 : 0;
    return ((current - prior) / Math.abs(prior)) * 100;
  };

  // Prepare data for Balance Sheet Waterfall
  const balanceSheetData = useMemo(() => {
    const categories = ['Assets', 'Liabilities', 'Equity'];
    const data = [
      {
        category: 'Current',
        Assets: categorizedAccounts.assets.reduce((sum, acc) =>
          (acc.category || '').toLowerCase().includes('current') ? sum + acc.debit - acc.credit : sum,
          0
        ),
        Liabilities: categorizedAccounts.liabilities.reduce((sum, acc) =>
          (acc.category || '').toLowerCase().includes('current') ? sum + acc.credit - acc.debit : sum,
          0
        ),
        Equity: categorizedAccounts.equity.reduce((sum, acc) =>
          (acc.category || '').toLowerCase().includes('current') ? sum + acc.credit - acc.debit : sum,
          0
        ),
      },
      {
        category: 'Non-Current',
        Assets: categorizedAccounts.assets.reduce((sum, acc) =>
          (acc.category || '').toLowerCase().includes('current') ? sum : sum + acc.debit - acc.credit,
          0
        ),
        Liabilities: categorizedAccounts.liabilities.reduce((sum, acc) =>
          (acc.category || '').toLowerCase().includes('current') ? sum : sum + acc.credit - acc.debit,
          0
        ),
        Equity: categorizedAccounts.equity.reduce((sum, acc) =>
          (acc.category || '').toLowerCase().includes('current') ? sum : sum + acc.credit - acc.debit,
          0
        ),
      },
    ];

    return data;
  }, [categorizedAccounts]);

  // Prepare data for YoY comparison (top 10 accounts by absolute value)
  const yoyData = useMemo(() => {
    const allAccounts = accounts.map(acc => ({
      ...acc,
      value: Math.abs(acc.debit - acc.credit),
      priorValue: Math.abs((acc.prior_debit || 0) - (acc.prior_credit || 0)),
    }));

    const top10 = allAccounts
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(acc => ({
        name: acc.account_name,
        current: acc.debit - acc.credit,
        prior: (acc.prior_debit || 0) - (acc.prior_credit || 0),
      }));

    return top10;
  }, [accounts]);

  // Prepare data for Asset Composition (DonutChart)
  const assetCompositionData = useMemo(() => {
    const categories = new Set<string>();
    categorizedAccounts.assets.forEach(acc => {
      if (acc.category) categories.add(acc.category);
    });

    const data = Array.from(categories).map(category => ({
      name: category,
      value: categorizedAccounts.assets
        .filter(acc => acc.category === category)
        .reduce((sum, acc) => sum + acc.debit - acc.credit, 0),
    }));

    return data;
  }, [categorizedAccounts]);

  // Prepare data for Financial Trend (AreaChart) - simplified as monthly trend
  const trendData = useMemo(() => {
    // Generate 6 months of synthetic data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const totalAssets = totals.assets;
    const totalLiabilities = totals.liabilities;

    // Create a simple trend with some variation
    const data = months.map((month, i) => ({
      month,
      Assets: totalAssets * (1 + 0.02 * i),
      Liabilities: totalLiabilities * (1 + 0.01 * i),
      Equity: (totalAssets - totalLiabilities) * (1 + 0.015 * i),
    }));

    return data;
  }, [totals]);

  // Helper to get color based on category
  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('asset')) return 'blue';
    if (cat.includes('liability')) return 'red';
    if (cat.includes('equity')) return 'emerald';
    if (cat.includes('income') || cat.includes('revenue')) return 'amber';
    return 'gray';
  };

  // Helper to get chart colors
  const getChartColors = (type: 'bar' | 'donut' | 'area') => {
    if (type === 'bar') {
      return {
        categories: ['Assets', 'Liabilities', 'Equity'],
        colors: ['blue', 'red', 'emerald'],
      };
    } else if (type === 'donut') {
      return {
        categories: assetCompositionData.map(d => d.name),
        colors: assetCompositionData.map(() => 'blue'),
      };
    } else {
      return {
        categories: ['Assets', 'Liabilities', 'Equity'],
        colors: ['blue', 'red', 'emerald'],
      };
    }
  };

  // Helper to render materiality line
  const renderMaterialityLine = (chartType: string, value: number) => {
    if (chartType === 'bar') {
      return {
        value: materiality,
        label: `Materiality (${materiality})`,
        color: 'red',
        lineType: 'dashed',
      };
    } else if (chartType === 'area') {
      return {
        value: materiality,
        label: `Materiality (${materiality})`,
        color: 'red',
        lineType: 'dashed',
      };
    }
    return null;
  };

  return (
    <div className="dark">
      {/* Tab Selector */}
      <Flex className="mb-6 space-x-2">
        {(['Balance Sheet', 'Income Statement', 'Ratios'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            {t}
          </button>
        ))}
      </Flex>

      {/* KPI Cards */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="mb-8">
        <Card className="bg-gray-900 border-gray-800">
          <Flex alignItems="start" justifyContent="between">
            <div>
              <Text>Total Assets</Text>
              <Metric>{totals.assets.toLocaleString()}</Metric>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg">
              <Wallet className="text-blue-400" size={20} />
            </div>
          </Flex>
          <Flex alignItems="center" className="mt-2">
            <BadgeDelta
              deltaType={getDelta(totals.assets, priorTotals.assets) >= 0 ? 'increase' : 'decrease'}
            >
              {Math.abs(getDelta(totals.assets, priorTotals.assets)).toFixed(1) + '%'}
            </BadgeDelta>
            <Text className="ml-2 text-gray-400">vs prior period</Text>
          </Flex>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <Flex alignItems="start" justifyContent="between">
            <div>
              <Text>Total Liabilities</Text>
              <Metric>{totals.liabilities.toLocaleString()}</Metric>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg">
              <TrendingDown className="text-red-400" size={20} />
            </div>
          </Flex>
          <Flex alignItems="center" className="mt-2">
            <BadgeDelta
              deltaType={getDelta(totals.liabilities, priorTotals.liabilities) >= 0 ? 'increase' : 'decrease'}
            >
              {Math.abs(getDelta(totals.liabilities, priorTotals.liabilities)).toFixed(1) + '%'}
            </BadgeDelta>
            <Text className="ml-2 text-gray-400">vs prior period</Text>
          </Flex>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <Flex alignItems="start" justifyContent="between">
            <div>
              <Text>Net Equity</Text>
              <Metric>{totals.equity.toLocaleString()}</Metric>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg">
              <TrendingUp className="text-emerald-400" size={20} />
            </div>
          </Flex>
          <Flex alignItems="center" className="mt-2">
            <BadgeDelta
              deltaType={getDelta(totals.equity, priorTotals.equity) >= 0 ? 'increase' : 'decrease'}
            >
              {Math.abs(getDelta(totals.equity, priorTotals.equity)).toFixed(1) + '%'}
            </BadgeDelta>
            <Text className="ml-2 text-gray-400">vs prior period</Text>
          </Flex>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <Flex alignItems="start" justifyContent="between">
            <div>
              <Text>Current Ratio</Text>
              <Metric>{totals.currentRatio.toFixed(2)}</Metric>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg">
              <Percent className="text-amber-400" size={20} />
            </div>
          </Flex>
          <Flex alignItems="center" className="mt-2">
            <BadgeDelta
              deltaType={getDelta(totals.currentRatio, priorTotals.currentRatio) >= 0 ? 'increase' : 'decrease'}
            >
              {Math.abs(getDelta(totals.currentRatio, priorTotals.currentRatio)).toFixed(1) + '%'}
            </BadgeDelta>
            <Text className="ml-2 text-gray-400">vs prior period</Text>
          </Flex>
        </Card>
      </Grid>

      {/*
      Charts Section */}
      <div className="mt-6">
        <Card className="bg-gray-900 border-gray-800">
          <Text className="text-gray-400 mb-4">Balance Sheet Composition</Text>
          <BarChart
            className="h-72"
            data={balanceSheetData}
            index="name"
            categories={['Current', 'Prior']}
            colors={['blue', 'gray']}
          />
        </Card>
      </div>
    </div>
  );
};

export default FinancialCharts;
