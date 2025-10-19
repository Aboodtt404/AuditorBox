import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Globe } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const { language, setLanguage, t } = useLanguage();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-end">
          <Select value={language} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
            <SelectTrigger className="w-32">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {t('auth.welcome')}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {t('auth.subtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isLoggingIn ? t('auth.logging_in') : t('auth.get_started')}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Secure authentication powered by Internet Identity</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 AuditorBox. Professional audit engagement management platform.</p>
        </div>
      </div>
    </div>
  );
}