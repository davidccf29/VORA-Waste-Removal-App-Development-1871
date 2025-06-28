import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMap, FiNavigation, FiMaximize2, FiMinimize2, FiRefreshCw } = FiIcons;

const RouteMap = ({ optimizedRoute, bookings }) => {
  const mapRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock map data for demonstration
  const mockMapData = {
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 12,
    markers: bookings.map((booking, index) => ({
      id: booking.id,
      position: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      },
      title: booking.customerName,
      address: booking.address,
      wasteType: booking.wasteType,
      order: index + 1
    })),
    route: optimizedRoute ? {
      path: bookings.map((_, index) => ({
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      })),
      distance: optimizedRoute.totalDistance,
      duration: optimizedRoute.totalDuration
    } : null
  };

  useEffect(() => {
    // Simulate map loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMapLoaded(true);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [optimizedRoute]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshMap = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getWasteTypeColor = (wasteType) => {
    switch (wasteType) {
      case 'hazardous': return '#ef4444';
      case 'electronic': return '#3b82f6';
      case 'recyclable': return '#22c55e';
      case 'construction': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiMap} className="w-5 h-5 text-primary-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Route Visualization</h3>
            <p className="text-sm text-gray-600">
              {optimizedRoute ? 'Optimized route with AI recommendations' : 'Standard booking locations'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshMap}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon 
              icon={FiRefreshCw} 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon 
              icon={isFullscreen ? FiMinimize2 : FiMaximize2} 
              className="w-4 h-4" 
            />
          </button>
        </div>
      </div>

      <div className={`relative ${isFullscreen ? 'h-full' : 'h-96'}`}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mock Map Display */}
            <div 
              ref={mapRef}
              className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden"
            >
              {/* Mock Street Pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Mock Route Line */}
              {optimizedRoute && (
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <motion.path
                    d={`M 20,80 Q 100,60 180,100 Q 260,140 340,120 Q 420,100 500,140`}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                </motion.svg>
              )}

              {/* Mock Markers */}
              {mockMapData.markers.map((marker, index) => (
                <motion.div
                  key={marker.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${20 + index * 18}%`,
                    top: `${30 + Math.sin(index) * 20 + 30}%`
                  }}
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: getWasteTypeColor(marker.wasteType) }}
                    >
                      {optimizedRoute ? marker.order : index + 1}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gray-900 text-white text-xs rounded-lg p-2 whitespace-nowrap">
                        <p className="font-medium">{marker.title}</p>
                        <p className="text-gray-300">{marker.wasteType}</p>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Mock Start Point */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: '10%', top: '20%' }}
              >
                <div className="w-10 h-10 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <SafeIcon icon={FiNavigation} className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
                  VORA HQ
                </div>
              </motion.div>
            </div>

            {/* Route Info Overlay */}
            {optimizedRoute && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <h4 className="font-medium text-gray-900 mb-2">Route Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Distance:</span>
                    <span className="font-medium">{optimizedRoute.totalDistance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-medium">
                      {Math.floor(optimizedRoute.totalDuration / 60)}h {optimizedRoute.totalDuration % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Cost:</span>
                    <span className="font-medium">${optimizedRoute.estimatedFuelCost.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Hazardous</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Electronic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Recyclable</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Construction</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-600">General</span>
            </div>
          </div>
          
          {optimizedRoute && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span>Optimized Route</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RouteMap;