import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { useAuth } from '../hooks/useAuth';

interface FSCategory {
  Asset?: null;
  Liability?: null;
  Equity?: null;
  Revenue?: null;
  Expense?: null;
}

interface FSLineItem {
  code: string;
  name: string;
  category: FSCategory;
  subcategory: string;
  order: bigint;
  is_subtotal: boolean;
  parent: [] | [string];
}

interface FSLine {
  line_item: FSLineItem;
  amount: bigint; // in cents
  mapped_accounts: bigint[];
}

interface FSNote {
  note_number: bigint;
  title: string;
  content: string;
  created_at: bigint;
  created_by: any;
}

interface FinancialStatement {
  id: bigint;
  engagement_id: bigint;
  trial_balance_id: bigint;
  taxonomy: any;
  period_end_date: string;
  lines: FSLine[];
  notes: FSNote[];
  created_at: bigint;
  created_by: any;
  last_modified: bigint;
}

interface Engagement {
  id: bigint;
  name: string;
}

interface TrialBalance {
  id: bigint;
  engagement_id: bigint;
  period_end_date: string;
  description: string;
}

const FinancialStatements = () => {
  const { call } = useBackend();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [trialBalances, setTrialBalances] = useState<TrialBalance[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<bigint | null>(null);
  const [selectedTrialBalance, setSelectedTrialBalance] = useState<bigint | null>(null);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<string>('EAS');
  const [financialStatements, setFinancialStatements] = useState<FinancialStatement[]>([]);
  const [selectedFS, setSelectedFS] = useState<FinancialStatement | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData();
    }
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const engs = await call<Engagement[]>('list_engagements', []);
      setEngagements(engs);
    } catch (err: any) {
      console.error('Failed to load engagements:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadTrialBalances = async (engagementId: bigint) => {
    try {
      const tbs = await call<TrialBalance[]>('list_trial_balances_by_engagement', [engagementId]);
      setTrialBalances(tbs);
    } catch (err: any) {
      console.error('Failed to load trial balances:', err);
      setError(err.message || 'Failed to load trial balances');
    }
  };

  const loadFinancialStatements = async (engagementId: bigint) => {
    try {
      const fss = await call<FinancialStatement[]>('list_financial_statements_by_engagement', [engagementId]);
      setFinancialStatements(fss);
    } catch (err: any) {
      console.error('Failed to load financial statements:', err);
      setError(err.message || 'Failed to load financial statements');
    }
  };

  const handleEngagementChange = (engagementId: bigint) => {
    setSelectedEngagement(engagementId);
    setSelectedTrialBalance(null);
    setSelectedFS(null);
    loadTrialBalances(engagementId);
    loadFinancialStatements(engagementId);
  };

  const handleGenerate = async () => {
    if (!selectedTrialBalance) {
      setError('Please select a trial balance');
      return;
    }

    try {
      setLoading(true);
      const taxonomy = { [selectedTaxonomy]: null };
      const fs = await call<FinancialStatement>('generate_financial_statements', [
        {
          trial_balance_id: selectedTrialBalance,
          taxonomy: taxonomy,
        },
      ]);
      
      setSelectedFS(fs);
      setFinancialStatements([...financialStatements, fs]);
      setError(null);
    } catch (err: any) {
      console.error('Failed to generate financial statements:', err);
      setError(err.message || 'Failed to generate financial statements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedFS || !noteTitle || !noteContent) {
      setError('Please provide note title and content');
      return;
    }

    try {
      await call('add_fs_note', [
        {
          fs_id: selectedFS.id,
          title: noteTitle,
          content: noteContent,
        },
      ]);

      // Refresh the financial statement
      const updated = await call<FinancialStatement>('get_financial_statement', [selectedFS.id]);
      setSelectedFS(updated);
      
      setNoteDialogOpen(false);
      setNoteTitle('');
      setNoteContent('');
      setError(null);
    } catch (err: any) {
      console.error('Failed to add note:', err);
      setError(err.message || 'Failed to add note');
    }
  };

  const formatAmount = (amount: bigint): string => {
    const dollars = Number(amount) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars);
  };

  const getCategoryName = (category: FSCategory): string => {
    if ('Asset' in category) return 'Asset';
    if ('Liability' in category) return 'Liability';
    if ('Equity' in category) return 'Equity';
    if ('Revenue' in category) return 'Revenue';
    if ('Expense' in category) return 'Expense';
    return 'Unknown';
  };

  // Separate balance sheet and income statement lines
  const balanceSheetLines = selectedFS?.lines.filter(line => {
    const cat = getCategoryName(line.line_item.category);
    return ['Asset', 'Liability', 'Equity'].includes(cat);
  }) || [];

  const incomeStatementLines = selectedFS?.lines.filter(line => {
    const cat = getCategoryName(line.line_item.category);
    return ['Revenue', 'Expense'].includes(cat);
  }) || [];

  if (loading && !engagements.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography variant="h6" color="text.secondary">Loading financial statements...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Financial Statements</Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Selection Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generate Financial Statements
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'end' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Engagement</InputLabel>
            <Select
              value={selectedEngagement?.toString() || ''}
              onChange={(e) => handleEngagementChange(BigInt(e.target.value))}
              label="Engagement"
            >
              {engagements.map((eng) => (
                <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                  {eng.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} disabled={!selectedEngagement}>
            <InputLabel>Trial Balance</InputLabel>
            <Select
              value={selectedTrialBalance?.toString() || ''}
              onChange={(e) => setSelectedTrialBalance(BigInt(e.target.value))}
              label="Trial Balance"
            >
              {trialBalances.map((tb) => (
                <MenuItem key={tb.id.toString()} value={tb.id.toString()}>
                  {tb.description} ({tb.period_end_date})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Taxonomy</InputLabel>
            <Select
              value={selectedTaxonomy}
              onChange={(e) => setSelectedTaxonomy(e.target.value)}
              label="Taxonomy"
            >
              <MenuItem value="EAS">EAS (Egyptian Accounting Standards)</MenuItem>
              <MenuItem value="GCC">GCC Standards</MenuItem>
              <MenuItem value="IFRS">IFRS</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!selectedTrialBalance || loading}
          >
            Generate Statements
          </Button>
        </Box>

        {/* Select existing FS */}
        {financialStatements.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Or select existing statements:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {financialStatements.map((fs) => (
                <Chip
                  key={fs.id.toString()}
                  label={`${fs.period_end_date} (${getTaxonomyLabel(fs.taxonomy)})`}
                  onClick={() => setSelectedFS(fs)}
                  color={selectedFS?.id === fs.id ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Financial Statements Display */}
      {selectedFS && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
              <Tab label="Balance Sheet" />
              <Tab label="Income Statement" />
              <Tab label="Notes" />
            </Tabs>
          </Box>

          {/* Balance Sheet Tab */}
          {currentTab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Line Item</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {balanceSheetLines.map((line, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        backgroundColor: line.line_item.is_subtotal ? 'grey.100' : 'inherit',
                        fontWeight: line.line_item.is_subtotal ? 'bold' : 'normal',
                      }}
                    >
                      <TableCell sx={{ fontWeight: line.line_item.is_subtotal ? 'bold' : 'normal' }}>
                        {line.line_item.is_subtotal ? (
                          <strong>{line.line_item.name}</strong>
                        ) : (
                          line.line_item.name
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: line.line_item.is_subtotal ? 'bold' : 'normal' }}>
                        {formatAmount(line.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Income Statement Tab */}
          {currentTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Line Item</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomeStatementLines.map((line, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        backgroundColor: line.line_item.is_subtotal ? 'grey.100' : 'inherit',
                      }}
                    >
                      <TableCell sx={{ fontWeight: line.line_item.is_subtotal ? 'bold' : 'normal' }}>
                        {line.line_item.is_subtotal ? (
                          <strong>{line.line_item.name}</strong>
                        ) : (
                          line.line_item.name
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: line.line_item.is_subtotal ? 'bold' : 'normal' }}>
                        {formatAmount(line.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Notes Tab */}
          {currentTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Financial Statement Notes</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setNoteDialogOpen(true)}
                >
                  Add Note
                </Button>
              </Box>

              {selectedFS.notes.length === 0 ? (
                <Typography color="text.secondary">No notes added yet.</Typography>
              ) : (
                selectedFS.notes.map((note) => (
                  <Paper key={note.note_number.toString()} sx={{ p: 2, mb: 2 }} variant="outlined">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Note {note.note_number.toString()}: {note.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {note.content}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          )}

          {/* Export Options */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<GetApp />} disabled>
              Export to PDF
            </Button>
            <Button variant="outlined" startIcon={<GetApp />} disabled>
              Export to Excel
            </Button>
          </Box>
        </Paper>
      )}

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Financial Statement Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Note Title"
            fullWidth
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            margin="normal"
            placeholder="e.g., Significant Accounting Policies"
          />
          <TextField
            label="Note Content"
            fullWidth
            multiline
            rows={6}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            margin="normal"
            placeholder="Enter the note content here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained">
            Add Note
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

function getTaxonomyLabel(taxonomy: any): string {
  if ('EAS' in taxonomy) return 'EAS';
  if ('GCC' in taxonomy) return 'GCC';
  if ('IFRS' in taxonomy) return 'IFRS';
  if ('Custom' in taxonomy) return 'Custom';
  return 'Unknown';
}

export default FinancialStatements;

