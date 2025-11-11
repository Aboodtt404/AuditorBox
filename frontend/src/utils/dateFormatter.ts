// Date formatting utilities for Egyptian/MENA region
import { formatDate as regionalFormatDate } from '../config/regional';

/**
 * Formats a date in DD/MM/YYYY format
 * @param date - Date object, bigint (nanoseconds), or string
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (date: Date | bigint | string | undefined | null): string => {
  if (!date) return 'N/A';
  return regionalFormatDate(date);
};

/**
 * Formats a date with time in DD/MM/YYYY HH:mm format
 * @param date - Date object, bigint (nanoseconds), or string
 * @returns Formatted date-time string
 */
export const formatDateTime = (date: Date | bigint | string | undefined | null): string => {
  if (!date) return 'N/A';
  
  let d: Date;
  
  if (typeof date === 'bigint') {
    d = new Date(Number(date) / 1000000);
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    d = date;
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formats a date for input fields (YYYY-MM-DD format required by HTML5 date inputs)
 * @param date - Date object, bigint, or string
 * @returns ISO format date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | bigint | string | undefined | null): string => {
  if (!date) return '';
  
  let d: Date;
  
  if (typeof date === 'bigint') {
    d = new Date(Number(date) / 1000000);
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    d = date;
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

