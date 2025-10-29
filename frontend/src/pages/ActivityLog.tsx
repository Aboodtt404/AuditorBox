import { useState, useEffect } from 'react';
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
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { ActivityLogEntry } from '../types';
import { format } from 'date-fns';
import { BlockchainVerification, ChainVerification } from '../components/BlockchainVerification';

const ActivityLog = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [users, setUsers] = useState<Map<string, string>>(new Map());
  const [filterAction, setFilterAction] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [limit, setLimit] = useState(100);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [showChainVerification, setShowChainVerification] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const loadLogs = async () => {
    try {
      const data = await call<ActivityLogEntry[]>('get_activity_logs', [[BigInt(limit)]]);
      setLogs(data);
      
      // Fetch all users to map principals to names
      try {
        const allUsers = await call<any[]>('list_users', []);
        const userMap = new Map<string, string>();
        allUsers.forEach((user: any) => {
          const principalStr = typeof user.principal === 'string' 
            ? user.principal 
            : user.principal.toString();
          userMap.set(principalStr, user.name);
        });
        setUsers(userMap);
      } catch (err) {
        console.log('Could not load users for name mapping');
      }
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    }
  };

  const getUserName = (principal: any): string => {
    const principalStr = typeof principal === 'string' 
      ? principal 
      : principal.toString();
    return users.get(principalStr) || principalStr.slice(0, 15) + '...';
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'info';
      case 'DELETE':
        return 'error';
      case 'IMPORT':
        return 'warning';
      case 'UPLOAD':
        return 'primary';
      default:
        return 'default';
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterAction && log.action !== filterAction) return false;
    if (filterResource && log.resource_type !== filterResource) return false;
    return true;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));
  const uniqueResources = Array.from(new Set(logs.map((l) => l.resource_type)));

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          {t('activityLog.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<VerifiedIcon />}
          onClick={() => setShowChainVerification(true)}
        >
          Verify Blockchain Chain
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          All activity logs are cryptographically signed and stored on the Internet Computer blockchain,
          ensuring tamper-proof audit trails. Click the verification icon next to any entry to verify its integrity.
        </Typography>
      </Alert>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('activityLog.action')}</InputLabel>
            <Select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {uniqueActions.map((action) => (
                <MenuItem key={action} value={action}>
                  {action}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('activityLog.resource')}</InputLabel>
            <Select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {uniqueResources.map((resource) => (
                <MenuItem key={resource} value={resource}>
                  {resource}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Limit</InputLabel>
            <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Block #</TableCell>
              <TableCell>{t('activityLog.timestamp')}</TableCell>
              <TableCell>{t('activityLog.user')}</TableCell>
              <TableCell>{t('activityLog.action')}</TableCell>
              <TableCell>{t('activityLog.resource')}</TableCell>
              <TableCell>Resource ID</TableCell>
              <TableCell>{t('activityLog.details')}</TableCell>
              <TableCell align="center">Blockchain</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => {
              return (
                <TableRow key={log.id.toString()} hover>
                  <TableCell>
                    <Chip 
                      label={`#${log.block_height?.toString() || '0'}`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(Number(log.timestamp) / 1000000),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {getUserName(log.principal)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.action}
                      color={getActionColor(log.action)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.resource_type}</TableCell>
                  <TableCell>{log.resource_id}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Verify blockchain proof">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setSelectedEntryId(Number(log.id))}
                      >
                        <VerifiedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredLogs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No activity logs found</Typography>
        </Box>
      )}

      {/* Blockchain Verification Dialog */}
      <Dialog
        open={selectedEntryId !== null}
        onClose={() => setSelectedEntryId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Blockchain Verification</DialogTitle>
        <DialogContent>
          {selectedEntryId !== null && (
            <BlockchainVerification entryId={selectedEntryId} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEntryId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Chain Verification Dialog */}
      <Dialog
        open={showChainVerification}
        onClose={() => setShowChainVerification(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Verify Entire Blockchain Chain</DialogTitle>
        <DialogContent>
          <ChainVerification />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChainVerification(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ActivityLog;

