import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authClient: AuthClient | null;
  identity: any;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  authClient: null,
  identity: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [identity, setIdentity] = useState<any>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    const authenticated = await client.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const identity = client.getIdentity();
      setIdentity(identity);
      await fetchUser(identity);
    }
  };

  const fetchUser = async (_identity: any) => {
    try {
      const { HttpAgent } = await import('@dfinity/agent');
      const { Actor } = await import('@dfinity/agent');
      // @ts-ignore
      const { idlFactory } = await import('../declarations/backend');
      // @ts-ignore
      const canisterIds = await import('../canister_ids.json');
      
      const host = import.meta.env.DFX_NETWORK === 'ic'
        ? 'https://ic0.app'
        : 'http://localhost:4943';
      
      const agent = new HttpAgent({ 
        identity: _identity,
        host,
      });
      
      // Fetch root key for local development - critical for certificate verification
      if (import.meta.env.DFX_NETWORK !== 'ic') {
        try {
          await agent.fetchRootKey();
          console.log('Root key fetched for authentication');
        } catch (err) {
          console.warn('Unable to fetch root key during auth:', err);
        }
      }
      
      const canisterId = canisterIds.default.backend.local;
        
      const actor = Actor.createActor(idlFactory, { agent, canisterId });
      
      // @ts-ignore
      const result: any = await actor.get_current_user();
      if (result && 'Ok' in result) {
        setUser(result.Ok as User);
        console.log('User created/fetched:', result.Ok);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const login = async () => {
    if (!authClient) return;

    // Use local Internet Identity for local development
    const identityProvider = import.meta.env.DFX_NETWORK === 'ic'
      ? 'https://identity.ic0.app'
      : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

    await authClient.login({
      identityProvider,
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        setIdentity(identity);
        setIsAuthenticated(true);
        await fetchUser(identity);
      },
      // Add a 7-day session duration
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
    });
  };

  const logout = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setUser(null);
    setIdentity(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        authClient,
        identity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

