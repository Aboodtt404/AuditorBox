// Excel utility functions using SheetJS (xlsx)
// Import xlsx at usage site: import * as XLSX from 'xlsx';

export interface TBAccount {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  prior_debit?: number;
  prior_credit?: number;
  leadsheet?: string;
}

export function parseCSV(text: string): TBAccount[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ''; });
    return {
      account_code: row['account_code'] || row['code'] || '',
      account_name: row['account_name'] || row['name'] || '',
      debit: parseFloat(row['debit'] || '0') || 0,
      credit: parseFloat(row['credit'] || '0') || 0,
      prior_debit: parseFloat(row['prior_debit'] || '0') || 0,
      prior_credit: parseFloat(row['prior_credit'] || '0') || 0,
    };
  }).filter(a => a.account_code);
}

export function formatCurrency(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(n);
}

export function netBalance(account: TBAccount): number {
  return account.debit - account.credit;
}

export function priorNetBalance(account: TBAccount): number {
  return (account.prior_debit || 0) - (account.prior_credit || 0);
}

export function percentChange(current: number, prior: number): number | null {
  if (prior === 0) return current === 0 ? 0 : null;
  return ((current - prior) / Math.abs(prior)) * 100;
}
