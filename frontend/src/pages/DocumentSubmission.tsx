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
} from '@mui/material';
import { CloudUpload, Download, Delete } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { Document, Organization, Entity } from '../types';

const DocumentSubmission = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Financial Statements',
    organization_id: '',
    entity_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [docs, orgs, ents] = await Promise.all([
        call<Document[]>('list_documents'),
        call<Organization[]>('list_organizations'),
        call<Entity[]>('list_entities'),
      ]);
      setDocuments(docs);
      setOrganizations(orgs);
      setEntities(ents);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadFile(file);
      setFormData({ ...formData, name: file.name });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      const arrayBuffer = await uploadFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      await call('upload_document', [{
        name: formData.name,
        file_type: uploadFile.type || 'application/octet-stream',
        organization_id: formData.organization_id ? BigInt(formData.organization_id) : null,
        entity_id: formData.entity_id ? BigInt(formData.entity_id) : null,
        category: formData.category,
        file_data: Array.from(bytes),
      }]);

      setDialogOpen(false);
      setUploadFile(null);
      loadData();
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document');
    }
  };

  const handleDownload = async (id: bigint, name: string) => {
    try {
      const data = await call<number[]>('download_document', [id]);
      const blob = new Blob([new Uint8Array(data)]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Failed to download document');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await call('delete_document', [id]);
        loadData();
      } catch (error) {
        console.error('Failed to delete document:', error);
        alert('Failed to delete document');
      }
    }
  };

  const formatFileSize = (bytes: bigint) => {
    const kb = Number(bytes) / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('documents.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setDialogOpen(true)}
        >
          {t('documents.upload')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('documents.name')}</TableCell>
              <TableCell>{t('documents.type')}</TableCell>
              <TableCell>{t('documents.size')}</TableCell>
              <TableCell>{t('documents.category')}</TableCell>
              <TableCell>{t('documents.organization')}</TableCell>
              <TableCell>{t('documents.entity')}</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id.toString()}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.file_type}</TableCell>
                <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                <TableCell>
                  <Chip label={doc.category} size="small" />
                </TableCell>
                <TableCell>
                  {doc.organization_id
                    ? organizations.find((o) => o.id === doc.organization_id)?.name
                    : '-'}
                </TableCell>
                <TableCell>
                  {doc.entity_id
                    ? entities.find((e) => e.id === doc.entity_id)?.name
                    : '-'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(doc.id, doc.name)}
                    color="primary"
                  >
                    <Download />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(doc.id)}
                    color="error"
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
        <DialogTitle>{t('documents.upload')}</DialogTitle>
        <DialogContent>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.400',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              my: 2,
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography>
              {uploadFile
                ? uploadFile.name
                : 'Drag and drop a file here, or click to select'}
            </Typography>
          </Paper>

          <TextField
            label={t('documents.name')}
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>{t('documents.category')}</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="Financial Statements">Financial Statements</MenuItem>
              <MenuItem value="Invoices">Invoices</MenuItem>
              <MenuItem value="Contracts">Contracts</MenuItem>
              <MenuItem value="Tax Documents">Tax Documents</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>{t('documents.organization')}</InputLabel>
            <Select
              value={formData.organization_id}
              onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id.toString()} value={org.id.toString()}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>{t('documents.entity')}</InputLabel>
            <Select
              value={formData.entity_id}
              onChange={(e) => setFormData({ ...formData, entity_id: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {entities
                .filter((e) =>
                  formData.organization_id
                    ? e.organization_id.toString() === formData.organization_id
                    : true
                )
                .map((ent) => (
                  <MenuItem key={ent.id.toString()} value={ent.id.toString()}>
                    {ent.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!uploadFile || !formData.name}
          >
            {t('documents.upload')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentSubmission;

