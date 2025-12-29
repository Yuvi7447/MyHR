/**
 * PayslipListScreen Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PayslipListScreen } from '../PayslipListScreen';
import { PayslipsProvider } from '../../context/PayslipsContext';
import { Payslip } from '../../types/payslip';

// Mock payslips for testing
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
    grossPay: 8500,
    deductions: 1700,
    netPay: 6800,
    employee: {
      name: 'Yuvraj Desai',
      department: 'Mobile Engineering',
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
    grossPay: 8500,
    deductions: 1700,
    netPay: 6800,
    employee: {
      name: 'Yuvraj Desai',
      department: 'Mobile Engineering',
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
    grossPay: 8500,
    deductions: 1700,
    netPay: 6800,
    employee: {
      name: 'Yuvraj Desai',
      department: 'Mobile Engineering',
    },
  },
];

// Helper to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NavigationContainer>
      <PayslipsProvider initialPayslips={mockPayslips}>
        {component}
      </PayslipsProvider>
    </NavigationContainer>,
  );
};

describe('PayslipListScreen', () => {
  it('should render the screen title', () => {
    renderWithProviders(<PayslipListScreen />);
    expect(screen.getByText('Payslips')).toBeTruthy();
  });

  it('should render all payslip items', () => {
    renderWithProviders(<PayslipListScreen />);
    
    // Check if payslips are rendered
    expect(screen.getByText('August 2025')).toBeTruthy();
    expect(screen.getByText('December 2024')).toBeTruthy();
    expect(screen.getByText('July 2023')).toBeTruthy();
  });

  it('should display correct payslip count', () => {
    renderWithProviders(<PayslipListScreen />);
    expect(screen.getByText('3 payslips')).toBeTruthy();
  });

  it('should display singular "payslip" when count is 1', () => {
    const singlePayslip = [mockPayslips[0]];
    render(
      <NavigationContainer>
        <PayslipsProvider initialPayslips={singlePayslip}>
          <PayslipListScreen />
        </PayslipsProvider>
      </NavigationContainer>,
    );
    expect(screen.getByText('1 payslip')).toBeTruthy();
  });

  it('should render sort picker', () => {
    renderWithProviders(<PayslipListScreen />);
    expect(screen.getByText('Newest first')).toBeTruthy();
  });

  it('should render search input with placeholder', () => {
    renderWithProviders(<PayslipListScreen />);
    const searchInput = screen.getByPlaceholderText(
      'Search by month, year, company name or ID...',
    );
    expect(searchInput).toBeTruthy();
  });

  it('should filter payslips by search query', () => {
    renderWithProviders(<PayslipListScreen />);
    
    const searchInput = screen.getByPlaceholderText(
      'Search by month, year, company name or ID...',
    );
    
    // Search for "INCRED"
    fireEvent.changeText(searchInput, 'INCRED');
    
    // Should show 2 INCRED payslips
    expect(screen.getByText('2 payslips')).toBeTruthy();
    expect(screen.getByText('August 2025')).toBeTruthy();
    expect(screen.getByText('December 2024')).toBeTruthy();
    expect(screen.queryByText('July 2023')).toBeNull();
  });

  it('should filter payslips by year', () => {
    renderWithProviders(<PayslipListScreen />);
    
    // Click on 2024 year filter
    const year2024Button = screen.getByText('2024');
    fireEvent.press(year2024Button);
    
    // Should show only 2024 payslip
    expect(screen.getByText('1 payslip')).toBeTruthy();
    expect(screen.getByText('December 2024')).toBeTruthy();
    expect(screen.queryByText('August 2025')).toBeNull();
  });

  it('should show empty state when no payslips match filter', () => {
    renderWithProviders(<PayslipListScreen />);
    
    const searchInput = screen.getByPlaceholderText(
      'Search by month, year, company name or ID...',
    );
    
    // Search for non-existent payslip
    fireEvent.changeText(searchInput, 'NONEXISTENT');
    
    expect(screen.getByText('No Payslips Found')).toBeTruthy();
    expect(screen.getByText('Try adjusting your filters')).toBeTruthy();
  });

  it('should render year filter chips', () => {
    renderWithProviders(<PayslipListScreen />);
    
    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('2025')).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('2023')).toBeTruthy();
  });

  it('should display net pay amounts', () => {
    renderWithProviders(<PayslipListScreen />);
    
    // All mock payslips have the same net pay
    const netPayElements = screen.getAllByText('$6,800');
    expect(netPayElements.length).toBeGreaterThan(0);
  });
});

