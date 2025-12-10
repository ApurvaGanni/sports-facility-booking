import React from 'react';
import { FiDollarSign, FiInfo } from 'react-icons/fi';

export default function PriceBreakdown({ price, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!price) return null;

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <h4 className="text-sm font-medium text-blue-800 flex items-center mb-2">
        <FiDollarSign className="mr-1" /> Price Breakdown
      </h4>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Price:</span>
          <span className="font-medium">${price.basePrice.toFixed(2)}</span>
        </div>
        
        {price.weekendFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Weekend Surcharge:</span>
            <span className="text-amber-600">+${price.weekendFee.toFixed(2)}</span>
          </div>
        )}
        
        {price.peakHourFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Peak Hours:</span>
            <span className="text-amber-600">+${price.peakHourFee.toFixed(2)}</span>
          </div>
        )}
        
        {price.courtTypeFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Court Type:</span>
            <span className="text-amber-600">+${price.courtTypeFee.toFixed(2)}</span>
          </div>
        )}
        
        {price.equipmentFee > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Equipment:</span>
            <span className="text-amber-600">+${price.equipmentFee.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-semibold text-blue-900">
          <span>Total:</span>
          <span>${price.total.toFixed(2)}</span>
        </div>
      </div>
      
      {(price.weekendFee > 0 || price.peakHourFee > 0) && (
        <div className="mt-2 text-xs text-blue-600 flex items-start">
          <FiInfo className="flex-shrink-0 mr-1 mt-0.5" />
          <span>Dynamic pricing applied based on your selected time and date.</span>
        </div>
      )}
    </div>
  );
}
