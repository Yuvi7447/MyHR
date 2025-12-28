/**
 * Payslips Context - Global state management for payslips
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import moment from 'moment';

import { mockPayslips } from '../data/mockPayslips';
import { FilterYear, Payslip, SortOrder } from '../types/payslip';
import { compareDates, getYear, getUniqueYears, formatDateRange } from '../utils/dateFormatter';

interface PayslipsContextValue {
  // Data
  payslips: Payslip[];
  availableYears: number[];

  // Sorting
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;

  // Filtering
  filterYear: FilterYear;
  setFilterYear: (year: FilterYear) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Helpers
  getPayslipById: (id: string) => Payslip | undefined;
}

const PayslipsContext = createContext<PayslipsContextValue | null>(null);

interface PayslipsProviderProps {
  children: ReactNode;
  initialPayslips?: Payslip[];
}

export function PayslipsProvider({
  children,
  initialPayslips = mockPayslips,
}: PayslipsProviderProps) {
  // State
  const [allPayslips] = useState<Payslip[]>(initialPayslips);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filterYear, setFilterYear] = useState<FilterYear>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Available years for filter dropdown
  const availableYears = useMemo(() => {
    const dates = allPayslips.map((p) => p.toDate);
    return getUniqueYears(dates);
  }, [allPayslips]);

  // Filtered and sorted payslips
  const payslips = useMemo(() => {
    let result = [...allPayslips];

    // Apply year filter
    if (filterYear !== 'all') {
      result = result.filter((p) => getYear(p.toDate) === filterYear);
    }

    // Apply search filter - searches across multiple fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        // Search by ID
        if (p.id.toLowerCase().includes(query)) {
          return true;
        }

        // Search by filename
        if (p.file.name.toLowerCase().includes(query)) {
          return true;
        }

        // Search by ISO date
        if (p.fromDate.includes(query) || p.toDate.includes(query)) {
          return true;
        }

        // Search by formatted month/year
        const formattedDate = formatDateRange(p.fromDate, p.toDate).toLowerCase();
        if (formattedDate.includes(query)) {
          return true;
        }

        // Search by full month name (e.g., "July", "August")
        const fullMonthName = moment(p.fromDate).format('MMMM').toLowerCase();
        if (fullMonthName.includes(query)) {
          return true;
        }

        return false;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const comparison = compareDates(a.toDate, b.toDate);
      return sortOrder === 'newest' ? -comparison : comparison;
    });

    return result;
  }, [allPayslips, sortOrder, filterYear, searchQuery]);

  // Get payslip by ID
  const getPayslipById = useCallback(
    (id: string): Payslip | undefined => {
      return allPayslips.find((p) => p.id === id);
    },
    [allPayslips],
  );

  const value = useMemo(
    () => ({
      payslips,
      availableYears,
      sortOrder,
      setSortOrder,
      filterYear,
      setFilterYear,
      searchQuery,
      setSearchQuery,
      getPayslipById,
    }),
    [
      payslips,
      availableYears,
      sortOrder,
      filterYear,
      searchQuery,
      getPayslipById,
    ],
  );

  return (
    <PayslipsContext.Provider value={value}>
      {children}
    </PayslipsContext.Provider>
  );
}

export function usePayslipsContext(): PayslipsContextValue {
  const context = useContext(PayslipsContext);
  if (!context) {
    throw new Error(
      'usePayslipsContext must be used within a PayslipsProvider',
    );
  }
  return context;
}

