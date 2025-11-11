// Regional Configuration for Egyptian/MENA Market

export const REGIONAL_CONFIG = {
  // Currency Settings
  defaultCurrency: 'EGP',
  currencies: [
    { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound', nameAr: 'جنيه مصري' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', nameAr: 'ريال سعودي' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', nameAr: 'درهم إماراتي' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', nameAr: 'دينار كويتي' },
    { code: 'USD', symbol: '$', name: 'US Dollar', nameAr: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', name: 'Euro', nameAr: 'يورو' },
  ],

  // Date & Time Settings
  dateFormat: 'DD/MM/YYYY',
  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  timeZone: 'Africa/Cairo',
  workWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  weekend: ['Friday', 'Saturday'],

  // Fiscal Settings
  fiscalYearEnd: '12-31', // December 31
  
  // Tax Rates (Egypt)
  taxRates: {
    vat: 0.14, // 14% VAT
    corporateTax: 0.225, // 22.5% corporate tax
    stampDuty: 0.004, // 0.4% stamp duty
  },

  // Number Formatting
  numberLocale: 'en-EG', // Can be switched to 'ar-EG' for Arabic numerals
  decimalSeparator: '.',
  thousandsSeparator: ',',
};

// Currency formatting helper
export const formatCurrency = (
  amount: number | bigint,
  currencyCode: string = REGIONAL_CONFIG.defaultCurrency
): string => {
  const currency = REGIONAL_CONFIG.currencies.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;
  
  const numAmount = typeof amount === 'bigint' ? Number(amount) / 100 : amount;
  
  return new Intl.NumberFormat(REGIONAL_CONFIG.numberLocale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount).replace(currencyCode, symbol);
};

// Date formatting helper
export const formatDate = (date: Date | string | bigint): string => {
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
  
  return `${day}/${month}/${year}`;
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = REGIONAL_CONFIG.currencies.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
};

