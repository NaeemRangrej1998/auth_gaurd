import { useState } from 'react';
import { FiMenu, FiBell, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cookies, STORAGE_KEYS } from '../storage';
import { setUsersData } from '../redux/slices/userSlice';

const Header = () => {
  const usersData = useSelector((state: any) => state.users.usersData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setTimeout(() => {
      cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
      dispatch(setUsersData([]));
      navigate('/login');
    }, 1000);

  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <div
            className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {usersData?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{usersData?.userName || 'User'}</p>
              <p className="text-xs text-gray-500">User Profile</p>
            </div>
            <FiChevronDown className="text-gray-500" />
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
