/**
 * Custom hooks for payslip operations
 */

import { usePayslipsContext } from '../context/PayslipsContext';

/**
 * Hook to access payslips data and operations
 * Re-exports context for cleaner imports
 */
export function usePayslips() {
  return usePayslipsContext();
}

/**
 * Hook to get a single payslip by ID
 */
export function usePayslip(id: string) {
  const { getPayslipById } = usePayslipsContext();
  return getPayslipById(id);
}

