import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiPlus, FiTruck, FiSettings, FiUsers, FiCalendar } = FiIcons;

const Sidebar = () => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'customer':
        return [
          { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/book', icon: FiPlus, label: 'Book Service' }
        ];
      case 'contractor':
        return [
          { to: '/contractor', icon: FiTruck, label: 'My Assignments' }
        ];
      case 'administrator':
        return [
          { to: '/admin', icon: FiHome, label: 'Admin Dashboard' },
          { to: '/system-setup', icon: FiSettings, label: 'System Setup' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;