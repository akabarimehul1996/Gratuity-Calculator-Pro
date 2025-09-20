
import React from 'react';
import { type EmployeeData } from '../types';
import { InfoIcon, UserIcon, CalendarIcon, RupeeIcon, BriefcaseIcon } from './Icons';

interface CalculatorFormProps {
    employeeData: EmployeeData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCalculate: () => void;
    onReset: () => void;
    isFormValid: boolean;
}

const InputField: React.FC<{
    id: keyof EmployeeData;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    icon: React.ReactNode;
}> = ({ id, label, type, value, onChange, placeholder, icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {icon}
            </div>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
                required={type !== 'text'}
            />
        </div>
    </div>
);


export const CalculatorForm: React.FC<CalculatorFormProps> = ({ employeeData, onFormChange, onCalculate, onReset, isFormValid }) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }} className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 border-b pb-3">Employee Details</h2>
            
            <InputField id="name" label="Employee Name" type="text" value={employeeData.name} onChange={onFormChange} placeholder="e.g., Ananya Sharma" icon={<UserIcon className="h-5 w-5 text-slate-400" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputField id="employeeId" label="Employee ID" type="text" value={employeeData.employeeId} onChange={onFormChange} placeholder="e.g., EMP12345" icon={<InfoIcon className="h-5 w-5 text-slate-400" />} />
                 <InputField id="designation" label="Designation" type="text" value={employeeData.designation} onChange={onFormChange} placeholder="e.g., Software Engineer" icon={<BriefcaseIcon className="h-5 w-5 text-slate-400" />} />
            </div>
            
            <InputField id="joiningDate" label="Date of Joining" type="date" value={employeeData.joiningDate} onChange={onFormChange} placeholder="" icon={<CalendarIcon className="h-5 w-5 text-slate-400" />} />
            <InputField id="leavingDate" label="Date of Resignation/Retirement" type="date" value={employeeData.leavingDate} onChange={onFormChange} placeholder="" icon={<CalendarIcon className="h-5 w-5 text-slate-400" />} />
            
            <div>
                 <InputField id="lastDrawnSalary" label="Last Drawn Salary (Basic + DA)" type="number" value={employeeData.lastDrawnSalary} onChange={onFormChange} placeholder="e.g., 75000" icon={<RupeeIcon className="h-5 w-5 text-slate-400" />} />
                 <p className="mt-1 text-xs text-slate-500">Enter the monthly salary amount.</p>
            </div>
           
            <div className="flex items-center space-x-3 pt-4 border-t">
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                    Calculate Gratuity
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Reset
                </button>
            </div>
        </form>
    );
};
