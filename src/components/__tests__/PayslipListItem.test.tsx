/**
 * PayslipListItem Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PayslipListItem } from '../PayslipListItem';
import { Payslip } from '../../types/payslip';

const mockPayslip: Payslip = {
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
    name: 'John Doe',
    department: 'Engineering',
  },
};

describe('PayslipListItem', () => {
  it('should render payslip month and year', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('August 2025')).toBeTruthy();
  });

  it('should render payslip date range', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('Aug 1 – 31, 2025')).toBeTruthy();
  });

  it('should render net pay', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('$6,800')).toBeTruthy();
  });

  it('should display PDF icon', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('📄')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    const item = screen.getByText('August 2025');
    fireEvent.press(item);
    
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(mockPayslip);
  });

  it('should have correct accessibility attributes', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <PayslipListItem payslip={mockPayslip} onPress={onPress} />,
    );
    
    const button = getByRole('button');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityLabel).toBe('Payslip for August 2025, net pay $6,800');
    expect(button.props.accessibilityHint).toBe('Double tap to view payslip details');
  });

  it('should render chevron indicator', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('›')).toBeTruthy();
  });
});

