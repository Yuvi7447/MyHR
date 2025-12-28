/**
 * PayslipsContext Tests
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { PayslipsProvider, usePayslipsContext } from '../PayslipsContext';
import { Payslip } from '../../types/payslip';

const mockPayslips: Payslip[] = [
  {
    id: 'PAY-2025-08',
    fromDate: '2025-08-01',
    toDate: '2025-08-31',
    file: {
      name: 'INCRED_AUG_2025_IMA000075_Payslip.pdf',
      type: 'pdf',
      assetPath: 'INCRED_AUG_2025_IMA000075_Payslip.pdf',
    },
  },
  {
    id: 'PAY-2024-12',
    fromDate: '2024-12-01',
    toDate: '2024-12-31',
    file: {
      name: 'INCRED_DEC_2024_IMA000075_Payslip.pdf',
      type: 'pdf',
      assetPath: 'INCRED_DEC_2024_IMA000075_Payslip.pdf',
    },
  },
  {
    id: 'PAY-2023-07',
    fromDate: '2023-07-01',
    toDate: '2023-07-31',
    file: {
      name: 'Payslip_Jul_2023.pdf',
      type: 'pdf',
      assetPath: 'Payslip_Jul_2023.pdf',
    },
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PayslipsProvider initialPayslips={mockPayslips}>{children}</PayslipsProvider>
);

describe('PayslipsContext', () => {
  it('should provide initial payslips', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    expect(result.current.payslips).toHaveLength(3);
    expect(result.current.payslips[0].id).toBe('PAY-2025-08');
  });

  it('should provide available years in descending order', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    expect(result.current.availableYears).toEqual([2025, 2024, 2023]);
  });

  it('should default to newest sort order', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    expect(result.current.sortOrder).toBe('newest');
    expect(result.current.payslips[0].id).toBe('PAY-2025-08'); // Most recent
  });

  it('should change sort order to oldest', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setSortOrder('oldest');
    });
    
    expect(result.current.sortOrder).toBe('oldest');
    expect(result.current.payslips[0].id).toBe('PAY-2023-07'); // Oldest
  });

  it('should filter by year', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setFilterYear(2024);
    });
    
    expect(result.current.payslips).toHaveLength(1);
    expect(result.current.payslips[0].id).toBe('PAY-2024-12');
  });

  it('should search by payslip ID', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setSearchQuery('PAY-2025-08');
    });
    
    expect(result.current.payslips).toHaveLength(1);
    expect(result.current.payslips[0].id).toBe('PAY-2025-08');
  });

  it('should search by filename', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setSearchQuery('INCRED');
    });
    
    expect(result.current.payslips).toHaveLength(2);
    expect(result.current.payslips[0].id).toBe('PAY-2025-08');
    expect(result.current.payslips[1].id).toBe('PAY-2024-12');
  });

  it('should search by formatted date (month name)', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setSearchQuery('Aug');
    });
    
    expect(result.current.payslips).toHaveLength(1);
    expect(result.current.payslips[0].id).toBe('PAY-2025-08');
  });

  it('should search by year in date', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setSearchQuery('2024');
    });
    
    expect(result.current.payslips).toHaveLength(1);
    expect(result.current.payslips[0].id).toBe('PAY-2024-12');
  });

  it('should return empty array when search has no matches', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setSearchQuery('NONEXISTENT');
    });
    
    expect(result.current.payslips).toHaveLength(0);
  });

  it('should combine year filter and search', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    act(() => {
      result.current.setFilterYear(2024);
      result.current.setSearchQuery('INCRED');
    });
    
    expect(result.current.payslips).toHaveLength(1);
    expect(result.current.payslips[0].id).toBe('PAY-2024-12');
  });

  it('should get payslip by ID', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    const payslip = result.current.getPayslipById('PAY-2024-12');
    
    expect(payslip).toBeDefined();
    expect(payslip?.id).toBe('PAY-2024-12');
    expect(payslip?.file.name).toBe('INCRED_DEC_2024_IMA000075_Payslip.pdf');
  });

  it('should return undefined for non-existent ID', () => {
    const { result } = renderHook(() => usePayslipsContext(), { wrapper });
    
    const payslip = result.current.getPayslipById('NONEXISTENT');
    
    expect(payslip).toBeUndefined();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => usePayslipsContext());
    }).toThrow('usePayslipsContext must be used within a PayslipsProvider');
    
    consoleSpy.mockRestore();
  });
});

