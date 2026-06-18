import React from 'react';
import { Clock, Users, Wifi, Wind, MapPin, Zap, Coffee } from 'lucide-react';
import { formatTime, formatDuration } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const BusCard = ({ schedule }) => {
  const navigate = useNavigate();
  const { buses: bus, routes: route, departure_time, arrival_time, price, available_seats, id } = schedule;

  // Helper to map amenity to an icon
  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4 text-emerald-500" />;
      case 'ac': return <Wind className="w-4 h-4 text-sky-500" />;
      case 'charging point': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'water bottle': return <Coffee className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const isAC = bus.bus_type?.toLowerCase().includes('ac');

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
      
      {/* Time & Route Info */}
      <div className="p-6 flex-grow flex flex-col md:flex-row gap-6 relative">
        <div className="flex-1 flex justify-between items-center relative">
          {/* Departure */}
          <div className="text-center w-1/3">
            <div className="text-2xl font-bold text-slate-800">{formatTime(departure_time)}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">{route.source}</div>
          </div>
          
          {/* Duration Graphic */}
          <div className="w-1/3 flex flex-col items-center justify-center relative z-10">
            <span className="text-xs font-semibold text-slate-400 mb-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
              {formatDuration(route.duration_hours)}
            </span>
            <div className="w-full h-px bg-slate-300 relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary absolute -left-1"></div>
              <div className="w-2 h-2 rounded-full bg-primary absolute -right-1"></div>
              <MapPin className="h-4 w-4 text-slate-400 bg-white" />
            </div>
            <span className="text-xs text-slate-400 mt-2">{route.distance_km} km</span>
          </div>
          
          {/* Arrival */}
          <div className="text-center w-1/3">
            <div className="text-2xl font-bold text-slate-800">{formatTime(arrival_time)}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">{route.destination}</div>
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px bg-slate-100 mx-4"></div>

        {/* Horizontal Divider (Mobile) */}
        <div className="md:hidden h-px bg-slate-100 w-full my-2"></div>

        {/* Bus Info */}
        <div className="md:w-48 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-slate-800 tracking-tight">{bus.bus_name}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {bus.bus_type}
            </span>
          </div>
          <div className="flex gap-2 items-center text-sm text-slate-600 mb-2">
            <Users className="w-4 h-4 text-blue-500" /> 
            <span className="font-medium">{available_seats} Seats</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {bus.amenities?.map((amenity, idx) => (
              <div key={idx} className="bg-slate-50 p-1.5 rounded-full border border-slate-100" title={amenity}>
                {getAmenityIcon(amenity)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-slate-50 w-full md:w-64 p-6 flex flex-row md:flex-col items-center justify-between border-t md:border-t-0 md:border-l border-slate-100">
        <div className="text-left md:text-center w-full">
          <p className="text-sm font-medium text-slate-500 mb-1">Starting from</p>
          <div className="text-3xl font-bold text-emerald-600">₹{price}</div>
        </div>
        <button 
          onClick={() => navigate(`/seat-selection/${id}`)}
          className="mt-0 md:mt-4 w-auto md:w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md shadow-blue-200 transition-all transform hover:-translate-y-0.5"
        >
          Select Seats
        </button>
      </div>
    </div>
  );
};

export default BusCard;
