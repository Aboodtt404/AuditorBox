import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit,
  CheckCircle,
  Schedule,
  TrendingUp,
  AttachMoney,
  Warning,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';

interface Engagement {
  id: bigint;
  name: string;
  description: string;
  start_date: bigint;
  end_date: bigint;
  status: string;
}

interface Milestone {
  id: bigint;
  engagement_id: bigint;
  name: string;
  description: string;
  due_date: bigint;
  status: any;
  assigned_to: [] | [string];
  estimated_hours: number;
  actual_hours: number;
  completed_date: [] | [bigint];
  completed_by: [] | [string];
}

interface Budget {
  id: bigint;
  engagement_id: bigint;
  total_budgeted_hours: number;
  total_actual_hours: number;
  total_budgeted_fee: number;
  total_actual_fee: number;
  partner_hours: number;
  manager_hours: number;
  senior_hours: number;
  staff_hours: number;
}

interface TimeEntry {
  id: bigint;
  engagement_id: bigint;
  user_id: string;
  date: bigint;
  hours: number;
  description: string;
  billable: boolean;
  created_at: bigint;
}

interface Dashboard {
  engagement: Engagement;
  budget: [] | [Budget];
  milestones: Milestone[];
  completion_percentage: number;
  budget_utilization: number;
  on_schedule: boolean;
  at_risk_milestones: Milestone[];
  recent_time_entries: TimeEntry[];
}

