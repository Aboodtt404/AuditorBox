import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Assessment as StandardsIcon,
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { useNotification } from '../components/NotificationSystem';
import ComplianceDashboard from '../components/ComplianceDashboard';
import DocumentationTemplates from '../components/DocumentationTemplates';
import { EGYPTIAN_STANDARDS, getStandardByCode } from '../data/egyptianStandards';
import { Engagement, EngagementChecklist } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`standards-tabpanel-${index}`}
      aria-labelledby={`standards-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AuditStandards() {
  const { t, i18n } = useTranslation();
  const { call } = useBackend();
  const { showSuccess, showError } = useNotification();
  const [tabValue, setTabValue] = useState(0);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<bigint | null>(null);
  const [checklists, setChecklists] = useState<EngagementChecklist[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    loadEngagements();
  }, []);

  useEffect(() => {
    if (selectedEngagement) {
      loadChecklists(selectedEngagement);
    }
  }, [selectedEngagement]);

  const loadEngagements = async () => {
    try {
      const result = await call<Engagement[]>('list_engagements');
      setEngagements(result);
    } catch (error: any) {
      console.error('Failed to load engagements:', error);
      showError(error.message || 'Failed to load engagements', 'Load Error');
    }
  };

  const loadChecklists = async (engagementId: bigint) => {
    try {
      const result = await call<EngagementChecklist[]>('get_engagement_checklists', [engagementId]);
      setChecklists(result);
    } catch (error: any) {
      console.error('Failed to load checklists:', error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <StandardsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {t('nav.auditStandards')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('egyptianStandards.description')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Engagement Selector */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>{t('egyptianStandards.selectEngagement')}</InputLabel>
            <Select
              value={selectedEngagement?.toString() || ''}
              onChange={(e) => setSelectedEngagement(e.target.value ? BigInt(e.target.value) : null)}
              label={t('egyptianStandards.selectEngagement')}
            >
              <MenuItem value="">
                <em>{t('egyptianStandards.noEngagementSelected')}</em>
              </MenuItem>
              {engagements.map((eng) => (
                <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                  {eng.name} - {eng.client_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedEngagement && checklists.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('egyptianStandards.noChecklistMessage')}
            </Alert>
          )}
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="audit standards tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={t('egyptianStandards.title')} />
            <Tab label={t('egyptianStandards.standardsLibrary')} />
            <Tab label={t('egyptianStandards.documentationTemplates')} />
            {selectedEngagement && checklists.length > 0 && (
              <Tab label={t('egyptianStandards.compliance')} />
            )}
          </Tabs>

          {/* Tab 0: Egyptian Standards Overview */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t('egyptianStandards.overviewTitle')}
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                {t('egyptianStandards.overviewDescription')}
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {EGYPTIAN_STANDARDS.map((standard) => (
                  <Grid item xs={12} md={6} key={standard.code}>
                    <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Chip
                              label={standard.code}
                              color="primary"
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Chip
                              label={isArabic ? standard.categoryAr : standard.category}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 1, ml: 1 }}
                            />
                          </Box>
                          <CheckCircle color="success" sx={{ fontSize: 20 }} />
                        </Box>
                        
                        <Typography variant="h6" gutterBottom>
                          {isArabic ? standard.nameAr : standard.name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {isArabic ? standard.descriptionAr : standard.description}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                          {t('egyptianStandards.keyRequirements')}:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {(isArabic ? standard.keyRequirementsAr : standard.keyRequirements).slice(0, 3).map((req, idx) => (
                            <li key={idx}>
                              <Typography variant="body2" color="text.secondary">
                                {req}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 1: Standards Library */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  {t('egyptianStandards.standardsReferenceLibrary')}
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel size="small">{t('egyptianStandards.filterByStandard')}</InputLabel>
                  <Select
                    value={selectedStandard}
                    onChange={(e) => setSelectedStandard(e.target.value)}
                    label={t('egyptianStandards.filterByStandard')}
                    size="small"
                  >
                    <MenuItem value="all">{t('egyptianStandards.allStandards')}</MenuItem>
                    {EGYPTIAN_STANDARDS.map((std) => (
                      <MenuItem key={std.code} value={std.code}>
                        {std.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {EGYPTIAN_STANDARDS
                .filter((std) => selectedStandard === 'all' || std.code === selectedStandard)
                .map((standard) => (
                  <Paper key={standard.code} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip label={standard.code} color="primary" />
                      <Typography variant="h6">{isArabic ? standard.nameAr : standard.name}</Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {isArabic ? standard.descriptionAr : standard.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom color="primary">
                          {t('egyptianStandards.keyRequirements')}:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {(isArabic ? standard.keyRequirementsAr : standard.keyRequirements).map((req, idx) => (
                            <li key={idx}>
                              <Typography variant="body2">{req}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom color="secondary">
                          {t('egyptianStandards.documentationNeeds')}:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {(isArabic ? standard.documentationNeedsAr : standard.documentationNeeds).map((doc, idx) => (
                            <li key={idx}>
                              <Typography variant="body2">{doc}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
            </Box>
          </TabPanel>

          {/* Tab 2: Documentation Templates */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {t('egyptianStandards.documentationTemplatesTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {t('egyptianStandards.documentationTemplatesDescription')}
              </Typography>
              <DocumentationTemplates />
            </Box>
          </TabPanel>

          {/* Tab 3: Compliance Dashboard (only if engagement selected) */}
          {selectedEngagement && checklists.length > 0 && (
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 3 }}>
                <ComplianceDashboard
                  engagementId={selectedEngagement}
                  checklist={checklists[0]}
                />
              </Box>
            </TabPanel>
          )}
        </Paper>

        {/* Info Cards */}
        {!selectedEngagement && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'primary.main', color: 'white', height: '100%' }}>
                <CardContent>
                  <CheckCircle sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('egyptianStandards.tenCoreStandards')}
                  </Typography>
                  <Typography variant="body2">
                    {t('egyptianStandards.tenCoreStandardsDescription')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'secondary.main', color: 'white', height: '100%' }}>
                <CardContent>
                  <Warning sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('egyptianStandards.complianceTracking')}
                  </Typography>
                  <Typography variant="body2">
                    {t('egyptianStandards.complianceTrackingDescription')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'info.main', color: 'white', height: '100%' }}>
                <CardContent>
                  <Info sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('egyptianStandards.documentation')}
                  </Typography>
                  <Typography variant="body2">
                    {t('egyptianStandards.documentationDescription')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}

