import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomThemeProvider } from './ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from './components/NotificationSystem';
import Navigation from './components/Navigation';
import PageLayout from './components/PageLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import Organizations from './pages/Organizations';
import Entities from './pages/Entities';
import Clients from './pages/Clients';
import Engagements from './pages/Engagements';
import DataImport from './pages/DataImport';
import WorkingPapers from './pages/WorkingPapers';
import DocumentSubmission from './pages/DocumentSubmission';
import DocumentRequests from './pages/DocumentRequests';
import UserManagement from './pages/UserManagement';
import ActivityLog from './pages/ActivityLog';
import ClientPortal from './pages/ClientPortal';
import TrialBalance from './pages/TrialBalance';
import FinancialStatements from './pages/FinancialStatements';
import ClientAcceptance from './pages/ClientAcceptance';
import EngagementLetters from './pages/EngagementLetters';
import ConflictCheck from './pages/ConflictCheck';
import EngagementPlanning from './pages/EngagementPlanning';
import MockDataGenerator from './pages/MockDataGenerator';

function App() {
  return (
    <CustomThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Navigation />
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
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
              path="/document-requests"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <DocumentRequests />
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
            <Route
              path="/financial-statements"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <FinancialStatements />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            {<Route
              path="/client-acceptance"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <ClientAcceptance />
                  </PageLayout>
                </ProtectedRoute>
              }
            />}
            <Route
              path="/engagement-letters"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <EngagementLetters />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/conflict-check"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <ConflictCheck />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/engagement-planning"
              element={
                <ProtectedRoute requireFirmUser>
                  <PageLayout>
                    <EngagementPlanning />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-data"
              element={
                <ProtectedRoute requireAdmin>
                  <PageLayout>
                    <MockDataGenerator />
                  </PageLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
      </NotificationProvider>
    </CustomThemeProvider>
  );
}

export default App;

