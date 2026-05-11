import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Suppliers from './pages/Suppliers';
import Insights from './pages/Insights';
import AuthGuard from './components/AuthGuard';
import { SearchProvider } from './hooks/useSearch';
import { SidebarProvider } from './hooks/useSidebar';

function App() {
  return (
    <SidebarProvider>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/admin" element={<AuthGuard allowedRoles={['admin', 'warehouse_manager']}><Admin /></AuthGuard>} />
            <Route path="/suppliers" element={<AuthGuard><Suppliers /></AuthGuard>} />
            <Route path="/insights" element={<AuthGuard><Insights /></AuthGuard>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </SearchProvider>
    </SidebarProvider>
  );
}

export default App;
