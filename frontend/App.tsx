
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/errors/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from './constants';
import ToastContainer from './components/ToastContainer';
import { QueryProvider } from './providers/QueryProvider';
import MapsErrorHandler from './components/MapsErrorHandler';

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoadOrchestrationPage = lazy(() => import('./pages/LoadOrchestrationPage'));
const VisibilitySecurityPage = lazy(() => import('./pages/VisibilitySecurityPage'));
const AnalyticsPage = lazy(() => import('./pages/SustainabilityPage'));
const SettingsPage = lazy(() => import('./pages/CollaborationPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <AuthProvider>
            <ToastProvider>
              <ToastContainer />
              <MapsErrorHandler />
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public routes that don't use the main layout */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Routes that use the main layout */}
                  <Route element={<Layout />}>
                    {/* Publicly accessible route within the layout */}
                    <Route path="/" element={<HomePage />} />

                    {/* Protected routes within the layout */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/loads" element={<LoadOrchestrationPage />} />
                      <Route path="/shipments" element={<VisibilitySecurityPage />} />
                      <Route path="/alerts" element={<AlertsPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />

                      {/* Old path redirects */}
                      <Route path="load-orchestration" element={<Navigate to="/loads" replace />} />
                      <Route path="visibility-security" element={<Navigate to="/shipments" replace />} />
                      <Route path="sustainability" element={<Navigate to="/analytics" replace />} />
                      <Route path="collaboration" element={<Navigate to="/settings" replace />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </ToastProvider>
          </AuthProvider>
        </APIProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
