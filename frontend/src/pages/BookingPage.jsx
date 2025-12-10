import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiDollarSign, FiInfo, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import SlotSelector from "../components/SlotSelector.jsx";
import PriceBreakdown from "../components/PriceBreakdown.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hour, setHour] = useState(new Date().getHours() + 1); // Default to next hour
  const [rackets, setRackets] = useState(0);
  const [shoes, setShoes] = useState(0);
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState({
    courts: true,
    coaches: true,
    price: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: null, message: "" });
  const [formErrors, setFormErrors] = useState({});
  
  const availableRackets = 10; // This should come from your API
  const availableShoes = 15;   // This should come from your API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courtsRes, coachesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/courts`),
          axios.get(`${API_BASE}/api/coaches`)
        ]);
        setCourts(courtsRes.data);
        setCoaches(coachesRes.data);
        
        // Auto-select first court if available
        if (courtsRes.data.length > 0) {
          setSelectedCourt(courtsRes.data[0]._id);
        }
        
        setLoading(prev => ({ ...prev, courts: false, coaches: false }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification({
          type: 'error',
          message: 'Failed to load courts and coaches. Please refresh the page.'
        });
        setLoading(prev => ({ ...prev, courts: false, coaches: false }));
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCourt) return;
    
    const fetchPrice = async () => {
      const startTime = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
      setLoading(prev => ({ ...prev, price: true }));
      
      try {
        const response = await axios.post(`${API_BASE}/api/bookings/preview-price`, {
          courtId: selectedCourt,
          startTime,
          rackets,
          shoes
        });
        setPrice(response.data);
        setFormErrors(prev => ({ ...prev, price: null }));
      } catch (error) {
        console.error("Error fetching price:", error);
        setPrice(null);
        setFormErrors(prev => ({
          ...prev,
          price: 'Failed to calculate price. Please try again.'
        }));
      } finally {
        setLoading(prev => ({ ...prev, price: false }));
      }
    };
    
    const debounceTimer = setTimeout(fetchPrice, 300); // Debounce to prevent excessive API calls
    return () => clearTimeout(debounceTimer);
  }, [selectedCourt, date, hour, rackets, shoes]);

  async function handleSubmit(e) {
    e.preventDefault();
    setNotification({ type: null, message: "" });
    
    // Validate form
    const errors = {};
    if (!selectedCourt) errors.court = "Please select a court";
    if (!userName.trim()) errors.userName = "Please enter your name";
    if (rackets < 0) errors.rackets = "Number of rackets cannot be negative";
    if (shoes < 0) errors.shoes = "Number of shoes cannot be negative";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setNotification({
        type: 'error',
        message: 'Please fix the errors in the form.'
      });
      return;
    }
    
    setFormErrors({});

    try {
      setSubmitting(true);
      const startTime = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const res = await axios.post(`${API_BASE}/api/bookings`, {
        userName,
        courtId: selectedCourt,
        startTime,
        endTime,
        resources: {
          rackets: parseInt(rackets) || 0,
          shoes: parseInt(shoes) || 0,
          coach: selectedCoach || null,
        },
      });

      setNotification({
        type: 'success',
        message: `Booking confirmed! Your booking ID is ${res.data._id}. You'll receive a confirmation email shortly.`
      });
      
      // Reset form but keep the court and time selection
      setUserName("");
      setRackets(0);
      setShoes(0);
      setSelectedCoach("");
      setPrice(null);
    } catch (err) {
      console.error("Error creating booking:", err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || "Failed to create booking. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Format the selected date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get selected court details
  const selectedCourtDetails = courts.find(court => court._id === selectedCourt);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Book a Court</h1>
          <p className="mt-1 text-sm text-gray-500">
            Reserve your court and equipment in just a few clicks
          </p>
        </div>
        
        {/* Notification Area */}
        {notification.message && (
          <div 
            className={`px-6 py-3 ${
              notification.type === 'error' 
                ? 'bg-red-50 text-red-800 border-l-4 border-red-500' 
                : 'bg-green-50 text-green-800 border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'error' ? (
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <FiCheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          <div className="px-6 py-6 space-y-8">
            {/* Court & Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Court Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Court
                </label>
                <div className="mt-1 relative">
                  {loading.courts ? (
                    <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
                  ) : (
                    <select
                      value={selectedCourt}
                      onChange={(e) => setSelectedCourt(e.target.value)}
                      className={`w-full pl-3 pr-10 py-2 text-base border ${
                        formErrors.court ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                      aria-invalid={!!formErrors.court}
                      aria-describedby={formErrors.court ? 'court-error' : undefined}
                    >
                      <option value="">Select a court</option>
                      {courts.map((court) => (
                        <option key={court._id} value={court._id}>
                          {court.name} ({court.type.charAt(0).toUpperCase() + court.type.slice(1)})
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.court && (
                    <p className="mt-1 text-sm text-red-600" id="court-error">
                      {formErrors.court}
                    </p>
                  )}
                </div>
                
                {selectedCourtDetails && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <FiInfo className="mr-1 flex-shrink-0" />
                    <span>Base rate: ${selectedCourtDetails.basePrice}/hour</span>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 30 days in the future
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mt-1 text-sm text-indigo-600">
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <SlotSelector 
                selectedHour={hour} 
                onSelect={setHour} 
                disabled={!selectedCourt || loading.price}
              />
              {loading.price && (
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  Calculating availability...
                </div>
              )}
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - User Info & Options */}
              <div className="lg:col-span-2 space-y-6">
                {/* User Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Your Information</h3>
                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className={`block w-full px-3 py-2 border ${
                        formErrors.userName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="John Doe"
                      aria-invalid={!!formErrors.userName}
                      aria-describedby={formErrors.userName ? 'name-error' : undefined}
                    />
                    {formErrors.userName && (
                      <p className="mt-1 text-sm text-red-600" id="name-error">
                        {formErrors.userName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Equipment Selection */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Add Equipment</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Tennis Rackets</h4>
                        <p className="text-sm text-gray-500">$5 per racket</p>
                        {formErrors.rackets && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.rackets}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setRackets(Math.max(0, rackets - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          disabled={rackets <= 0}
                          aria-label="Remove one racket"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">{rackets}</span>
                        <button
                          type="button"
                          onClick={() => setRackets(rackets + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          aria-label="Add one racket"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">Tennis Shoes</h4>
                        <p className="text-sm text-gray-500">$3 per pair</p>
                        {formErrors.shoes && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.shoes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setShoes(Math.max(0, shoes - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          disabled={shoes <= 0}
                          aria-label="Remove one pair of shoes"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium">{shoes}</span>
                        <button
                          type="button"
                          onClick={() => setShoes(shoes + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          aria-label="Add one pair of shoes"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coach Selection */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Add a Coach (Optional)</h3>
                  <div className="space-y-2">
                    {loading.coaches ? (
                      <div className="animate-pulse h-10 bg-gray-200 rounded-md"></div>
                    ) : (
                      <select
                        value={selectedCoach}
                        onChange={(e) => setSelectedCoach(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">No coach (self-play)</option>
                        {coaches
                          .filter(coach => coach.isAvailable)
                          .map((coach) => (
                            <option key={coach._id} value={coach._id}>
                              {coach.name} ({coach.sport.charAt(0).toUpperCase() + coach.sport.slice(1)} Coach)
                            </option>
                          ))}
                      </select>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Adding a coach provides professional guidance during your session.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
                    </div>
                    
                    <div className="p-4">
                      {selectedCourtDetails ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{selectedCourtDetails.name}</h4>
                            <p className="text-sm text-gray-500">
                              {selectedCourtDetails.type.charAt(0).toUpperCase() + selectedCourtDetails.type.slice(1)} Court
                            </p>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time:</span>
                              <span className="font-medium">
                                {hour}:00 - {hour + 1}:00 {hour >= 12 ? 'PM' : 'AM'}
                              </span>
                            </div>
                            {selectedCoach && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Coach:</span>
                                <span className="font-medium">
                                  {coaches.find(c => c._id === selectedCoach)?.name}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="border-t border-gray-200 pt-3">
                            <PriceBreakdown price={price} loading={loading.price} />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={submitting || loading.price || !price || !userName.trim()}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                              submitting || loading.price || !price || !userName.trim()
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                          >
                            {submitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : 'Confirm Booking'}
                          </button>
                          
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            You won't be charged until you confirm your booking
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                            <FiInfo className="h-6 w-6 text-indigo-600" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a court</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Choose a court and time to see pricing and availability
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Need help?</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Contact us at{' '}
                            <a href="mailto:support@sportsfacility.com" className="font-medium underline">
                              support@sportsfacility.com
                            </a>{' '}
                            or call (555) 123-4567
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
