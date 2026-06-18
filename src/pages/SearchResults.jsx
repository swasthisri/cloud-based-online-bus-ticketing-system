import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { formatDate } from '../utils/helpers';
import BusCard from '../components/BusCard';
import { Filter, SlidersHorizontal, ArrowLeft, Bus, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [busTypeFilter, setBusTypeFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('price_asc');

  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const dateStr = searchParams.get('date');
  const passengers = searchParams.get('passengers') || 1;

  useEffect(() => {
    if (!source || !destination || !dateStr) {
      toast.error('Invalid search parameters');
      navigate('/');
      return;
    }

    const fetchSchedules = async () => {
      setLoading(true);
      try {
        // Find matching routes - use ilike to handle potential trailing spaces in DB
        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('id')
          .ilike('source', source.trim())
          .ilike('destination', destination.trim());

        if (routesError) throw routesError;

        if (!routesData || routesData.length === 0) {
          setSchedules([]);
          return;
        }

        const routeIds = routesData.map(r => r.id);

        // Date boundaries: use plain date string to avoid UTC/local timezone mismatch
        // Departure times in DB are stored as local time (no Z suffix)
        const startOfDay = dateStr + 'T00:00:00';
        const endOfDay = dateStr + 'T23:59:59';

        const { data: schedulesData, error } = await supabase
          .from('schedules')
          .select(`
            id,
            departure_time,
            arrival_time,
            price,
            available_seats,
            routes (*),
            buses (*)
          `)
          .in('route_id', routeIds)
          .gte('departure_time', startOfDay)
          .lte('departure_time', endOfDay)
          .gte('available_seats', parseInt(passengers)); // Ensure enough seats

        if (error) throw error;
        setSchedules(schedulesData || []);
      } catch (error) {
        toast.error('Failed to fetch buses');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [source, destination, dateStr, passengers, navigate]);

  // Apply frontend filters & sorting
  const getFilteredSchedules = () => {
    let filtered = [...schedules];

    // Bus Type filter
    if (busTypeFilter) {
      filtered = filtered.filter(sch => 
        sch.buses.bus_type.toLowerCase().includes(busTypeFilter.toLowerCase())
      );
    }

    // Price Filter
    filtered = filtered.filter(sch => sch.price <= maxPrice);

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'departure_asc') return new Date(a.departure_time) - new Date(b.departure_time);
      if (sortBy === 'duration_asc') return a.routes.duration_hours - b.routes.duration_hours;
      return 0;
    });

    return filtered;
  };

  const filteredSchedules = getFilteredSchedules();

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Top Summary Bar */}
      <div className="bg-primary text-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Back to search"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{source}</span>
              <div className="flex-1 w-8 border-t-2 border-dashed border-white/50 relative">
                <div className="w-2 h-2 rounded-full border border-white bg-primary absolute -top-1 right-0"></div>
              </div>
              <span className="font-bold text-lg">{destination}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-blue-100 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(dateStr)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{passengers} Passenger(s)</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded text-white font-medium transition-colors text-xs"
            >
              Modify
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 w-full">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-40">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-lg mb-6 pb-4 border-b border-slate-100">
              <Filter className="w-5 h-5 text-primary" /> 
              Filters
            </div>

            {/* Filter: Bus Type */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-700 mb-3 text-sm tracking-wide uppercase">Bus Type</h3>
              <div className="space-y-3">
                {['', 'AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="busType" 
                      checked={busTypeFilter === type}
                      onChange={() => setBusTypeFilter(type)}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                      {type === '' ? 'All Types' : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Price Range */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h3 className="font-bold text-slate-700 text-sm tracking-wide uppercase">Max Price</h3>
                <span className="font-bold text-primary">₹{maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="0" max="5000" step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>₹0</span>
                <span>₹5000</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setBusTypeFilter('');
                setMaxPrice(3000);
                setSortBy('price_asc');
              }}
              className="w-full py-2.5 text-sm font-medium text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:w-3/4 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {loading ? 'Searching...' : `${filteredSchedules.length} Buses Found`}
            </h2>
            
            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="price_asc">Price - Low to High</option>
                <option value="price_desc">Price - High to Low</option>
                <option value="departure_asc">Departure - Earliest</option>
                <option value="duration_asc">Duration - Fastest</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              // Loading Skeletons
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 h-48 w-full animate-pulse flex">
                  <div className="p-6 flex-grow flex gap-4">
                    <div className="w-1/3 bg-slate-100 rounded-lg"></div>
                    <div className="w-1/3 bg-slate-100 rounded-lg"></div>
                    <div className="w-1/3 bg-slate-100 rounded-lg"></div>
                  </div>
                  <div className="w-64 bg-slate-50 border-l border-slate-100 p-6 flex flex-col justify-center items-center gap-4">
                    <div className="w-24 h-8 bg-slate-200 rounded"></div>
                    <div className="w-full h-12 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              ))
            ) : filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <BusCard key={schedule.id} schedule={schedule} />
              ))
            ) : (
              // Empty State
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bus className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Buses Found</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  We couldn't find any buses matching your criteria. Try adjusting your filters or searching for a different date.
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors"
                >
                  Modify Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
