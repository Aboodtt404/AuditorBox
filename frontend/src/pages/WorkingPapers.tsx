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
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { ImportedDataset, Engagement, WorkingPaper, ColumnMapping } from '../types';
import { useNotification } from '../components/NotificationSystem';

const WorkingPapers = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const { showSuccess, showError } = useNotification();
  const [activeStep, setActiveStep] = useState(0);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [datasets, setDatasets] = useState<ImportedDataset[]>([]);
  const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [workingPaperName, setWorkingPaperName] = useState('');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [standardFilter, setStandardFilter] = useState<string>('all');

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
    } catch (error: any) {
      console.error('Failed to load data:', error);
      showError(error.message || 'Failed to load data', 'Load Error');
    }
  };

  const loadWorkingPapers = async (engagementId: string) => {
    try {
      const wps = await call<WorkingPaper[]>('list_working_papers_by_engagement', [
        BigInt(engagementId),
      ]);
      setWorkingPapers(wps);
    } catch (error: any) {
      console.error('Failed to load working papers:', error);
      showError(error.message || 'Failed to load working papers', 'Load Error');
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
    if (!workingPaperName.trim()) {
      showError('Working paper name is required', 'Validation Error');
      return;
    }
    if (!columnMapping.account_number || !columnMapping.account_name) {
      showError('Account number and account name mappings are required', 'Validation Error');
      return;
    }

    // Ensure all required fields are present in the column mapping
    // The backend expects all keys to be present in the Candid record structure
    // Candid opt text representation: None = [], Some(text) = [text]
    // Convert empty strings to [] (None) and non-empty strings to [value] (Some)
    const normalizeOptText = (value: string | undefined): [] | [string] => {
      return value && value.trim() !== '' ? [value] : [];
    };

    const completeColumnMapping: any = {
      account_number: normalizeOptText(columnMapping.account_number),
      account_name: normalizeOptText(columnMapping.account_name),
      currency: normalizeOptText(columnMapping.currency),
      opening_debit: normalizeOptText(columnMapping.opening_debit),
      opening_credit: normalizeOptText(columnMapping.opening_credit),
      period_debit: normalizeOptText(columnMapping.period_debit),
      period_credit: normalizeOptText(columnMapping.period_credit),
      ytd_debit: normalizeOptText(columnMapping.ytd_debit),
      ytd_credit: normalizeOptText(columnMapping.ytd_credit),
      entity: normalizeOptText(columnMapping.entity),
      department: normalizeOptText(columnMapping.department),
      project: normalizeOptText(columnMapping.project),
      notes: normalizeOptText(columnMapping.notes),
    };

    try {
      await call('create_working_paper', [{
        engagement_id: BigInt(selectedEngagement),
        dataset_id: BigInt(selectedDataset),
        name: workingPaperName,
        column_mapping: completeColumnMapping,
        selected_accounts: [],
      }]);
      showSuccess('Working paper created successfully!', 'Success');
      setActiveStep(0);
      loadWorkingPapers(selectedEngagement);
    } catch (error: any) {
      console.error('Failed to create working paper:', error);
      showError(error.message || 'Failed to create working paper', 'Create Error');
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
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Map your Excel columns to accounting fields</strong>
                </Typography>
                <Typography variant="body2">
                  Select which column in your dataset corresponds to each field below. 
                  <strong> Account Number</strong> and <strong>Account Name</strong> are required. 
                  Other fields are optional but recommended for complete analysis.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Working Paper Name"
                fullWidth
                value={workingPaperName}
                onChange={(e) => setWorkingPaperName(e.target.value)}
                required
              />
            </Grid>
            {[
              { field: 'account_number', label: 'accountNumber', required: true },
              { field: 'account_name', label: 'accountName', required: true },
              { field: 'currency', label: 'currency', required: false },
              { field: 'opening_debit', label: 'openingDebit', required: false },
              { field: 'opening_credit', label: 'openingCredit', required: false },
              { field: 'period_debit', label: 'periodDebit', required: false },
              { field: 'period_credit', label: 'periodCredit', required: false },
              { field: 'ytd_debit', label: 'ytdDebit', required: false },
              { field: 'ytd_credit', label: 'ytdCredit', required: false },
              { field: 'entity', label: 'entity', required: false },
              { field: 'department', label: 'department', required: false },
              { field: 'project', label: 'project', required: false },
              { field: 'notes', label: 'notes', required: false },
            ].map(({ field, label, required }) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth required={required}>
                  <InputLabel>
                    {t(`workingPapers.${label}`)} {required && '*'}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
            Existing Working Papers
          </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by ISA Standard</InputLabel>
              <Select
                value={standardFilter}
                onChange={(e) => setStandardFilter(e.target.value)}
                label="Filter by ISA Standard"
              >
                <MenuItem value="all">All Standards</MenuItem>
                <MenuItem value="ISA 200">ISA 200</MenuItem>
                <MenuItem value="ISA 210">ISA 210</MenuItem>
                <MenuItem value="ISA 220">ISA 220</MenuItem>
                <MenuItem value="ISA 230">ISA 230</MenuItem>
                <MenuItem value="ISA 240">ISA 240</MenuItem>
                <MenuItem value="ISA 250">ISA 250</MenuItem>
                <MenuItem value="ISA 260">ISA 260</MenuItem>
                <MenuItem value="ISA 265">ISA 265</MenuItem>
                <MenuItem value="ISA 300">ISA 300</MenuItem>
                <MenuItem value="ISA 315">ISA 315</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Relevant Standards</TableCell>
                  <TableCell>Ratios</TableCell>
                  <TableCell>Linked Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workingPapers
                  .filter((wp) => {
                    if (standardFilter === 'all') return true;
                    // In a full implementation, this would check wp.standard_codes or similar
                    // For now, we'll show all working papers
                    return true;
                  })
                  .map((wp) => {
                    // Determine relevant standards based on working paper type
                    // This is a simplified mapping - in production, this would come from backend
                    const relevantStandards = ['ISA 230', 'ISA 315']; // Default for trial balance working papers
                    const displayStandards = standardFilter === 'all' 
                      ? relevantStandards 
                      : relevantStandards.filter(s => s === standardFilter);

                    return (
                  <TableRow key={wp.id.toString()}>
                    <TableCell>{wp.name}</TableCell>
                    <TableCell>
                      {new Date(Number(wp.created_at) / 1000000).toLocaleDateString()}
                    </TableCell>
                        <TableCell>
                          {displayStandards.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {displayStandards.map((std) => (
                                <Chip key={std} label={std} size="small" variant="outlined" />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                    <TableCell>{wp.ratios.length}</TableCell>
                    <TableCell>{wp.linked_document_ids.length}</TableCell>
                  </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default WorkingPapers;

