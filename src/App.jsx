import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { SystemProvider } from './context/SystemContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingForm from './pages/BookingForm';
import SystemSetup from './pages/SystemSetup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SystemProvider>
        <BookingProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Customer Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/book" 
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <BookingForm />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Contractor Routes */}
                  <Route 
                    path="/contractor" 
                    element={
                      <ProtectedRoute allowedRoles={['contractor']}>
                        <ContractorDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute allowedRoles={['administrator']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/system-setup" 
                    element={
                      <ProtectedRoute allowedRoles={['administrator']}>
                        <SystemSetup />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
              </Routes>
            </div>
          </Router>
        </BookingProvider>
      </SystemProvider>
    </AuthProvider>
  );
}

export default App;