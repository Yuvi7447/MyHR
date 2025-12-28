/**
 * Payslip type definitions and navigation params
 */

export interface PayslipFile {
  name: string;
  type: 'pdf' | 'image';
  assetPath: string;
}

export interface EmployeeInfo {
  name: string;
  department: string;
}

export interface Payslip {
  id: string;
  fromDate: string; // ISO format: "2024-01-01"
  toDate: string; // ISO format: "2024-01-31"
  file: PayslipFile;
  netPay: number;
  grossPay: number;
  deductions: number;
  employee: EmployeeInfo;
}

export type SortOrder = 'newest' | 'oldest';

export type FilterYear = number | 'all';

// Navigation param types
export type RootStackParamList = {
  PayslipList: undefined;
  PayslipDetails: { payslipId: string };
};

