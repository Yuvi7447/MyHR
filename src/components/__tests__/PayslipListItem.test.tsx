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
};

describe('PayslipListItem', () => {
  it('should render payslip date range', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('Aug 1 – 31, 2025')).toBeTruthy();
  });

  it('should render payslip filename', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('INCRED_AUG_2025_IMA000075_Payslip.pdf')).toBeTruthy();
  });

  it('should display PDF icon for PDF files', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('📄')).toBeTruthy();
  });

  it('should display image icon for image files', () => {
    const imagePayslip: Payslip = {
      ...mockPayslip,
      file: {
        name: 'payslip.png',
        type: 'image',
        assetPath: 'payslip.png',
      },
    };
    const onPress = jest.fn();
    render(<PayslipListItem payslip={imagePayslip} onPress={onPress} />);
    
    expect(screen.getByText('🖼️')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    const item = screen.getByText('Aug 1 – 31, 2025');
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
    expect(button.props.accessibilityLabel).toBe('Payslip for Aug 1 – 31, 2025');
    expect(button.props.accessibilityHint).toBe('Double tap to view payslip details');
  });

  it('should render chevron indicator', () => {
    const onPress = jest.fn();
    render(<PayslipListItem payslip={mockPayslip} onPress={onPress} />);
    
    expect(screen.getByText('›')).toBeTruthy();
  });
});

