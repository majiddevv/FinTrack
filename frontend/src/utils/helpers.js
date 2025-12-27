import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount, currency = 'PKR') => {
  const currencySymbols = {
    PKR: 'Rs.',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    AED: 'د.إ',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol} ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthName = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return format(date, 'MMMM yyyy');
};

export const getMonthOptions = (count = 12) => {
  const options = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy'),
    });
  }
  
  return options;
};

export const getYearOptions = (startYear = 2020) => {
  const currentYear = new Date().getFullYear();
  const options = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    options.push({ value: year.toString(), label: year.toString() });
  }
  
  return options;
};

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: 'banknote' },
  { value: 'card', label: 'Card', icon: 'credit-card' },
  { value: 'bank', label: 'Bank Transfer', icon: 'building' },
  { value: 'other', label: 'Other', icon: 'wallet' },
];

export const CURRENCIES = [
  { value: 'PKR', label: 'Pakistani Rupee (Rs.)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'AED', label: 'UAE Dirham (د.إ)' },
];

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

