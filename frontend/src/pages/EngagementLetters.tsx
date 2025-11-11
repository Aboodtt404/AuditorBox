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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Send,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useTranslation } from 'react-i18next';

interface Client {
  id: bigint;
  name: string;
  contact_email: string;
}

interface EngagementLetter {
  id: bigint;
  engagement_id: [] | [bigint];
  client_id: bigint;
  engagement_type: any;
  scope_of_services: string;
  management_responsibilities: string;
  auditor_responsibilities: string;
  limitations_of_engagement: string;
  fee_structure: string;
  estimated_completion_date: string;
  special_terms: string;
  status: any;
  sent_date: [] | [bigint];
  signed_date: [] | [bigint];
  signed_by_client_name: [] | [string];
  created_at: bigint;
  created_by: string;
  last_modified_at: bigint;
}

export default function EngagementLetters() {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [clients, setClients] = useState<Client[]>([]);
  const [letters, setLetters] = useState<EngagementLetter[]>([]);
  const [selectedClient, setSelectedClient] = useState<bigint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<EngagementLetter | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    engagement_type: 'Audit',
    scope_of_services: '',
    fee_structure: '',
    estimated_completion_date: '',
    special_terms: '',
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

  const loadLetters = async (clientId: bigint) => {
    try {
      const result = await call<{ Ok: EngagementLetter[] } | { Err: string }>(
        'list_engagement_letters_by_client',
        [clientId]
      );
      if ('Ok' in result) {
        setLetters(result.Ok);
      } else if ('Err' in result) {
        console.error('Error from backend:', result.Err);
      } else if (Array.isArray(result)) {
        setLetters(result as EngagementLetter[]);
      }
    } catch (error) {
      console.error('Failed to load letters:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const clientId = BigInt(formData.client_id);
      const request = {
        client_id: clientId,
        engagement_type: { [formData.engagement_type]: null },
        scope_of_services: formData.scope_of_services,
        fee_structure: formData.fee_structure,
        estimated_completion_date: formData.estimated_completion_date,
        special_terms: [formData.special_terms],
      };

      await call('create_engagement_letter', [request]);
      setDialogOpen(false);
      setSelectedClient(clientId);
      await loadLetters(clientId);
      alert('Engagement letter created successfully!');
      resetForm();
    } catch (error) {
      console.error('Failed to create engagement letter:', error);
      alert('Failed to create engagement letter. Please try again.');
    }
  };

  const handleSend = async (letterId: bigint) => {
    try {
      await call('send_engagement_letter', [letterId]);
      if (selectedClient) {
        loadLetters(selectedClient);
      }
      alert('Engagement letter sent to client!');
    } catch (error) {
      console.error('Failed to send letter:', error);
      alert('Failed to send letter. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      engagement_type: 'Audit',
      scope_of_services: '',
      fee_structure: '',
      estimated_completion_date: '',
      special_terms: '',
    });
  };

  const getStatusColor = (status: any) => {
    const statusKey = Object.keys(status)[0];
    switch (statusKey) {
      case 'Draft':
        return 'default';
      case 'SentToClient':
        return 'info';
      case 'Signed':
        return 'success';
      case 'Declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: any) => {
    const statusKey = Object.keys(status)[0];
    return statusKey.replace(/([A-Z])/g, ' $1').trim();
  };

  const getEngagementType = (type: any) => {
    if (typeof type === 'object') {
      const keys = Object.keys(type);
      if (keys.length > 0) {
        return keys[0];
      }
    }
    return String(type);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('engagementLetters.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Create Letter
          </Button>
        </Box>

        <Paper sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Client</InputLabel>
            <Select
              value={selectedClient?.toString() || ''}
              onChange={(e) => {
                const clientId = BigInt(e.target.value);
                setSelectedClient(clientId);
                loadLetters(clientId);
              }}
              label="Select Client"
            >
              {clients.map((client) => (
                <MenuItem key={client.id.toString()} value={client.id.toString()}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {letters.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Engagement Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fee Structure</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {letters.map((letter) => (
                    <TableRow key={letter.id.toString()}>
                      <TableCell>
                        {new Date(Number(letter.created_at) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getEngagementType(letter.engagement_type)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(letter.status)}
                          color={getStatusColor(letter.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{letter.fee_structure}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedLetter(letter);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        {Object.keys(letter.status)[0] === 'Draft' && (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSend(letter.id)}
                          >
                            <Send />
                          </IconButton>
                        )}
                        {letter.signed_date.length > 0 && (
                          <CheckCircle color="success" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : selectedClient ? (
            <Typography color="textSecondary">No engagement letters found for this client.</Typography>
          ) : (
            <Typography color="textSecondary">Select a client to view engagement letters.</Typography>
          )}
        </Paper>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Engagement Letter</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                label="Client"
              >
                {clients.map((client) => (
                  <MenuItem key={client.id.toString()} value={client.id.toString()}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Engagement Type</InputLabel>
              <Select
                value={formData.engagement_type}
                onChange={(e) => setFormData({ ...formData, engagement_type: e.target.value })}
                label="Engagement Type"
              >
                <MenuItem value="Audit">Audit</MenuItem>
                <MenuItem value="Review">Review</MenuItem>
                <MenuItem value="Compilation">Compilation</MenuItem>
                <MenuItem value="TaxPreparation">Tax Preparation</MenuItem>
                <MenuItem value="Consulting">Consulting</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Scope of Services"
              required
              value={formData.scope_of_services}
              onChange={(e) => setFormData({ ...formData, scope_of_services: e.target.value })}
              helperText="Describe the services to be performed"
            />

            <TextField
              fullWidth
              label="Fee Structure"
              required
              value={formData.fee_structure}
              onChange={(e) => setFormData({ ...formData, fee_structure: e.target.value })}
              placeholder="e.g., Fixed fee of $10,000 or Hourly rate of $150/hour"
            />

            <TextField
              fullWidth
              label="Estimated Completion Date"
              required
              value={formData.estimated_completion_date}
              onChange={(e) => setFormData({ ...formData, estimated_completion_date: e.target.value })}
              placeholder="e.g., March 31, 2025"
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Special Terms (Optional)"
              value={formData.special_terms}
              onChange={(e) => setFormData({ ...formData, special_terms: e.target.value })}
              helperText="Any special conditions or terms"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.client_id ||
              !formData.scope_of_services ||
              !formData.fee_structure ||
              !formData.estimated_completion_date
            }
          >
            Create Letter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Engagement Letter Preview</DialogTitle>
        <DialogContent>
          {selectedLetter && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography variant="h6">{getEngagementType(selectedLetter.engagement_type)} Engagement</Typography>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Scope of Services:
                </Typography>
                <Typography variant="body2">{selectedLetter.scope_of_services}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Management Responsibilities:
                </Typography>
                <Typography variant="body2">{selectedLetter.management_responsibilities}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Auditor Responsibilities:
                </Typography>
                <Typography variant="body2">{selectedLetter.auditor_responsibilities}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Limitations of Engagement:
                </Typography>
                <Typography variant="body2">{selectedLetter.limitations_of_engagement}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Fee Structure:
                </Typography>
                <Typography variant="body2">{selectedLetter.fee_structure}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Estimated Completion:
                </Typography>
                <Typography variant="body2">{selectedLetter.estimated_completion_date}</Typography>
              </Box>

              {selectedLetter.special_terms && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Special Terms:
                  </Typography>
                  <Typography variant="body2">{selectedLetter.special_terms}</Typography>
                </Box>
              )}

              {selectedLetter.signed_by_client_name.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    ✓ Signed by: {selectedLetter.signed_by_client_name[0]}
                  </Typography>
                  <Typography variant="caption">
                    On {new Date(Number(selectedLetter.signed_date[0]) / 1000000).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

