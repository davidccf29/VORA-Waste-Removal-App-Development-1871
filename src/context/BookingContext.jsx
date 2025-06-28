import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [contractors, setContractors] = useState([
    { id: 2, name: 'Mike Contractor', email: 'contractor@vora.com', phone: '+1-555-0123' }
  ]);

  useEffect(() => {
    const savedBookings = localStorage.getItem('voraBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      // Initialize with sample data
      const sampleBookings = [
        {
          id: 1,
          customerId: 1,
          customerName: 'John Customer',
          customerEmail: 'customer@vora.com',
          customerPhone: '+1-555-0101',
          address: '123 Main St, City, State 12345',
          wasteType: 'general',
          pickupDate: '2024-01-15',
          pickupTime: '09:00',
          specialInstructions: 'Large furniture items',
          status: 'pending',
          contractorId: null,
          createdAt: new Date().toISOString()
        }
      ];
      setBookings(sampleBookings);
      localStorage.setItem('voraBookings', JSON.stringify(sampleBookings));
    }
  }, []);

  const createBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      status: 'pending',
      contractorId: null,
      createdAt: new Date().toISOString()
    };
    
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem('voraBookings', JSON.stringify(updatedBookings));
    return newBooking;
  };

  const updateBooking = (id, updates) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('voraBookings', JSON.stringify(updatedBookings));
  };

  const assignContractor = (bookingId, contractorId) => {
    updateBooking(bookingId, { contractorId, status: 'assigned' });
  };

  const getBookingsByCustomer = (customerId) => {
    return bookings.filter(booking => booking.customerId === customerId);
  };

  const getBookingsByContractor = (contractorId) => {
    return bookings.filter(booking => booking.contractorId === contractorId);
  };

  const value = {
    bookings,
    contractors,
    createBooking,
    updateBooking,
    assignContractor,
    getBookingsByCustomer,
    getBookingsByContractor
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};