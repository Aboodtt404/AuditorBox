import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { Client, Engagement } from '../types';

const Clients = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [clients, setClients] = useState<Client[]>([]);
  const [engagementCounts, setEngagementCounts] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await call<Client[]>('list_clients');
      setClients(data);
      
      // Load engagement counts for each client
      const counts: Record<string, number> = {};
      await Promise.all(
        data.map(async (client) => {
          try {
            const engagements = await call<Engagement[]>('list_engagements_by_client', [client.id]);
            counts[client.id.toString()] = engagements.length;
          } catch (error) {
            counts[client.id.toString()] = 0;
          }
        })
      );
      setEngagementCounts(counts);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const handleSave = async () => {
    try {
      await call('create_client', [formData]);
      setDialogOpen(false);
      loadClients();
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const handleDelete = async (id: bigint, name: string) => {
    if (!window.confirm(`Are you sure you want to delete client "${name}"?`)) {
      return;
    }
    try {
      await call('delete_client', [id]);
      loadClients();
    } catch (error) {
      console.error('Failed to delete client:', error);
      alert('Failed to delete client. You may not have permission.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('clients.title')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          {t('clients.create')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('clients.name')}</TableCell>
              <TableCell>{t('clients.contactEmail')}</TableCell>
              <TableCell>{t('clients.contactPhone')}</TableCell>
              <TableCell>Engagements</TableCell>
              <TableCell align="right">{t('common.edit')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id.toString()}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.contact_email}</TableCell>
                <TableCell>{client.contact_phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={engagementCounts[client.id.toString()] || 0}
                    color={engagementCounts[client.id.toString()] > 0 ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary"><Edit /></IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(client.id, client.name)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('clients.create')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('clients.name')}
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label={t('clients.contactEmail')}
            fullWidth
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            margin="normal"
          />
          <TextField
            label={t('clients.contactPhone')}
            fullWidth
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            margin="normal"
          />
          <TextField
            label={t('clients.address')}
            fullWidth
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Clients;

