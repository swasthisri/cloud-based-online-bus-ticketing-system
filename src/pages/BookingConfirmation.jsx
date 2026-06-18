import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CheckCircle, Download, Calendar, MapPin, Bus, User, Users, Navigation } from 'lucide-react';
import { formatDate, formatTime, formatDuration } from '../utils/helpers';
import toast from 'react-hot-toast';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            schedules (
              *,
              routes (*),
              buses (*)
            )
          `)
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        if (!data) {
          toast.error('Booking not found');
          navigate('/');
        }
        
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Could not load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId, navigate]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) return null;

  const { schedules } = booking;
  const { routes, buses } = schedules;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Banner */}
        <div className="text-center mb-10 animation-fade-in-up no-print">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6 shadow-lg shadow-emerald-200">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Booking Confirmed!</h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Your ticket has been booked successfully. A confirmation email has been sent to your registered address.
          </p>
        </div>

        {/* Ticket Container */}
        <div id="printable-ticket" className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative mb-8">
          
          {/* Top Edge Decoration */}
          <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-indigo-500 no-print"></div>
          
          <div className="p-8 pb-0">
            {/* Header: IDs & Status */}
            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Booking Reference</span>
                <span className="text-2xl font-mono font-bold text-slate-800">{booking.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold uppercase tracking-wider inline-block">
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Travel Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 font-medium mb-1">Journey Date</span>
                    <span className="font-bold text-slate-800 text-lg">{formatDate(schedules.departure_time)}</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm text-slate-500 font-medium mb-1">Bus details</span>
                    <span className="font-bold text-slate-800 text-lg block">{buses.bus_name}</span>
                    <span className="text-sm text-slate-500">
                      {buses.bus_type} • {buses.bus_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Journey Path */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex flex-col gap-6 relative before:absolute before:inset-y-3 before:left-[11px] before:w-0.5 before:bg-slate-300">
                  <div className="relative flex items-center gap-5">
                    <div className="absolute -left-2 top-1.5 w-3 h-3 rounded-full bg-white border-[3px] border-emerald-500 z-10 box-content"></div>
                    <div>
                      <span className="font-bold text-xl text-slate-800 block">{formatTime(schedules.departure_time)}</span>
                      <span className="font-medium text-slate-500 text-sm mt-0.5 block">{routes.source}</span>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-5">
                    <div className="absolute -left-2 top-1.5 w-3 h-3 rounded-full bg-primary z-10 box-content"></div>
                    <div>
                      <span className="font-bold text-xl text-slate-800 block">{formatTime(schedules.arrival_time)}</span>
                      <span className="font-medium text-slate-500 text-sm mt-0.5 block">{routes.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="mb-0">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Passenger Details
              </h3>
              
              <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-bold tracking-wider">Passenger Name</th>
                      <th scope="col" className="px-6 py-4 font-bold tracking-wider">Seat Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.passenger_names.map((name, idx) => (
                      <tr key={idx} className="border-b last:border-0 border-slate-100 hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-800">{name}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold bg-blue-100 text-primary px-3 py-1 rounded-md text-xs">
                            {booking.seat_numbers[idx]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Cutout Effect Overlay */}
            <div className="flex items-center -mx-10 mt-8">
              <div className="w-6 h-6 rounded-full bg-slate-50 border-r border-slate-200 relative -left-1"></div>
              <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
              <div className="w-6 h-6 rounded-full bg-slate-50 border-l border-slate-200 relative -right-1"></div>
            </div>
          </div>

          {/* Payment Details Footer */}
          <div className="bg-slate-50 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="block text-sm font-medium text-slate-500 mb-1">Total Amount Paid</span>
              <span className="text-3xl font-extrabold text-slate-800">₹{booking.total_price}</span>
            </div>
            
            <button 
              onClick={handlePrint}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-lg font-bold shadow-lg transition-colors no-print"
            >
              <Download className="w-5 h-5" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 no-print">
          <Link 
            to="/my-tickets" 
            className="w-full sm:w-auto text-center px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Go to My Tickets
          </Link>
          <Link 
            to="/" 
            className="w-full sm:w-auto text-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Book Another Trip
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
