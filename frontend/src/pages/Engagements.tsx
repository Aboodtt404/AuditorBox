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
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, PersonAdd } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/NotificationSystem';
import { Engagement, Organization, Entity } from '../types';
import { formatDate } from '../utils/dateFormatter';

const Engagements = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const { isAuthenticated, user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    access_level: 'UploadDocuments',
    message: '',
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
      const [engs, orgs, ents, clnts] = await Promise.all([
        call<Engagement[]>('list_engagements'),
        call<Organization[]>('list_organizations'),
        call<Entity[]>('list_entities'),
        call<any[]>('list_clients'),
      ]);
      setEngagements(engs);
      setOrganizations(orgs);
      setEntities(ents);
      setClients(clnts);
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

  const handleInviteClick = async (engagement: Engagement) => {
    setSelectedEngagement(engagement);
    setInviteFormData({
      email: '',
      access_level: 'UploadDocuments',
      message: '',
    });
    
    // Load existing invitations for this engagement
    try {
      const invites = await call<any[]>('get_invitations_for_engagement', [engagement.id]);
      setInvitations(invites);
      console.log('Loaded invitations for engagement:', invites);
    } catch (error) {
      console.error('Failed to load invitations:', error);
      setInvitations([]);
    }
    
    setInviteDialogOpen(true);
  };

  const handleSendInvitation = async () => {
    if (!selectedEngagement || !inviteFormData.email) {
      showWarning('Please enter a client email address');
      return;
    }

    // Basic email validation
    if (!inviteFormData.email.includes('@')) {
      showWarning('Please enter a valid email address');
      return;
    }

    try {
      await call('create_invitation', [{
        engagement_id: selectedEngagement.id,
        invited_email: inviteFormData.email,
        access_level: { [inviteFormData.access_level]: null },
        message: inviteFormData.message ? [inviteFormData.message] : [],
      }]);
      
      const accessLevelText = inviteFormData.access_level === 'ViewOnly' ? 'View Only' :
                              inviteFormData.access_level === 'UploadDocuments' ? 'Upload Documents' : 'Full Access';
      
      showSuccess(
        `Invitation sent to ${inviteFormData.email}\n` +
        `Engagement: ${selectedEngagement.name}\n` +
        `Access Level: ${accessLevelText}\n\n` +
        `The client will see this invitation when they log in.`,
        'Invitation Sent Successfully'
      );
      
      // Reload invitations list
      const invites = await call<any[]>('get_invitations_for_engagement', [selectedEngagement.id]);
      setInvitations(invites);
      
      // Clear form
      setInviteFormData({
        email: '',
        access_level: 'UploadDocuments',
        message: '',
      });
    } catch (error) {
      console.error('Failed to send invitation:', error);
      showError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        'Failed to Send Invitation'
      );
    }
  };

  const getAccessLevelName = (level: any): string => {
    if ('ViewOnly' in level) return 'View Only';
    if ('UploadDocuments' in level) return 'Upload Documents';
    if ('Full' in level) return 'Full Access';
    return 'Unknown';
  };

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
                      onClick={() => handleInviteClick(eng)}
                      title="Send Client Invitation"
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

      {/* Send Invitation Dialog */}
      <Dialog 
        open={inviteDialogOpen} 
        onClose={() => setInviteDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Send Engagement Invitation
          {selectedEngagement && (
            <Typography variant="subtitle2" color="text.secondary">
              Engagement: {selectedEngagement.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Send New Invitation</Typography>
            
            <TextField
              label="Client Email Address"
              fullWidth
              value={inviteFormData.email}
              onChange={(e) => setInviteFormData({ ...inviteFormData, email: e.target.value })}
              margin="normal"
              placeholder="client@company.com"
              helperText="The client will receive this invitation when they log in with this email"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Access Level</InputLabel>
              <Select
                value={inviteFormData.access_level}
                onChange={(e) => setInviteFormData({ ...inviteFormData, access_level: e.target.value })}
              >
                <MenuItem value="ViewOnly">View Only - Can view document requests</MenuItem>
                <MenuItem value="UploadDocuments">Upload Documents - Can view and upload (Recommended)</MenuItem>
                <MenuItem value="Full">Full Access - Complete access to engagement</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Personal Message (Optional)"
              fullWidth
              multiline
              rows={3}
              value={inviteFormData.message}
              onChange={(e) => setInviteFormData({ ...inviteFormData, message: e.target.value })}
              margin="normal"
              placeholder="Add a personal message to the invitation..."
            />
          </Box>

          {invitations.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Sent Invitations</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Access Level</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sent By</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invitations.map((invitation, index) => {
                      const getStatusColor = (status: any) => {
                        if ('Pending' in status) return 'warning';
                        if ('Accepted' in status) return 'success';
                        if ('Rejected' in status) return 'error';
                        if ('Expired' in status) return 'default';
                        return 'default';
                      };
                      
                      const getStatusText = (status: any) => {
                        if ('Pending' in status) return 'Pending';
                        if ('Accepted' in status) return 'Accepted';
                        if ('Rejected' in status) return 'Rejected';
                        if ('Expired' in status) return 'Expired';
                        if ('Cancelled' in status) return 'Cancelled';
                        return 'Unknown';
                      };
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {invitation.invited_email}
                            </Typography>
                          </TableCell>
                          <TableCell>{getAccessLevelName(invitation.access_level)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusText(invitation.status)} 
                              size="small"
                              color={getStatusColor(invitation.status) as any}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {invitation.invited_by_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(Number(invitation.invited_at) / 1000000).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Close</Button>
          <Button onClick={handleSendInvitation} variant="contained" color="primary">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Engagements;

