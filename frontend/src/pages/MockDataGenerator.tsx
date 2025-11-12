import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';

interface GenerationLog {
  step: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

const MockDataGenerator = () => {
  const { call } = useBackend();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [completed, setCompleted] = useState(false);

  const addLog = (step: string, status: 'success' | 'error' | 'pending', message: string) => {
    setLogs((prev) => {
      // If updating an existing step, replace it
      const existingIndex = prev.findIndex(log => log.step === step);
      if (existingIndex >= 0 && status !== 'pending') {
        const updated = [...prev];
        updated[existingIndex] = { step, status, message };
        return updated;
      }
      // Otherwise add new log
      return [...prev, { step, status, message }];
    });
  };

  const generateMockData = async () => {
    setLoading(true);
    setLogs([]);
    setCompleted(false);

    try {
      // Step 1: Create Organizations
      addLog('organizations', 'pending', 'Creating organizations...');
      
      const orgs = [
        {
          name: 'Nile Renewables Holding S.A.E',
          description: 'Integrated clean-energy group operating across Egypt and MENA region, specializing in solar and wind energy projects',
        },
        {
          name: 'Delta Industries Group',
          description: 'Manufacturing conglomerate with subsidiaries in textiles, chemicals, and packaging sectors',
        },
        {
          name: 'Pyramids Real Estate Development Co.',
          description: 'Leading real estate developer focusing on residential and commercial properties in Greater Cairo',
        },
      ];

      const createdOrgs: any[] = [];
      for (const org of orgs) {
        const result = await call('create_organization', [org]);
        createdOrgs.push(result);
      }
      
      addLog('organizations', 'success', `Created ${createdOrgs.length} organizations`);

      // Step 2: Create Entities
      addLog('entities', 'pending', 'Creating entities...');
      
      const entities = [
        {
          organization_id: createdOrgs[0].id,
          name: 'Nile Solar Technologies Ltd.',
          description: 'Solar panel manufacturing and installation services',
          taxonomy: [{ EAS: null }],
          taxonomy_config: '{}',
        },
        {
          organization_id: createdOrgs[0].id,
          name: 'Green Wind Energy Egypt',
          description: 'Wind farm development and operations',
          taxonomy: [{ EAS: null }],
          taxonomy_config: '{}',
        },
        {
          organization_id: createdOrgs[1].id,
          name: 'Delta Textiles Manufacturing Co.',
          description: 'Cotton textiles and garment production',
          taxonomy: [{ EAS: null }],
          taxonomy_config: '{}',
        },
        {
          organization_id: createdOrgs[1].id,
          name: 'Delta Chemicals & Polymers',
          description: 'Industrial chemicals and polymer production',
          taxonomy: [{ EAS: null }],
          taxonomy_config: '{}',
        },
        {
          organization_id: createdOrgs[2].id,
          name: 'Pyramids Commercial Properties',
          description: 'Shopping malls and office buildings',
          taxonomy: [{ EAS: null }],
          taxonomy_config: '{}',
        },
      ];

      const createdEntities: any[] = [];
      for (const entity of entities) {
        const result = await call('create_entity', [entity]);
        createdEntities.push(result);
      }
      
      addLog('entities', 'success', `Created ${createdEntities.length} entities`);

      // Step 3: Create Clients
      addLog('clients', 'pending', 'Creating clients...');
      
      const clients = [
        {
          name: 'Nile Solar Technologies Ltd.',
          name_ar: ['شركة نيل للتقنيات الشمسية المحدودة'],
          contact_email: 'finance@nilesolar.com.eg',
          contact_phone: '+20 2 3456 7890',
          address: '15 Industrial Zone, 6th October City, Giza, Egypt',
          tax_registration_number: ['123-456-789'],
          commercial_registration: ['12345'],
          industry_code: ['2711'],
          organization_id: [createdOrgs[0].id],
          entity_id: [createdEntities[0].id],
        },
        {
          name: 'Green Wind Energy Egypt',
          name_ar: ['شركة الطاقة الخضراء للرياح - مصر'],
          contact_email: 'accounts@greenwind.com.eg',
          contact_phone: '+20 2 3456 7891',
          address: '45 Red Sea Road, Hurghada, Red Sea Governorate, Egypt',
          tax_registration_number: ['234-567-890'],
          commercial_registration: ['23456'],
          industry_code: ['3511'],
          organization_id: [createdOrgs[0].id],
          entity_id: [createdEntities[1].id],
        },
        {
          name: 'Delta Textiles Manufacturing Co.',
          name_ar: ['شركة دلتا للصناعات النسيجية'],
          contact_email: 'cfo@deltatextiles.com',
          contact_phone: '+20 50 234 5678',
          address: 'Mahalla Industrial Zone, El-Mahalla El-Kubra, Gharbia, Egypt',
          tax_registration_number: ['345-678-901'],
          commercial_registration: ['34567'],
          industry_code: ['1311'],
          organization_id: [createdOrgs[1].id],
          entity_id: [createdEntities[2].id],
        },
        {
          name: 'Pyramids Mall Management Services',
          name_ar: ['خدمات إدارة مراكز الأهرامات التجارية'],
          contact_email: 'finance@pyramidsmalls.com',
          contact_phone: '+20 2 3567 8901',
          address: 'Mall of Arabia, 6th October City, Giza, Egypt',
          tax_registration_number: ['456-789-012'],
          commercial_registration: ['45678'],
          industry_code: ['6820'],
          organization_id: [createdOrgs[2].id],
          entity_id: [],
        },
        {
          name: 'Egyptian Pharma Distribution Co.',
          name_ar: ['شركة التوزيع المصرية للأدوية'],
          contact_email: 'accounting@egyptpharma.com',
          contact_phone: '+20 2 2456 7890',
          address: '28 Ramses Street, Downtown Cairo, Egypt',
          tax_registration_number: ['567-890-123'],
          commercial_registration: ['56789'],
          industry_code: ['4649'],
          organization_id: [],
          entity_id: [],
        },
      ];

      const createdClients: any[] = [];
      for (const client of clients) {
        const result = await call('create_client', [client]);
        createdClients.push(result);
      }
      
      addLog('clients', 'success', `Created ${createdClients.length} clients`);

      // Step 4: Create Engagements
      addLog('engagements', 'pending', 'Creating engagements...');
      
      const engagements = [
        {
          name: 'Nile Solar Technologies - FY2024 Audit',
          description: 'Statutory audit of financial statements for year ended 31 December 2024',
          link: { Client: createdClients[0].id },
          start_date: BigInt(Date.now() * 1000000), // Current date
          end_date: BigInt((Date.now() + 90 * 24 * 60 * 60 * 1000) * 1000000), // +90 days
          status: 'In Progress',
        },
        {
          name: 'Delta Textiles - Q1 2024 Review',
          description: 'Limited review of Q1 2024 interim financial statements',
          link: { Client: createdClients[2].id },
          start_date: BigInt((Date.now() - 30 * 24 * 60 * 60 * 1000) * 1000000), // -30 days
          end_date: BigInt(Date.now() * 1000000), // Today
          status: 'Completed',
        },
      ];

      const createdEngagements: any[] = [];
      for (const engagement of engagements) {
        const result = await call('create_engagement', [engagement]);
        createdEngagements.push(result);
      }
      
      addLog('engagements', 'success', `Created ${createdEngagements.length} engagements`);

      // Step 5: Create Trial Balance with accounts
      addLog('trial_balance', 'pending', 'Creating trial balance with accounts...');
      
      const trialBalanceReq = {
        engagement_id: createdEngagements[0].id,
        period_end_date: '2024-12-31',
        description: 'FY2024 trial balance for Nile Solar Technologies',
        currency: ['EGP'],
      };

      const trialBalance: any = await call('create_trial_balance', [trialBalanceReq]);
      
      // Add accounts to trial balance (using US GAAP codes for now as backend expects these)
      const accounts = [
        { account_number: '1001', account_name: 'Cash and Cash Equivalents', account_type: 'Asset', debit: BigInt(4300000), credit: BigInt(0), fs_line: 'BS_CASH' },
        { account_number: '1200', account_name: 'Trade Receivables', account_type: 'Asset', debit: BigInt(4275000), credit: BigInt(0), fs_line: 'BS_AR' },
        { account_number: '1300', account_name: 'Inventory', account_type: 'Asset', debit: BigInt(6150000), credit: BigInt(0), fs_line: 'BS_INVENTORY' },
        { account_number: '1500', account_name: 'Property Plant and Equipment', account_type: 'Asset', debit: BigInt(18000000), credit: BigInt(0), fs_line: 'BS_PPE' },
        { account_number: '1520', account_name: 'Accumulated Depreciation', account_type: 'Asset', debit: BigInt(0), credit: BigInt(5460000), fs_line: 'BS_ACCUM_DEPR' },
        { account_number: '2001', account_name: 'Trade Payables', account_type: 'Liability', debit: BigInt(0), credit: BigInt(2890000), fs_line: 'BS_AP' },
        { account_number: '2100', account_name: 'Accrued Expenses', account_type: 'Liability', debit: BigInt(0), credit: BigInt(725000), fs_line: 'BS_ACCRUED' },
        { account_number: '2200', account_name: 'Bank Loans', account_type: 'Liability', debit: BigInt(0), credit: BigInt(7500000), fs_line: 'BS_LONG_TERM_DEBT' },
        { account_number: '3001', account_name: 'Share Capital', account_type: 'Equity', debit: BigInt(0), credit: BigInt(10000000), fs_line: 'BS_CAPITAL' },
        { account_number: '3200', account_name: 'Retained Earnings', account_type: 'Equity', debit: BigInt(0), credit: BigInt(2875000), fs_line: 'BS_RETAINED' },
        { account_number: '4001', account_name: 'Revenue', account_type: 'Revenue', debit: BigInt(0), credit: BigInt(37250000), fs_line: 'IS_REVENUE' },
        { account_number: '5001', account_name: 'Cost of Sales', account_type: 'Expense', debit: BigInt(23050000), credit: BigInt(0), fs_line: 'IS_COGS' },
        { account_number: '6001', account_name: 'Operating Expenses', account_type: 'Expense', debit: BigInt(7185000), credit: BigInt(0), fs_line: 'IS_OPEX' },
        { account_number: '6030', account_name: 'Depreciation Expense', account_type: 'Expense', debit: BigInt(1460000), credit: BigInt(0), fs_line: 'IS_DEPRECIATION' },
        { account_number: '6080', account_name: 'Finance Costs', account_type: 'Expense', debit: BigInt(125000), credit: BigInt(0), fs_line: 'IS_INTEREST' },
      ];

      const createdAccounts: any[] = [];
      for (const acc of accounts) {
        const accountReq = {
          account_number: acc.account_number,
          account_name: acc.account_name,
          account_type: { [acc.account_type]: null }, // Convert to enum variant
          debit_balance: acc.debit,
          credit_balance: acc.credit,
          fs_line_item: [acc.fs_line], // Option<String>
          notes: [], // Option<String>
        };
        const account: any = await call('add_trial_balance_account', [trialBalance.id, accountReq]);
        createdAccounts.push(account);
      }
      
      addLog('trial_balance', 'success', `Created trial balance with ${createdAccounts.length} pre-mapped accounts`);

      // Success
      addLog('complete', 'success', 'Mock data generation completed successfully! Ready for financial statement generation.');
      setCompleted(true);

    } catch (error: any) {
      addLog('error', 'error', `Failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setLogs([]);
    setCompleted(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mock Data Generator
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          This will automatically create complete mock data for testing financial statement generation and all audit workflows.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            What will be created:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="3 Organizations"
                secondary="Nile Renewables, Delta Industries, Pyramids Real Estate"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="5 Entities"
                secondary="Solar, Wind, Textiles, Chemicals, Commercial Properties"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="5 Clients"
                secondary="With Egyptian company details, Arabic names, tax IDs, linked to orgs/entities"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2 Engagements"
                secondary="FY2024 Audit and Q1 Review engagements"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Trial Balance with 15 Pre-Mapped Accounts"
                secondary="Complete trial balance for Nile Solar with accounts mapped to financial statement lines (EGP 59.4M balanced)"
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
            onClick={generateMockData}
            disabled={loading || completed}
            fullWidth
          >
            {loading ? 'Generating...' : 'Generate Mock Data'}
          </Button>
          
          {completed && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<Refresh />}
              onClick={resetData}
              fullWidth
            >
              Reset & Generate Again
            </Button>
          )}
        </Box>

        {logs.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Generation Log:
            </Typography>
            <List dense>
              {logs.map((log, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {log.status === 'success' && <CheckCircle color="success" />}
                    {log.status === 'error' && <ErrorIcon color="error" />}
                    {log.status === 'pending' && <CircularProgress size={20} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={log.message}
                    primaryTypographyProps={{
                      color: log.status === 'error' ? 'error' : 'textPrimary',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {completed && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Mock data created successfully!</strong>
            </Typography>
            <Typography variant="body2" gutterBottom>
              All data has been generated and is ready for use. You can now:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Navigate to Trial Balance"
                  secondary="Select 'Nile Solar Technologies - FY2024 Audit' engagement to view the pre-mapped trial balance"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Generate Financial Statements"
                  secondary="Go to Financial Statements page, select the engagement, and click 'Generate' to create EAS-compliant statements"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Explore All Features"
                  secondary="Visit Organizations, Entities, Clients, and Engagements to see the complete data structure"
                />
              </ListItem>
            </List>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default MockDataGenerator;

