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
  CircularProgress,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Info as InfoIcon,
  Undo as UndoIcon,
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
  const [revertingEntryId, setRevertingEntryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const loadLogs = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (principal: any): string => {
    const principalStr = typeof principal === 'string' 
      ? principal 
      : principal.toString();
    return users.get(principalStr) || principalStr.slice(0, 15) + '...';
  };

  const getActionColor = (action: string) => {
    const normalized = action.toLowerCase();
    if (normalized.startsWith('create') || normalized.startsWith('revert_create')) {
      return 'success';
    }
    if (normalized.startsWith('update') || normalized.startsWith('revert_update')) {
      return 'info';
    }
    if (normalized.startsWith('delete') || normalized.startsWith('revert_delete')) {
      return 'error';
    }
    if (normalized.includes('import')) {
      return 'warning';
    }
    if (normalized.includes('upload')) {
      return 'primary';
    }
    return 'default';
  };

  const hasSnapshot = (entry: ActivityLogEntry): boolean => {
    if (!('snapshot' in entry)) return false;
    const snapshot = (entry as any).snapshot;
    if (!snapshot) return false;
    if (Array.isArray(snapshot)) {
      return snapshot.length > 0;
    }
    return true;
  };

  const handleRevert = async (entry: ActivityLogEntry) => {
    if (!hasSnapshot(entry)) {
      alert(t('activityLog.revertUnavailable'));
      return;
    }

    if (!window.confirm(t('activityLog.revertConfirm', { id: entry.id.toString() }))) {
      return;
    }

    try {
      setRevertingEntryId(Number(entry.id));
      await call('revert_activity_entry', [entry.id]);
      await loadLogs();
      alert(t('activityLog.revertSuccess'));
    } catch (error) {
      console.error('Failed to revert entry:', error);
      alert(t('activityLog.revertFailure'));
    } finally {
      setRevertingEntryId(null);
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
          {t('activityLog.verifyChain')}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }} icon={<InfoIcon />}>
        <Typography variant="body2">
          {t('activityLog.blockchainInfo')}
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
              <MenuItem value="">{t('activityLog.allActions')}</MenuItem>
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
              <MenuItem value="">{t('activityLog.allResources')}</MenuItem>
              {uniqueResources.map((resource) => (
                <MenuItem key={resource} value={resource}>
                  {resource}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('activityLog.limit')}</InputLabel>
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
              <TableCell>{t('activityLog.blockHeight')}</TableCell>
              <TableCell>{t('activityLog.timestamp')}</TableCell>
              <TableCell>{t('activityLog.user')}</TableCell>
              <TableCell>{t('activityLog.action')}</TableCell>
              <TableCell>{t('activityLog.resource')}</TableCell>
              <TableCell>{t('activityLog.resourceId')}</TableCell>
              <TableCell>{t('activityLog.details')}</TableCell>
              <TableCell align="center">{t('activityLog.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => {
              const entryIdNumber = Number(log.id);
              const isReverting = revertingEntryId === entryIdNumber;
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
                    <Tooltip title={t('activityLog.verifyEntry')}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setSelectedEntryId(Number(log.id))}
                      >
                        <VerifiedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('activityLog.revert')}>
                      <span>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => handleRevert(log)}
                          disabled={isReverting || !hasSnapshot(log) || log.action.startsWith('revert_')}
                        >
                          {isReverting ? (
                            <CircularProgress size={16} />
                          ) : (
                            <UndoIcon fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredLogs.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">{t('activityLog.noLogs')}</Typography>
        </Box>
      )}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Blockchain Verification Dialog */}
      <Dialog
        open={selectedEntryId !== null}
        onClose={() => setSelectedEntryId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('activityLog.verifyDialogTitle')}</DialogTitle>
        <DialogContent>
          {selectedEntryId !== null && (
            <BlockchainVerification entryId={selectedEntryId} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEntryId(null)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Chain Verification Dialog */}
      <Dialog
        open={showChainVerification}
        onClose={() => setShowChainVerification(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('activityLog.verifyChainTitle')}</DialogTitle>
        <DialogContent>
          <ChainVerification />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChainVerification(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ActivityLog;

