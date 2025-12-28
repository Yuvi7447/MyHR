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
    expect(screen.getByText('My Payslips')).toBeTruthy();
  });

  it('should render all payslip items', () => {
    renderWithProviders(<PayslipListScreen />);
    
    // Check if payslips are rendered
    expect(screen.getByText('Aug 1 – 31, 2025')).toBeTruthy();
    expect(screen.getByText('Dec 1 – 31, 2024')).toBeTruthy();
    expect(screen.getByText('Jul 1 – 31, 2023')).toBeTruthy();
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
      'Search by month, year, company, or ID...',
    );
    expect(searchInput).toBeTruthy();
  });

  it('should filter payslips by search query', () => {
    renderWithProviders(<PayslipListScreen />);
    
    const searchInput = screen.getByPlaceholderText(
      'Search by month, year, company, or ID...',
    );
    
    // Search for "INCRED"
    fireEvent.changeText(searchInput, 'INCRED');
    
    // Should show 2 INCRED payslips
    expect(screen.getByText('2 payslips')).toBeTruthy();
    expect(screen.getByText('Aug 1 – 31, 2025')).toBeTruthy();
    expect(screen.getByText('Dec 1 – 31, 2024')).toBeTruthy();
    expect(screen.queryByText('Jul 1 – 31, 2023')).toBeNull();
  });

  it('should filter payslips by year', () => {
    renderWithProviders(<PayslipListScreen />);
    
    // Click on 2024 year filter
    const year2024Button = screen.getByText('2024');
    fireEvent.press(year2024Button);
    
    // Should show only 2024 payslip
    expect(screen.getByText('1 payslip')).toBeTruthy();
    expect(screen.getByText('Dec 1 – 31, 2024')).toBeTruthy();
    expect(screen.queryByText('Aug 1 – 31, 2025')).toBeNull();
  });

  it('should show empty state when no payslips match filter', () => {
    renderWithProviders(<PayslipListScreen />);
    
    const searchInput = screen.getByPlaceholderText(
      'Search by month, year, company, or ID...',
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

  it('should display payslip filenames', () => {
    renderWithProviders(<PayslipListScreen />);
    
    expect(screen.getByText('INCRED_AUG_2025_IMA000075_Payslip.pdf')).toBeTruthy();
    expect(screen.getByText('INCRED_DEC_2024_IMA000075_Payslip.pdf')).toBeTruthy();
    expect(screen.getByText('Payslip_Jul_2023.pdf')).toBeTruthy();
  });
});

