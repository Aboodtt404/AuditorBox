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
  CircularProgress,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { useAuth } from '../hooks/useAuth';
import { Engagement, Organization, Entity } from '../types';
import { formatDate } from '../utils/dateFormatter';

const Engagements = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const { isAuthenticated, user } = useAuth();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [grantAccessDialogOpen, setGrantAccessDialogOpen] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [clientAccess, setClientAccess] = useState<any[]>([]);
  const [accessFormData, setAccessFormData] = useState({
    client_principal: '',
    access_level: 'UploadDocuments',
  });
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
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [engs, orgs, ents, clnts, usrs] = await Promise.all([
        call<Engagement[]>('list_engagements'),
        call<Organization[]>('list_organizations'),
        call<Entity[]>('list_entities'),
        call<any[]>('list_clients'),
        call<any[]>('list_users').catch(() => []), // Only admin can list users
      ]);
      setEngagements(engs);
      setOrganizations(orgs);
      setEntities(ents);
      setClients(clnts);
      setUsers(usrs);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLinkedEntityName = (engagement: Engagement): { type: string; name: string } => {
    const link = engagement.link as any;
    if (link.Organization !== undefined) {
      const org = organizations.find(o => o.id === link.Organization);
      return { type: 'Organization', name: org?.name || 'Unknown' };
    } else if (link.Entity !== undefined) {
      const ent = entities.find(e => e.id === link.Entity);
      return { type: 'Entity', name: ent?.name || 'Unknown' };
    } else if (link.Client !== undefined) {
      const client = clients.find(c => c.id === link.Client);
      return { type: 'Client', name: client?.name || 'Unknown' };
    }
    return { type: 'Unknown', name: 'Unknown' };
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

  const handleGrantAccessClick = async (engagement: Engagement) => {
    setSelectedEngagement(engagement);
    setAccessFormData({
      client_principal: '',
      access_level: 'UploadDocuments',
    });
    
    // Load existing client access for this engagement
    try {
      const access = await call<any[]>('get_client_access_for_engagement', [engagement.id]);
      setClientAccess(access);
    } catch (error) {
      console.error('Failed to load client access:', error);
      setClientAccess([]);
    }
    
    setGrantAccessDialogOpen(true);
  };

  const handleGrantAccess = async () => {
    if (!selectedEngagement || !accessFormData.client_principal) {
      alert('Please select a client user');
      return;
    }

    try {
      await call('grant_client_access', [{
        client_principal: accessFormData.client_principal,
        engagement_id: selectedEngagement.id,
        access_level: { [accessFormData.access_level]: null },
      }]);
      
      alert('Client access granted successfully!');
      setGrantAccessDialogOpen(false);
      
      // Reload access list
      const access = await call<any[]>('get_client_access_for_engagement', [selectedEngagement.id]);
      setClientAccess(access);
    } catch (error) {
      console.error('Failed to grant access:', error);
      alert('Failed to grant access: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getRoleName = (role: any): string => {
    if (role.Admin) return 'Admin';
    if (role.Partner) return 'Partner';
    if (role.Manager) return 'Manager';
    if (role.Senior) return 'Senior';
    if (role.Staff) return 'Staff';
    if (role.ClientUser) return 'Client User';
    return 'Unknown';
  };

  const getAccessLevelName = (level: any): string => {
    if (level.ViewOnly) return 'View Only';
    if (level.UploadDocuments) return 'Upload Documents';
    if (level.Full) return 'Full Access';
    return 'Unknown';
  };

  // Filter users to show only ClientUser role
  const clientUsers = users.filter(u => u.role.ClientUser);

  // Show loading while data is being fetched
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography variant="h6" color="text.secondary">Loading engagements...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

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
              <TableCell>Linked To</TableCell>
              <TableCell>{t('engagements.status')}</TableCell>
              <TableCell>{t('engagements.startDate')}</TableCell>
              <TableCell>{t('engagements.endDate')}</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {engagements.map((eng) => {
              const linkedEntity = getLinkedEntityName(eng);
              return (
                <TableRow key={eng.id.toString()}>
                  <TableCell>{eng.name}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {linkedEntity.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({linkedEntity.type})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{eng.status}</TableCell>
                  <TableCell>
                    {formatDate(eng.start_date)}
                  </TableCell>
                  <TableCell>
                    {formatDate(eng.end_date)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => handleGrantAccessClick(eng)}
                      title="Grant Client Access"
                    >
                      <PersonAdd />
                    </IconButton>
                    <IconButton size="small" color="primary"><Edit /></IconButton>
                    <IconButton size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
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
              <MenuItem value="Client">Client</MenuItem>
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
          {formData.link_type === 'Client' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.link_id}
                onChange={(e) => setFormData({ ...formData, link_id: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id.toString()} value={client.id.toString()}>
                    {client.name}
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

      {/* Grant Client Access Dialog */}
      <Dialog 
        open={grantAccessDialogOpen} 
        onClose={() => setGrantAccessDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Grant Client Access
          {selectedEngagement && (
            <Typography variant="subtitle2" color="text.secondary">
              Engagement: {selectedEngagement.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Grant New Access</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Client User</InputLabel>
              <Select
                value={accessFormData.client_principal}
                onChange={(e) => setAccessFormData({ ...accessFormData, client_principal: e.target.value })}
              >
                {clientUsers.map((user) => (
                  <MenuItem key={user.principal.toText()} value={user.principal.toText()}>
                    {user.name} ({user.email}) - {getRoleName(user.role)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Access Level</InputLabel>
              <Select
                value={accessFormData.access_level}
                onChange={(e) => setAccessFormData({ ...accessFormData, access_level: e.target.value })}
              >
                <MenuItem value="ViewOnly">View Only</MenuItem>
                <MenuItem value="UploadDocuments">Upload Documents</MenuItem>
                <MenuItem value="Full">Full Access</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {clientAccess.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Current Access Grants</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Principal ID</TableCell>
                      <TableCell>Access Level</TableCell>
                      <TableCell>Granted By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientAccess.map((access, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {access.principal.toText().substring(0, 20)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{getAccessLevelName(access.access_level)}</TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {access.granted_by.toText().substring(0, 20)}...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGrantAccessDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleGrantAccess} variant="contained" color="primary">
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Engagements;

