import { useState } from 'react';
import { HttpAgent, Actor } from '@dfinity/agent';
import { useAuth } from './useAuth';
// @ts-ignore - Auto-generated declarations
import { idlFactory } from '../declarations/backend';
// @ts-ignore - Canister IDs JSON
import canisterIds from '../canister_ids.json';

export const useBackend = () => {
  const { identity } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createActor = async () => {
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const host = process.env.DFX_NETWORK === 'ic' 
      ? 'https://ic0.app' 
      : 'http://localhost:4943';

    const agent = new HttpAgent({ 
      identity,
      host,
    });

    // Fetch root key for local development - MUST be done for local replica
    // This is critical for Internet Identity to work locally
    if (process.env.DFX_NETWORK !== 'ic') {
      try {
        await agent.fetchRootKey();
        console.log('Root key fetched successfully');
      } catch (err) {
        console.warn('Unable to fetch root key:', err);
      }
    }

    const canisterId = canisterIds.backend.local;

    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  };

  const call = async <T,>(method: string, args: any[] = []): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const actor = await createActor();
      
      // Check if method exists
      if (typeof actor[method] !== 'function') {
        console.error('Available methods:', Object.keys(actor));
        throw new Error(`Method ${method} not found on actor`);
      }

      // @ts-ignore - Dynamic method call
      const result = await actor[method](...args);
      
      // Handle Result type from backend
      if (result && typeof result === 'object' && 'Ok' in result) {
        return result.Ok as T;
      } else if (result && typeof result === 'object' && 'Err' in result) {
        throw new Error(result.Err as string);
      }

      return result as T;
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    call,
    loading,
    error,
  };
};

