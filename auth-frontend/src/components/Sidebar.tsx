import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiShield } from 'react-icons/fi';
import { usePermission } from '../context/Permissioncontext';
const Sidebar: React.FC = () => {
  const { hasRouteAccess } = usePermission();
  console.log(hasRouteAccess);

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FiHome />, pageName: "dashboard" },
    { path: '/users', name: 'Users', icon: <FiUsers />, pageName: "users" },
    { path: '/roles', name: 'Roles', icon: <FiShield />, pageName: "roles" },
    { path: '/settings', name: 'Settings', icon: <FiSettings />, pageName: "settings" },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">AuthGuard</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          hasRouteAccess(item.pageName, "view") && (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          )
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
