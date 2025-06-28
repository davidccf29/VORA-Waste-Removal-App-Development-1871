import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCalendar, FiClock, FiMapPin, FiDollarSign } = FiIcons;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getBookingsByCustomer } = useBooking();
  
  const userBookings = getBookingsByCustomer(user.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your waste removal services</p>
        </div>
        <Link
          to="/book"
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Book Service</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{userBookings.length}</p>
            </div>
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {userBookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <SafeIcon icon={FiClock} className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {userBookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        
        {userBookings.length === 0 ? (
          <div className="p-8 text-center">
            <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">Get started by booking your first waste removal service</p>
            <Link
              to="/book"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Book Service</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {userBookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Booking #{booking.id}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created {formatDate(booking.createdAt)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                    <span>{booking.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>{formatDate(booking.pickupDate)} at {booking.pickupTime}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Waste Type:</span> {booking.wasteType}
                </div>
                
                {booking.specialInstructions && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Instructions:</span> {booking.specialInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;