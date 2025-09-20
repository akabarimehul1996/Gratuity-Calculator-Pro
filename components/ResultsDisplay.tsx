import React from 'react';
import { type CalculationResult, type EmployeeData } from '../types';
import { PrintIcon, CheckCircleIcon } from './Icons';
import { GRATUITY_TAX_EXEMPT_LIMIT } from '../constants';

interface ResultsDisplayProps {
    result: CalculationResult | null;
    employeeData: EmployeeData;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const ResultCard: React.FC<{ title: string; value: string; colorClass: string; isLarge?: boolean }> = ({ title, value, colorClass, isLarge }) => (
    <div className={`p-4 rounded-lg ${colorClass}`}>
        <p className="text-sm opacity-80">{title}</p>
        <p className={`${isLarge ? 'text-3xl' : 'text-xl'} font-bold`}>{value}</p>
    </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, employeeData }) => {

    const handlePrint = () => {
        window.print();
    };
    
    if (!result) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center">
                 <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <CheckCircleIcon className="h-12 w-12 text-indigo-600"/>
                 </div>
                <h2 className="text-xl font-semibold text-slate-800">Your Gratuity Calculation Awaits</h2>
                <p className="text-slate-500 mt-2 max-w-sm">Fill in the employee details on the left to instantly calculate the gratuity amount and see the detailed tax breakdown.</p>
            </div>
        );
    }
    
    const isEligible = result.gratuityAmount > 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200" id="print-section">
            <div className="flex justify-between items-start print:hidden">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Calculation Result</h2>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                >
                    <PrintIcon className="h-5 w-5 mr-2 text-slate-500" />
                    Print / Save PDF
                </button>
            </div>
            
             <div className="print:block hidden text-center mb-6">
                <h1 className="text-2xl font-bold">Gratuity Calculation Report</h1>
                <p className="text-sm text-slate-600">Generated on: {new Date().toLocaleDateString()}</p>
            </div>

            {employeeData.name && (
                 <div className="mb-6 pb-4 border-b border-dashed print:block">
                     <h3 className="text-lg font-semibold text-slate-800">For: {employeeData.name}</h3>
                     <p className="text-sm text-slate-500">
                         {employeeData.designation} (ID: {employeeData.employeeId})
                     </p>
                 </div>
            )}
            
            {!isEligible ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-center">
                    <h3 className="font-bold text-lg">Not Eligible for Gratuity</h3>
                    <p>The employee has not completed the minimum required 5 years of service.</p>
                    <p className="text-sm mt-2">Years of Service: {result.yearsOfService} years.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <ResultCard title="Total Gratuity Payable" value={formatCurrency(result.gratuityAmount)} colorClass="bg-indigo-600 text-white" isLarge />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultCard title="Tax-Exempt Amount" value={formatCurrency(result.taxExemptAmount)} colorClass="bg-green-100 text-green-900" />
                        <ResultCard title="Taxable Amount" value={formatCurrency(result.taxableAmount)} colorClass="bg-red-100 text-red-900" />
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Calculation Breakdown</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex justify-between"><span>Years of Service:</span> <span className="font-medium text-slate-800">{result.yearsOfService} years</span></li>
                            <li className="flex justify-between"><span>Rounded Years for Calculation:</span> <span className="font-medium text-slate-800">{result.roundedYears} years</span></li>
                             <li className="flex justify-between items-center">
                               <span>Formula Used:</span> 
                               <span className="font-mono text-xs bg-slate-100 p-1 rounded text-slate-800">{result.calculationFormula}</span>
                             </li>
                            <li className="flex justify-between"><span>Statutory Tax-Exempt Limit:</span> <span className="font-medium text-slate-800">{formatCurrency(GRATUITY_TAX_EXEMPT_LIMIT)}</span></li>
                        </ul>
                    </div>
                </div>
            )}
             {/* FIX: Removed the non-standard 'jsx' prop from the <style> tag. The 'jsx' prop is specific to libraries like styled-jsx and is not a valid attribute for a standard HTML style element in React, which caused a TypeScript error. */}
             <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #print-section, #print-section * {
                    visibility: visible;
                  }
                  #print-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                }
            `}</style>
        </div>
    );
};
