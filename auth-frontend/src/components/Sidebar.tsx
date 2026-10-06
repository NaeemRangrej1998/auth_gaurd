import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { usePermission } from '../context/Permissioncontext';
import { menuItems } from '../enum/Navigation';
const Sidebar: React.FC = () => {
  const { hasRouteAccess } = usePermission();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  useEffect(() => {
    setOpenSubMenus(prev => {
      const newState = { ...prev };
      menuItems.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some(child => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`));
          if (isChildActive) {
            newState[item.name] = true;
          } else {
            newState[item.name] = false;
          }
        }
      });
      return newState;
    });
  }, [location.pathname]);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== name) newState[key] = false;
      });
      newState[name] = !prev[name];
      return newState;
    });
  };


  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 h-screen bg-white border-r border-gray-200 flex flex-col relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-blue-600 shadow-sm z-10"
      >
        {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>

      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className={`text-xl font-bold text-blue-600 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>AuthGuard</h1>
        {isCollapsed && <h1 className="text-xl font-bold text-blue-600">AG</h1>}
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          if (item.children) {
            const visibleChildren = item.children.filter(child => hasRouteAccess(child.pageName, "view"));
            if (visibleChildren.length === 0) return null;
          } else {
            if (!hasRouteAccess(item.pageName, "view")) return null;
          }

          if (item.children) {
            const isOpen = openSubMenus[item.name];

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => {
                    if (isCollapsed) setIsCollapsed(false);
                    toggleSubMenu(item.name);
                  }}
                  title={isCollapsed ? item.name : undefined}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-gray-400">
                      {isOpen ? <FiChevronLeft className="-rotate-90" /> : <FiChevronLeft className="rotate-180" />}
                    </span>
                  )}
                </button>
                {isOpen && !isCollapsed && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.children.map(child => (
                      hasRouteAccess(child.pageName, "view") && (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${isActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                        >
                          <span className="whitespace-nowrap">{child.name}</span>
                        </NavLink>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path!}
              to={item.path!}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
