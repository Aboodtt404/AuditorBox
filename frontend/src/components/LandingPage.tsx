import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Globe, 
  Building2, 
  Building, 
  Briefcase, 
  Upload, 
  FileText, 
  Users, 
  Activity,
  CheckCircle,
  ArrowRight,
  Zap,
  Lock,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
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

  const features = [
    {
      icon: Building2,
      title: t('landing.features.organizations.title'),
      description: t('landing.features.organizations.description'),
      highlights: [
        t('landing.features.organizations.highlight1'),
        t('landing.features.organizations.highlight2'),
        t('landing.features.organizations.highlight3')
      ]
    },
    {
      icon: Building,
      title: t('landing.features.entities.title'),
      description: t('landing.features.entities.description'),
      highlights: [
        t('landing.features.entities.highlight1'),
        t('landing.features.entities.highlight2'),
        t('landing.features.entities.highlight3')
      ]
    },
    {
      icon: Briefcase,
      title: t('landing.features.engagements.title'),
      description: t('landing.features.engagements.description'),
      highlights: [
        t('landing.features.engagements.highlight1'),
        t('landing.features.engagements.highlight2'),
        t('landing.features.engagements.highlight3')
      ]
    },
    {
      icon: Upload,
      title: t('landing.features.data_import.title'),
      description: t('landing.features.data_import.description'),
      highlights: [
        t('landing.features.data_import.highlight1'),
        t('landing.features.data_import.highlight2'),
        t('landing.features.data_import.highlight3')
      ]
    },
    {
      icon: FileText,
      title: t('landing.features.documents.title'),
      description: t('landing.features.documents.description'),
      highlights: [
        t('landing.features.documents.highlight1'),
        t('landing.features.documents.highlight2'),
        t('landing.features.documents.highlight3')
      ]
    },
    {
      icon: Users,
      title: t('landing.features.user_management.title'),
      description: t('landing.features.user_management.description'),
      highlights: [
        t('landing.features.user_management.highlight1'),
        t('landing.features.user_management.highlight2'),
        t('landing.features.user_management.highlight3')
      ]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: t('landing.benefits.efficiency.title'),
      description: t('landing.benefits.efficiency.description')
    },
    {
      icon: Lock,
      title: t('landing.benefits.security.title'),
      description: t('landing.benefits.security.description')
    },
    {
      icon: BarChart3,
      title: t('landing.benefits.insights.title'),
      description: t('landing.benefits.insights.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                AuditorBox
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">{t('app.subtitle')}</p>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <Select value={language} onValueChange={(value: 'en' | 'ar') => setLanguage(value)}>
              <SelectTrigger className="w-32 bg-muted/50 border-0 shadow-sm">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              <Shield className="h-4 w-4" />
              {isLoggingIn ? t('auth.logging_in') : t('auth.login')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
              {t('landing.hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="gap-2 h-12 px-8 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
            >
              <Shield className="h-5 w-5" />
              {isLoggingIn ? t('auth.logging_in') : t('landing.hero.cta_primary')}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('landing.hero.cta_subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              {t('landing.how_it_works.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.how_it_works.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: t('landing.how_it_works.step1.title'),
                description: t('landing.how_it_works.step1.description')
              },
              {
                step: '2',
                title: t('landing.how_it_works.step2.title'),
                description: t('landing.how_it_works.step2.description')
              },
              {
                step: '3',
                title: t('landing.how_it_works.step3.title'),
                description: t('landing.how_it_works.step3.description')
              },
              {
                step: '4',
                title: t('landing.how_it_works.step4.title'),
                description: t('landing.how_it_works.step4.description')
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              {t('landing.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('landing.cta.subtitle')}
            </p>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            size="lg"
            className="gap-2 h-12 px-8 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
          >
            <Shield className="h-5 w-5" />
            {isLoggingIn ? t('auth.logging_in') : t('landing.cta.button')}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-sm text-muted-foreground">
            {t('landing.cta.note')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">AuditorBox</span>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 AuditorBox. Professional audit engagement management platform.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
