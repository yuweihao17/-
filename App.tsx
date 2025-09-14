import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import { NotificationProvider } from './hooks/useNotifications';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import DormAllocation from './pages/DormAllocation';
import RepairRequests from './pages/RepairRequests';
import HygieneCheck from './pages/HygieneCheck';
import VisitorLog from './pages/VisitorLog';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/allocation" element={<DormAllocation />} />
        <Route path="/repairs" element={<RepairRequests />} />
        <Route path="/hygiene" element={<HygieneCheck />} />
        <Route path="/visitors" element={<VisitorLog />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MainLayout>
  );
};

export default App;