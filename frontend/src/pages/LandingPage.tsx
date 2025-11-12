import { useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme, Stack, Chip } from '@mui/material';
import {
  Business as BusinessIcon,
  AccountBalance as EntityIcon,
  Assignment as EngagementIcon,
  CloudUpload as UploadIcon,
  Description as PaperIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
  VerifiedUser as ComplianceIcon,
  TrendingUp as GrowthIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: BusinessIcon,
    title: 'landing.features.organizations.title',
    description: 'landing.features.organizations.description',
  },
  {
    icon: EntityIcon,
    title: 'landing.features.entities.title',
    description: 'landing.features.entities.description',
  },
  {
    icon: EngagementIcon,
    title: 'landing.features.engagements.title',
    description: 'landing.features.engagements.description',
  },
  {
    icon: UploadIcon,
    title: 'landing.features.dataImport.title',
    description: 'landing.features.dataImport.description',
  },
  {
    icon: PaperIcon,
    title: 'landing.features.workingPapers.title',
    description: 'landing.features.workingPapers.description',
  },
  {
    icon: SecurityIcon,
    title: 'landing.features.security.title',
    description: 'landing.features.security.description',
  },
];

const benefits = [
  {
    icon: SpeedIcon,
    title: 'landing.benefits.automation.title',
    description: 'landing.benefits.automation.description',
  },
  {
    icon: SecurityIcon,
    title: 'landing.benefits.blockchain.title',
    description: 'landing.benefits.blockchain.description',
  },
  {
    icon: LanguageIcon,
    title: 'landing.benefits.bilingual.title',
    description: 'landing.benefits.bilingual.description',
  },
];

const trustIndicators = [
  'Bank-grade Security',
  'SOC 2 Compliant',
  'GDPR Ready',
  'ISO 27001',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, login, user } = useAuth();
  const theme = useTheme();

  // Auto-redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if profile is completed
      if (!user.profile_completed) {
        navigate('/profile-setup');
        return;
      }

      // Redirect based on role
      const isClientUser = user.role && 'ClientUser' in user.role;
      const redirectPath = isClientUser ? '/client-portal' : '/engagements';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      return;
    } else {
      login();
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Sophisticated Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0A2463 0%, #1E3A8A 50%, #3E92CC 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 20%, rgba(62, 146, 204, 0.2) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center" sx={{ py: { xs: 10, md: 16 } }}>
            <Grid item xs={12} md={7}>
              {/* Trust Badge */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<ShieldIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)' }} />}
                  label="Trusted by 500+ Audit Firms"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.02em',
                    px: 1,
                  }}
                />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  mb: 3,
                  lineHeight: 1.1,
                  color: 'white',
                  letterSpacing: '-0.03em',
                }}
              >
                {t('landing.hero.title')}
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  maxWidth: 600,
                }}
              >
                {t('landing.hero.subtitle')}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.75,
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      bgcolor: '#F9FAFB',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  {isAuthenticated ? t('landing.hero.goToDashboard') : t('landing.hero.getStarted')}
                </Button>
                
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      px: 4,
                      py: 1.75,
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderWidth: '2px',
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: '2px',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                  >
                    {t('landing.hero.learnMore')}
                  </Button>
                )}
              </Stack>

              {/* Trust Indicators */}
              <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ gap: 2 }}>
                {trustIndicators.map((indicator, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon sx={{ fontSize: 18, color: '#10B981' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.85)', 
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      {indicator}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Visual Element */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  height: 450,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 380,
                    height: 380,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                    },
                  }}
                >
                  <PaperIcon sx={{ fontSize: 180, color: 'rgba(255, 255, 255, 0.3)' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Professional Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 800,
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
            }}
          >
            COMPREHENSIVE PLATFORM
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2, 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: 'text.primary',
            }}
          >
            {t('landing.features.title')}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.8,
            }}
          >
            {t('landing.features.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                      borderColor: 'primary.main',
                      '& .feature-icon': {
                        transform: 'scale(1.1)',
                        bgcolor: 'primary.main',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '12px',
                        bgcolor: 'rgba(10, 36, 99, 0.08)',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1.5, 
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {t(feature.title)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {t(feature.description)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Benefits Section - Modern Cards */}
      <Box 
        sx={{ 
          bgcolor: '#F9FAFB',
          borderTop: '1px solid #E5E7EB',
          borderBottom: '1px solid #E5E7EB',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 800,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
              }}
            >
              WHY AUDITORBOX
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 2, 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'text.primary',
              }}
            >
              {t('landing.benefits.title')}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              {t('landing.benefits.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={5}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Box 
                    sx={{ 
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 96,
                        height: 96,
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #0A2463 0%, #3E92CC 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: '0 8px 24px rgba(10, 36, 99, 0.25)',
                      }}
                    >
                      <Icon sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {t(benefit.title)}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {t(benefit.description)}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Professional */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 14 } }}>
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 4, md: 6 },
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0A2463 0%, #1E3A8A 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 70% 30%, rgba(62, 146, 204, 0.3) 0%, transparent 50%)',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 3, 
                fontWeight: 800,
                color: 'white',
                fontSize: { xs: '1.875rem', md: '2.5rem' },
              }}
            >
              {t('landing.cta.title')}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 5,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              {t('landing.cta.subtitle')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              endIcon={<ArrowIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 6,
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              {isAuthenticated ? t('landing.hero.goToDashboard') : t('landing.hero.getStarted')}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer - Professional */}
      <Box
        sx={{
          bgcolor: '#1A2332',
          color: 'white',
          py: 6,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PaperIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                  AuditorBox
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.7,
                  maxWidth: 400,
                  lineHeight: 1.7,
                }}
              >
                Enterprise-grade audit management platform built for modern accounting firms.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.7,
                  textAlign: { xs: 'left', md: 'right' }
                }}
              >
                © 2025 AuditorBox. {t('landing.footer.rights')}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.5,
                  textAlign: { xs: 'left', md: 'right' },
                  display: 'block',
                  mt: 1,
                }}
              >
                Secured by Internet Computer Protocol
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
