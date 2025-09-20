
import React from 'react';
import { type HistoryEntry } from '../types';

interface HistoryTableProps {
    history: HistoryEntry[];
    onClearHistory: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClearHistory }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Calculation History</h2>
                <button
                    onClick={onClearHistory}
                    className="px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                    Clear History
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Years of Service</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Gratuity Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {history.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(entry.calculatedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{entry.employeeData.name || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{entry.employeeData.employeeId || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{entry.result.roundedYears} yrs</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold text-right">{formatCurrency(entry.result.gratuityAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
