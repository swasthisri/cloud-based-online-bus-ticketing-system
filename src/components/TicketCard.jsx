import React, { useState } from 'react';
import { Download, Calendar, MapPin, X, Check, XCircle } from 'lucide-react';
import { formatDate, formatTime } from '../utils/helpers';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const TicketCard = ({ booking, onCancel }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancelClick = async () => {
    setIsCancelling(true);
    try {
      // 1. Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);
        
      if (bookingError) throw bookingError;

      // 2. Increase available seats in schedule
      const seatCount = booking.seat_numbers.length;
      
      // We need to fetch current available seats first
      const { data: schedule, error: fetchError } = await supabase
        .from('schedules')
        .select('available_seats')
        .eq('id', booking.schedule_id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const { error: scheduleError } = await supabase
        .from('schedules')
        .update({ available_seats: schedule.available_seats + seatCount })
        .eq('id', booking.schedule_id);
        
      if (scheduleError) throw scheduleError;

      toast.success('Ticket cancelled successfully');
      setShowConfirm(false);
      if (onCancel) onCancel();
    } catch (error) {
      toast.error('Failed to cancel ticket');
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const isUpcoming = new Date(booking.schedules.departure_time) > new Date() && booking.status === 'confirmed';
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className={`h-2 w-full absolute top-0 left-0 ${isCancelled ? 'bg-red-500' : isUpcoming ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Booking ID</div>
            <div className="font-mono font-bold text-slate-800">{booking.id.substring(0, 8).toUpperCase()}</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isCancelled ? 'bg-red-50 text-red-600' : 
            isUpcoming ? 'bg-emerald-50 text-emerald-600' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {booking.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold text-slate-800">{formatDate(booking.schedules.departure_time)}</span>
            </div>
            
            <div className="flex flex-col gap-4 pl-2 relative before:absolute before:inset-y-3 before:left-[11px] before:w-0.5 before:bg-slate-200">
              <div className="relative flex items-center gap-4">
                <div className="absolute -left-2 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary z-10"></div>
                <div>
                  <div className="font-bold text-lg text-slate-800">{formatTime(booking.schedules.departure_time)}</div>
                  <div className="font-medium text-slate-500">{booking.schedules.routes.source}</div>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className="absolute -left-2 top-1.5 w-3 h-3 rounded-full bg-primary z-10"></div>
                <div>
                  <div className="font-bold text-lg text-slate-800">{formatTime(booking.schedules.arrival_time)}</div>
                  <div className="font-medium text-slate-500">{booking.schedules.routes.destination}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-500">Bus Details</span>
              <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{booking.schedules.buses.bus_number}</span>
            </div>
            
            <div className="mb-4">
              <span className="text-sm font-medium text-slate-500 block mb-1">Passengers ({booking.passenger_names.length})</span>
              <div className="text-slate-800 font-medium">
                {booking.passenger_names.join(', ')}
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm font-medium text-slate-500 block mb-1">Seats</span>
                <div className="flex gap-2 flex-wrap">
                  {booking.seat_numbers.map((seat) => (
                    <span key={seat} className="bg-primary/10 text-primary font-bold text-xs px-2 py-1 rounded">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-slate-500 block mb-1">Total Paid</span>
                <span className="font-bold text-xl text-emerald-600">₹{booking.total_price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium text-sm">
            <Download className="w-4 h-4" />
            Download e-Ticket
          </button>
          
          {isUpcoming && !showConfirm && (
            <button 
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
            >
              Cancel Booking
            </button>
          )}

          {showConfirm && (
            <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
              <span className="text-sm text-red-800 font-medium">Are you sure?</span>
              <button 
                onClick={handleCancelClick}
                disabled={isCancelling}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : <React.Fragment><Check className="w-3 w-3" /> Yes</React.Fragment>}
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isCancelling}
                className="flex items-center gap-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
              >
                <XCircle className="w-3 h-3" /> No
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
