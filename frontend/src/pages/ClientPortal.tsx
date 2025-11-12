import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface DocumentRequest {
  id: bigint;
  engagement_id: bigint;
  title: string;
  description: string;
  requested_by: any;
  requested_from_principal: any;
  due_date: bigint | null;
  status: { Pending: null } | { Uploaded: null } | { Approved: null } | { Rejected: null } | { Cancelled: null };
  created_at: bigint;
  fulfilled_at: bigint | null;
  fulfilled_document_id: bigint | null;
  category: string;
  is_required: boolean;
}

const ClientPortal = () => {
  const { call } = useBackend();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [engagements, setEngagements] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load requests when authenticated and user is loaded
    if (isAuthenticated && user) {
      loadData(true); // Show loading on first load
      
      // Auto-refresh every 5 seconds (silent updates)
      const interval = setInterval(() => {
        loadData(false); // No loading spinner on refresh
      }, 5000);
      
      return () => clearInterval(interval);
    } else if (isAuthenticated === false && user === null) {
      // Authentication failed or user not loaded after initialization
      setLoading(false);
      
      // Redirect to landing page after 3 seconds
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate]);

  const loadData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const [reqs, invites, engs] = await Promise.all([
        call<DocumentRequest[]>('get_my_document_requests', []),
        call<any[]>('get_my_invitations', []).catch(() => []),
        call<Array<[bigint, string, string]>>('get_my_engagements', []).catch(() => []),
      ]);
      setRequests(reqs);
      setInvitations(invites);
      setEngagements(engs);
      setError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: bigint) => {
    try {
      await call('accept_invitation', [{ invitation_id: invitationId }]);
      console.log('Invitation accepted successfully');
      // Auto-refresh will update the UI
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      setError('Failed to accept invitation: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleRejectInvitation = async (invitationId: bigint) => {
    // Silent reject - auto-refresh will show the change
    try {
      await call('reject_invitation', [{
        invitation_id: invitationId,
        reason: [],
      }]);
      console.log('Invitation rejected');
      // Auto-refresh will update the UI
    } catch (err) {
      console.error('Failed to reject invitation:', err);
      setError('Failed to reject invitation: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleUploadClick = (request: DocumentRequest) => {
    setSelectedRequest(request);
    setUploadDialogOpen(true);
    setUploadFile(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedRequest) return;

    try {
      setUploading(true);
      setError(null);

      // Convert file to bytes
      const arrayBuffer = await uploadFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const input = {
        request_id: selectedRequest.id,
        document_name: uploadFile.name,
        file_type: uploadFile.type || 'application/octet-stream',
        file_data: Array.from(bytes),
        category: selectedRequest.category,
      };

      await call('fulfill_document_request', [input]);
      
      setUploadDialogOpen(false);
      setUploadFile(null);
      setSelectedRequest(null);
      await loadData();
    } catch (err) {
      console.error('Failed to upload document:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStatusChip = (status: DocumentRequest['status']) => {
    if ('Pending' in status) {
      return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
    } else if ('Uploaded' in status) {
      return <Chip icon={<UploadIcon />} label="Uploaded" color="info" size="small" />;
    } else if ('Approved' in status) {
      return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
    } else if ('Rejected' in status) {
      return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
    } else if ('Cancelled' in status) {
      return <Chip label="Cancelled" color="default" size="small" />;
    }
    return <Chip label="Unknown" size="small" />;
  };

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1000000);
    return format(date, 'MMM dd, yyyy');
  };

  const isPending = (request: DocumentRequest): boolean => {
    return 'Pending' in request.status;
  };

  const pendingRequests = requests.filter(r => isPending(r));
  const completedRequests = requests.filter(r => !isPending(r));

  // Show loading while authentication is initializing or data is loading
  if (loading && (!isAuthenticated || !user)) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography variant="h6" color="text.secondary">Loading your portal...</Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we set up your account
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  // If not authenticated after loading, show message and redirect
  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={3} alignItems="center" sx={{ maxWidth: 500 }}>
            <Alert severity="warning" sx={{ width: '100%' }}>
              You are not authenticated. Please log in to access the client portal.
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Redirecting to login page in 3 seconds...
              </Typography>
            </Alert>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/')}
            >
              Go to Login Now
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Client Portal
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to your client portal. Here you can view document requests from your auditors
        and upload the required documents securely.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Paper sx={{ mb: 4, borderLeft: 4, borderColor: 'primary.main' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.50' }}>
            <Typography variant="h6" color="primary">
              🎉 You have {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''}!
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            {invitations.map((invitation) => (
              <Card key={invitation.id.toString()} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        {invitation.engagement_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>From:</strong> {invitation.invited_by_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Access Level:</strong> {
                          'ViewOnly' in invitation.access_level ? 'View Only' :
                          'UploadDocuments' in invitation.access_level ? 'Upload Documents' :
                          'Full' in invitation.access_level ? 'Full Access' : 'Unknown'
                        }
                      </Typography>
                      {invitation.message && invitation.message[0] && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="body2" fontStyle="italic">
                            "{invitation.message[0]}"
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => handleAcceptInvitation(invitation.id)}
                        >
                          Accept Invitation
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => handleRejectInvitation(invitation.id)}
                        >
                          Decline
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      )}

      {/* My Engagements */}
      {engagements.length > 0 && (
        <Paper sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">
              My Engagements ({engagements.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Engagements you have been granted access to
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {engagements.map(([id, name, status]) => (
                <Grid item xs={12} sm={6} md={4} key={id.toString()}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {name}
                      </Typography>
                      <Chip 
                        label={status} 
                        size="small"
                        color={status === 'Active' ? 'success' : 'default'}
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Engagement ID: {id.toString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Pending Requests */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Pending Document Requests ({pendingRequests.length})
          </Typography>
        </Box>
        {pendingRequests.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No pending document requests. All caught up!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ p: 2 }}>
            {pendingRequests.map((request) => (
              <Grid item xs={12} md={6} key={request.id.toString()}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" gutterBottom>
                        {request.title}
                        {request.is_required && (
                          <Chip label="Required" color="error" size="small" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                      {getStatusChip(request.status)}
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      {request.description}
                    </Typography>

                    <Stack spacing={1} mb={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Category:</Typography>
                        <Typography variant="body2">{request.category}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Requested:</Typography>
                        <Typography variant="body2">{formatDate(request.created_at)}</Typography>
                      </Box>
                      {request.due_date !== null && request.due_date !== undefined && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Due Date:</Typography>
                          <Typography variant="body2" color="error">
                            {formatDate(request.due_date)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      onClick={() => handleUploadClick(request)}
                      fullWidth
                    >
                      Upload Document
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Completed Requests */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Completed Requests ({completedRequests.length})
          </Typography>
        </Box>
        {completedRequests.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No completed requests yet.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Requested</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedRequests.map((request) => (
                  <TableRow key={request.id.toString()} hover>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.category}</TableCell>
                    <TableCell>{formatDate(request.created_at)}</TableCell>
                    <TableCell>
                      {request.fulfilled_at ? formatDate(request.fulfilled_at) : '-'}
                    </TableCell>
                    <TableCell>{getStatusChip(request.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => !uploading && setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedRequest.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedRequest.description}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <input
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    disabled={uploading}
                    fullWidth
                  >
                    Choose File
                  </Button>
                </label>
                {uploadFile && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(2)} KB)
                  </Alert>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!uploadFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientPortal;

