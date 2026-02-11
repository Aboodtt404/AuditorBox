const IS_LOCAL =
  typeof window !== 'undefined'
    ? window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    : false;

export const CONFIG = {
  CANISTER_ID: IS_LOCAL
    ? 'uxrrr-q7777-77774-qaaaq-cai'
    : 's7go6-iyaaa-aaaab-aekwq-cai',
  IC_HOST: IS_LOCAL ? 'http://127.0.0.1:4943' : 'https://icp-api.io',
  IDENTITY_PROVIDER: IS_LOCAL
    ? 'http://uzt4z-lp777-77774-qaabq-cai.localhost:4943'
    : 'https://identity.ic0.app',
  IS_LOCAL,
};
