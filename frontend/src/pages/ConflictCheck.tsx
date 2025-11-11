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
  Alert,
} from '@mui/material';
import { Add as AddIcon, Warning, CheckCircle, Block } from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useTranslation } from 'react-i18next';

interface Client {
  id: bigint;
  name: string;
  contact_email: string;
}

interface ConflictCheck {
  id: bigint;
  client_id: bigint;
  related_parties: string[];
  conflicts_found: boolean;
  conflict_details: string[];
  resolution_notes: string;
  cleared: boolean;
  cleared_by: [] | [string];
  cleared_at: [] | [bigint];
  created_at: bigint;
  created_by: string;
}

export default function ConflictCheck() {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [clients, setClients] = useState<Client[]>([]);
  const [conflicts, setConflicts] = useState<ConflictCheck[]>([]);
  const [selectedClient, setSelectedClient] = useState<bigint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    related_parties: '',
    potential_conflicts: '',
    resolution_notes: '',
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

  const loadConflicts = async (clientId: bigint) => {
    try {
      const result = await call<{ Ok: ConflictCheck[] } | { Err: string }>(
        'list_conflict_checks_by_client',
        [clientId]
      );
      if ('Ok' in result) {
        setConflicts(result.Ok);
      } else if ('Err' in result) {
        console.error('Error from backend:', result.Err);
      } else if (Array.isArray(result)) {
        setConflicts(result as ConflictCheck[]);
      }
    } catch (error) {
      console.error('Failed to load conflict checks:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const clientId = BigInt(formData.client_id);
      const request = {
        client_id: clientId,
        related_parties: formData.related_parties
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
        potential_conflicts: formData.potential_conflicts
          .split('\n')
          .map((c) => c.trim())
          .filter((c) => c.length > 0),
        resolution_notes: formData.resolution_notes,
      };

      await call('create_conflict_check', [request]);
      setDialogOpen(false);
      setSelectedClient(clientId);
      await loadConflicts(clientId);
      alert('Conflict check created successfully!');
      resetForm();
    } catch (error) {
      console.error('Failed to create conflict check:', error);
      alert('Failed to create conflict check. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      related_parties: '',
      potential_conflicts: '',
      resolution_notes: '',
    });
  };

  const getStatusIcon = (cleared: boolean) => {
    return cleared ? (
      <CheckCircle color="success" />
    ) : (
      <Warning color="warning" />
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('conflictCheck.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            {t('conflictCheck.newCheck')}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Perform conflict checks before accepting new clients or engagements. All conflicts must be
          cleared before proceeding with the engagement.
        </Alert>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('conflictCheck.title')}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Client</InputLabel>
            <Select
              value={selectedClient?.toString() || ''}
              onChange={(e) => {
                const clientId = BigInt(e.target.value);
                setSelectedClient(clientId);
                loadConflicts(clientId);
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

          {conflicts.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Related Parties</TableCell>
                    <TableCell>Potential Conflicts</TableCell>
                    <TableCell>Resolution</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conflicts.map((conflict) => (
                    <TableRow key={conflict.id.toString()}>
                      <TableCell>
                        {new Date(Number(conflict.created_at) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {conflict.related_parties.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {conflict.related_parties.map((party, idx) => (
                              <Chip key={idx} label={party} size="small" />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            None
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {conflict.conflict_details.length > 0 ? (
                          <Box>
                            {conflict.conflict_details.map((conf, idx) => (
                              <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                                • {conf}
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            None identified
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {conflict.resolution_notes || (
                          <Typography variant="body2" color="textSecondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(conflict.cleared)}
                          <Chip
                            label={conflict.cleared ? 'Cleared' : 'Pending Review'}
                            color={conflict.cleared ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                        {conflict.cleared && conflict.cleared_by.length > 0 && (
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                            Cleared on{' '}
                            {new Date(Number(conflict.cleared_at[0]) / 1000000).toLocaleDateString()}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : selectedClient ? (
            <Typography color="textSecondary">No conflict checks found for this client.</Typography>
          ) : (
            <Typography color="textSecondary">Select a client to view conflict checks.</Typography>
          )}
        </Paper>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Block />
            Conflict of Interest Check
          </Box>
        </DialogTitle>
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

            <TextField
              fullWidth
              label="Related Parties"
              value={formData.related_parties}
              onChange={(e) => setFormData({ ...formData, related_parties: e.target.value })}
              helperText="Enter related parties separated by commas (e.g., Company A, Person B, Entity C)"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Potential Conflicts"
              value={formData.potential_conflicts}
              onChange={(e) => setFormData({ ...formData, potential_conflicts: e.target.value })}
              helperText="List any potential conflicts of interest (one per line). Leave empty if none identified."
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Resolution Notes"
              value={formData.resolution_notes}
              onChange={(e) => setFormData({ ...formData, resolution_notes: e.target.value })}
              helperText="Describe how conflicts will be managed or why they are not material"
            />

            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Important:</strong> All potential conflicts must be documented and resolved
                before accepting the engagement. Partner review is required for material conflicts.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.client_id}>
            Submit Check
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

