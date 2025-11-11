import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  Alert,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { ImportedDataset, ColumnMetadata } from '../types';

const DataImport = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [dataset, setDataset] = useState<ImportedDataset | null>(null);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [uploading, setUploading] = useState(false);

  const getColumnType = (type: any): string => {
    if (typeof type === 'object' && type !== null) {
      return Object.keys(type)[0];
    }
    return String(type);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Send to backend for processing
      const result = await call<ImportedDataset>('import_excel', [{
        name: file.name.replace(/\.[^/.]+$/, ''),
        engagement_id: [],
        file_name: file.name,
        file_data: Array.from(bytes),
      }]);

      setDataset(result);
    } catch (error) {
      console.error('Failed to import file:', error);
      alert('Failed to import file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const renderSchemaAnalysis = (columns: ColumnMetadata[]) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('dataImport.fieldName')}</TableCell>
            <TableCell>{t('dataImport.type')}</TableCell>
            <TableCell>{t('dataImport.nullPercent')}</TableCell>
            <TableCell>{t('dataImport.uniqueCount')}</TableCell>
            <TableCell>{t('dataImport.minValue')}</TableCell>
            <TableCell>{t('dataImport.maxValue')}</TableCell>
            <TableCell>{t('dataImport.samples')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {columns.map((col, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {col.name}
                {col.pii_detection.has_emails || col.pii_detection.has_phone_numbers ? (
                  <Chip label="PII" size="small" color="warning" sx={{ ml: 1 }} />
                ) : null}
              </TableCell>
              <TableCell>{getColumnType(col.detected_type)}</TableCell>
              <TableCell>{col.null_percent.toFixed(1)}%</TableCell>
              <TableCell>{col.unique_count.toString()}</TableCell>
              <TableCell>{col.min_value}</TableCell>
              <TableCell>{col.max_value}</TableCell>
              <TableCell>{col.sample_values.slice(0, 3).join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderDataPreview = () => {
    if (!dataset || dataset.sheets.length === 0) return null;

    const sheet = dataset.sheets[selectedSheet];

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('dataImport.dataPreview')}
        </Typography>
        <Tabs value={selectedSheet} onChange={(_, v) => setSelectedSheet(v)} sx={{ mb: 2 }}>
          {dataset.sheets.map((s, idx) => (
            <Tab key={idx} label={`${s.name} (${s.row_count} rows)`} />
          ))}
        </Tabs>

        <Typography variant="subtitle1" gutterBottom>
          {t('dataImport.schemaAnalysis')}
        </Typography>
        {renderSchemaAnalysis(sheet.columns)}

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Preview (First 10 rows)
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {sheet.columns.map((col, idx) => (
                  <TableCell key={idx}>{col.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sheet.data.slice(0, 10).map((row, ridx) => (
                <TableRow key={ridx}>
                  {row.map((cell, cidx) => (
                    <TableCell key={cidx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('dataImport.title')}
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {uploading ? 'Uploading...' : t('dataImport.dragDrop')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: .xlsx, .xls
        </Typography>
      </Paper>

      {dataset && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Successfully imported: {dataset.file_name} ({dataset.sheets.length} sheets,{' '}
          {dataset.sheets.reduce((sum, s) => sum + Number(s.row_count), 0)} total rows)
        </Alert>
      )}

      {renderDataPreview()}
    </Container>
  );
};

export default DataImport;

