import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import { Add as AddIcon, CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useTranslation } from 'react-i18next';

interface Client {
  id: bigint;
  name: string;
  contact_email: string;
}

interface ClientAcceptance {
  id: bigint;
  client_id: bigint;
  questionnaire: {
    management_integrity_risk: string;
    financial_stability_risk: string;
    industry_risk: string;
    regulatory_complexity_risk: string;
    fee_collection_risk: string;
    independence_threats: boolean;
    conflicts_of_interest: boolean;
    resources_available: boolean;
    technical_expertise_available: boolean;
    notes: string;
  };
  overall_risk: string;
  decision: string;
  decision_rationale: string;
  reviewed_by: string;
  reviewed_at: bigint;
  partner_approved_by: [] | [string];
  partner_approved_at: [] | [bigint];
  created_at: bigint;
  created_by: string;
}

export default function ClientAcceptance() {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [clients, setClients] = useState<Client[]>([]);
  const [acceptances, setAcceptances] = useState<ClientAcceptance[]>([]);
  const [selectedClient, setSelectedClient] = useState<bigint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    management_integrity_risk: 'Low',
    financial_stability_risk: 'Low',
    industry_risk: 'Low',
    regulatory_complexity_risk: 'Low',
    fee_collection_risk: 'Low',
    independence_threats: false,
    conflicts_of_interest: false,
    resources_available: true,
    technical_expertise_available: true,
    notes: '',
    decision_rationale: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientList = await call<Client[]>('list_clients');
      setClients(clientList);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const loadAcceptances = async (clientId: bigint) => {
    try {
      const result = await call<{ Ok: ClientAcceptance[] } | { Err: string }>(
        'list_client_acceptances_by_client',
        [clientId]
      );
      if ('Ok' in result) {
        setAcceptances(result.Ok);
      } else if ('Err' in result) {
        console.error('Error from backend:', result.Err);
      } else if (Array.isArray(result)) {
        setAcceptances(result as ClientAcceptance[]);
      }
    } catch (error) {
      console.error('Failed to load acceptances:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const clientId = BigInt(formData.client_id);
      const request = {
        client_id: clientId,
        questionnaire: {
          management_integrity_risk: { [formData.management_integrity_risk]: null },
          financial_stability_risk: { [formData.financial_stability_risk]: null },
          industry_risk: { [formData.industry_risk]: null },
          regulatory_complexity_risk: { [formData.regulatory_complexity_risk]: null },
          fee_collection_risk: { [formData.fee_collection_risk]: null },
          independence_threats: formData.independence_threats,
          conflicts_of_interest: formData.conflicts_of_interest,
          resources_available: formData.resources_available,
          technical_expertise_available: formData.technical_expertise_available,
          notes: formData.notes,
        },
        decision_rationale: formData.decision_rationale,
      };

      await call('create_client_acceptance', [request]);
      setDialogOpen(false);
      setSelectedClient(clientId);
      await loadAcceptances(clientId);
      alert('Client acceptance created successfully!');
      resetForm();
    } catch (error) {
      console.error('Failed to create client acceptance:', error);
      alert('Failed to create client acceptance. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      management_integrity_risk: 'Low',
      financial_stability_risk: 'Low',
      industry_risk: 'Low',
      regulatory_complexity_risk: 'Low',
      fee_collection_risk: 'Low',
      independence_threats: false,
      conflicts_of_interest: false,
      resources_available: true,
      technical_expertise_available: true,
      notes: '',
      decision_rationale: '',
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      case 'Unacceptable':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDecisionIcon = (decision: string) => {
    const decisionKey = Object.keys(decision)[0];
    switch (decisionKey) {
      case 'Accepted':
        return <CheckCircle color="success" />;
      case 'Rejected':
        return <Cancel color="error" />;
      case 'RequiresPartnerReview':
        return <HourglassEmpty color="warning" />;
      case 'Pending':
        return <HourglassEmpty color="info" />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('clientAcceptance.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            New Assessment
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          {t('clientAcceptance.info')}
        </Alert>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('clientAcceptance.assessment')}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('clientAcceptance.selectClient')}</InputLabel>
            <Select
              value={selectedClient?.toString() || ''}
              onChange={(event) => {
                const clientId = BigInt(event.target.value);
                setSelectedClient(clientId);
                loadAcceptances(clientId);
              }}
              label={t('clientAcceptance.selectClient')}
            >
              {clients.map((client) => (
                <MenuItem key={client.id.toString()} value={client.id.toString()}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {acceptances.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('clientAcceptance.table.date')}</TableCell>
                    <TableCell>{t('clientAcceptance.table.overallRisk')}</TableCell>
                    <TableCell>{t('clientAcceptance.table.decision')}</TableCell>
                    <TableCell>{t('clientAcceptance.table.reviewer')}</TableCell>
                    <TableCell>{t('clientAcceptance.table.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acceptances.map((acceptance) => (
                    <TableRow key={acceptance.id.toString()}>
                      <TableCell>
                        {new Date(Number(acceptance.created_at) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={Object.keys(acceptance.overall_risk)[0]}
                          color={getRiskColor(Object.keys(acceptance.overall_risk)[0]) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getDecisionIcon(acceptance.decision)}
                          {Object.keys(acceptance.decision)[0]}
                        </Box>
                      </TableCell>
                      <TableCell>{acceptance.decision_rationale}</TableCell>
                      <TableCell>
                        {acceptance.partner_approved_by.length > 0 ? (
                          <Chip
                            label={t('clientAcceptance.partnerApproved')}
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label={t('clientAcceptance.pending')}
                            color="warning"
                            size="small"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : selectedClient ? (
            <Typography color="textSecondary">{t('clientAcceptance.noRecords')}</Typography>
          ) : (
            <Typography color="textSecondary">{t('clientAcceptance.selectPrompt')}</Typography>
          )}
        </Paper>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('clientAcceptance.dialogTitle')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{t('clientAcceptance.client')}</InputLabel>
              <Select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                label={t('clientAcceptance.client')}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id.toString()} value={client.id.toString()}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>
              {t('clientAcceptance.questionnaire')}
            </Typography>

            <FormControl fullWidth>
              <InputLabel>{t('clientAcceptance.managementIntegrity')}</InputLabel>
              <Select
                value={formData.management_integrity_risk}
                onChange={(e) =>
                  setFormData({ ...formData, management_integrity_risk: e.target.value })
                }
                label="Management Integrity Risk"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Unacceptable">Unacceptable</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('clientAcceptance.financialStability')}</InputLabel>
              <Select
                value={formData.financial_stability_risk}
                onChange={(e) =>
                  setFormData({ ...formData, financial_stability_risk: e.target.value })
                }
                label="Financial Stability Risk"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Unacceptable">Unacceptable</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('clientAcceptance.industryRisk')}</InputLabel>
              <Select
                value={formData.industry_risk}
                onChange={(e) => setFormData({ ...formData, industry_risk: e.target.value })}
                label="Industry Risk"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Unacceptable">Unacceptable</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('clientAcceptance.regulatoryComplexity')}</InputLabel>
              <Select
                value={formData.regulatory_complexity_risk}
                onChange={(e) =>
                  setFormData({ ...formData, regulatory_complexity_risk: e.target.value })
                }
                label="Regulatory Complexity Risk"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Unacceptable">Unacceptable</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{t('clientAcceptance.feeCollection')}</InputLabel>
              <Select
                value={formData.fee_collection_risk}
                onChange={(e) => setFormData({ ...formData, fee_collection_risk: e.target.value })}
                label="Fee Collection Risk"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Unacceptable">Unacceptable</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>
              {t('clientAcceptance.independenceResources')}
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.independence_threats}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      independence_threats: e.target.checked,
                    })
                  }
                />
              }
              label={t('clientAcceptance.independenceThreats')}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.conflicts_of_interest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      conflicts_of_interest: e.target.checked,
                    })
                  }
                />
              }
              label={t('clientAcceptance.conflictsOfInterest')}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.resources_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resources_available: e.target.checked,
                    })
                  }
                />
              }
              label={t('clientAcceptance.resourcesAvailable')}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.technical_expertise_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      technical_expertise_available: e.target.checked,
                    })
                  }
                />
              }
              label={t('clientAcceptance.technicalExpertise')}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('clientAcceptance.notes')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('clientAcceptance.decisionRationale')}
              required
              value={formData.decision_rationale}
              onChange={(e) => setFormData({ ...formData, decision_rationale: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.client_id}>
            Submit Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

