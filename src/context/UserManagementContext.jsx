import React, { createContext, useContext, useState, useEffect } from 'react';

const UserManagementContext = createContext();

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
};

export const UserManagementProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    {
      id: 'customer',
      name: 'Customer',
      description: 'Can book waste removal services and view their bookings',
      permissions: ['book_service', 'view_own_bookings', 'edit_own_profile'],
      color: 'blue'
    },
    {
      id: 'contractor',
      name: 'Contractor',
      description: 'Can view assigned jobs and manage route optimization',
      permissions: ['view_assigned_jobs', 'update_job_status', 'optimize_routes', 'edit_own_profile'],
      color: 'green'
    },
    {
      id: 'administrator',
      name: 'Administrator',
      description: 'Full system access including user management and system configuration',
      permissions: [
        'manage_users', 'manage_roles', 'view_all_bookings', 'assign_contractors',
        'system_configuration', 'view_analytics', 'manage_payments', 'edit_any_profile'
      ],
      color: 'purple'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Can manage bookings and view reports but cannot modify system settings',
      permissions: [
        'view_all_bookings', 'assign_contractors', 'view_analytics', 
        'manage_contractors', 'edit_own_profile'
      ],
      color: 'orange'
    }
  ]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('voraUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default users
      const defaultUsers = [
        {
          id: 1,
          email: 'customer@vora.com',
          password: 'password',
          role: 'customer',
          name: 'John Customer',
          phone: '+1-555-0101',
          address: '123 Main St, City, State 12345',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: null
        },
        {
          id: 2,
          email: 'contractor@vora.com',
          password: 'password',
          role: 'contractor',
          name: 'Mike Contractor',
          phone: '+1-555-0123',
          address: '456 Oak Ave, City, State 12345',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: null,
          contractorInfo: {
            licenseNumber: 'WM-12345',
            serviceAreas: ['Downtown', 'North District'],
            vehicleType: 'Truck',
            capacity: '5 tons'
          }
        },
        {
          id: 3,
          email: 'admin@vora.com',
          password: 'password',
          role: 'administrator',
          name: 'Sarah Admin',
          phone: '+1-555-0456',
          address: '789 Admin Blvd, City, State 12345',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: null
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('voraUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('voraUsers', JSON.stringify(updatedUsers));
  };

  const createUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      avatar: null
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
  };

  const updateUser = (id, updates) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, ...updates } : user
    );
    saveUsers(updatedUsers);
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    saveUsers(updatedUsers);
  };

  const toggleUserStatus = (id) => {
    const updatedUsers = users.map(user =>
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
    saveUsers(updatedUsers);
  };

  const getUsersByRole = (role) => {
    return users.filter(user => user.role === role);
  };

  const getRoleById = (roleId) => {
    return roles.find(role => role.id === roleId);
  };

  const hasPermission = (userRole, permission) => {
    const role = getRoleById(userRole);
    return role ? role.permissions.includes(permission) : false;
  };

  const createRole = (roleData) => {
    const newRole = {
      ...roleData,
      id: roleData.name.toLowerCase().replace(/\s+/g, '_'),
    };
    setRoles([...roles, newRole]);
  };

  const updateRole = (id, updates) => {
    const updatedRoles = roles.map(role =>
      role.id === id ? { ...role, ...updates } : role
    );
    setRoles(updatedRoles);
  };

  const deleteRole = (id) => {
    // Check if any users have this role
    const usersWithRole = users.filter(user => user.role === id);
    if (usersWithRole.length > 0) {
      throw new Error(`Cannot delete role. ${usersWithRole.length} users are assigned to this role.`);
    }
    const updatedRoles = roles.filter(role => role.id !== id);
    setRoles(updatedRoles);
  };

  const value = {
    users,
    roles,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUsersByRole,
    getRoleById,
    hasPermission,
    createRole,
    updateRole,
    deleteRole
  };

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
};