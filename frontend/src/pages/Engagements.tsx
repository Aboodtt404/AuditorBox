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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { Engagement, Organization, Entity } from '../types';

const Engagements = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link_type: 'Organization',
    link_id: '',
    start_date: '',
    end_date: '',
    status: 'Planning',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [engs, orgs, ents] = await Promise.all([
        call<Engagement[]>('list_engagements'),
        call<Organization[]>('list_organizations'),
        call<Entity[]>('list_entities'),
      ]);
      setEngagements(engs);
      setOrganizations(orgs);
      setEntities(ents);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSave = async () => {
    try {
      const link = { [formData.link_type]: BigInt(formData.link_id) };
      await call('create_engagement', [{
        name: formData.name,
        description: formData.description,
        link,
        start_date: BigInt(new Date(formData.start_date).getTime() * 1000000),
        end_date: BigInt(new Date(formData.end_date).getTime() * 1000000),
        status: formData.status,
      }]);
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save engagement:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('engagements.title')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          {t('engagements.create')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('engagements.name')}</TableCell>
              <TableCell>{t('engagements.status')}</TableCell>
              <TableCell>{t('engagements.startDate')}</TableCell>
              <TableCell>{t('engagements.endDate')}</TableCell>
              <TableCell align="right">{t('common.edit')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {engagements.map((eng) => (
              <TableRow key={eng.id.toString()}>
                <TableCell>{eng.name}</TableCell>
                <TableCell>{eng.status}</TableCell>
                <TableCell>
                  {new Date(Number(eng.start_date) / 1000000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(Number(eng.end_date) / 1000000).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary"><Edit /></IconButton>
                  <IconButton size="small" color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('engagements.create')}</DialogTitle>
        <DialogContent>
          <TextField
            label={t('engagements.name')}
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label={t('engagements.description')}
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('engagements.linkType')}</InputLabel>
            <Select
              value={formData.link_type}
              onChange={(e) => setFormData({ ...formData, link_type: e.target.value, link_id: '' })}
            >
              <MenuItem value="Organization">Organization</MenuItem>
              <MenuItem value="Entity">Entity</MenuItem>
            </Select>
          </FormControl>
          {formData.link_type === 'Organization' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Organization</InputLabel>
              <Select
                value={formData.link_id}
                onChange={(e) => setFormData({ ...formData, link_id: e.target.value })}
              >
                {organizations.map((org) => (
                  <MenuItem key={org.id.toString()} value={org.id.toString()}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {formData.link_type === 'Entity' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Entity</InputLabel>
              <Select
                value={formData.link_id}
                onChange={(e) => setFormData({ ...formData, link_id: e.target.value })}
              >
                {entities.map((ent) => (
                  <MenuItem key={ent.id.toString()} value={ent.id.toString()}>
                    {ent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label={t('engagements.startDate')}
            type="date"
            fullWidth
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('engagements.endDate')}
            type="date"
            fullWidth
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t('engagements.status')}
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

export default Engagements;

