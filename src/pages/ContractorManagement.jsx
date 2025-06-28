import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserManagement } from '../context/UserManagementContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiTruck, FiPlus, FiEdit3, FiTrash2, FiSearch, FiFilter,
  FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiCreditCard,
  FiCheck, FiX, FiEye, FiEyeOff, FiSave, FiUserCheck,
  FiAlertTriangle, FiSettings, FiCalendar, FiBriefcase,
  FiAward, FiTrendingUp, FiClock, FiTarget
} = FiIcons;

const ContractorManagement = () => {
  const { users, createUser, updateUser, deleteUser, toggleUserStatus } = useUserManagement();
  const [contractors, setContractors] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('basic-info');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    licenseNumber: '',
    serviceAreas: [],
    vehicleType: '',
    capacity: '',
    hourlyRate: '',
    commissionRate: '',
    paymentMethod: 'bank_transfer',
    bankDetails: {
      accountNumber: '',
      routingNumber: '',
      accountHolderName: '',
      bankName: ''
    },
    paypalEmail: '',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    certifications: [],
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSensitiveData, setShowSensitiveData] = useState({});

  const availableServiceAreas = [
    'Downtown', 'North District', 'South District', 
    'East Side', 'West Side', 'Suburbs', 'Industrial Zone'
  ];

  const vehicleTypes = [
    'Small Truck', 'Medium Truck', 'Large Truck', 
    'Van', 'Pickup Truck', 'Specialized Vehicle'
  ];

  const certificationTypes = [
    'Hazardous Waste Handler', 'CDL License', 'DOT Certification',
    'Environmental Safety', 'First Aid/CPR', 'Defensive Driving'
  ];

  useEffect(() => {
    const contractorUsers = users.filter(user => user.role === 'contractor');
    setContractors(contractorUsers);
    setFilteredContractors(contractorUsers);
  }, [users]);

  useEffect(() => {
    let filtered = contractors.filter(contractor => {
      const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contractor.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || contractor.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredContractors(filtered);
  }, [contractors, searchTerm, statusFilter]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      licenseNumber: '',
      serviceAreas: [],
      vehicleType: '',
      capacity: '',
      hourlyRate: '',
      commissionRate: '',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '',
        routingNumber: '',
        accountHolderName: '',
        bankName: ''
      },
      paypalEmail: '',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      certifications: [],
      notes: ''
    });
    setFormErrors({});
    setActiveTab('basic-info');
  };

  const handleCreateContractor = () => {
    setEditingContractor(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditContractor = (contractor) => {
    setEditingContractor(contractor);
    setFormData({
      name: contractor.name || '',
      email: contractor.email || '',
      password: '',
      phone: contractor.phone || '',
      address: contractor.address || '',
      licenseNumber: contractor.contractorInfo?.licenseNumber || '',
      serviceAreas: contractor.contractorInfo?.serviceAreas || [],
      vehicleType: contractor.contractorInfo?.vehicleType || '',
      capacity: contractor.contractorInfo?.capacity || '',
      hourlyRate: contractor.contractorInfo?.hourlyRate || '',
      commissionRate: contractor.contractorInfo?.commissionRate || '',
      paymentMethod: contractor.contractorInfo?.paymentMethod || 'bank_transfer',
      bankDetails: contractor.contractorInfo?.bankDetails || {
        accountNumber: '',
        routingNumber: '',
        accountHolderName: '',
        bankName: ''
      },
      paypalEmail: contractor.contractorInfo?.paypalEmail || '',
      availability: contractor.contractorInfo?.availability || {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      emergencyContact: contractor.contractorInfo?.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      certifications: contractor.contractorInfo?.certifications || [],
      notes: contractor.contractorInfo?.notes || ''
    });
    setActiveTab('basic-info');
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!editingContractor && !formData.password) errors.password = 'Password is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (formData.serviceAreas.length === 0) errors.serviceAreas = 'At least one service area is required';
    if (!formData.vehicleType) errors.vehicleType = 'Vehicle type is required';
    if (!formData.capacity.trim()) errors.capacity = 'Capacity is required';
    
    // Payment validation
    if (formData.paymentMethod === 'bank_transfer') {
      if (!formData.bankDetails.accountNumber) errors.accountNumber = 'Account number is required';
      if (!formData.bankDetails.routingNumber) errors.routingNumber = 'Routing number is required';
      if (!formData.bankDetails.accountHolderName) errors.accountHolderName = 'Account holder name is required';
      if (!formData.bankDetails.bankName) errors.bankName = 'Bank name is required';
    } else if (formData.paymentMethod === 'paypal') {
      if (!formData.paypalEmail) errors.paypalEmail = 'PayPal email is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const contractorData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      role: 'contractor',
      contractorInfo: {
        licenseNumber: formData.licenseNumber,
        serviceAreas: formData.serviceAreas,
        vehicleType: formData.vehicleType,
        capacity: formData.capacity,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
        commissionRate: formData.commissionRate ? parseFloat(formData.commissionRate) : 0,
        paymentMethod: formData.paymentMethod,
        bankDetails: formData.paymentMethod === 'bank_transfer' ? formData.bankDetails : null,
        paypalEmail: formData.paymentMethod === 'paypal' ? formData.paypalEmail : null,
        availability: formData.availability,
        emergencyContact: formData.emergencyContact,
        certifications: formData.certifications,
        notes: formData.notes
      }
    };

    if (!editingContractor && formData.password) {
      contractorData.password = formData.password;
    }

    try {
      if (editingContractor) {
        updateUser(editingContractor.id, contractorData);
      } else {
        createUser(contractorData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving contractor:', error);
    }
  };

  const handleDeleteContractor = (contractorId) => {
    try {
      deleteUser(contractorId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting contractor:', error);
    }
  };

  const handleToggleStatus = (contractorId) => {
    toggleUserStatus(contractorId);
  };

  const handleServiceAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  const handleCertificationToggle = (cert) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleAvailabilityChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const toggleSensitiveData = (field) => {
    setShowSensitiveData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: FiUser },
    { id: 'work-details', label: 'Work Details', icon: FiBriefcase },
    { id: 'payment', label: 'Payment Setup', icon: FiDollarSign },
    { id: 'availability', label: 'Availability', icon: FiCalendar },
    { id: 'additional', label: 'Additional Info', icon: FiSettings }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contractor Management</h1>
          <p className="text-gray-600 mt-1">Manage contractors and their payment configurations</p>
        </div>
        <button
          onClick={handleCreateContractor}
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Contractor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contractors</p>
              <p className="text-3xl font-bold text-gray-900">{contractors.length}</p>
            </div>
            <SafeIcon icon={FiTruck} className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {contractors.filter(c => c.status === 'active').length}
              </p>
            </div>
            <SafeIcon icon={FiUserCheck} className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-3xl font-bold text-red-600">
                {contractors.filter(c => c.status === 'inactive').length}
              </p>
            </div>
            <SafeIcon icon={FiX} className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-3xl font-bold text-yellow-600">4.8</p>
            </div>
            <SafeIcon icon={FiAward} className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredContractors.length} of {contractors.length} contractors
          </div>
        </div>
      </div>

      {/* Contractors Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle & Areas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Setup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContractors.map((contractor) => (
                <tr key={contractor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiTruck} className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{contractor.name}</div>
                        <div className="text-sm text-gray-500">
                          License: {contractor.contractorInfo?.licenseNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contractor.email}</div>
                    <div className="text-sm text-gray-500">{contractor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contractor.contractorInfo?.vehicleType || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {contractor.contractorInfo?.serviceAreas?.length || 0} areas
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <SafeIcon 
                        icon={contractor.contractorInfo?.paymentMethod === 'paypal' ? FiMail : FiCreditCard} 
                        className="w-4 h-4 text-gray-400" 
                      />
                      <span className="text-sm text-gray-900 capitalize">
                        {contractor.contractorInfo?.paymentMethod?.replace('_', ' ') || 'Not Set'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(contractor.status)}`}>
                      {contractor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditContractor(contractor)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(contractor.id)}
                        className={getStatusColor(contractor.status === 'active' ? 'inactive' : 'active')}
                      >
                        <SafeIcon icon={contractor.status === 'active' ? FiX : FiCheck} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(contractor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContractors.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiTruck} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first contractor.'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <button
                onClick={handleCreateContractor}
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Add First Contractor</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingContractor ? 'Edit Contractor' : 'Add New Contractor'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="p-6">
                  {/* Basic Info Tab */}
                  {activeTab === 'basic-info' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter contractor's full name"
                          />
                          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="contractor@email.com"
                          />
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.phone ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="+1-555-0123"
                          />
                          {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                        </div>

                        {!editingContractor && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password *
                            </label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                formErrors.password ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Enter password"
                            />
                            {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            formErrors.address ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter full address"
                        />
                        {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                      </div>
                    </div>
                  )}

                  {/* Work Details Tab */}
                  {activeTab === 'work-details' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Number *
                          </label>
                          <input
                            type="text"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="WM-12345"
                          />
                          {formErrors.licenseNumber && <p className="mt-1 text-sm text-red-600">{formErrors.licenseNumber}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Type *
                          </label>
                          <select
                            value={formData.vehicleType}
                            onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.vehicleType ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select vehicle type</option>
                            {vehicleTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          {formErrors.vehicleType && <p className="mt-1 text-sm text-red-600">{formErrors.vehicleType}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Capacity *
                          </label>
                          <input
                            type="text"
                            value={formData.capacity}
                            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.capacity ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="5 tons"
                          />
                          {formErrors.capacity && <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hourly Rate ($)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="25.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Commission Rate (%)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.commissionRate}
                            onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="15.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Service Areas *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableServiceAreas.map((area) => (
                            <label key={area} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.serviceAreas.includes(area)}
                                onChange={() => handleServiceAreaToggle(area)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700">{area}</span>
                            </label>
                          ))}
                        </div>
                        {formErrors.serviceAreas && <p className="mt-1 text-sm text-red-600">{formErrors.serviceAreas}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Certifications
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {certificationTypes.map((cert) => (
                            <label key={cert} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.certifications.includes(cert)}
                                onChange={() => handleCertificationToggle(cert)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700">{cert}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Setup Tab */}
                  {activeTab === 'payment' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Payment Method *
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bank_transfer"
                              checked={formData.paymentMethod === 'bank_transfer'}
                              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-gray-500" />
                            <div>
                              <div className="font-medium text-gray-900">Bank Transfer</div>
                              <div className="text-sm text-gray-500">Direct deposit to bank account</div>
                            </div>
                          </label>
                          <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="paypal"
                              checked={formData.paymentMethod === 'paypal'}
                              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-500" />
                            <div>
                              <div className="font-medium text-gray-900">PayPal</div>
                              <div className="text-sm text-gray-500">Payment via PayPal account</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {formData.paymentMethod === 'bank_transfer' && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Bank Account Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Holder Name *
                              </label>
                              <input
                                type="text"
                                value={formData.bankDetails.accountHolderName}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  bankDetails: {...formData.bankDetails, accountHolderName: e.target.value}
                                })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                  formErrors.accountHolderName ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="John Doe"
                              />
                              {formErrors.accountHolderName && <p className="mt-1 text-sm text-red-600">{formErrors.accountHolderName}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name *
                              </label>
                              <input
                                type="text"
                                value={formData.bankDetails.bankName}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  bankDetails: {...formData.bankDetails, bankName: e.target.value}
                                })}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                  formErrors.bankName ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Chase Bank"
                              />
                              {formErrors.bankName && <p className="mt-1 text-sm text-red-600">{formErrors.bankName}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number *
                              </label>
                              <div className="relative">
                                <input
                                  type={showSensitiveData.accountNumber ? 'text' : 'password'}
                                  value={formData.bankDetails.accountNumber}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    bankDetails: {...formData.bankDetails, accountNumber: e.target.value}
                                  })}
                                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                    formErrors.accountNumber ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="1234567890"
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleSensitiveData('accountNumber')}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <SafeIcon icon={showSensitiveData.accountNumber ? FiEyeOff : FiEye} className="w-4 h-4" />
                                </button>
                              </div>
                              {formErrors.accountNumber && <p className="mt-1 text-sm text-red-600">{formErrors.accountNumber}</p>}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Routing Number *
                              </label>
                              <div className="relative">
                                <input
                                  type={showSensitiveData.routingNumber ? 'text' : 'password'}
                                  value={formData.bankDetails.routingNumber}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    bankDetails: {...formData.bankDetails, routingNumber: e.target.value}
                                  })}
                                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                                    formErrors.routingNumber ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="123456789"
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleSensitiveData('routingNumber')}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <SafeIcon icon={showSensitiveData.routingNumber ? FiEyeOff : FiEye} className="w-4 h-4" />
                                </button>
                              </div>
                              {formErrors.routingNumber && <p className="mt-1 text-sm text-red-600">{formErrors.routingNumber}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.paymentMethod === 'paypal' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            PayPal Email *
                          </label>
                          <input
                            type="email"
                            value={formData.paypalEmail}
                            onChange={(e) => setFormData({...formData, paypalEmail: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              formErrors.paypalEmail ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="contractor@paypal.com"
                          />
                          {formErrors.paypalEmail && <p className="mt-1 text-sm text-red-600">{formErrors.paypalEmail}</p>}
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Payment Security</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              All payment information is encrypted and stored securely. Bank details are used exclusively for contractor payouts and are never shared with third parties.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Availability Tab */}
                  {activeTab === 'availability' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Work Days
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.keys(formData.availability).map((day) => (
                            <label key={day} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.availability[day]}
                                onChange={() => handleAvailabilityChange(day)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Name
                            </label>
                            <input
                              type="text"
                              value={formData.emergencyContact.name}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyContact: {...formData.emergencyContact, name: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Jane Doe"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={formData.emergencyContact.phone}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyContact: {...formData.emergencyContact, phone: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="+1-555-0123"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={formData.emergencyContact.relationship}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyContact: {...formData.emergencyContact, relationship: e.target.value}
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Spouse, Parent, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info Tab */}
                  {activeTab === 'additional' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Additional notes about this contractor..."
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <SafeIcon icon={FiTarget} className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Jobs Completed</div>
                            <div className="text-lg font-semibold text-gray-900">--</div>
                          </div>
                          <div>
                            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Success Rate</div>
                            <div className="text-lg font-semibold text-gray-900">--</div>
                          </div>
                          <div>
                            <SafeIcon icon={FiClock} className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Avg Time</div>
                            <div className="text-lg font-semibold text-gray-900">--</div>
                          </div>
                          <div>
                            <SafeIcon icon={FiAward} className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Rating</div>
                            <div className="text-lg font-semibold text-gray-900">--</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3 text-center">
                          Performance metrics will be available after the contractor completes their first job.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>{editingContractor ? 'Update Contractor' : 'Create Contractor'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center space-x-3 mb-4">
                <SafeIcon icon={FiAlertTriangle} className="w-8 h-8 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this contractor? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteContractor(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractorManagement;