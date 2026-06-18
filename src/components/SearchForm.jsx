import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Calendar, Users, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const SearchForm = ({ compact = false }) => {
  const navigate = useNavigate();

  // Form State
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Fetch unique source and destination cities from routes
        const { data, error } = await supabase.from('routes').select('source, destination');
        if (error) throw error;

        const uniqueCities = new Set();
        data.forEach(route => {
          uniqueCities.add(route.source);
          uniqueCities.add(route.destination);
        });

        // Convert Set back to array and sort alphabetically
        setCities(Array.from(uniqueCities).sort());
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to load cities.');
      }
    };
    fetchCities();
  }, []);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!from || !to) {
      toast.error('Please select both Origin and Destination');
      return;
    }

    if (from === to) {
      toast.error('Origin and Destination cannot be the same');
      return;
    }

    // Format date as YYYY-MM-DD for URL
    const formattedDate = date.toISOString().split('T')[0];

    // Build search parameters safely
    const params = new URLSearchParams({
      source: from,
      destination: to,
      date: formattedDate,
      passengers
    });

    // Navigate to search results
    navigate('/search?' + params.toString());
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-5xl mx-auto border border-blue-50 relative z-10 mt-[-40px]">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">

        {/* Source */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">From</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-slate-50 hover:bg-white transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>Select Origin</option>
              {cities.map(city => (
                <option key={city} value={city} disabled={city === to}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button (Desktop only placeholder for visual) */}
        <div className="hidden md:flex items-center justify-center -mx-2 z-10">
          <button type="button" onClick={handleSwap} className="bg-blue-100 hover:bg-blue-200 text-primary p-2 rounded-full transition-colors shadow-sm">
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">To</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-amber-500" />
            </div>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none bg-slate-50 hover:bg-white transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>Select Destination</option>
              {cities.map(city => (
                <option key={city} value={city} disabled={city === from}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date format override in index.css */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Travel Date</label>
          <div className="relative search-datepicker">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary bg-slate-50 hover:bg-white transition-colors cursor-pointer"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="w-full md:w-32">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Passengers</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-slate-400" />
            </div>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-slate-50 hover:bg-white transition-colors cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-100"
          >
            Search Buses
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
