import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/auditorbox_backend/auditorbox_backend.did.js';
import type { _SERVICE } from '../declarations/auditorbox_backend/auditorbox_backend.did';
import { CONFIG } from '../config';

let backendActor: _SERVICE | null = null;

export const initializeBackend = async (identity?: any) => {
  const agent = new HttpAgent({ host: CONFIG.IC_HOST, identity });
  if (CONFIG.IS_LOCAL) {
    try {
      await agent.fetchRootKey();
    } catch (e) {
      console.warn('Could not fetch root key — is dfx running?', e);
    }
  }

  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: CONFIG.CANISTER_ID,
  });

  backendActor = actor;
  return actor;
};

export const getBackend = (): _SERVICE => {
  if (!backendActor) throw new Error('Backend not initialized — call initializeBackend first');
  return backendActor;
};
