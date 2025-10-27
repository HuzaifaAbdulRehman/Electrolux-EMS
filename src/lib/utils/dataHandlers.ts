/**
 * DATA HANDLERS UTILITY
 *
 * Comprehensive utility functions to handle NULL, NaN, undefined values
 * throughout the application. Use these to prevent displaying "NaN" or "null"
 * in the UI.
 */

// ========== NUMBER HANDLERS ==========

/**
 * Safely convert any value to a number, with fallback
 * @param value - The value to convert
 * @param defaultValue - Default value if conversion fails (default: 0)
 * @returns A valid number or the default value
 */
export const safeNumber = (value: unknown, defaultValue: number = 0): number => {
  // Handle null, undefined, empty string
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  // Try to convert to number
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);

  // Return default if NaN
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
};

/**
 * Format number with fallback and decimal places
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param defaultValue - Default if value is invalid (default: '0.00')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: unknown,
  decimals: number = 2,
  defaultValue: string = '0.00'
): string => {
  const num = safeNumber(value);
  if (num === 0 && (value === null || value === undefined || value === '')) {
    return defaultValue;
  }
  return num.toFixed(decimals);
};

/**
 * Format currency with symbol
 * @param value - Amount to format
 * @param symbol - Currency symbol (default: '₹')
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: unknown,
  symbol: string = '₹',
  decimals: number = 2
): string => {
  const num = safeNumber(value);
  return `${symbol}${num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param value - Number to format
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export const formatCompactNumber = (value: unknown, decimals: number = 1): string => {
  const num = safeNumber(value);

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
};

// ========== STRING HANDLERS ==========

/**
 * Safely convert any value to string with fallback
 * @param value - Value to convert
 * @param defaultValue - Default if value is invalid (default: 'N/A')
 * @returns String or default value
 */
export const safeString = (value: unknown, defaultValue: string = 'N/A'): string => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  return String(value);
};

/**
 * Truncate string to max length with ellipsis
 * @param value - String to truncate
 * @param maxLength - Maximum length
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated string
 */
export const truncateString = (
  value: unknown,
  maxLength: number,
  ellipsis: string = '...'
): string => {
  const str = safeString(value, '');
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
};

// ========== DATE HANDLERS ==========

/**
 * Safely format date with fallback
 * @param value - Date value (string, Date object, or timestamp)
 * @param defaultValue - Default if invalid (default: 'N/A')
 * @param format - Format options
 * @returns Formatted date string
 */
export const safeDate = (
  value: unknown,
  defaultValue: string = 'N/A',
  format: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
): string => {
  if (!value) return defaultValue;

  try {
    const date = new Date(value as string | number | Date);
    if (isNaN(date.getTime())) return defaultValue;
    return date.toLocaleDateString('en-IN', format);
  } catch {
    return defaultValue;
  }
};

/**
 * Format date for display (short format)
 * @param value - Date value
 * @returns Formatted date (e.g., "Jan 15, 2024")
 */
