import React from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from './components/LanguageProvider';
import LandingPage from './components/LandingPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import MainLayout from './components/MainLayout';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          {!isAuthenticated ? (
            <LandingPage />
          ) : (
            <>
              <MainLayout />
              {showProfileSetup && <ProfileSetupModal />}
            </>
          )}
          <Toaster />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
