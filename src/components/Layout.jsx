import React from 'react';
import {Outlet,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout=()=> {
  const {user}=useAuth();
  const navigate=useNavigate();

  React.useEffect(()=> {
    if (!user) {
      navigate('/login');
    }
  },[user,navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50" style={{ position: 'relative' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;