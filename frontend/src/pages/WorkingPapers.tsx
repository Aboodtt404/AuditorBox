import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { ImportedDataset, Engagement, WorkingPaper, ColumnMapping } from '../types';

const WorkingPapers = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [activeStep, setActiveStep] = useState(0);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [datasets, setDatasets] = useState<ImportedDataset[]>([]);
  const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [workingPaperName, setWorkingPaperName] = useState('');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [engs, dsets] = await Promise.all([
        call<Engagement[]>('list_engagements'),
        call<ImportedDataset[]>('list_datasets'),
      ]);
      setEngagements(engs);
      setDatasets(dsets);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadWorkingPapers = async (engagementId: string) => {
    try {
      const wps = await call<WorkingPaper[]>('list_working_papers_by_engagement', [
        BigInt(engagementId),
      ]);
      setWorkingPapers(wps);
    } catch (error) {
      console.error('Failed to load working papers:', error);
    }
  };

  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDataset(datasetId);
    const dataset = datasets.find((d) => d.id.toString() === datasetId);
    if (dataset && dataset.sheets.length > 0) {
      const columns = dataset.sheets[0].columns.map((c) => c.name);
      setAvailableColumns(columns);
    }
  };

  const handleCreateWorkingPaper = async () => {
    try {
      await call('create_working_paper', [{
        engagement_id: BigInt(selectedEngagement),
        dataset_id: BigInt(selectedDataset),
        name: workingPaperName,
        column_mapping: columnMapping,
        selected_accounts: [],
      }]);
      alert('Working paper created successfully!');
      setActiveStep(0);
      loadWorkingPapers(selectedEngagement);
    } catch (error) {
      console.error('Failed to create working paper:', error);
      alert('Failed to create working paper');
    }
  };

  const steps = [
    'Select Engagement',
    'Select Dataset',
    'Map Columns',
    'Review & Create',
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormControl fullWidth>
            <InputLabel>Select Engagement</InputLabel>
            <Select
              value={selectedEngagement}
              onChange={(e) => {
                setSelectedEngagement(e.target.value);
                loadWorkingPapers(e.target.value);
              }}
            >
              {engagements.map((eng) => (
                <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                  {eng.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 1:
        return (
          <FormControl fullWidth>
            <InputLabel>Select Dataset</InputLabel>
            <Select
              value={selectedDataset}
              onChange={(e) => handleDatasetSelect(e.target.value)}
            >
              {datasets.map((ds) => (
                <MenuItem key={ds.id.toString()} value={ds.id.toString()}>
                  {ds.name} ({ds.file_name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Working Paper Name"
                fullWidth
                value={workingPaperName}
                onChange={(e) => setWorkingPaperName(e.target.value)}
              />
            </Grid>
            {[
              'account_number',
              'account_name',
              'currency',
              'opening_debit',
              'opening_credit',
              'period_debit',
              'period_credit',
              'ytd_debit',
              'ytd_credit',
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t(`workingPapers.${field.replace(/_/g, '')}`)}
                  </InputLabel>
                  <Select
                    value={(columnMapping as any)[field] || ''}
                    onChange={(e) =>
                      setColumnMapping({ ...columnMapping, [field]: e.target.value })
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {availableColumns.map((col) => (
                      <MenuItem key={col} value={col}>
                        {col}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Working Paper Configuration
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Typography>
                <strong>Name:</strong> {workingPaperName}
              </Typography>
              <Typography>
                <strong>Engagement:</strong>{' '}
                {engagements.find((e) => e.id.toString() === selectedEngagement)?.name}
              </Typography>
              <Typography>
                <strong>Dataset:</strong>{' '}
                {datasets.find((d) => d.id.toString() === selectedDataset)?.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Column Mappings:</strong>
              </Typography>
              {Object.entries(columnMapping).map(([key, value]) => (
                <Chip key={key} label={`${key}: ${value}`} sx={{ m: 0.5 }} />
              ))}
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('workingPapers.title')}</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 2 }}>{renderStepContent()}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                handleCreateWorkingPaper();
              } else {
                setActiveStep(activeStep + 1);
              }
            }}
            disabled={
              (activeStep === 0 && !selectedEngagement) ||
              (activeStep === 1 && !selectedDataset)
            }
          >
            {activeStep === steps.length - 1 ? 'Create' : 'Next'}
          </Button>
        </Box>
      </Paper>

      {selectedEngagement && workingPapers.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Existing Working Papers
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Ratios</TableCell>
                  <TableCell>Linked Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workingPapers.map((wp) => (
                  <TableRow key={wp.id.toString()}>
                    <TableCell>{wp.name}</TableCell>
                    <TableCell>
                      {new Date(Number(wp.created_at) / 1000000).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{wp.ratios.length}</TableCell>
                    <TableCell>{wp.linked_document_ids.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default WorkingPapers;

