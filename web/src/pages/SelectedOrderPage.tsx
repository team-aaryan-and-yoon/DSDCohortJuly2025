import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import ProgressBarCheckout from "../components/ui/progress-bar-checkout";
import type { serviceType } from "@/Types";
import { useAuth } from "@/contexts/AuthContext";

const SelectedOrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const service: serviceType | null = location.state?.service;
    
    // Form state
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    
    // Store service and form data in sessionStorage to persist through auth flow
    useEffect(() => {
        if (service) {
            sessionStorage.setItem('pendingService', JSON.stringify(service));
        }
    }, [service]);
    
    // Restore form data if returning from auth
    useEffect(() => {
        const savedFormData = sessionStorage.getItem('pendingBookingForm');
        if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            if (formData.date) {
                setSelectedDate(new Date(formData.date));
            }
            setSelectedTime(formData.time || '');
            setNotes(formData.notes || '');
            // Clear the saved form data after restoring
            sessionStorage.removeItem('pendingBookingForm');
        }
    }, []);

    if (!service) {
        return (
          <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-20 text-center">
            <h1 className="text-3xl font-bold mb-4">No Service Selected</h1>
            <p className="text-lg">Please go back to the <Link to="/services" className="text-blue-600 hover:underline">services page</Link> to book a service.</p>
          </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-20 ">
            <h1 className="text-3xl font-bold mb-8">Review Your Order</h1>
            <div className="flex flex-col items-center justify-center">
                <ProgressBarCheckout currentStep="Cart"/>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="flex items-start space-x-4 border-b pb-4 p-10">
                        <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.details}</p>
                        </div>
                        <p className="font-semibold">${service.price?.toFixed(2)}</p>
                    </div>
                    <div className="mt-auto space-y-4">
                        <div className="flex justify-between pt-4">
                            <span className="text-sm text-gray-500">Fee:</span>
                            <span className="text-sm font-medium">$20.00</span>
                        </div>
                        <div className="flex justify-between border-t pt-4">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-lg font-bold">${( (service.price || 0) + 20 ).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 space-y-6">
                    <h3 className="text-md font-semibold mb-2">Schedule Your Service</h3>
                    <div>
                        <label className="block text-sm font-medium mb-2">Service Date</label>
                        <Calendar 
                            mode="single" 
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                        />     
                    </div>
                    <div> 
                        <label className="block text-sm font-medium mb-2">Service Time</label>
                        <input 
                            type="time" 
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm p-2" 
                        />
                    </div>
                    <div> 
                        <label className="block text-sm font-medium mb-2">Note</label>
                        <textarea 
                            rows={4} 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Leave a note for the provider..." 
                            className="w-full rounded-md border-gray-300 shadow-sm p-2" 
                        />
                    </div>
                    {!user ? (
                        <>
                            <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mb-2"
                                onClick={() => {
                                    // Store form data before redirecting
                                    sessionStorage.setItem('pendingBookingForm', JSON.stringify({
                                        date: selectedDate?.toISOString(),
                                        time: selectedTime,
                                        notes: notes
                                    }));
                                    // Store current path to return after auth
                                    sessionStorage.setItem('redirectAfterAuth', '/book-service');
                                    navigate('/sign-up');
                                }}
                            >
                                Sign Up to Continue
                            </Button>
                            <Button 
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    // Store form data before redirecting
                                    sessionStorage.setItem('pendingBookingForm', JSON.stringify({
                                        date: selectedDate?.toISOString(),
                                        time: selectedTime,
                                        notes: notes
                                    }));
                                    // Store current path to return after auth
                                    sessionStorage.setItem('redirectAfterAuth', '/book-service');
                                    navigate('/sign-in');
                                }}
                            >
                                Already have an account? Sign In
                            </Button>
                        </>
                    ) : (
                        <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                                // User is authenticated, proceed to payment with all booking data
                                navigate('/orders', { 
                                    state: { 
                                        service,
                                        bookingDetails: {
                                            date: selectedDate,
                                            time: selectedTime,
                                            notes: notes
                                        }
                                    } 
                                });
                            }}
                        >
                            Confirm and Pay
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectedOrderPage;