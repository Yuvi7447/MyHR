/**
 * Mock payslip data based on actual files in assets/payslips
 */

import moment from 'moment';

import { Payslip } from '../types/payslip';

/**
 * Helper to create a payslip entry with realistic financial data
 */
function createPayslip(
  id: string,
  year: number,
  month: number,
  fileName: string,
  grossPay: number = 8500,
): Payslip {
  const startDate = moment({ year, month: month - 1, day: 1 });
  const endDate = startDate.clone().endOf('month');
  
  // Calculate realistic deductions (20% of gross pay)
  const deductions = Math.round(grossPay * 0.2);
  const netPay = grossPay - deductions;

  return {
    id,
    fromDate: startDate.format('YYYY-MM-DD'),
    toDate: endDate.format('YYYY-MM-DD'),
    file: {
      name: fileName,
      type: 'pdf',
      assetPath: fileName,
    },
    grossPay,
    deductions,
    netPay,
    employee: {
      name: 'Yuvraj Desai',
      department: 'Mobile Engineering',
    },
  };
}

export const mockPayslips: Payslip[] = [
  // 2025 Payslips (INCRED)
  createPayslip(
    'PAY-2025-08',
    2025,
    8,
    'INCRED_AUG_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-07',
    2025,
    7,
    'INCRED_JUL_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-06',
    2025,
    6,
    'INCRED_JUN_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-05',
    2025,
    5,
    'INCRED_MAY_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-04',
    2025,
    4,
    'INCRED_APR_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-03',
    2025,
    3,
    'INCRED_MAR_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-02',
    2025,
    2,
    'INCRED_FEB_2025_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2025-01',
    2025,
    1,
    'INCRED_JAN_2025_IMA000075_Payslip.pdf',
  ),

  // 2024 Payslips (INCRED + others)
  createPayslip(
    'PAY-2024-12',
    2024,
    12,
    'INCRED_DEC_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2024-11',
    2024,
    11,
    'INCRED_NOV_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2024-10',
    2024,
    10,
    'INCRED_OCT_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2024-09',
    2024,
    9,
    'INCRED_SEP_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2024-08',
    2024,
    8,
    'INCRED_AUG_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2024-07',
    2024,
    7,
    'INCRED_JUL_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip(
    'PAY-2024-06',
    2024,
    6,
    'INCRED_JUN_2024_IMA000075_Payslip.pdf',
  ),
  createPayslip('PAY-2024-01', 2024, 1, 'Payslip_Jan_2024.pdf'),

  // 2023 Payslips
  createPayslip('PAY-2023-07', 2023, 7, 'Payslip_Jul_2023.pdf'),
  createPayslip('PAY-2023-03', 2023, 3, 'Payslip_Mar_2023.pdf'),

  // 2022 Payslips
  createPayslip('PAY-2022-08', 2022, 8, 'Payslip_Aug_2022.pdf'),
  createPayslip('PAY-2022-05', 2022, 5, 'Payslip_May_2022.pdf'),
  createPayslip('PAY-2022-02', 2022, 2, 'Payslip_Feb_2022.pdf'),

  // 2021 Payslips
  createPayslip('PAY-2021-06', 2021, 6, 'Payslip_Jun_2021.pdf'),
  createPayslip('PAY-2021-05', 2021, 5, 'Payslip_May_2021.pdf'),
  createPayslip('PAY-2021-03', 2021, 3, 'Payslip_Mar_2021.pdf'),

  // 2020 Payslip
  createPayslip('PAY-2020-08', 2020, 8, 'Payslip_Aug_2020.pdf'),

  // 2019 Payslip
  createPayslip('PAY-2019-08', 2019, 8, 'Yuvrajsinh D_Payslip Aug 19.pdf'),
];
