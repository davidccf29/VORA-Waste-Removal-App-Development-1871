import React from 'react';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLogOut, FiBell } = FiIcons;

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600">VORA</h1>
          <span className="text-gray-500">|</span>
          <span className="text-gray-600 capitalize">{user?.role} Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <SafeIcon icon={FiBell} className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;