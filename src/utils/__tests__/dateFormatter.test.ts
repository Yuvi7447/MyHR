/**
 * Date Formatter Utility Tests
 */

import {
  formatDate,
  formatDateFull,
  formatDateRange,
  getYear,
  getUniqueYears,
  compareDates,
} from '../dateFormatter';

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('should format ISO date to short format', () => {
      expect(formatDate('2024-08-15')).toBe('Aug 15, 2024');
      expect(formatDate('2025-01-01')).toBe('Jan 1, 2025');
      expect(formatDate('2023-12-31')).toBe('Dec 31, 2023');
    });

    it('should handle edge cases', () => {
      expect(formatDate('2024-02-29')).toBe('Feb 29, 2024'); // Leap year
      expect(formatDate('2024-01-01')).toBe('Jan 1, 2024'); // Year start
      expect(formatDate('2024-12-31')).toBe('Dec 31, 2024'); // Year end
    });
  });

  describe('formatDateFull', () => {
    it('should format ISO date to full format', () => {
      expect(formatDateFull('2024-08-15')).toBe('August 15, 2024');
      expect(formatDateFull('2025-01-01')).toBe('January 1, 2025');
      expect(formatDateFull('2023-12-31')).toBe('December 31, 2023');
    });
  });

  describe('formatDateRange', () => {
    it('should format same month range', () => {
      expect(formatDateRange('2024-08-01', '2024-08-31')).toBe('Aug 1 – 31, 2024');
      expect(formatDateRange('2025-01-01', '2025-01-31')).toBe('Jan 1 – 31, 2025');
    });

    it('should format different months, same year', () => {
      expect(formatDateRange('2024-01-15', '2024-02-15')).toBe('Jan 15 – Feb 15, 2024');
      expect(formatDateRange('2024-11-01', '2024-12-31')).toBe('Nov 1 – Dec 31, 2024');
    });

    it('should format different years', () => {
      expect(formatDateRange('2023-12-15', '2024-01-15')).toBe(
        'Dec 15, 2023 – Jan 15, 2024',
      );
      expect(formatDateRange('2024-06-01', '2025-06-30')).toBe(
        'Jun 1, 2024 – Jun 30, 2025',
      );
    });
  });

  describe('getYear', () => {
    it('should extract year from ISO date', () => {
      expect(getYear('2024-08-15')).toBe(2024);
      expect(getYear('2025-01-01')).toBe(2025);
      expect(getYear('2019-12-31')).toBe(2019);
    });
  });

  describe('getUniqueYears', () => {
    it('should return unique years in descending order', () => {
      const dates = [
        '2024-08-15',
        '2024-01-01',
        '2025-06-30',
        '2023-12-31',
        '2024-05-15',
      ];
      expect(getUniqueYears(dates)).toEqual([2025, 2024, 2023]);
    });

    it('should handle empty array', () => {
      expect(getUniqueYears([])).toEqual([]);
    });

    it('should handle single year', () => {
      const dates = ['2024-01-01', '2024-06-15', '2024-12-31'];
      expect(getUniqueYears(dates)).toEqual([2024]);
    });
  });

  describe('compareDates', () => {
    it('should return negative when first date is earlier', () => {
      expect(compareDates('2024-01-01', '2024-12-31')).toBeLessThan(0);
      expect(compareDates('2023-12-31', '2024-01-01')).toBeLessThan(0);
    });

    it('should return positive when first date is later', () => {
      expect(compareDates('2024-12-31', '2024-01-01')).toBeGreaterThan(0);
      expect(compareDates('2025-01-01', '2024-12-31')).toBeGreaterThan(0);
    });

    it('should return zero for same dates', () => {
      expect(compareDates('2024-08-15', '2024-08-15')).toBe(0);
    });
  });
});

