import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './hooks/useAuth';
import Navigation from './components/Navigation';
import PageLayout from './components/PageLayout';
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
                <PageLayout>
                  <Organizations />
                </PageLayout>
              }
            />
            <Route
              path="/entities"
              element={
                <PageLayout>
                  <Entities />
                </PageLayout>
              }
            />
            <Route
              path="/clients"
              element={
                <PageLayout>
                  <Clients />
                </PageLayout>
              }
            />
            <Route
              path="/engagements"
              element={
                <PageLayout>
                  <Engagements />
                </PageLayout>
              }
            />
            <Route
              path="/data-import"
              element={
                <PageLayout>
                  <DataImport />
                </PageLayout>
              }
            />
            <Route
              path="/working-papers"
              element={
                <PageLayout>
                  <WorkingPapers />
                </PageLayout>
              }
            />
            <Route
              path="/documents"
              element={
                <PageLayout>
                  <DocumentSubmission />
                </PageLayout>
              }
            />
            <Route
              path="/users"
              element={
                <PageLayout>
                  <UserManagement />
                </PageLayout>
              }
            />
            <Route
              path="/activity-log"
              element={
                <PageLayout>
                  <ActivityLog />
                </PageLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

