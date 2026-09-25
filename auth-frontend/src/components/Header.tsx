
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <FiMenu size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">SuperAdmin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
