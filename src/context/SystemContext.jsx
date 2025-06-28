import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  const [systemConfig, setSystemConfig] = useState({
    wasteTypes: [
      { id: 'general', name: 'General Waste', price: 50 },
      { id: 'recyclable', name: 'Recyclable Materials', price: 30 },
      { id: 'hazardous', name: 'Hazardous Waste', price: 100 },
      { id: 'electronic', name: 'Electronic Waste', price: 75 },
      { id: 'construction', name: 'Construction Debris', price: 120 }
    ],
    serviceAreas: [
      'Downtown',
      'North District',
      'South District',
      'East Side',
      'West Side',
      'Suburbs'
    ],
    businessHours: {
      start: '08:00',
      end: '18:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    companyInfo: {
      name: 'VORA Waste Management',
      phone: '+1-800-VORA-WASTE',
      email: 'info@vora.com',
      address: '456 Industrial Blvd, City, State 12345'
    }
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('voraSystemConfig');
    if (savedConfig) {
      setSystemConfig(JSON.parse(savedConfig));
    }
  }, []);

  const updateSystemConfig = (updates) => {
    const newConfig = { ...systemConfig, ...updates };
    setSystemConfig(newConfig);
    localStorage.setItem('voraSystemConfig', JSON.stringify(newConfig));
  };

  const value = {
    systemConfig,
    updateSystemConfig
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};