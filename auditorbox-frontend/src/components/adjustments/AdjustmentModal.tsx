import React, { useState, useEffect } from 'react';
import { CreateAjeRequest, AjeLineItem } from '../../declarations/auditorbox_backend/auditorbox_backend.did';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (aje: CreateAjeRequest) => void;
    engagementId: bigint;
    trialBalanceId: bigint; // We need this to link the AJE
};

const AdjustmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, engagementId, trialBalanceId }) => {
    const [description, setDescription] = useState('');
    const [lineItems, setLineItems] = useState<AjeLineItem[]>([
        { accountNumber: '', accountName: '', description: '', debit: 0, credit: 0 },
        { accountNumber: '', accountName: '', description: '', debit: 0, credit: 0 },
    ]);

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            setDescription('');
            setLineItems([
                { accountNumber: '', accountName: '', description: '', debit: 0, credit: 0 },
                { accountNumber: '', accountName: '', description: '', debit: 0, credit: 0 },
            ]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const totalDebit = lineItems.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = lineItems.reduce((sum, item) => sum + (item.credit || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
    const isValid = description.trim().length > 0 && lineItems.every(i => i.accountNumber) && isBalanced && totalDebit > 0;

    const handleAddLine = () => {
        setLineItems([...lineItems, { accountNumber: '', accountName: '', description: '', debit: 0, credit: 0 }]);
    };

    const handleRemoveLine = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: keyof AjeLineItem, value: string | number) => {
        const newLines = [...lineItems];
        (newLines[index] as any)[field] = value;
        setLineItems(newLines);
    };

    const handleSubmit = () => {
        if (!isValid) return;
        onSave({
            engagementId,
            trialBalanceId,
            description,
            lineItems,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-surface-darker border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-icons text-primary">post_add</span>
                        New Adjustment Entry
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description / Memo</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Reclassify hardware purchase to PPE"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            autoFocus
                        />
                    </div>

                    {/* Line Items */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-400">Journal Lines</label>
                            <button
                                onClick={handleAddLine}
                                className="text-xs font-medium text-primary hover:text-primary-light flex items-center gap-1"
                            >
                                <span className="material-icons text-sm">add</span>
                                Add Line
                            </button>
                        </div>

                        <div className="space-y-2">
                            {/* Header Row */}
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-2">
                                <div className="col-span-2">Account No.</div>
                                <div className="col-span-3">Account Name</div>
                                <div className="col-span-3">Description (Optional)</div>
                                <div className="col-span-2 text-right">Debit</div>
                                <div className="col-span-2 text-right">Credit</div>
                            </div>

                            {lineItems.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start group">
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={item.accountNumber}
                                            onChange={(e) => updateLine(index, 'accountNumber', e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary"
                                            placeholder="Code"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            value={item.accountName}
                                            onChange={(e) => updateLine(index, 'accountName', e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary"
                                            placeholder="Account Name"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateLine(index, 'description', e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:ring-1 focus:ring-primary"
                                            placeholder="Line desc"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            value={item.debit || ''}
                                            onChange={(e) => updateLine(index, 'debit', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white text-right focus:ring-1 focus:ring-primary"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={item.credit || ''}
                                            onChange={(e) => updateLine(index, 'credit', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white text-right focus:ring-1 focus:ring-primary"
                                            placeholder="0.00"
                                        />
                                        {lineItems.length > 2 && (
                                            <button onClick={() => handleRemoveLine(index)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-icons text-sm">close</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer / Totals */}
                <div className="p-6 bg-slate-900/50 border-t border-slate-800 rounded-b-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm font-medium text-slate-400">Totals</div>
                        <div className="flex gap-8 text-sm font-mono">
                            <div className="flex flex-col items-end">
                                <span className="text-slate-500 text-xs uppercase">Total Debit</span>
                                <span className="text-white font-bold">{totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-slate-500 text-xs uppercase">Total Credit</span>
                                <span className="text-white font-bold">{totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex flex-col items-end border-l border-slate-700 pl-8">
                                <span className="text-slate-500 text-xs uppercase">Difference</span>
                                <span className={`font-bold ${isBalanced ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {Math.abs(totalDebit - totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all shadow-lg ${isValid
                                    ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            Save Adjustment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdjustmentModal;
