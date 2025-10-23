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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { ActivityLogEntry } from '../types';
import { format } from 'date-fns';

const ActivityLog = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [filterAction, setFilterAction] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const loadLogs = async () => {
    try {
      const data = await call<ActivityLogEntry[]>('get_activity_logs', [[BigInt(limit)]]);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    }
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
      <Typography variant="h4" gutterBottom>
        {t('activityLog.title')}
      </Typography>

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
              <TableCell>{t('activityLog.timestamp')}</TableCell>
              <TableCell>{t('activityLog.user')}</TableCell>
              <TableCell>{t('activityLog.action')}</TableCell>
              <TableCell>{t('activityLog.resource')}</TableCell>
              <TableCell>Resource ID</TableCell>
              <TableCell>{t('activityLog.details')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => {
              const principalStr = typeof log.principal === 'string' 
                ? log.principal 
                : log.principal.toString();
              return (
                <TableRow key={log.id.toString()} hover>
                  <TableCell>
                    {format(
                      new Date(Number(log.timestamp) / 1000000),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {principalStr.slice(0, 15)}...
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
    </Container>
  );
};

export default ActivityLog;

