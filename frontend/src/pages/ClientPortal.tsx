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
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
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
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await call<DocumentRequest[]>('get_my_document_requests', []);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load document requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load requests');
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
      await loadRequests();
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

