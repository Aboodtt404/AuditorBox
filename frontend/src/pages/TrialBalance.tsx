import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import { Add, Upload, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';
import { REGIONAL_CONFIG } from '../config/regional';

interface TrialBalance {
  id: bigint;
  engagement_id: bigint;
  period_end_date: string;
  description: string;
  currency: string;
  is_adjusted: boolean;
  created_at: bigint;
}

interface TBAccount {
  id: bigint;
  trial_balance_id: bigint;
  account_number: string;
  account_name: string;
  account_type: any;
  debit_balance: bigint;
  credit_balance: bigint;
  fs_line_item: [] | [string];
  notes: string;
}

interface Validation {
  is_balanced: boolean;
  total_debits: bigint;
  total_credits: bigint;
  difference: bigint;
  account_count: bigint;
  issues: string[];
}

interface Engagement {
  id: bigint;
  name: string;
  link: any;
}

interface Client {
  id: bigint;
  name: string;
}

interface Organization {
  id: bigint;
  name: string;
}

interface Entity {
  id: bigint;
  name: string;
}

export default function TrialBalance() {
  const { call } = useBackend();
  const [trialBalances, setTrialBalances] = useState<TrialBalance[]>([]);
  const [accounts, setAccounts] = useState<TBAccount[]>([]);
  const [validation, setValidation] = useState<Validation | null>(null);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedTB, setSelectedTB] = useState<bigint | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TBAccount | null>(null);
  const [selectedFSLine, setSelectedFSLine] = useState('');
  const [availableLineItems, setAvailableLineItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    engagement_id: '',
    period_end_date: '',
    description: '',
    currency: REGIONAL_CONFIG.defaultCurrency,
  });
  const [csvData, setCsvData] = useState('');

  useEffect(() => {
    loadEngagements();
    loadLineItems();
  }, []);

  const loadLineItems = async () => {
    try {
      // Default to EAS taxonomy
      const result: any = await call('get_line_items_for_taxonomy', [{ EAS: null }]);
      setAvailableLineItems(Array.isArray(result) ? result : []);
    } catch (error: any) {
      console.error('Failed to load line items:', error);
    }
  };

  useEffect(() => {
    if (selectedTB) {
      loadAccounts(selectedTB);
      validateTB(selectedTB);
    }
  }, [selectedTB]);

  const loadEngagements = async () => {
    try {
      const [engs, clnts, orgs, ents] = await Promise.all([
        call<Engagement[]>('list_engagements'),
        call<Client[]>('list_clients'),
        call<Organization[]>('list_organizations'),
        call<Entity[]>('list_entities'),
      ]);
      setEngagements(engs);
      setClients(clnts);
      setOrganizations(orgs);
      setEntities(ents);
    } catch (error) {
      console.error('Failed to load engagements:', error);
    }
  };

  const getEngagementLinkedName = (engagement: Engagement): string => {
    const link = engagement.link as any;
    if (link.Organization !== undefined) {
      const org = organizations.find(o => o.id === link.Organization);
      return org ? ` (Org: ${org.name})` : '';
    } else if (link.Entity !== undefined) {
      const ent = entities.find(e => e.id === link.Entity);
      return ent ? ` (Entity: ${ent.name})` : '';
    } else if (link.Client !== undefined) {
      const client = clients.find(c => c.id === link.Client);
      return client ? ` (Client: ${client.name})` : '';
    }
    return '';
  };

  const loadTrialBalances = async (engagementId: bigint) => {
    try {
      const data = await call<TrialBalance[]>('list_trial_balances_by_engagement', [engagementId]);
      setTrialBalances(data);
      if (data.length > 0) {
        setSelectedTB(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load trial balances:', error);
    }
  };

  const loadAccounts = async (tbId: bigint) => {
    try {
      const data = await call<TBAccount[]>('get_trial_balance_accounts', [tbId]);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const validateTB = async (tbId: bigint) => {
    try {
      const result = await call<Validation>('validate_trial_balance', [tbId]);
      setValidation(result);
    } catch (error) {
      console.error('Failed to validate trial balance:', error);
    }
  };

  const handleValidate = () => {
    if (selectedTB) {
      validateTB(selectedTB);
    }
  };

  const handleMapToFS = async () => {
    if (!selectedAccount || !selectedTB) return;

    try {
      await call('map_account_to_fs_line', [
        selectedAccount.id,
        selectedFSLine,
      ]);
      
      setMapDialogOpen(false);
      setSelectedAccount(null);
      setSelectedFSLine('');
      loadAccounts(selectedTB);
      alert('Account mapped successfully!');
    } catch (error: any) {
      console.error('Failed to map account:', error);
      alert(`Failed to map account: ${error.message || error}`);
    }
  };

  const handleImportCSV = async () => {
    try {
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const rows = lines.slice(1).map(line => {
        const parts = line.split(',').map(p => p.trim());
        
        // Handle CSV with or without Account Type column
        let account_number, account_name, debit, credit;
        
        if (parts.length === 5) {
          // Format: Account No., Account Name, Account Type, Debit, Credit
          [account_number, account_name, , debit, credit] = parts;
        } else if (parts.length === 4) {
          // Format: Account No., Account Name, Debit, Credit
          [account_number, account_name, debit, credit] = parts;
        } else {
          throw new Error(`Invalid CSV format. Expected 4 or 5 columns, got ${parts.length}`);
        }
        
        const debitValue = parseFloat(debit || '0');
        const creditValue = parseFloat(credit || '0');
        
        if (isNaN(debitValue) || isNaN(creditValue)) {
          throw new Error(`Invalid numeric values in row: ${line}`);
        }
        
        return {
          account_number: account_number,
          account_name: account_name,
          debit_balance: BigInt(Math.round(debitValue * 100)),
          credit_balance: BigInt(Math.round(creditValue * 100)),
        };
      });

      await call('import_trial_balance_csv', [
        BigInt(formData.engagement_id),
        formData.period_end_date,
        rows,
      ]);

      setImportDialogOpen(false);
      loadTrialBalances(BigInt(formData.engagement_id));
      setCsvData('');
      setFormData({ engagement_id: '', period_end_date: '', description: '', currency: REGIONAL_CONFIG.defaultCurrency });
      alert('Trial balance imported successfully!');
    } catch (error) {
      console.error('Failed to import CSV:', error);
      alert(`Failed to import CSV: ${error instanceof Error ? error.message : 'Check console for details.'}`);
    }
  };

  const formatAmount = (amount: bigint) => {
    const dollars = Number(amount) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars);
  };

  const getAccountType = (type: any): string => {
    return Object.keys(type)[0];
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Trial Balance</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={() => setImportDialogOpen(true)}
          >
            Import Trial Balance (CSV)
          </Button>
        </Box>
      </Box>

      {/* Engagement Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Engagement</InputLabel>
          <Select
            value={formData.engagement_id}
            label="Select Engagement"
            onChange={(e) => {
              setFormData({ ...formData, engagement_id: e.target.value });
              if (e.target.value) {
                loadTrialBalances(BigInt(e.target.value));
              }
            }}
          >
            {engagements.map((eng) => (
              <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                {eng.name}{getEngagementLinkedName(eng)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Trial Balance Selector */}
      {trialBalances.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControl sx={{ flex: 1, mr: 2 }}>
              <InputLabel>Select Trial Balance</InputLabel>
              <Select
                value={selectedTB?.toString() || ''}
                label="Select Trial Balance"
                onChange={(e) => setSelectedTB(BigInt(e.target.value))}
              >
                {trialBalances.map((tb) => (
                  <MenuItem key={tb.id.toString()} value={tb.id.toString()}>
                    {tb.description} - {tb.period_end_date} {tb.is_adjusted && '(Adjusted)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedTB !== null && (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={handleValidate}
                  sx={{ mr: 1 }}
                >
                  Validate
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Add Account
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Validation Alert */}
      {validation && (
        <Alert
          severity={validation.is_balanced ? 'success' : 'error'}
          icon={validation.is_balanced ? <CheckCircle /> : <ErrorIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">
            {validation.is_balanced ? 'Trial Balance is Balanced ✓' : 'Trial Balance is NOT Balanced'}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={3}>
              <Typography variant="body2">
                <strong>Total Debits:</strong> {formatAmount(validation.total_debits)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <strong>Total Credits:</strong> {formatAmount(validation.total_credits)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <strong>Difference:</strong> {formatAmount(validation.difference)}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                <strong>Accounts:</strong> {validation.account_count.toString()}
              </Typography>
            </Grid>
          </Grid>
          {validation.issues.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="error">
                <strong>Issues:</strong>
              </Typography>
              {validation.issues.map((issue, idx) => (
                <Typography key={idx} variant="body2" color="error">
                  • {issue}
                </Typography>
              ))}
            </Box>
          )}
        </Alert>
      )}

      {/* Accounts Table */}
      {accounts.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Account #</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell>FS Line Item</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id.toString()}>
                  <TableCell>{account.account_number}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell>
                    <Chip label={getAccountType(account.account_type)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {account.debit_balance > 0 ? formatAmount(account.debit_balance) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {account.credit_balance > 0 ? formatAmount(account.credit_balance) : '-'}
                  </TableCell>
                  <TableCell>
                    {account.fs_line_item.length > 0 ? (
                      <Chip label={account.fs_line_item[0]} size="small" color="primary" />
                    ) : (
                      <Chip label="Not Mapped" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedAccount(account);
                        setSelectedFSLine(account.fs_line_item.length > 0 && account.fs_line_item[0] ? account.fs_line_item[0] : '');
                        setMapDialogOpen(true);
                      }}
                    >
                      Map to FS
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Account Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Account Manually</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
            Add individual accounts to the selected trial balance. For bulk import, use "Import Trial Balance (CSV)" instead.
          </Alert>
          <TextField
            fullWidth
            margin="normal"
            label="Account Number"
            placeholder="e.g., 1001"
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Name"
            placeholder="e.g., Cash & Cash Equivalents"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Account Type</InputLabel>
            <Select label="Account Type" defaultValue="">
              <MenuItem value="Asset">Asset</MenuItem>
              <MenuItem value="Liability">Liability</MenuItem>
              <MenuItem value="Equity">Equity</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Debit Balance"
            type="number"
            placeholder="0.00"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Credit Balance"
            type="number"
            placeholder="0.00"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => alert('Add Account functionality - Coming soon!')} variant="contained">Add Account</Button>
        </DialogActions>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Import Trial Balance from CSV</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            CSV Format: account_number, account_name, debit, credit
            <br />
            Example: 1000, Cash, 50000.00, 0.00
          </Alert>
          <FormControl fullWidth margin="normal">
            <InputLabel>Engagement</InputLabel>
            <Select
              value={formData.engagement_id}
              label="Engagement"
              onChange={(e) => setFormData({ ...formData, engagement_id: e.target.value })}
            >
              {engagements.map((eng) => (
                <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                  {eng.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Period End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.period_end_date}
            onChange={(e) => setFormData({ ...formData, period_end_date: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select
              value={formData.currency}
              label="Currency"
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              {REGIONAL_CONFIG.currencies.map((curr) => (
                <MenuItem key={curr.code} value={curr.code}>
                  {curr.symbol} - {curr.name} ({curr.nameAr})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="CSV Data"
            multiline
            rows={10}
            fullWidth
            margin="normal"
            placeholder="Account No.,Account Name,Account Type,Debit,Credit
1001,النقدية - Cash & Cash Equivalents,Asset,5250000,0
2001,الموردون - Trade Payables,Liability,0,2890000"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleImportCSV} variant="contained">Import</Button>
        </DialogActions>
      </Dialog>

      {/* Map to FS Dialog */}
      <Dialog open={mapDialogOpen} onClose={() => setMapDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Map Account to Financial Statement Line</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <>
              <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
                Map this account to a financial statement line item to include it in generated financial statements.
              </Alert>
              <TextField
                label="Account"
                value={`${selectedAccount.account_number} - ${selectedAccount.account_name}`}
                fullWidth
                margin="normal"
                disabled
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Financial Statement Line Item</InputLabel>
                <Select
                  value={selectedFSLine}
                  onChange={(e) => setSelectedFSLine(e.target.value)}
                >
                  <MenuItem value="">Clear Mapping</MenuItem>
                  {availableLineItems
                    .filter(item => !item.is_subtotal) // Only show mappable line items, not subtotals
                    .map(item => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.code} - {item.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Line Item Codes:</strong> Use these codes when mapping accounts. Subtotals are calculated automatically.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMapDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMapToFS} variant="contained">Save Mapping</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

