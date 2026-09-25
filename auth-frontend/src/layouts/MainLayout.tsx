
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { PermissionProvider } from '../context/Permissioncontext';
import { cookies, STORAGE_KEYS } from '../storage';

const MainLayout = () => {
  const authToken = cookies.get(STORAGE_KEYS.AUTH_TOKEN);

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return (
    <PermissionProvider>
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </PermissionProvider>
  );
};

export default MainLayout;
