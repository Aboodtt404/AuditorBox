import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
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
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useNotification } from '../components/NotificationSystem';
import ConfirmDialog from '../components/ConfirmDialog';

interface Engagement {
  id: bigint;
  name: string;
}

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

const DocumentRequests = () => {
  const { call } = useBackend();
  const { showSuccess, showError, showWarning } = useNotification();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<bigint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Financial Records',
    due_date: '',
    is_required: true,
  });
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestForReject, setSelectedRequestForReject] = useState<bigint | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [selectedRequestForApprove, setSelectedRequestForApprove] = useState<DocumentRequest | null>(null);

  useEffect(() => {
    loadEngagements();
  }, []);

  useEffect(() => {
    if (selectedEngagement) {
      loadRequests();
      
      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        loadRequests();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedEngagement]);

  const loadEngagements = async () => {
    try {
      const engs = await call<Engagement[]>('list_engagements', []);
      setEngagements(engs);
      if (engs.length > 0 && !selectedEngagement) {
        setSelectedEngagement(engs[0].id);
      }
    } catch (err) {
      console.error('Failed to load engagements:', err);
      showError('Failed to load engagements. Please refresh the page.');
    }
  };

  const loadRequests = async () => {
    if (!selectedEngagement) return;
    
    try {
      const reqs = await call<DocumentRequest[]>('get_document_requests_for_engagement', [selectedEngagement]);
      setRequests(reqs);
    } catch (err) {
      console.error('Failed to load document requests:', err);
      showError('Failed to load document requests. Please try again.');
    }
  };

  const handleCreateRequest = async () => {
    if (!selectedEngagement) {
      showWarning('Please select an engagement');
      return;
    }

    if (!formData.title.trim()) {
      showWarning('Please enter a title for the document request');
      return;
    }

    try {
      const input = {
        engagement_id: selectedEngagement,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        due_date: formData.due_date ? [BigInt(new Date(formData.due_date).getTime() * 1000000)] : [],
        is_required: formData.is_required,
        requested_from_principal: [], // General request to all clients with access
      };

      await call('create_document_request', [input]);
      
      showSuccess(`Document request "${formData.title}" created successfully`, 'Request Created');
      setDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Financial Records',
        due_date: '',
        is_required: true,
      });
      // Auto-refresh will update the UI
    } catch (err) {
      console.error('Failed to create document request:', err);
      showError(
        err instanceof Error ? err.message : 'Unknown error occurred',
        'Failed to Create Request'
      );
    }
  };

  const handleApproveClick = (request: DocumentRequest) => {
    setSelectedRequestForApprove(request);
    setApproveConfirmOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequestForApprove) return;

    try {
      await call('approve_document_request', [{
        request_id: selectedRequestForApprove.id,
        approved: true,
        rejection_reason: [],
      }]);
      showSuccess(`Document "${selectedRequestForApprove.title}" approved successfully`, 'Document Approved');
      setApproveConfirmOpen(false);
      setSelectedRequestForApprove(null);
      // Auto-refresh will update the UI
    } catch (err) {
      console.error('Failed to approve request:', err);
      showError(
        err instanceof Error ? err.message : 'Unknown error occurred',
        'Failed to Approve'
      );
    }
  };

  const handleRejectClick = (requestId: bigint) => {
    setSelectedRequestForReject(requestId);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequestForReject || !rejectionReason.trim()) {
      showWarning('Please provide a rejection reason');
      return;
    }

    try {
      await call('approve_document_request', [{
        request_id: selectedRequestForReject,
        approved: false,
        rejection_reason: [rejectionReason],
      }]);
      showSuccess('Document rejected and feedback sent to client', 'Document Rejected');
      setRejectDialogOpen(false);
      setSelectedRequestForReject(null);
      setRejectionReason('');
      // Auto-refresh will update the UI
    } catch (err) {
      console.error('Failed to reject request:', err);
      showError(
        err instanceof Error ? err.message : 'Unknown error occurred',
        'Failed to Reject'
      );
    }
  };

  const getStatusChip = (status: DocumentRequest['status']) => {
    if ('Pending' in status) {
      return <Chip label="Pending" color="warning" size="small" />;
    } else if ('Uploaded' in status) {
      return <Chip label="Uploaded" color="info" size="small" />;
    } else if ('Approved' in status) {
      return <Chip label="Approved" color="success" size="small" />;
    } else if ('Rejected' in status) {
      return <Chip label="Rejected" color="error" size="small" />;
    } else if ('Cancelled' in status) {
      return <Chip label="Cancelled" color="default" size="small" />;
    }
    return <Chip label="Unknown" size="small" />;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const pendingRequests = requests.filter(r => 'Pending' in r.status);
  const uploadedRequests = requests.filter(r => 'Uploaded' in r.status);
  const completedRequests = requests.filter(r => 'Approved' in r.status || 'Rejected' in r.status);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Document Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={!selectedEngagement}
        >
          Create Request
        </Button>
      </Box>

      {/* Engagement Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Engagement</InputLabel>
          <Select
            value={selectedEngagement?.toString() || ''}
            onChange={(e) => setSelectedEngagement(BigInt(e.target.value))}
            label="Select Engagement"
          >
            {engagements.map((eng) => (
              <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                {eng.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Pending Requests */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Pending Requests ({pendingRequests.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Waiting for client to upload
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Required</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" py={3}>
                      No pending requests
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pendingRequests.map((req) => (
                  <TableRow key={req.id.toString()}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {req.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{req.category}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {req.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {req.due_date ? formatDate(req.due_date) : '-'}
                    </TableCell>
                    <TableCell>
                      {req.is_required ? (
                        <Chip label="Required" color="error" size="small" />
                      ) : (
                        <Chip label="Optional" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{getStatusChip(req.status)}</TableCell>
                    <TableCell>{formatDate(req.created_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Uploaded Requests (Awaiting Review) */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Awaiting Review ({uploadedRequests.length})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Client has uploaded - needs your approval
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploadedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" py={3}>
                      No uploaded documents awaiting review
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                uploadedRequests.map((req) => (
                  <TableRow key={req.id.toString()}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {req.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{req.category}</TableCell>
                    <TableCell>
                      {req.fulfilled_at ? formatDate(req.fulfilled_at) : '-'}
                    </TableCell>
                    <TableCell>{getStatusChip(req.status)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApproveClick(req)}
                          title="Approve Document"
                        >
                          <ApproveIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRejectClick(req.id)}
                          title="Reject Document"
                        >
                          <RejectIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={!req.fulfilled_document_id}
                          title={req.fulfilled_document_id ? "View Document (ID: " + req.fulfilled_document_id.toString() + ")" : "No document uploaded"}
                        >
                          <DocumentIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Completed Requests */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Completed ({completedRequests.length})
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary" py={3}>
                      No completed requests
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                completedRequests.map((req) => (
                  <TableRow key={req.id.toString()}>
                    <TableCell>{req.title}</TableCell>
                    <TableCell>{req.category}</TableCell>
                    <TableCell>{getStatusChip(req.status)}</TableCell>
                    <TableCell>
                      {req.fulfilled_at ? formatDate(req.fulfilled_at) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Request Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Document Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
            Request a document from the client for the selected engagement
          </Typography>
          
          <TextField
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., Bank Statements - January 2024"
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            placeholder="Provide details about what you need..."
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              label="Category"
            >
              <MenuItem value="Financial Records">Financial Records</MenuItem>
              <MenuItem value="Bank Statements">Bank Statements</MenuItem>
              <MenuItem value="Invoices">Invoices</MenuItem>
              <MenuItem value="Receipts">Receipts</MenuItem>
              <MenuItem value="Contracts">Contracts</MenuItem>
              <MenuItem value="Tax Documents">Tax Documents</MenuItem>
              <MenuItem value="Payroll">Payroll</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Due Date (Optional)"
            type="date"
            fullWidth
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.is_required ? 'required' : 'optional'}
              onChange={(e) => setFormData({ ...formData, is_required: e.target.value === 'required' })}
              label="Priority"
            >
              <MenuItem value="required">
                <Box>
                  <Typography variant="body2" fontWeight="bold">Required</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Client must provide this document
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="optional">
                <Box>
                  <Typography variant="body2">Optional</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Nice to have, but not mandatory
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRequest} variant="contained">
            Create Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        open={approveConfirmOpen}
        onClose={() => {
          setApproveConfirmOpen(false);
          setSelectedRequestForApprove(null);
        }}
        onConfirm={handleApprove}
        title="Approve Document"
        message={`Are you sure you want to approve "${selectedRequestForApprove?.title}"?\n\nThis will mark the document as accepted and notify the client.`}
        confirmText="Approve"
        cancelText="Cancel"
        severity="success"
        confirmColor="success"
      />

      {/* Reject Document Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Reject Document
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
            Please provide a reason for rejecting this document. This will be visible to the client.
          </Typography>
          
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            margin="normal"
            required
            placeholder="e.g., Document is incomplete, unclear, or does not meet requirements..."
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setRejectDialogOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason.trim()}
            sx={{ minWidth: 100 }}
          >
            Reject Document
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentRequests;