export const formatDate = (value: unknown): string => {
  return safeDate(value, 'N/A', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Format date with time
 * @param value - Date value
 * @returns Formatted datetime (e.g., "Jan 15, 2024, 3:30 PM")
 */
export const formatDateTime = (value: unknown): string => {
  return safeDate(value, 'N/A', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ========== PERCENTAGE HANDLERS ==========

/**
 * Format value as percentage
 * @param value - Decimal value (e.g., 0.15 for 15%)
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted percentage (e.g., "15.0%")
 */
export const formatPercentage = (value: unknown, decimals: number = 1): string => {
  const num = safeNumber(value) * 100;
  return `${num.toFixed(decimals)}%`;
};

// ========== ARRAY HANDLERS ==========

/**
 * Safely get array with fallback to empty array
 * @param value - Value that should be an array
 * @returns Array or empty array
 */
export const safeArray = <T = unknown>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};

/**
 * Calculate average of array values
 * @param values - Array of numbers
 * @param decimals - Decimal places (default: 2)
 * @returns Average or 0 if array is empty
 */
export const calculateAverage = (values: unknown[], decimals: number = 2): number => {
  const arr = safeArray(values).map(v => safeNumber(v));
  if (arr.length === 0) return 0;

  const sum = arr.reduce((acc, val) => acc + val, 0);
  const avg = sum / arr.length;
  return parseFloat(avg.toFixed(decimals));
};

/**
 * Calculate sum of array values
 * @param values - Array of numbers
 * @param decimals - Decimal places (default: 2)
 * @returns Sum or 0 if array is empty
 */
export const calculateSum = (values: unknown[], decimals: number = 2): number => {
  const arr = safeArray(values).map(v => safeNumber(v));
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return parseFloat(sum.toFixed(decimals));
};

// ========== OBJECT HANDLERS ==========

/**
 * Safely get nested object property
 * @param obj - Object to traverse
 * @param path - Dot-separated path (e.g., 'user.profile.name')
 * @param defaultValue - Default if path not found
 * @returns Value at path or default
 */
export const safeGet = (obj: unknown, path: string, defaultValue: unknown = null): unknown => {
  try {
    return path.split('.').reduce((current: any, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

// ========== VALIDATION HELPERS ==========

/**
 * Check if value is valid (not null, undefined, NaN, empty string)
 * @param value - Value to check
 * @returns true if valid, false otherwise
 */
export const isValid = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

/**
 * Get first valid value from array of values
 * @param values - Array of potential values
 * @param defaultValue - Final fallback
 * @returns First valid value or default
 */
export const firstValid = (...values: unknown[]): unknown => {
  for (const value of values) {
    if (isValid(value)) return value;
  }
  return values[values.length - 1];
};

// ========== BILL-SPECIFIC HELPERS ==========

/**
 * Format units consumed
 * @param value - Units value
 * @returns Formatted units (e.g., "450 kWh")
 */
export const formatUnits = (value: unknown): string => {
  const units = safeNumber(value);
  return `${units.toLocaleString()} kWh`;
};

/**
 * Format meter reading
 * @param value - Meter reading value
 * @returns Formatted reading (e.g., "12,345")
 */
export const formatMeterReading = (value: unknown): string => {
  const reading = safeNumber(value);
  return reading.toLocaleString();
};

/**
 * Calculate bill status badge color
 * @param status - Bill status
 * @returns Tailwind color classes
 */
export const getBillStatusColor = (status: string): string => {
  const s = safeString(status, '').toLowerCase();
  switch (s) {
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'pending':
    case 'issued':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Tariff slab interface
 */
export interface TariffSlab {
  units: number;
  rate: number;
  amount: number;
  range: string;
}

/**
 * Calculate tariff slab breakdown from units consumed and tariff rates
 * This mimics the calculation done in the backend bill generation
 * @param unitsConsumed - Total units consumed
 * @param tariff - Tariff object with slab rates (optional - uses default Pakistani residential rates)
 * @returns Array of tariff slabs with units, rate, and amount
 */
export const calculateTariffSlabs = (
  unitsConsumed: number,
  tariff?: {
    slab1Start: number;
    slab1End: number;
    slab1Rate: number;
    slab2Start: number;
    slab2End: number;
    slab2Rate: number;
    slab3Start: number;
    slab3End: number;
    slab3Rate: number;
    slab4Start: number;
    slab4End: number;
    slab4Rate: number;
    slab5Start: number;
    slab5End: number | null;
    slab5Rate: number;
  }
): TariffSlab[] => {
  // Default Pakistani residential tariff structure if not provided
  const defaultTariff = {
    slab1Start: 0,
    slab1End: 100,
    slab1Rate: 5.0,
    slab2Start: 100,
    slab2End: 200,
    slab2Rate: 8.0,
    slab3Start: 200,
    slab3End: 300,
    slab3Rate: 12.0,
    slab4Start: 300,
    slab4End: 500,
    slab4Rate: 18.0,
    slab5Start: 500,
    slab5End: null,
    slab5Rate: 22.0,
  };

  const t = tariff || defaultTariff;

  const slabs = [
    { start: t.slab1Start, end: t.slab1End, rate: t.slab1Rate },
    { start: t.slab2Start, end: t.slab2End, rate: t.slab2Rate },
    { start: t.slab3Start, end: t.slab3End, rate: t.slab3Rate },
    { start: t.slab4Start, end: t.slab4End, rate: t.slab4Rate },
    { start: t.slab5Start, end: t.slab5End || 999999, rate: t.slab5Rate },
  ];

  const result: TariffSlab[] = [];
  let remainingUnits = safeNumber(unitsConsumed, 0);

  for (const slab of slabs) {
    if (remainingUnits <= 0) break;

    const slabUnits = Math.min(remainingUnits, slab.end - slab.start);
    if (slabUnits > 0) {
      const amount = slabUnits * slab.rate;
      result.push({
        units: slabUnits,
        rate: slab.rate,
        amount: amount,
        range: slab.end === 999999
          ? `${slab.start}+ kWh`
          : `${slab.start}-${slab.end} kWh`
      });
      remainingUnits -= slabUnits;
    }
  }

  return result;
};

// ========== EXPORT ALL ==========

export default {
  // Numbers
  safeNumber,
  formatNumber,
  formatCurrency,
  formatCompactNumber,

  // Strings
  safeString,
  truncateString,

  // Dates
  safeDate,
  formatDate,
  formatDateTime,

  // Percentages
  formatPercentage,

  // Arrays
  safeArray,
  calculateAverage,
  calculateSum,

  // Objects
  safeGet,

  // Validation
  isValid,
  firstValid,

  // Bill-specific
  formatUnits,
  formatMeterReading,
  getBillStatusColor,
  calculateTariffSlabs
};
