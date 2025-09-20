
export interface EmployeeData {
    name: string;
    employeeId: string;
    designation: string;
    joiningDate: string;
    leavingDate: string;
    lastDrawnSalary: string;
}

export interface CalculationResult {
    yearsOfService: number;
    roundedYears: number;
    gratuityAmount: number;
    taxExemptAmount: number;
    taxableAmount: number;
    calculationFormula: string;
}

export interface HistoryEntry {
    id: string;
    employeeData: EmployeeData;
    result: CalculationResult;
    calculatedAt: string;
}
