/**
 * Date formatting utilities using Moment.js
 */

import moment from 'moment';

/**
 * Format an ISO date string to display format
 * @param isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Jan 1, 2024")
 */
export function formatDate(isoDate: string): string {
  return moment(isoDate).format('MMM D, YYYY');
}

/**
 * Format an ISO date string to full format
 * @param isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "January 1, 2024")
 */
export function formatDateFull(isoDate: string): string {
  return moment(isoDate).format('MMMM D, YYYY');
}

/**
 * Format a date range for display
 * @param fromDate - Start date in ISO format
 * @param toDate - End date in ISO format
 * @returns Formatted range (e.g., "Jan 1 – Jan 31, 2024" or "Dec 15, 2023 – Jan 15, 2024")
 */
export function formatDateRange(fromDate: string, toDate: string): string {
  const from = moment(fromDate);
  const to = moment(toDate);

  // Same year
  if (from.year() === to.year()) {
    // Same month - just show "Jan 1 – 31, 2024"
    if (from.month() === to.month()) {
      return `${from.format('MMM D')} – ${to.format('D, YYYY')}`;
    }
    // Different months - show "Jan 1 – Feb 28, 2024"
    return `${from.format('MMM D')} – ${to.format('MMM D, YYYY')}`;
  }

  // Different years - show full dates
  return `${from.format('MMM D, YYYY')} – ${to.format('MMM D, YYYY')}`;
}

/**
 * Extract year from an ISO date string
 * @param isoDate - Date in ISO format (YYYY-MM-DD)
 * @returns Year as number
 */
export function getYear(isoDate: string): number {
  return moment(isoDate).year();
}

/**
 * Get unique years from an array of ISO date strings
 * @param dates - Array of ISO date strings
 * @returns Sorted array of unique years (descending)
 */
export function getUniqueYears(dates: string[]): number[] {
  const years = [...new Set(dates.map(getYear))];
  return years.sort((a, b) => b - a);
}

/**
 * Compare two ISO dates for sorting
 * @param dateA - First date in ISO format
 * @param dateB - Second date in ISO format
 * @returns Negative if dateA < dateB, positive if dateA > dateB, 0 if equal
 */
export function compareDates(dateA: string, dateB: string): number {
  return moment(dateA).diff(moment(dateB));
}
