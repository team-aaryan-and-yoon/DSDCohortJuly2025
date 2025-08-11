import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import ProgressBarCheckout from "../components/ui/progress-bar-checkout";

export default function OrderPage() {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<
    number | null
  >(null);
  const [cartItems, setCartItems] = useState([
    {
      title: "Repair Technician",
      location: "234 Plum Ln, TX. 77777",
      price: 573,
      icon: "🛠️",
      date: "2025-08-01",
      time: "10:00 AM",
      note: "Please fix the issue with the car",
    },
    {
      title: "Cleaning Service",
      location: "234 Plum Ln, TX. 77777",
      price: 578,
      icon: "🧹",
      date: "2025-08-01",
      time: "10:00 AM",
      note: "Please clean the car and the inside of the car",
    },
  ]);
  const [editingNote, setEditingNote] = useState("");
  const [editingTime, setEditingTime] = useState("");
  const [editingDate, setEditingDate] = useState<Date | undefined>(undefined);

  const handleServiceSelect = (index: number) => {
    setSelectedServiceIndex(index);
    const service = cartItems[index];
    setEditingNote(service.note);
    setEditingTime(service.time);
    setEditingDate(new Date(service.date));
  };

  const handleSaveChanges = () => {
    if (selectedServiceIndex !== null) {
      const updatedItems = [...cartItems];
      updatedItems[selectedServiceIndex] = {
        ...updatedItems[selectedServiceIndex],
        note: editingNote,
        time: editingTime,
        date:
          editingDate?.toISOString().split("T")[0] ||
          updatedItems[selectedServiceIndex].date,
      };
      setCartItems(updatedItems);
      // Return to overview after saving
      setSelectedServiceIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-20 ">
      <h1 className="text-3xl font-bold mb-8">Order Page</h1>
      <div className="flex flex-col items-center justify-center">
        <ProgressBarCheckout currentStep="Cart" />
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Order Summary */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 flex-1">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-4 border-b pb-4 p-10 cursor-pointer transition-colors ${
                  selectedServiceIndex === idx
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleServiceSelect(idx)}>
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.location}</p>
                  <p className="text-xs text-gray-400">
                    Date: {item.date} | Time: {item.time}
                  </p>
                </div>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex justify-between pt-4">
              <span className="text-sm text-gray-500">Fee:</span>
              <span className="text-sm font-medium">$200.00</span>
            </div>

            <div className="flex justify-between border-t pt-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold">$1,773.00</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-gray-100 rounded-xl p-6 space-y-6">
          {selectedServiceIndex !== null ? (
            <>
              <div>
                <h3 className="text-md font-semibold mb-2">Service Details</h3>
                <p className="font-medium">
                  {cartItems[selectedServiceIndex].title}
                </p>
                <p className="text-sm text-gray-600">
                  Location: {cartItems[selectedServiceIndex].location}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Date
                </label>
                <Calendar
                  mode="single"
                  selected={editingDate}
                  onSelect={setEditingDate}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Time
                </label>
                <input
                  type="time"
                  value={editingTime.replace(" AM", "").replace(" PM", "")}
                  onChange={(e) => setEditingTime(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <textarea
                  rows={4}
                  value={editingNote}
                  onChange={(e) => setEditingNote(e.target.value)}
                  placeholder="Leave a note..."
                  className="w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <Button
                onClick={handleSaveChanges}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2">
                Save Changes
              </Button>

              <Button
                onClick={() => setSelectedServiceIndex(null)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white mb-2">
                Back to Overview
              </Button>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Click to Pay
              </Button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-md font-semibold mb-2">Order Overview</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click on a service to view and edit details
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Services in Cart:</h4>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-400 pl-3">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.date} at {item.time}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-2">Quick Summary</h4>
                <p className="text-sm text-gray-600">
                  Total Services: {cartItems.length}
                </p>
                <p className="text-sm text-gray-600">Total Amount: $1,773.00</p>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Click to Pay
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
