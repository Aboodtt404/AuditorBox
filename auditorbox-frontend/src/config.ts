const IS_LOCAL =
  typeof window !== 'undefined'
    ? window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    : false;

export const CONFIG = {
  CANISTER_ID: process.env.CANISTER_ID_AUDITORBOX_BACKEND || 'br5f7-viaaa-aaaaa-qaaba-cai', // Local default
  IC_HOST: IS_LOCAL ? 'http://127.0.0.1:4943' : 'https://icp-api.io',
  IDENTITY_PROVIDER: IS_LOCAL
    ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}.localhost:4943`
    : 'https://identity.ic0.app',
  IS_LOCAL,
};
