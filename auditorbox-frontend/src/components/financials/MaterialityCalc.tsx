import React, { useState, useEffect } from 'react';
import { Calculator, Percent, DollarSign, BarChart3 } from 'lucide-react';

interface MaterialityCalcProps {
  engagement: {
    clientName: string;
    yearEnd: string;
    materiality: {
      overall: number;
      performance: number;
      trivial: number;
    };
  };
  onUpdate: (materiality: { overall: number; performance: number; trivial: number }) => void;
}

const MaterialityCalc: React.FC<MaterialityCalcProps> = ({ engagement, onUpdate }) => {
  const { materiality } = engagement;
  const [benchmark, setBenchmark] = useState('Total Revenue');
  const [benchmarkAmount, setBenchmarkAmount] = useState<number | ''>(materiality.overall);
  const [benchmarkPercentage, setBenchmarkPercentage] = useState<number | ''>(1);
  const [overall, setOverall] = useState(materiality.overall);
  const [performance, setPerformance] = useState(materiality.performance);
  const [trivial, setTrivial] = useState(materiality.trivial);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  useEffect(() => {
    if (benchmarkAmount !== '' && benchmarkPercentage !== '') {
      const calculated = (benchmarkAmount as number) * (benchmarkPercentage as number) / 100;
      setOverall(calculated);
    }
  }, [benchmarkAmount, benchmarkPercentage]);

  useEffect(() => {
    setPerformance(overall * 0.75);
    setTrivial(overall * 0.05);
  }, [overall]);

  useEffect(() => {
    onUpdate({ overall, performance, trivial });
  }, [overall, performance, trivial, onUpdate]);

  const handleBenchmarkAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : parseFloat(e.target.value);
    setBenchmarkAmount(val);
  };

  const handleBenchmarkPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? '' : parseFloat(e.target.value);
    setBenchmarkPercentage(val);
  };

  const handleOverallChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setOverall(val);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-white">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Materiality Calculation</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Benchmark</label>
        <div className="flex gap-3">
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Total Revenue">Total Revenue</option>
            <option value="Total Assets">Total Assets</option>
            <option value="Profit Before Tax">Profit Before Tax</option>
            <option value="Total Equity">Total Equity</option>
          </select>
          
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={benchmarkAmount}
              onChange={handleBenchmarkAmountChange}
              placeholder="Benchmark amount"
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative w-32">
            <Percent className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={benchmarkPercentage}
              onChange={handleBenchmarkPercentageChange}
              placeholder="Percentage"
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Overall Materiality</label>
          <div className="relative">
            <Calculator className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={overall}
              onChange={handleOverallChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Calculated as {benchmark} × {benchmarkPercentage}% = {formatCurrency(overall)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Performance Materiality</label>
          <div className="relative">
            <Calculator className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={performance}
              onChange={(e) => setPerformance(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            75% of Overall = {formatCurrency(performance)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Trivial Threshold</label>
          <div className="relative">
            <Calculator className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={trivial}
              onChange={(e) => setTrivial(parseFloat(e.target.value) || 0)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            5% of Overall = {formatCurrency(trivial)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Materiality Hierarchy</label>
        <div className="h-12 bg-gray-800 rounded-md overflow-hidden flex flex-col justify-center">
          <div 
            className="bg-blue-500 h-1/3 flex items-center justify-end px-2 text-xs text-white font-medium"
            style={{ width: '100%' }}
          >
            Overall: {formatCurrency(overall)}
          </div>
          <div 
            className="bg-amber-500 h-1/3 flex items-center justify-end px-2 text-xs text-white font-medium"
            style={{ width: `${(performance / overall) * 100}%` }}
          >
            Performance: {formatCurrency(performance)}
          </div>
          <div 
            className="bg-red-500 h-1/3 flex items-center justify-end px-2 text-xs text-white font-medium"
            style={{ width: `${(trivial / overall) * 100}%` }}
          >
            Trivial: {formatCurrency(trivial)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialityCalc;