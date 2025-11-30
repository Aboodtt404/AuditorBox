import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle,
  Warning,
  Error,
  Info,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useNotification } from './NotificationSystem';
import { useTranslation } from 'react-i18next';
import { StandardCompliance, ChecklistItem, EngagementChecklist } from '../types';
import { EGYPTIAN_STANDARDS, getStandardByCode } from '../data/egyptianStandards';

interface ComplianceDashboardProps {
  engagementId: bigint;
  checklist?: EngagementChecklist;
}

export default function ComplianceDashboard({ engagementId, checklist }: ComplianceDashboardProps) {
  const { call } = useBackend();
  const { showSuccess, showError } = useNotification();
  const { t } = useTranslation();
  const [complianceReport, setComplianceReport] = useState<StandardCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStandard, setExpandedStandard] = useState<string | false>(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadComplianceReport();
  }, [engagementId]);

  const loadComplianceReport = async () => {
    setLoading(true);
    try {
      const result = await call<StandardCompliance[]>('get_compliance_report', [engagementId]);
      setComplianceReport(result);
    } catch (error: any) {
      console.error('Failed to load compliance report:', error);
      if (error.message && !error.message.includes('No checklist found')) {
        showError(error.message || 'Failed to load compliance report', 'Load Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: any): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const statusKey = Object.keys(status || {})[0] || 'NotStarted';
    switch (statusKey) {
      case 'Compliant':
        return 'success';
      case 'PartiallyCompliant':
        return 'warning';
      case 'InProgress':
        return 'info';
      case 'NonCompliant':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: any) => {
    const statusKey = Object.keys(status || {})[0] || 'NotStarted';
    switch (statusKey) {
      case 'Compliant':
        return <CheckCircle color="success" />;
      case 'PartiallyCompliant':
        return <Warning color="warning" />;
      case 'InProgress':
        return <Info color="info" />;
      case 'NonCompliant':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: any): string => {
    const statusKey = Object.keys(status || {})[0] || 'NotStarted';
    return t(`egyptianStandards.${statusKey.charAt(0).toLowerCase() + statusKey.slice(1)}`) || statusKey;
  };

  const calculateProgress = (compliance: StandardCompliance): number => {
    if (!checklist || !compliance.checklist_item_ids || compliance.checklist_item_ids.length === 0) {
      return 0;
    }

    const completed = checklist.items.filter((item) => {
      const statusKey = Object.keys(item.status || {})[0];
      return compliance.checklist_item_ids.includes(item.item_id) && statusKey === 'Completed';
    }).length;

    return (completed / compliance.checklist_item_ids.length) * 100;
  };

  const getStandardItems = (standardCode: string): ChecklistItem[] => {
    if (!checklist) return [];
    // This would need to be enhanced to get items from template
    return [];
  };

  const exportToCSV = () => {
    const headers = ['Standard Code', 'Standard Name', 'Status', 'Progress %', 'Last Reviewed', 'Notes'];
    const rows = complianceReport.map((c) => {
      const statusKey = Object.keys(c.compliance_status || {})[0] || 'NotStarted';
      const progress = calculateProgress(c);
      return [
        c.standard_code,
        c.standard_name,
        statusKey,
        progress.toFixed(1),
        c.last_reviewed
          ? new Date(Number(c.last_reviewed) / 1000000).toLocaleDateString()
          : '',
        c.notes || '',
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMenuAnchor(null);
  };

  const exportToPDF = () => {
    // For PDF export, we would use a library like jsPDF
    // For now, we'll create a text version
    let reportText = 'EGYPTIAN AUDIT STANDARDS COMPLIANCE REPORT\n';
    reportText += '==========================================\n\n';
    reportText += `Engagement ID: ${engagementId.toString()}\n`;
    reportText += `Report Date: ${new Date().toLocaleDateString()}\n\n`;

    complianceReport.forEach((c) => {
      const statusKey = Object.keys(c.compliance_status || {})[0] || 'NotStarted';
      const progress = calculateProgress(c);
      reportText += `${c.standard_code} - ${c.standard_name}\n`;
      reportText += `Status: ${statusKey}\n`;
      reportText += `Progress: ${progress.toFixed(1)}%\n`;
      if (c.last_reviewed) {
        reportText += `Last Reviewed: ${new Date(Number(c.last_reviewed) / 1000000).toLocaleDateString()}\n`;
      }
      if (c.notes) {
        reportText += `Notes: ${c.notes}\n`;
      }
      reportText += '\n';
    });

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMenuAnchor(null);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading compliance data...</Typography>
      </Paper>
    );
  }

  if (complianceReport.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          {t('egyptianStandards.complianceReport')} - No compliance data available. Please apply a template first.
        </Alert>
      </Paper>
    );
  }

  const overallCompliant = complianceReport.filter(
    (c) => Object.keys(c.compliance_status || {})[0] === 'Compliant'
  ).length;
  const overallInProgress = complianceReport.filter(
    (c) => Object.keys(c.compliance_status || {})[0] === 'InProgress'
  ).length;
  const overallNotStarted = complianceReport.filter(
    (c) => Object.keys(c.compliance_status || {})[0] === 'NotStarted'
  ).length;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {t('egyptianStandards.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('egyptianStandards.description')}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={(e) => setExportMenuAnchor(e.currentTarget)}
          >
            {t('egyptianStandards.exportReport')}
          </Button>
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={() => setExportMenuAnchor(null)}
          >
            <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
            <MenuItem onClick={exportToPDF}>Export as Text</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {overallCompliant}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('egyptianStandards.standardsCompliant')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {overallInProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('egyptianStandards.standardsInProgress')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary">
              {overallNotStarted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('egyptianStandards.standardsNotStarted')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Standards List */}
      <Box>
        {complianceReport.map((compliance) => {
          const standardMeta = getStandardByCode(compliance.standard_code);
          const progress = calculateProgress(compliance);
          const statusKey = Object.keys(compliance.compliance_status || {})[0] || 'NotStarted';

          return (
            <Accordion
              key={compliance.standard_code}
              expanded={expandedStandard === compliance.standard_code}
              onChange={(_, isExpanded) =>
                setExpandedStandard(isExpanded ? compliance.standard_code : false)
              }
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {getStatusIcon(compliance.compliance_status)}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {compliance.standard_code} - {compliance.standard_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Chip
                        label={getStatusLabel(compliance.compliance_status)}
                        color={getStatusColor(compliance.compliance_status)}
                        size="small"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, maxWidth: 200 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 45 }}>
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {standardMeta && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('egyptianStandards.keyRequirements')}:
                    </Typography>
                    <ul>
                      {standardMeta.keyRequirements.map((req, idx) => (
                        <li key={idx}>
                          <Typography variant="body2">{req}</Typography>
                        </li>
                      ))}
                    </ul>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      {t('egyptianStandards.documentationNeeds')}:
                    </Typography>
                    <ul>
                      {standardMeta.documentationNeeds.map((doc, idx) => (
                        <li key={idx}>
                          <Typography variant="body2">{doc}</Typography>
                        </li>
                      ))}
                    </ul>
                    {compliance.notes && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Notes:
                        </Typography>
                        <Typography variant="body2">{compliance.notes}</Typography>
                      </Box>
                    )}
                    {compliance.last_reviewed && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        {t('egyptianStandards.lastReviewed')}:{' '}
                        {new Date(Number(compliance.last_reviewed) / 1000000).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}

