
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryTable } from './components/HistoryTable';
import { LogoIcon } from './components/Icons';
import { type EmployeeData, type CalculationResult, type HistoryEntry } from './types';
import { GRATUITY_TAX_EXEMPT_LIMIT } from './constants';

const App: React.FC = () => {
    const [employeeData, setEmployeeData] = useState<EmployeeData>({
        name: '',
        employeeId: '',
        designation: '',
        joiningDate: '',
        leavingDate: '',
        lastDrawnSalary: '',
    });

    const [result, setResult] = useState<CalculationResult | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('gratuityHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to parse history from localStorage", error);
            localStorage.removeItem('gratuityHistory');
        }
    }, []);

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({ ...prev, [name]: value }));
    }, []);

    const calculateGratuity = useCallback(() => {
        if (!employeeData.joiningDate || !employeeData.leavingDate || !employeeData.lastDrawnSalary) {
            return;
        }

        const startDate = new Date(employeeData.joiningDate);
        const endDate = new Date(employeeData.leavingDate);

        if (endDate < startDate) {
            alert("Leaving date cannot be before joining date.");
            return;
        }

        let yearsOfService = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        
        const fullYears = Math.floor(yearsOfService);
        const months = (yearsOfService - fullYears) * 12;
        const roundedYears = months >= 6 ? fullYears + 1 : fullYears;

        if (roundedYears < 5) {
             const newResult: CalculationResult = {
                yearsOfService: parseFloat(yearsOfService.toFixed(2)),
                roundedYears: roundedYears,
                gratuityAmount: 0,
                taxExemptAmount: 0,
                taxableAmount: 0,
                calculationFormula: "Not eligible (less than 5 years of service)",
            };
            setResult(newResult);
            return;
        }

        const salary = parseFloat(employeeData.lastDrawnSalary);
        const gratuityAmount = Math.round((salary * 15 * roundedYears) / 26);
        const taxExemptAmount = Math.min(gratuityAmount, GRATUITY_TAX_EXEMPT_LIMIT);
        const taxableAmount = Math.max(0, gratuityAmount - GRATUITY_TAX_EXEMPT_LIMIT);

        const newResult: CalculationResult = {
            yearsOfService: parseFloat(yearsOfService.toFixed(2)),
            roundedYears: roundedYears,
            gratuityAmount: gratuityAmount,
            taxExemptAmount: taxExemptAmount,
            taxableAmount: taxableAmount,
            calculationFormula: `(₹${salary.toLocaleString('en-IN')} × 15 × ${roundedYears} years) / 26`,
        };
        setResult(newResult);

        const newHistoryEntry: HistoryEntry = {
            id: Date.now().toString(),
            employeeData,
            result: newResult,
            calculatedAt: new Date().toISOString(),
        };

        const updatedHistory = [newHistoryEntry, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('gratuityHistory', JSON.stringify(updatedHistory));

    }, [employeeData, history]);

    const handleReset = useCallback(() => {
        setEmployeeData({
            name: '',
            employeeId: '',
            designation: '',
            joiningDate: '',
            leavingDate: '',
            lastDrawnSalary: '',
        });
        setResult(null);
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem('gratuityHistory');
    }, []);
    
    const isFormValid = useMemo(() => {
        return employeeData.joiningDate && employeeData.leavingDate && parseFloat(employeeData.lastDrawnSalary) > 0;
    }, [employeeData]);


    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center space-x-3 mb-8">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <LogoIcon className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Gratuity Calculator Pro</h1>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                           <CalculatorForm
                                employeeData={employeeData}
                                onFormChange={handleFormChange}
                                onCalculate={calculateGratuity}
                                onReset={handleReset}
                                isFormValid={isFormValid}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                       <ResultsDisplay result={result} employeeData={employeeData} />
                    </div>

                    {history.length > 0 && (
                        <div className="lg:col-span-5 mt-4">
                           <HistoryTable history={history} onClearHistory={clearHistory} />
                        </div>
                    )}
                </main>
                 <footer className="text-center text-sm text-slate-500 mt-12">
                    <p>&copy; {new Date().getFullYear()} Gratuity Calculator Pro. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
