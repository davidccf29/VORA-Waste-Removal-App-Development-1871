import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTruck, FiMapPin, FiCalendar, FiClock, FiPhone, FiMail, FiFileText, FiCheckCircle, FiPlay } = FiIcons;

const ContractorDashboard = () => {
  const { user } = useAuth();
  const { getBookingsByContractor, updateBooking } = useBooking();
  
  const assignedBookings = getBookingsByContractor(user.id);

  const handleStatusUpdate = (bookingId, newStatus) => {
    updateBooking(bookingId, { status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your assigned waste collection tasks</p>
        </div>
        <div className="flex items-center space-x-2 text-primary-600">
          <SafeIcon icon={FiTruck} className="w-6 h-6" />
          <span className="font-medium">Contractor Portal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-900">{assignedBookings.length}</p>
            </div>
            <SafeIcon icon={FiTruck} className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-purple-600">
                {assignedBookings.filter(b => b.status === 'in-progress').length}
              </p>
            </div>
            <SafeIcon icon={FiPlay} className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {assignedBookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Assignments</h2>
        </div>
        
        {assignedBookings.length === 0 ? (
          <div className="p-8 text-center">
            <SafeIcon icon={FiTruck} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600">You don't have any waste collection assignments at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {assignedBookings.map((booking) => (
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
                  <div className="flex space-x-2">
                    {booking.status === 'assigned' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'in-progress')}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        Start Job
                      </button>
                    )}
                    {booking.status === 'in-progress' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                        <span>{booking.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiPhone} className="w-4 h-4" />
                        <span>{booking.customerPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiMail} className="w-4 h-4" />
                        <span>{booking.customerEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Job Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span>{formatDate(booking.pickupDate)} at {formatTime(booking.pickupTime)}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Waste Type:</span> {booking.wasteType}
                      </div>
                    </div>
                  </div>
                </div>
                
                {booking.specialInstructions && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Special Instructions:</span>
                        <p className="text-gray-600 mt-1">{booking.specialInstructions}</p>
                      </div>
                    </div>
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

export default ContractorDashboard;