export default function EngagementPlanning() {
  const { call } = useBackend();
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<bigint | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [timeEntryDialogOpen, setTimeEntryDialogOpen] = useState(false);
  const [milestoneFormData, setMilestoneFormData] = useState({
    name: '',
    description: '',
    due_date: '',
    estimated_hours: '',
  });
  const [budgetFormData, setBudgetFormData] = useState({
    total_budgeted_hours: '',
    partner_hours: '',
    manager_hours: '',
    senior_hours: '',
    staff_hours: '',
    partner_rate: '',
    manager_rate: '',
    senior_rate: '',
    staff_rate: '',
  });
  const [timeEntryFormData, setTimeEntryFormData] = useState({
    milestone_id: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
    billable: true,
  });

  useEffect(() => {
    loadEngagements();
  }, []);

  const loadEngagements = async () => {
    try {
      const result = await call<Engagement[]>('list_engagements');
      setEngagements(result);
    } catch (error) {
      console.error('Failed to load engagements:', error);
    }
  };

  const loadDashboard = async (engagementId: bigint) => {
    try {
      const result = await call<{ Ok: Dashboard } | { Err: string } | Dashboard>(
        'get_engagement_dashboard',
        [engagementId]
      );
      if ('Ok' in result) {
        setDashboard(result.Ok);
      } else if ('Err' in result) {
        console.error('Error from backend:', result.Err);
      } else {
        // Direct dashboard object (fallback)
        setDashboard(result as Dashboard);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  const handleCreateMilestone = async () => {
    if (!selectedEngagement) return;

    try {
      const request = {
        engagement_id: selectedEngagement,
        name: milestoneFormData.name,
        description: milestoneFormData.description,
        due_date: BigInt(new Date(milestoneFormData.due_date).getTime() * 1000000),
        assigned_to: [],
        estimated_hours: parseFloat(milestoneFormData.estimated_hours),
      };

      await call('create_milestone', [request]);
      setMilestoneDialogOpen(false);
      loadDashboard(selectedEngagement);
      alert('Milestone created successfully!');
      resetMilestoneForm();
    } catch (error) {
      console.error('Failed to create milestone:', error);
      alert('Failed to create milestone. Please try again.');
    }
  };

  const handleCreateBudget = async () => {
    if (!selectedEngagement) return;

    try {
      const request = {
        engagement_id: selectedEngagement,
        total_budgeted_hours: parseFloat(budgetFormData.total_budgeted_hours),
        partner_hours: parseFloat(budgetFormData.partner_hours),
        manager_hours: parseFloat(budgetFormData.manager_hours),
        senior_hours: parseFloat(budgetFormData.senior_hours),
        staff_hours: parseFloat(budgetFormData.staff_hours),
        partner_rate: parseFloat(budgetFormData.partner_rate),
        manager_rate: parseFloat(budgetFormData.manager_rate),
        senior_rate: parseFloat(budgetFormData.senior_rate),
        staff_rate: parseFloat(budgetFormData.staff_rate),
      };

      await call('create_budget', [request]);
      setBudgetDialogOpen(false);
      loadDashboard(selectedEngagement);
      alert('Budget created successfully!');
      resetBudgetForm();
    } catch (error) {
      console.error('Failed to create budget:', error);
      alert('Failed to create budget. Please try again.');
    }
  };

  const handleCreateTimeEntry = async () => {
    if (!selectedEngagement) return;

    try {
      const request = {
        engagement_id: selectedEngagement,
        milestone_id: timeEntryFormData.milestone_id
          ? [BigInt(timeEntryFormData.milestone_id)]
          : [],
        date: BigInt(new Date(timeEntryFormData.date).getTime() * 1000000),
        hours: parseFloat(timeEntryFormData.hours),
        description: timeEntryFormData.description,
        billable: timeEntryFormData.billable,
      };

      await call('create_time_entry', [request]);
      setTimeEntryDialogOpen(false);
      loadDashboard(selectedEngagement);
      alert('Time entry recorded successfully!');
      resetTimeEntryForm();
    } catch (error) {
      console.error('Failed to create time entry:', error);
      alert('Failed to record time entry. Please try again.');
    }
  };

  const resetMilestoneForm = () => {
    setMilestoneFormData({
      name: '',
      description: '',
      due_date: '',
      estimated_hours: '',
    });
  };

  const resetBudgetForm = () => {
    setBudgetFormData({
      total_budgeted_hours: '',
      partner_hours: '',
      manager_hours: '',
      senior_hours: '',
      staff_hours: '',
      partner_rate: '',
      manager_rate: '',
      senior_rate: '',
      staff_rate: '',
    });
  };

  const resetTimeEntryForm = () => {
    setTimeEntryFormData({
      milestone_id: '',
      date: new Date().toISOString().split('T')[0],
      hours: '',
      description: '',
      billable: true,
    });
  };

  const getMilestoneStatusColor = (status: any) => {
    const statusKey = Object.keys(status)[0];
    switch (statusKey) {
      case 'Completed':
        return 'success';
      case 'InProgress':
        return 'info';
      case 'Blocked':
        return 'error';
      case 'Cancelled':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getMilestoneStatus = (status: any) => {
    return Object.keys(status)[0].replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Engagement Planning Dashboard
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Engagement</InputLabel>
          <Select
            value={selectedEngagement?.toString() || ''}
            onChange={(e) => {
              const engId = BigInt(e.target.value);
              setSelectedEngagement(engId);
              loadDashboard(engId);
            }}
            label="Select Engagement"
          >
            {engagements.map((eng) => (
              <MenuItem key={eng.id.toString()} value={eng.id.toString()}>
                {eng.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {dashboard && (
          <>
            {!dashboard.on_schedule && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="subtitle2">
                  ⚠️ {dashboard.at_risk_milestones.length} milestone(s) are overdue or at risk!
                </Typography>
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="textSecondary">
                        Completion
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {dashboard.completion_percentage.toFixed(0)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={dashboard.completion_percentage}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney color="success" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="textSecondary">
                        Budget Used
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {dashboard.budget_utilization.toFixed(0)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={dashboard.budget_utilization}
                      color={dashboard.budget_utilization > 100 ? 'error' : 'success'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Schedule color="info" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="textSecondary">
                        Milestones
                      </Typography>
                    </Box>
                    <Typography variant="h4">{dashboard.milestones.length}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Total milestones
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {dashboard.on_schedule ? (
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                      ) : (
                        <Warning color="warning" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="subtitle2" color="textSecondary">
                        Schedule Status
                      </Typography>
                    </Box>
                    <Typography variant="h5">
                      {dashboard.on_schedule ? 'On Track' : 'At Risk'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Milestones</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setMilestoneDialogOpen(true)}
                >
                  Add Milestone
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Est. Hours</TableCell>
                      <TableCell>Actual Hours</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard.milestones.map((milestone) => (
                      <TableRow key={milestone.id.toString()}>
                        <TableCell>{milestone.name}</TableCell>
                        <TableCell>
                          {new Date(Number(milestone.due_date) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getMilestoneStatus(milestone.status)}
                            color={getMilestoneStatusColor(milestone.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{milestone.estimated_hours}h</TableCell>
                        <TableCell>{milestone.actual_hours}h</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {dashboard.budget.length > 0 && dashboard.budget[0] && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Budget Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Budgeted Hours:
                    </Typography>
                    <Typography variant="h6">
                      {dashboard.budget[0].total_budgeted_hours}h
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Budgeted Fee:
                    </Typography>
                    <Typography variant="h6">
                      ${dashboard.budget[0].total_budgeted_fee.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {dashboard.budget.length === 0 && (
              <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  No budget set for this engagement
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setBudgetDialogOpen(true)}
                >
                  Create Budget
                </Button>
              </Paper>
            )}

            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Time Tracking</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setTimeEntryDialogOpen(true)}
                >
                  Log Time
                </Button>
              </Box>

              {dashboard.recent_time_entries.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Hours</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Billable</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard.recent_time_entries.map((entry, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            {new Date(Number(entry.date) / 1000000).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{entry.hours}h</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>
                            <Chip
                              label={entry.billable ? 'Yes' : 'No'}
                              color={entry.billable ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                  No time entries logged yet.
                </Typography>
              )}
            </Paper>
          </>
        )}

        {!dashboard && selectedEngagement !== null && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">Loading dashboard...</Typography>
          </Paper>
        )}

        {selectedEngagement === null && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">Select an engagement to view the dashboard</Typography>
          </Paper>
        )}
      </Box>

      <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Milestone</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Milestone Name"
              required
              value={milestoneFormData.name}
              onChange={(e) => setMilestoneFormData({ ...milestoneFormData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={milestoneFormData.description}
              onChange={(e) =>
                setMilestoneFormData({ ...milestoneFormData, description: e.target.value })
              }
            />
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              required
              InputLabelProps={{ shrink: true }}
              value={milestoneFormData.due_date}
              onChange={(e) => setMilestoneFormData({ ...milestoneFormData, due_date: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Estimated Hours"
              required
              value={milestoneFormData.estimated_hours}
              onChange={(e) =>
                setMilestoneFormData({ ...milestoneFormData, estimated_hours: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMilestoneDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateMilestone}
            variant="contained"
            disabled={
              !milestoneFormData.name || !milestoneFormData.due_date || !milestoneFormData.estimated_hours
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={budgetDialogOpen} onClose={() => setBudgetDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Budget</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Total Budgeted Hours"
              required
              value={budgetFormData.total_budgeted_hours}
              onChange={(e) =>
                setBudgetFormData({ ...budgetFormData, total_budgeted_hours: e.target.value })
              }
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Partner Hours"
                  value={budgetFormData.partner_hours}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, partner_hours: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Partner Rate"
                  value={budgetFormData.partner_rate}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, partner_rate: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Manager Hours"
                  value={budgetFormData.manager_hours}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, manager_hours: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Manager Rate"
                  value={budgetFormData.manager_rate}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, manager_rate: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Senior Hours"
                  value={budgetFormData.senior_hours}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, senior_hours: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Senior Rate"
                  value={budgetFormData.senior_rate}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, senior_rate: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Staff Hours"
                  value={budgetFormData.staff_hours}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, staff_hours: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Staff Rate"
                  value={budgetFormData.staff_rate}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, staff_rate: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBudgetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateBudget} variant="contained">
            Create Budget
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={timeEntryDialogOpen} onClose={() => setTimeEntryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Time Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              required
              InputLabelProps={{ shrink: true }}
              value={timeEntryFormData.date}
              onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, date: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Hours"
              required
              value={timeEntryFormData.hours}
              onChange={(e) => setTimeEntryFormData({ ...timeEntryFormData, hours: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              required
              multiline
              rows={2}
              value={timeEntryFormData.description}
              onChange={(e) =>
                setTimeEntryFormData({ ...timeEntryFormData, description: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={timeEntryFormData.billable}
                  onChange={(e) =>
                    setTimeEntryFormData({ ...timeEntryFormData, billable: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Billable"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeEntryDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTimeEntry}
            variant="contained"
            disabled={!timeEntryFormData.hours || !timeEntryFormData.description}
          >
            Log Time
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

