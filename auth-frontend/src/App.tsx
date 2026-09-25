
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { PermissionProvider } from './context/Permissioncontext';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<div className="text-gray-600">Users Page Placeholder</div>} />
          <Route path="roles" element={<div className="text-gray-600">Roles Page Placeholder</div>} />
          <Route path="settings" element={<div className="text-gray-600">Settings Page Placeholder</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
