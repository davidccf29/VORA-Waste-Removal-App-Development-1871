import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiDollarSign, FiMapPin, FiClock, FiInfo, FiPlus, FiTrash2, FiSave } = FiIcons;

const SystemSetup = () => {
  const { systemConfig, updateSystemConfig } = useSystem();
  const [activeTab, setActiveTab] = useState('waste-types');
  const [newWasteType, setNewWasteType] = useState({ name: '', price: '' });
  const [newServiceArea, setNewServiceArea] = useState('');

  const tabs = [
    { id: 'waste-types', label: 'Waste Types', icon: FiSettings },
    { id: 'service-areas', label: 'Service Areas', icon: FiMapPin },
    { id: 'business-hours', label: 'Business Hours', icon: FiClock },
    { id: 'company-info', label: 'Company Info', icon: FiInfo }
  ];

  const handleAddWasteType = () => {
    if (newWasteType.name && newWasteType.price) {
      const updatedWasteTypes = [
        ...systemConfig.wasteTypes,
        {
          id: newWasteType.name.toLowerCase().replace(/\s+/g, '-'),
          name: newWasteType.name,
          price: parseInt(newWasteType.price)
        }
      ];
      updateSystemConfig({ wasteTypes: updatedWasteTypes });
      setNewWasteType({ name: '', price: '' });
    }
  };

  const handleRemoveWasteType = (id) => {
    const updatedWasteTypes = systemConfig.wasteTypes.filter(type => type.id !== id);
    updateSystemConfig({ wasteTypes: updatedWasteTypes });
  };

  const handleUpdateWasteType = (id, field, value) => {
    const updatedWasteTypes = systemConfig.wasteTypes.map(type =>
      type.id === id ? { ...type, [field]: field === 'price' ? parseInt(value) : value } : type
    );
    updateSystemConfig({ wasteTypes: updatedWasteTypes });
  };

  const handleAddServiceArea = () => {
    if (newServiceArea) {
      const updatedServiceAreas = [...systemConfig.serviceAreas, newServiceArea];
      updateSystemConfig({ serviceAreas: updatedServiceAreas });
      setNewServiceArea('');
    }
  };

  const handleRemoveServiceArea = (index) => {
    const updatedServiceAreas = systemConfig.serviceAreas.filter((_, i) => i !== index);
    updateSystemConfig({ serviceAreas: updatedServiceAreas });
  };

  const handleBusinessHoursUpdate = (field, value) => {
    updateSystemConfig({
      businessHours: {
        ...systemConfig.businessHours,
        [field]: value
      }
    });
  };

  const handleCompanyInfoUpdate = (field, value) => {
    updateSystemConfig({
      companyInfo: {
        ...systemConfig.companyInfo,
        [field]: value
      }
    });
  };

  const renderWasteTypesTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">Add New Waste Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Waste type name"
            value={newWasteType.name}
            onChange={(e) => setNewWasteType({ ...newWasteType, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Price ($)"
            value={newWasteType.price}
            onChange={(e) => setNewWasteType({ ...newWasteType, price: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleAddWasteType}
            className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Existing Waste Types</h3>
        {systemConfig.wasteTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <input
              type="text"
              value={type.name}
              onChange={(e) => handleUpdateWasteType(type.id, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-gray-500" />
              <input
                type="number"
                value={type.price}
                onChange={(e) => handleUpdateWasteType(type.id, 'price', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleRemoveWasteType(type.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServiceAreasTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">Add New Service Area</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Service area name"
            value={newServiceArea}
            onChange={(e) => setNewServiceArea(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleAddServiceArea}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Service Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemConfig.serviceAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-gray-900">{area}</span>
              <button
                onClick={() => handleRemoveServiceArea(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBusinessHoursTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
          <input
            type="time"
            value={systemConfig.businessHours.start}
            onChange={(e) => handleBusinessHoursUpdate('start', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
          <input
            type="time"
            value={systemConfig.businessHours.end}
            onChange={(e) => handleBusinessHoursUpdate('end', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Operating Days</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={systemConfig.businessHours.days.includes(day)}
                onChange={(e) => {
                  const updatedDays = e.target.checked
                    ? [...systemConfig.businessHours.days, day]
                    : systemConfig.businessHours.days.filter(d => d !== day);
                  handleBusinessHoursUpdate('days', updatedDays);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">{day}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompanyInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={systemConfig.companyInfo.name}
            onChange={(e) => handleCompanyInfoUpdate('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={systemConfig.companyInfo.phone}
            onChange={(e) => handleCompanyInfoUpdate('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={systemConfig.companyInfo.email}
            onChange={(e) => handleCompanyInfoUpdate('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={systemConfig.companyInfo.address}
            onChange={(e) => handleCompanyInfoUpdate('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'waste-types': return renderWasteTypesTab();
      case 'service-areas': return renderServiceAreasTab();
      case 'business-hours': return renderBusinessHoursTab();
      case 'company-info': return renderCompanyInfoTab();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Setup</h1>
          <p className="text-gray-600 mt-1">Configure your waste management system</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <SafeIcon icon={FiSave} className="w-5 h-5" />
          <span className="text-sm font-medium">Auto-saved</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSetup;