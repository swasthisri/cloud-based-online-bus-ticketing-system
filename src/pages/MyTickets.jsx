import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import { Ticket, Clock, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyTickets = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchBookings = async () => {
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
        .eq('user_id', user.id)
        .order('booked_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleCancelClick = () => {
    fetchBookings(); // Refresh the list after cancellation
  };

  const now = new Date();

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const departureDate = new Date(booking.schedules.departure_time);
    const isPast = departureDate < now;
    
    if (activeTab === 'upcoming') {
      return !isPast && booking.status === 'confirmed';
    } else if (activeTab === 'past') {
      return isPast && booking.status === 'confirmed';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              <Ticket className="h-8 w-8 text-primary" />
              My Tickets
            </h1>
            <p className="text-slate-500 mt-2">Manage your current and past bookings</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-slate-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${activeTab === 'upcoming' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              <Clock className="w-4 h-4" /> Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${activeTab === 'past' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              <CheckCircle2 className="w-4 h-4" /> Past Journeys
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${activeTab === 'cancelled' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              <XCircle className="w-4 h-4" /> Cancelled
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
             </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <TicketCard 
                key={booking.id} 
                booking={booking} 
                onCancel={handleCancelClick}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center animation-fade-in-up">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                No {activeTab} tickets found
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Looks like you don't have any bookings in this list yet. Plan your next adventure with SwiftBus!
              </p>
              <a 
                href="/"
                className="inline-block bg-primary hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
              >
                Book a Ticket
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyTickets;
