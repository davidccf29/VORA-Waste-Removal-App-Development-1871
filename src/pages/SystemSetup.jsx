import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiSettings, FiDollarSign, FiMapPin, FiClock, FiInfo, FiPlus, FiTrash2, 
  FiSave, FiKey, FiCreditCard, FiEye, FiEyeOff, FiCheck, FiX, FiLoader 
} = FiIcons;

const SystemSetup = () => {
  const { systemConfig, updateSystemConfig, updateApiKey, validateApiKey } = useSystem();
  const [activeTab, setActiveTab] = useState('waste-types');
  const [newWasteType, setNewWasteType] = useState({ name: '', price: '' });
  const [newServiceArea, setNewServiceArea] = useState('');
  const [showApiKeys, setShowApiKeys] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [isValidating, setIsValidating] = useState({});

  const tabs = [
    { id: 'waste-types', label: 'Waste Types', icon: FiSettings },
    { id: 'service-areas', label: 'Service Areas', icon: FiMapPin },
    { id: 'business-hours', label: 'Business Hours', icon: FiClock },
    { id: 'company-info', label: 'Company Info', icon: FiInfo },
    { id: 'api-keys', label: 'API Keys', icon: FiKey },
    { id: 'payments', label: 'Payment Settings', icon: FiCreditCard }
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
      businessHours: { ...systemConfig.businessHours, [field]: value }
    });
  };

  const handleCompanyInfoUpdate = (field, value) => {
    updateSystemConfig({
      companyInfo: { ...systemConfig.companyInfo, [field]: value }
    });
  };

  const handleApiKeyUpdate = async (provider, field, value) => {
    const updatedKey = { [field]: value };
    if (field === 'enabled') {
      updatedKey.enabled = value;
    }
    updateApiKey(provider, updatedKey);

    // Validate key if it's being updated and enabled
    if (field === 'key' && value && systemConfig.apiKeys[provider].enabled) {
      setIsValidating({ ...isValidating, [provider]: true });
      try {
        const validation = await validateApiKey(provider, value);
        setValidationStatus({ ...validationStatus, [provider]: validation });
      } catch (error) {
        setValidationStatus({ ...validationStatus, [provider]: { valid: false, message: 'Validation failed' } });
      }
      setIsValidating({ ...isValidating, [provider]: false });
    }
  };

  const handlePaymentSettingsUpdate = (field, value) => {
    updateSystemConfig({
      paymentSettings: { ...systemConfig.paymentSettings, [field]: value }
    });
  };

  const handlePaymentMethodUpdate = (method, enabled) => {
    updateSystemConfig({
      paymentSettings: {
        ...systemConfig.paymentSettings,
        paymentMethods: { ...systemConfig.paymentSettings.paymentMethods, [method]: enabled }
      }
    });
  };

  const toggleShowApiKey = (provider, field) => {
    setShowApiKeys({
      ...showApiKeys,
      [`${provider}_${field}`]: !showApiKeys[`${provider}_${field}`]
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

  const renderApiKeysTab = () => (
    <div className="space-y-8">
      {/* Google Maps API */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiMapPin} className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Google Maps API</h3>
              <p className="text-sm text-gray-600">Required for route optimization and address validation</p>
            </div>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={systemConfig.apiKeys.googleMaps.enabled}
              onChange={(e) => handleApiKeyUpdate('googleMaps', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="relative">
              <input
                type={showApiKeys.googleMaps_key ? 'text' : 'password'}
                value={systemConfig.apiKeys.googleMaps.key}
                onChange={(e) => handleApiKeyUpdate('googleMaps', 'key', e.target.value)}
                placeholder="Enter your Google Maps API key"
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {isValidating.googleMaps && (
                  <SafeIcon icon={FiLoader} className="w-4 h-4 text-gray-400 animate-spin" />
                )}
                {validationStatus.googleMaps && !isValidating.googleMaps && (
                  <SafeIcon 
                    icon={validationStatus.googleMaps.valid ? FiCheck : FiX} 
                    className={`w-4 h-4 ${validationStatus.googleMaps.valid ? 'text-green-500' : 'text-red-500'}`} 
                  />
                )}
                <button
                  type="button"
                  onClick={() => toggleShowApiKey('googleMaps', 'key')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showApiKeys.googleMaps_key ? FiEyeOff : FiEye} className="w-4 h-4" />
                </button>
              </div>
            </div>
            {validationStatus.googleMaps && (
              <p className={`text-xs mt-1 ${validationStatus.googleMaps.valid ? 'text-green-600' : 'text-red-600'}`}>
                {validationStatus.googleMaps.message}
              </p>
            )}
          </div>
          {systemConfig.apiKeys.googleMaps.lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {new Date(systemConfig.apiKeys.googleMaps.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Stripe API */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900">Stripe Payment Processing</h3>
              <p className="text-sm text-gray-600">Required for customer payments and contractor payouts</p>
            </div>
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={systemConfig.apiKeys.stripe.enabled}
              onChange={(e) => handleApiKeyUpdate('stripe', 'enabled', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
            <div className="relative">
              <input
                type={showApiKeys.stripe_publishableKey ? 'text' : 'password'}
                value={systemConfig.apiKeys.stripe.publishableKey}
                onChange={(e) => handleApiKeyUpdate('stripe', 'publishableKey', e.target.value)}
                placeholder="pk_live_... or pk_test_..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => toggleShowApiKey('stripe', 'publishableKey')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showApiKeys.stripe_publishableKey ? FiEyeOff : FiEye} className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
            <div className="relative">
              <input
                type={showApiKeys.stripe_secretKey ? 'text' : 'password'}
                value={systemConfig.apiKeys.stripe.secretKey}
                onChange={(e) => handleApiKeyUpdate('stripe', 'secretKey', e.target.value)}
                placeholder="sk_live_... or sk_test_..."
                className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                {isValidating.stripe && (
                  <SafeIcon icon={FiLoader} className="w-4 h-4 text-gray-400 animate-spin" />
                )}
                {validationStatus.stripe && !isValidating.stripe && (
                  <SafeIcon 
                    icon={validationStatus.stripe.valid ? FiCheck : FiX} 
                    className={`w-4 h-4 ${validationStatus.stripe.valid ? 'text-green-500' : 'text-red-500'}`} 
                  />
                )}
                <button
                  type="button"
                  onClick={() => toggleShowApiKey('stripe', 'secretKey')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={showApiKeys.stripe_secretKey ? FiEyeOff : FiEye} className="w-4 h-4" />
                </button>
              </div>
            </div>
            {validationStatus.stripe && (
              <p className={`text-xs mt-1 ${validationStatus.stripe.valid ? 'text-green-600' : 'text-red-600'}`}>
                {validationStatus.stripe.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
            <div className="relative">
              <input
                type={showApiKeys.stripe_webhookSecret ? 'text' : 'password'}
                value={systemConfig.apiKeys.stripe.webhookSecret}
                onChange={(e) => handleApiKeyUpdate('stripe', 'webhookSecret', e.target.value)}
                placeholder="whsec_..."
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => toggleShowApiKey('stripe', 'webhookSecret')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={showApiKeys.stripe_webhookSecret ? FiEyeOff : FiEye} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {systemConfig.apiKeys.stripe.lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {new Date(systemConfig.apiKeys.stripe.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Security Notice</h4>
            <p className="text-sm text-yellow-700 mt-1">
              API keys are sensitive information. In production, store them securely using environment variables 
              and never expose them in client-side code. The secret keys should only be used on your server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-8">
      {/* General Payment Settings */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-4">General Payment Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={systemConfig.paymentSettings.currency}
              onChange={(e) => handlePaymentSettingsUpdate('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={systemConfig.paymentSettings.processingFee}
              onChange={(e) => handlePaymentSettingsUpdate('processingFee', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={systemConfig.paymentSettings.fixedFee}
              onChange={(e) => handlePaymentSettingsUpdate('fixedFee', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-4">Accepted Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(systemConfig.paymentSettings.paymentMethods).map(([method, enabled]) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handlePaymentMethodUpdate(method, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {method.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Contractor Payout Settings */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-4">Contractor Payout Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
            <select
              value={systemConfig.paymentSettings.contractorPayoutSchedule}
              onChange={(e) => handlePaymentSettingsUpdate('contractorPayoutSchedule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payout Day</label>
            <select
              value={systemConfig.paymentSettings.contractorPayoutDay}
              onChange={(e) => handlePaymentSettingsUpdate('contractorPayoutDay', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={systemConfig.paymentSettings.minimumPayoutAmount}
              onChange={(e) => handlePaymentSettingsUpdate('minimumPayoutAmount', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={systemConfig.paymentSettings.enableAutomaticPayouts}
              onChange={(e) => handlePaymentSettingsUpdate('enableAutomaticPayouts', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">Enable Automatic Payouts</label>
          </div>
        </div>
      </div>

      {/* Payout Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Contractor Payout Information</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Contractors will receive payouts based on completed jobs</li>
              <li>• Payouts are processed automatically according to your schedule</li>
              <li>• Contractors need to connect their bank account via Stripe Express</li>
              <li>• Minimum payout amounts help reduce processing fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'waste-types':
        return renderWasteTypesTab();
      case 'service-areas':
        return renderServiceAreasTab();
      case 'business-hours':
        return renderBusinessHoursTab();
      case 'company-info':
        return renderCompanyInfoTab();
      case 'api-keys':
        return renderApiKeysTab();
      case 'payments':
        return renderPaymentsTab();
      default:
        return null;
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
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
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