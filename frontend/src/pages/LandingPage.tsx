import { useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme } from '@mui/material';
import {
  Business as BusinessIcon,
  AccountBalance as EntityIcon,
  Assignment as EngagementIcon,
  CloudUpload as UploadIcon,
  Description as PaperIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Language as LanguageIcon,
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
      // This will be handled by the useEffect above
      return;
    } else {
      login();
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                {t('landing.hero.title')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {t('landing.hero.subtitle')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'grey.100',
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
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {t('landing.hero.learnMore')}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            {t('landing.features.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            {t('landing.features.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {t(feature.title)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(feature.description)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
              {t('landing.benefits.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t('landing.benefits.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      {t(benefit.title)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {t(benefit.description)}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
          {t('landing.cta.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {t('landing.cta.subtitle')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {isAuthenticated ? t('landing.hero.goToDashboard') : t('landing.hero.getStarted')}
        </Button>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 AuditorBox. {t('landing.footer.rights')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
