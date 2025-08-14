import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/utils/apiClient';

const StripeSuccessPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Get the booking data stored before payment
        const bookingDataStr = sessionStorage.getItem('pendingBooking');
        if (!bookingDataStr) {
          alert('No booking data found. Please try booking again.');
          navigate('/services');
          return;
        }

        const bookingData = JSON.parse(bookingDataStr);
        
        // Create DateTime from stored date and time
        const [hours, minutes] = bookingData.selectedTime.split(':').map(Number);
        const startDateTime = new Date(bookingData.selectedDate);
        startDateTime.setHours(hours, minutes, 0, 0);

        // Create the order after successful payment
        const orderData = {
          service_type: bookingData.serviceType,
          job: bookingData.service.id || bookingData.service.name.toLowerCase().replace(/\s+/g, '_'),
          start_time: startDateTime.toISOString(),
          comments: bookingData.notes,
          status: 'scheduled'
        };

        const response = await apiClient.post('/orders/', orderData);
        
        // Clear the stored booking data
        sessionStorage.removeItem('pendingBooking');
        
        // Navigate to order confirmation with the order number
        navigate('/order-confirmation', { 
          state: { 
            orderNumber: response.data.order_num,
            service: bookingData.service,
            bookingDetails: {
              date: new Date(bookingData.selectedDate),
              time: bookingData.selectedTime,
              notes: bookingData.notes
            }
          } 
        });

      } catch (error: any) {
        console.error('Failed to create order after payment:', error);
        alert(`Failed to create order: ${error.response?.status} - ${JSON.stringify(error.response?.data) || error.message}`);
        navigate('/services');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default StripeSuccessPage;