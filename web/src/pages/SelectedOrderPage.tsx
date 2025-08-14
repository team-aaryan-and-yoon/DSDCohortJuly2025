import { useLocation, Link } from 'react-router-dom';
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import ProgressBarCheckout from "../components/ui/progress-bar-checkout";
import type { serviceType } from "@/Types";
import ConfirmAndPayButton from "@/components/ConfirmAndPayButton";


const SelectedOrderPage = () => {
    const location = useLocation();
    const service: serviceType | null = location.state?.service;

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
                        <Calendar mode="single" />     
                    </div>
                    <div> 
                        <label className="block text-sm font-medium mb-2">Service Time</label>
                        <input type="time" className="w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <div> 
                        <label className="block text-sm font-medium mb-2">Note</label>
                        <textarea rows={4} placeholder="Leave a note for the provider..." className="w-full rounded-md border-gray-300 shadow-sm p-2" />
                    </div>
                    <ConfirmAndPayButton />
                </div>
            </div>
        </div>
    );
};

export default SelectedOrderPage;
