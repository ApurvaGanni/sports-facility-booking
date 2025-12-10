import React from "react";
import { FiClock } from "react-icons/fi";

// Generate time slots from 6:00 to 20:00 (8 PM)
const HOURS = Array.from({ length: 15 }, (_, i) => 6 + i);

// Format hour to 12-hour format with AM/PM
const formatTime = (hour) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return { hour: displayHour, ampm };
};

export default function SlotSelector({ selectedHour, onSelect, disabled = false }) {
  // Get current hour to highlight the next available slot
  const currentHour = new Date().getHours();
  const isPastHour = (hour) => hour < currentHour;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 flex items-center">
        <FiClock className="mr-2" /> Select a time slot
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {HOURS.map((h) => {
          const startTime = formatTime(h);
          const endTime = formatTime(h + 1);
          const isPast = isPastHour(h);
          const isSelected = selectedHour === h;
          
          return (
            <button
              key={h}
              type="button"
              onClick={() => !isPast && onSelect(h)}
              disabled={disabled || isPast}
              className={`
                relative p-3 rounded-lg border text-center transition-all duration-150
                ${isPast 
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
                  : isSelected 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'}
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              `}
              title={isPast ? "This time slot has passed" : `Book from ${h}:00 - ${h + 1}:00`}
            >
              <div className="text-sm font-medium">
                {startTime.hour}:00{startTime.ampm !== endTime.ampm ? startTime.ampm : ''}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                to {endTime.hour}:00{endTime.ampm}
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 h-4 w-4 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {isPast && (
                <div className="absolute inset-0 bg-white/50 rounded-lg"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center text-xs text-gray-500 mt-2">
        <div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-300 mr-1"></div>
        <span>Selected</span>
        <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 ml-3 mr-1"></div>
        <span>Available</span>
        <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200 ml-3 mr-1 opacity-40"></div>
        <span>Unavailable</span>
      </div>
    </div>
  );
}
