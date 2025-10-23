export const formatDate = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleDateString();
};

export const formatDateTime = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleString();
};

export const formatFileSize = (bytes: bigint | number): string => {
  const numBytes = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  const kb = numBytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const truncatePrincipal = (principal: string, length: number = 20): string => {
  if (principal.length <= length) return principal;
  return `${principal.slice(0, length)}...`;
};

