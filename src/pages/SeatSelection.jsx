import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SeatMap from '../components/SeatMap';
import { ArrowLeft, User, CreditCard, Clock, MapPin, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatTime, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const SeatSelection = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  const [schedule, setSchedule] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerNames, setPassengerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchScheduleAndBookings = async () => {
      setLoading(true);
      try {
        // 1. Fetch Schedule Details
        const { data: scheduleData, error: scheduleError } = await supabase
          .from('schedules')
          .select(`
            *,
            routes (*),
            buses (*)
          `)
          .eq('id', scheduleId)
          .single();

        if (scheduleError) throw scheduleError;
        setSchedule(scheduleData);

        // 2. Fetch Booked Seats for this schedule
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('seat_numbers')
          .eq('schedule_id', scheduleId)
          .eq('status', 'confirmed');

        if (bookingsError) throw bookingsError;

        // Flatten all booked seat arrays into one array
        const allBookedSeats = bookingsData.reduce((acc, curr) => {
          return [...acc, ...curr.seat_numbers];
        }, []);
        
        setBookedSeats(allBookedSeats);

      } catch (error) {
        toast.error('Failed to load seat layout');
        console.error(error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) fetchScheduleAndBookings();
  }, [scheduleId, navigate]);

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      // Remove seat
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      
      // Remove associated passenger name
      const newNames = { ...passengerNames };
      delete newNames[seatId];
      setPassengerNames(newNames);
    } else {
      // Add seat (limit to 6)
      if (selectedSeats.length >= 6) {
        toast.error('Maximum 6 seats can be selected per booking');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
      setPassengerNames(prev => ({ ...prev, [seatId]: '' }));
    }
  };

  const handleNameChange = (seatId, name) => {
    setPassengerNames(prev => ({ ...prev, [seatId]: name }));
  };

  const handleProceedBook = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const allNamesFilled = selectedSeats.every(seat => passengerNames[seat]?.trim().length > 0);
    if (!allNamesFilled) {
      toast.error('Please enter names for all passengers');
      return;
    }

    setBookingLoading(true);

    try {
      const totalPrice = selectedSeats.length * schedule.price;

      // Ensure realtime capacity isn't exceeded during booking window
      const { data: latestSchedule, error: fetchError } = await supabase
        .from('schedules')
        .select('available_seats')
        .eq('id', scheduleId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (latestSchedule.available_seats < selectedSeats.length) {
        throw new Error("Sorry, not enough seats available anymore.");
      }

      // 1. Insert Booking
      const namesList = selectedSeats.map(seat => passengerNames[seat]);
      
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          schedule_id: scheduleId,
          seat_numbers: selectedSeats,
          passenger_names: namesList,
          total_price: totalPrice,
          status: 'confirmed'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Reduce Available Seats in Schedule
      const newAvailable = latestSchedule.available_seats - selectedSeats.length;
      
      const { error: updateError } = await supabase
        .from('schedules')
        .update({ available_seats: newAvailable })
        .eq('id', scheduleId);

      if (updateError) throw updateError;

      toast.success('Booking Successful!');
      navigate(`/booking-confirmation/${bookingData.id}`);

    } catch (error) {
      toast.error(error.message || 'Booking failed');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!schedule) return null;

  const totalPrice = selectedSeats.length * schedule.price;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-white border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Select Seats</h1>
            <p className="text-slate-500 text-sm">Choose your preferred seats for the journey</p>
          </div>
        </div>

        {/* Trip Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500 mb-1">From</span>
              <span className="text-xl font-bold text-slate-800">{schedule.routes.source}</span>
              <span className="text-sm font-semibold text-slate-600 mt-1">{formatTime(schedule.departure_time)}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center px-4 hidden sm:flex">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-500 mb-2">
                {formatDate(schedule.departure_time)}
              </span>
              <div className="w-32 lg:w-48 h-px bg-slate-300 relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full border-2 border-primary bg-white absolute -left-1"></div>
                <div className="w-2 h-2 rounded-full border-2 border-primary bg-white absolute -right-1"></div>
                <Clock className="w-4 h-4 text-slate-400 bg-white" />
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-slate-500 mb-1">To</span>
              <span className="text-xl font-bold text-slate-800">{schedule.routes.destination}</span>
              <span className="text-sm font-semibold text-slate-600 mt-1">{formatTime(schedule.arrival_time)}</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-200"></div>

          <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 w-full md:w-auto justify-between md:justify-start">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Per Seat</span>
              <span className="text-2xl font-bold text-emerald-600">₹{schedule.price}</span>
            </div>
            <div className="md:hidden">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bus</span>
              <span className="font-bold text-slate-800">{schedule.buses.bus_number}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Seat Map | Passenger Info */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left: Seat Map */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <SeatMap 
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* Right: Passenger Details & Summary */}
          <div className="w-full lg:flex-1 space-y-6">
            
            {/* Passenger Forms */}
            {selectedSeats.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-800">Passenger Details</h3>
                </div>
                
                <div className="p-6 space-y-4">
                  {selectedSeats.map((seatId, index) => (
                    <div key={seatId} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-lg border border-blue-100 bg-blue-50/50">
                      <div className="w-16 h-12 bg-white rounded-lg border border-blue-200 flex flex-col items-center justify-center font-bold text-primary shadow-sm">
                        <span className="text-[10px] text-slate-400 leading-none mb-1 uppercase tracking-wider">Seat</span>
                        {seatId}
                      </div>
                      
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 ml-1 uppercase tracking-wider">Passenger {index + 1} Name</label>
                        <input
                          type="text"
                          required
                          value={passengerNames[seatId] || ''}
                          onChange={(e) => handleNameChange(seatId, e.target.value)}
                          placeholder="Full Name"
                          className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center border-dashed">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Seats Selected</h3>
                <p className="text-slate-500">Please select seats from the layout on the left to proceed with passenger details.</p>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-800">Fare Summary</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Base Fare (×{selectedSeats.length})</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Taxes & Fees</span>
                    <span className="font-medium text-emerald-600">Included</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-slate-800">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">₹{totalPrice}</span>
                </div>

                <button
                  onClick={handleProceedBook}
                  disabled={selectedSeats.length === 0 || bookingLoading}
                  className="w-full py-4 px-6 bg-primary hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_8px_30px_rgb(29,78,216,0.3)] hover:shadow-[0_8px_30px_rgb(29,78,216,0.5)] transition-all transform hover:-translate-y-1 flex justify-center items-center"
                >
                  {bookingLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Payment Processing
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SeatSelection;
