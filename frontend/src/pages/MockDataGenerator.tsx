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
    setLogs((prev) => [...prev, { step, status, message }]);
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

      // Success
      addLog('complete', 'success', 'Mock data generation completed successfully!');
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
          This will automatically create sample Egyptian organizations, entities, and clients for testing and demonstration purposes.
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
            <Typography variant="body2">
              You can now navigate to Organizations, Entities, and Clients pages to see the generated data.
              Use these for creating engagements, client acceptances, and other audit workflows.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default MockDataGenerator;

