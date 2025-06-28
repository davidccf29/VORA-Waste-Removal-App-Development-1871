import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiMail, FiLock, FiEye, FiEyeOff, FiTruck, FiUser, FiPhone, 
  FiMapPin, FiArrowLeft, FiCheck, FiAlertCircle, FiSend 
} = FiIcons;

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [registerErrors, setRegisterErrors] = useState({});
  
  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { login, register, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'customer':
          navigate('/dashboard');
          break;
        case 'contractor':
          navigate('/contractor');
          break;
        case 'administrator':
          navigate('/admin');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      // Navigation handled by useEffect
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setRegisterErrors({});
    
    // Validate form
    const errors = validateRegistrationForm();
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }

    setLoading(true);
    
    try {
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
        address: registerData.address,
        role: 'customer'
      });

      if (result.success) {
        setSuccessMessage('Account created successfully! You can now sign in.');
        setActiveTab('login');
        setEmail(registerData.email);
        // Reset form
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          address: ''
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setResetSent(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    }
    
    setLoading(false);
  };

  const validateRegistrationForm = () => {
    const errors = {};
    
    if (!registerData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!registerData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    return errors;
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (registerErrors[name]) {
      setRegisterErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const demoCredentials = [
    { role: 'Customer', email: 'customer@vora.com', password: 'password' },
    { role: 'Contractor', email: 'contractor@vora.com', password: 'password' },
    { role: 'Administrator', email: 'admin@vora.com', password: 'password' }
  ];

  const tabs = [
    { id: 'login', label: 'Sign In' },
    { id: 'register', label: 'Create Account' },
    { id: 'forgot', label: 'Reset Password' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="text-center p-8 pb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-4"
            >
              <SafeIcon icon={FiTruck} className="w-12 h-12 text-primary-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900">VORA</h1>
            <p className="text-gray-600 mt-2">Waste Management Solutions</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setError('');
                  setSuccessMessage('');
                  setResetSent(false);
                }}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* Login Form */}
              {activeTab === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <button
                          type="button"
                          onClick={() => setActiveTab('forgot')}
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center space-x-2"
                      >
                        <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {successMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg flex items-center space-x-2"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4" />
                        <span>{successMessage}</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setActiveTab('register')}
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Create one here
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Registration Form */}
              {activeTab === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={registerData.name}
                          onChange={handleRegisterInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            registerErrors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {registerErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{registerErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={registerData.email}
                          onChange={handleRegisterInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            registerErrors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {registerErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{registerErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={registerData.phone}
                          onChange={handleRegisterInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            registerErrors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {registerErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{registerErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          name="address"
                          value={registerData.address}
                          onChange={handleRegisterInputChange}
                          rows={2}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            registerErrors.address ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your address"
                        />
                      </div>
                      {registerErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{registerErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            registerErrors.password ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Create a password"
                        />
                      </div>
                      {registerErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{registerErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            registerErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {registerErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{registerErrors.confirmPassword}</p>
                      )}
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center space-x-2"
                      >
                        <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        onClick={() => setActiveTab('login')}
                        className="font-medium text-primary-600 hover:text-primary-500"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Forgot Password Form */}
              {activeTab === 'forgot' && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {!resetSent ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Password</h3>
                        <p className="text-sm text-gray-600">
                          Enter your email address and we'll send you a link to reset your password.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center space-x-2"
                        >
                          <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={FiSend} className="w-4 h-4" />
                        <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center space-x-1"
                        >
                          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                          <span>Back to Sign In</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
                      <p className="text-sm text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{resetEmail}</strong>
                      </p>
                      <button
                        onClick={() => setActiveTab('login')}
                        className="text-primary-600 hover:text-primary-500 font-medium flex items-center justify-center space-x-1 mx-auto"
                      >
                        <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                        <span>Back to Sign In</span>
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo Credentials - Only show on login tab */}
          {activeTab === 'login' && (
            <div className="px-8 pb-8 pt-0">
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 text-center mb-4">Demo Credentials:</p>
                <div className="space-y-2">
                  {demoCredentials.map((cred) => (
                    <button
                      key={cred.role}
                      onClick={() => {
                        setEmail(cred.email);
                        setPassword(cred.password);
                      }}
                      className="w-full text-left p-2 text-xs bg-gray-50 rounded border hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium">{cred.role}:</span> {cred.email}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;