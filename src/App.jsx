import React from 'react';
import {HashRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import {AuthProvider} from './context/AuthContext';
import {BookingProvider} from './context/BookingContext';
import {SystemProvider} from './context/SystemContext';
import {UserManagementProvider} from './context/UserManagementContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingForm from './pages/BookingForm';
import SystemSetup from './pages/SystemSetup';
import ContractorManagement from './pages/ContractorManagement';
import ProtectedRoute from './components/ProtectedRoute';
import HelpHub from './components/HelpHub';
import questConfig from './config/questConfig';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <AuthProvider>
        <UserManagementProvider>
          <SystemProvider>
            <BookingProvider>
              <Router>
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      {/* Customer Routes */}
                      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['customer']}> <CustomerDashboard /> </ProtectedRoute>} />
                      <Route path="/book" element={<ProtectedRoute allowedRoles={['customer']}> <BookingForm /> </ProtectedRoute>} />
                      {/* Contractor Routes */}
                      <Route path="/contractor" element={<ProtectedRoute allowedRoles={['contractor']}> <ContractorDashboard /> </ProtectedRoute>} />
                      {/* Admin Routes */}
                      <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrator']}> <AdminDashboard /> </ProtectedRoute>} />
                      <Route path="/contractor-management" element={<ProtectedRoute allowedRoles={['administrator']}> <ContractorManagement /> </ProtectedRoute>} />
                      <Route path="/system-setup" element={<ProtectedRoute allowedRoles={['administrator']}> <SystemSetup /> </ProtectedRoute>} />
                    </Route>
                  </Routes>
                  <HelpHub />
                </div>
              </Router>
            </BookingProvider>
          </SystemProvider>
        </UserManagementProvider>
      </AuthProvider>
    </QuestProvider>
  );
}

export default App;