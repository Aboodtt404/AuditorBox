import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';

// Types matching backend FSLineItem roughly
export type FSLineItem = {
    code: string;
    name: string;
    category: string; // "Asset", "Liability", "Equity", "Revenue", "Expense"
    amount: number;
    nameAr?: string | null;
};

export type FinancialStatementData = {
    id: bigint;
    title: string;
    generatedAt: bigint;
    lineItems: FSLineItem[];
    taxonomy: any; // Simplified for now
};

const formatCurrency = (value: number) => {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(absValue);
    return isNegative ? `(${formatted})` : formatted;
};

type Tab = 'BS' | 'IS' | 'CF';

export const FinancialStatementView: React.FC<{
    data: FinancialStatementData;
    onGenerate: () => void;
    onExport: () => void;
    isGenerating?: boolean;
}> = ({ data, onGenerate, onExport, isGenerating }) => {
    const [activeTab, setActiveTab] = useState<Tab>('BS');

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, FSLineItem[]> = {
            Asset: [],
            Liability: [],
            Equity: [],
            Revenue: [],
            Expense: [],
        };

        data.lineItems.forEach(item => {
            // Normalize category check
            const cat = item.category;
            if (groups[cat]) {
                groups[cat].push(item);
            } else {
                // Fallback or other categories
                if (!groups['Other']) groups['Other'] = [];
                groups['Other'].push(item);
            }
        });
        return groups;
    }, [data]);

    // Calculations for Totals
    const totalAssets = groupedItems.Asset.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = groupedItems.Liability.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = groupedItems.Equity.reduce((sum, item) => sum + item.amount, 0);
    const totalRevenue = groupedItems.Revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = groupedItems.Expense.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpense; // Assuming expenses are positive numbers in DB, need to subtract
    // Note: If expenses are stored as negative, then just add. Usually in trial balance credits are negative, debits positive.
    // FS Line items usually displayed as positive magnitudes. We'll assume positive magnitudes for now.

    const renderSection = (title: string, items: FSLineItem[], totalLabel?: string, totalValue?: number) => (
        <div className="mb-8">
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-3 px-4">{title}</h3>
            <div className="bg-surface-darker rounded-xl border border-slate-800 overflow-hidden mb-2">
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-800">
                        {items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 text-slate-300 pl-8">{item.name}</td>
                                <td className="px-4 py-3 text-right font-mono text-slate-200 w-48">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalLabel && totalValue !== undefined && (
                <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <span className="font-bold text-slate-200">{totalLabel}</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(totalValue)}</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-background-dark">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-surface-dark sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{data.title}</h1>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="material-icons text-sm">event</span>
                        Generated: {format(Number(data.generatedAt) / 1000000, 'MMM d, yyyy HH:mm')}
                        <span className="mx-2">•</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs border border-amber-500/20">Draft</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className={`material-icons text-base ${isGenerating ? 'animate-spin' : ''}`}>
                            {isGenerating ? 'sync' : 'autorenew'}
                        </span>
                        {isGenerating ? 'Generating...' : 'Regenerate'}
                    </button>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-darker hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition-colors"
                    >
                        <span className="material-icons text-base">picture_as_pdf</span>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-6 pb-2 bg-background-dark">
                <div className="flex border-b border-slate-800">
                    {[
                        { id: 'BS', label: 'Balance Sheet' },
                        { id: 'IS', label: 'Income Statement' },
                        { id: 'CF', label: 'Cash Flow' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 relative">
                <div className="max-w-4xl mx-auto bg-surface-dark rounded-xl border border-slate-800 p-8 shadow-2xl">

                    {/* Balance Sheet */}
                    {activeTab === 'BS' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="text-center mb-8 border-b border-slate-800 pb-8">
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Statement of Financial Position</h2>
                                <p className="text-slate-500 text-sm">As of {format(new Date(), 'MMMM d, yyyy')}</p>
                            </div>

                            {renderSection('Assets', groupedItems.Asset, 'Total Assets', totalAssets)}

                            {renderSection('Liabilities', groupedItems.Liability, 'Total Liabilities', totalLiabilities)}

                            {renderSection('Equity', groupedItems.Equity, 'Total Equity', totalEquity)}

                            <div className="flex justify-between items-center px-4 py-4 bg-slate-900 rounded-lg border border-slate-700 mt-8">
                                <span className="font-bold text-lg text-white">Total Liabilities & Equity</span>
                                <span className="font-mono font-bold text-xl text-emerald-400">{formatCurrency(totalLiabilities + totalEquity)}</span>
                            </div>
                        </div>
                    )}

                    {/* Income Statement */}
                    {activeTab === 'IS' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="text-center mb-8 border-b border-slate-800 pb-8">
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Statement of Profit or Loss</h2>
                                <p className="text-slate-500 text-sm">For the year ended {format(new Date(), 'MMMM d, yyyy')}</p>
                            </div>

                            {renderSection('Revenue', groupedItems.Revenue, 'Total Revenue', totalRevenue)}

                            {renderSection('Expenses', groupedItems.Expense, 'Total Expenses', totalExpense)}

                            <div className="flex justify-between items-center px-4 py-4 bg-slate-900 rounded-lg border border-slate-700 mt-8">
                                <span className="font-bold text-lg text-white">Net Income</span>
                                <span className={`font-mono font-bold text-xl ${netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {formatCurrency(netIncome)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Cash Flow (Placeholder for now) */}
                    {activeTab === 'CF' && (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                            <span className="material-icons text-6xl mb-4 opacity-20">receipt_long</span>
                            <p className="text-lg">Statement of Cash Flows is not yet generated.</p>
                            <button onClick={onGenerate} className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                                Generarte Cash Flow
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FinancialStatementView;
