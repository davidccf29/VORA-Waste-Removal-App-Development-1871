import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiCalendar, FiTruck, FiSettings, FiMapPin, FiClock, FiUser, FiPhone } = FiIcons;

const AdminDashboard = () => {
  const { bookings, contractors, assignContractor } = useBooking();

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

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleAssignContractor = (bookingId, contractorId) => {
    assignContractor(bookingId, parseInt(contractorId));
  };

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    assignedBookings: bookings.filter(b => b.status === 'assigned').length,
    completedBookings: bookings.filter(b => b.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all waste removal operations</p>
        </div>
        <Link
          to="/system-setup"
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiSettings} className="w-5 h-5" />
          <span>System Setup</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
            </div>
            <SafeIcon icon={FiClock} className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-3xl font-bold text-blue-600">{stats.assignedBookings}</p>
            </div>
            <SafeIcon icon={FiTruck} className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-8 text-center">
            <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">No waste removal bookings have been created yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Booking #{booking.id}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created {formatDate(booking.createdAt)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Customer</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>{booking.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                        <span>{booking.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Details</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>{formatDate(booking.pickupDate)} at {formatTime(booking.pickupTime)}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Type:</span> {booking.wasteType}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Assignment</h4>
                    {booking.status === 'pending' ? (
                      <select
                        onChange={(e) => handleAssignContractor(booking.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        defaultValue=""
                      >
                        <option value="">Assign contractor...</option>
                        {contractors.map((contractor) => (
                          <option key={contractor.id} value={contractor.id}>
                            {contractor.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {booking.contractorId ? (
                          <span>
                            Assigned to: {contractors.find(c => c.id === booking.contractorId)?.name || 'Unknown'}
                          </span>
                        ) : (
                          <span>Unassigned</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {booking.specialInstructions && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Special Instructions:</span>
                    <p className="text-gray-600 mt-1">{booking.specialInstructions}</p>
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

export default AdminDashboard;