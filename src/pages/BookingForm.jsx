import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useSystem } from '../context/SystemContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiCalendar, FiClock, FiFileText, FiCheck } = FiIcons;

const BookingForm = () => {
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const { systemConfig } = useSystem();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    wasteType: '',
    pickupDate: '',
    pickupTime: '',
    specialInstructions: '',
    customerPhone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.wasteType) {
      newErrors.wasteType = 'Please select a waste type';
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    } else {
      const selectedDate = new Date(formData.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.pickupDate = 'Pickup date cannot be in the past';
      }
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email
      };

      createBooking(bookingData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const selectedWasteType = systemConfig.wasteTypes.find(type => type.id === formData.wasteType);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Book Waste Removal Service</h1>
          <p className="text-gray-600 mt-1">Fill in the details for your waste pickup</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiMapPin} className="inline w-4 h-4 mr-1" />
              Pickup Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter the full address where waste should be collected"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.customerPhone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Your contact phone number"
            />
            {errors.customerPhone && <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Type
            </label>
            <select
              name="wasteType"
              value={formData.wasteType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.wasteType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select waste type</option>
              {systemConfig.wasteTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - ${type.price}
                </option>
              ))}
            </select>
            {errors.wasteType && <p className="mt-1 text-sm text-red-600">{errors.wasteType}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiCalendar} className="inline w-4 h-4 mr-1" />
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                min={getMinDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.pickupDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.pickupDate && <p className="mt-1 text-sm text-red-600">{errors.pickupDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SafeIcon icon={FiClock} className="inline w-4 h-4 mr-1" />
                Preferred Time
              </label>
              <select
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.pickupTime ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select time</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
              {errors.pickupTime && <p className="mt-1 text-sm text-red-600">{errors.pickupTime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiFileText} className="inline w-4 h-4 mr-1" />
              Special Instructions (Optional)
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any special instructions for the pickup (e.g., gate code, specific location, fragile items)"
            />
          </div>

          {selectedWasteType && (
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-2">Service Summary</h3>
              <div className="text-sm text-primary-800">
                <p><span className="font-medium">Service:</span> {selectedWasteType.name}</p>
                <p><span className="font-medium">Estimated Cost:</span> ${selectedWasteType.price}</p>
                <p className="mt-2 text-xs text-primary-600">
                  *Final cost may vary based on actual waste volume and additional services
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Booking...</span>
              ) : (
                <>
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span>Book Service</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;