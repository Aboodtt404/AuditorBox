import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './hooks/useAuth';
import Navigation from './components/Navigation';
import PageLayout from './components/PageLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Organizations from './pages/Organizations';
import Entities from './pages/Entities';
import Clients from './pages/Clients';
import Engagements from './pages/Engagements';
import DataImport from './pages/DataImport';
import WorkingPapers from './pages/WorkingPapers';
import DocumentSubmission from './pages/DocumentSubmission';
import UserManagement from './pages/UserManagement';
import ActivityLog from './pages/ActivityLog';
import ClientPortal from './pages/ClientPortal';
import TrialBalance from './pages/TrialBalance';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/profile"
              element={
                <PageLayout>
                  <Profile />
                </PageLayout>
              }
            />
            <Route
              path="/organizations"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <Organizations />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/entities"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <Entities />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <Clients />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/engagements"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <Engagements />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-import"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <DataImport />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/working-papers"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <WorkingPapers />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <DocumentSubmission />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAdmin>
                  <PageLayout>
                    <UserManagement />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity-log"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <ActivityLog />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-portal"
              element={
                <PageLayout>
                  <ClientPortal />
                </PageLayout>
              }
            />
            <Route
              path="/trial-balance"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <TrialBalance />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

