import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import routeOptimizationService from '../services/routeOptimization';

const { 
  FiMapPin, FiClock, FiTruck, FiZap, FiLeaf, FiDollarSign, 
  FiNavigation, FiRefreshCw, FiCheckCircle, FiAlertTriangle,
  FiBarChart3, FiTrendingUp, FiTarget
} = FiIcons;

const RouteOptimizer = ({ bookings, onOptimizedRoute }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [optimizationStats, setOptimizationStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter bookings by selected date
  const dailyBookings = bookings.filter(booking => 
    booking.pickupDate === selectedDate && 
    (booking.status === 'assigned' || booking.status === 'pending')
  );

  const handleOptimizeRoute = async () => {
    if (dailyBookings.length === 0) return;

    setIsOptimizing(true);
    try {
      const result = await routeOptimizationService.optimizeRoute(dailyBookings);
      setOptimizedRoute(result);
      setOptimizationStats(result);
      onOptimizedRoute?.(result);
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (km) => {
    return `${km.toFixed(1)} km`;
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWasteTypeIcon = (wasteType) => {
    switch (wasteType) {
      case 'hazardous': return '⚠️';
      case 'electronic': return '🔌';
      case 'recyclable': return '♻️';
      case 'construction': return '🏗️';
      default: return '🗑️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiNavigation} className="w-5 h-5 text-primary-600" />
              <span>AI Route Optimizer</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Optimize your daily routes with AI-powered algorithms
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleOptimizeRoute}
              disabled={isOptimizing || dailyBookings.length === 0}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon 
                icon={isOptimizing ? FiRefreshCw : FiZap} 
                className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} 
              />
              <span>{isOptimizing ? 'Optimizing...' : 'Optimize Route'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {dailyBookings.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiTruck} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bookings scheduled for {selectedDate}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Optimization Stats */}
            <AnimatePresence>
              {optimizationStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
                >
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Distance</p>
                        <p className="text-xl font-bold text-blue-900">
                          {formatDistance(optimizationStats.totalDistance)}
                        </p>
                      </div>
                      <SafeIcon icon={FiMapPin} className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Total Time</p>
                        <p className="text-xl font-bold text-purple-900">
                          {formatTime(optimizationStats.totalDuration)}
                        </p>
                      </div>
                      <SafeIcon icon={FiClock} className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Fuel Cost</p>
                        <p className="text-xl font-bold text-green-900">
                          ${optimizationStats.estimatedFuelCost.toFixed(2)}
                        </p>
                      </div>
                      <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-700">Efficiency</p>
                        <p className={`text-xl font-bold ${getEfficiencyColor(optimizationStats.routeEfficiency)}`}>
                          {optimizationStats.routeEfficiency.toFixed(0)}%
                        </p>
                      </div>
                      <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Environmental Impact */}
            {optimizationStats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiLeaf} className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Environmental Impact</h4>
                    <p className="text-sm text-green-700">
                      CO₂ Savings: <span className="font-semibold">{optimizationStats.co2Savings.toFixed(2)} kg</span>
                      {' • '}
                      Optimized vs. Standard Route: <span className="font-semibold">
                        -{((1 - optimizationStats.routeEfficiency/100) * 100).toFixed(0)}%
                      </span> emissions
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Optimized Route List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="w-5 h-5" />
                <span>
                  {optimizedRoute ? 'Optimized Route' : 'Scheduled Bookings'} 
                  ({dailyBookings.length} stops)
                </span>
              </h4>

              <div className="space-y-3">
                {(optimizedRoute?.optimizedBookings || dailyBookings).map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getWasteTypeIcon(booking.wasteType)}</span>
                        <h5 className="font-medium text-gray-900 truncate">
                          {booking.customerName}
                        </h5>
                        {booking.wasteType === 'hazardous' && (
                          <SafeIcon icon={FiAlertTriangle} className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="w-3 h-3" />
                          <span>{booking.pickupTime}</span>
                        </div>
                      </div>

                      {optimizationStats?.trafficPredictions && (
                        <div className="mt-2 text-xs">
                          <span className="text-gray-500">
                            Est. delay: {optimizationStats.trafficPredictions[index]?.estimatedDelay.toFixed(0) || 0} min
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {optimizedRoute && (
                        <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500" />
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'assigned' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {optimizedRoute && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 p-4 rounded-lg border border-blue-200"
              >
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">AI Optimization Insights</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Route optimized using genetic algorithm and traffic prediction</li>
                      <li>• Hazardous waste prioritized for early collection</li>
                      <li>• Time windows and customer preferences considered</li>
                      <li>• Real-time traffic patterns analyzed for optimal timing</li>
                      {optimizationStats.co2Savings > 5 && (
                        <li>• Significant environmental impact reduction achieved</li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteOptimizer;