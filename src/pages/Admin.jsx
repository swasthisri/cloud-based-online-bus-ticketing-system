import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Map, Bus, CalendarClock, TicketCheck, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('buses');
  
  // Data State
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [busForm, setBusForm] = useState({ name: '', number: '', type: 'AC', seats: 40, amenities: '' });
  const [routeForm, setRouteForm] = useState({ source: '', destination: '', distance: '', duration: '' });
  const [scheduleForm, setScheduleForm] = useState({ busId: '', routeId: '', departure: '', arrival: '', price: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: bData }, { data: rData }, { data: sData }, { data: bkData }] = await Promise.all([
        supabase.from('buses').select('*').order('created_at', { ascending: false }),
        supabase.from('routes').select('*'),
        supabase.from('schedules').select('*, buses(*), routes(*)').order('departure_time', { ascending: true }),
        supabase.from('bookings').select('*, users:user_id(email), schedules(*, routes(*), buses(*))').order('booked_at', { ascending: false })
      ]);
      
      setBuses(bData || []);
      setRoutes(rData || []);
      setSchedules(sData || []);
      setBookings(bkData || []);

      // Defaults for schedule form if data exists
      if (bData?.length > 0 && rData?.length > 0 && !scheduleForm.busId) {
        setScheduleForm(prev => ({ ...prev, busId: bData[0].id, routeId: rData[0].id }));
      }
    } catch (error) {
      toast.error('Failed to fetch admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArray = busForm.amenities.split(',').map(i => i.trim()).filter(i => i);
      const { error } = await supabase.from('buses').insert({
        bus_name: busForm.name,
        bus_number: busForm.number,
        bus_type: busForm.type,
        total_seats: parseInt(busForm.seats),
        amenities: amenitiesArray
      });
      if (error) throw error;
      toast.success('Bus added successfully');
      setBusForm({ name: '', number: '', type: 'AC', seats: 40, amenities: '' });
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('routes').insert({
        source: routeForm.source,
        destination: routeForm.destination,
        distance_km: parseInt(routeForm.distance),
        duration_hours: parseFloat(routeForm.duration)
      });
      if (error) throw error;
      toast.success('Route added successfully');
      setRouteForm({ source: '', destination: '', distance: '', duration: '' });
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      // Find bus to set initial available seats
      const targetBus = buses.find(b => b.id === scheduleForm.busId);
      
      const { error } = await supabase.from('schedules').insert({
        bus_id: scheduleForm.busId,
        route_id: scheduleForm.routeId,
        departure_time: scheduleForm.departure,
        arrival_time: scheduleForm.arrival,
        price: parseFloat(scheduleForm.price),
        available_seats: targetBus ? targetBus.total_seats : 40
      });
      if (error) throw error;
      toast.success('Schedule added successfully');
      setScheduleForm({ ...scheduleForm, departure: '', arrival: '', price: '' });
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading admin data...</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex bg-white rounded-lg shadow-sm border border-slate-200 mb-8 overflow-hidden flex-wrap md:flex-nowrap">
          <button 
            onClick={() => setActiveTab('buses')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors border-b-2 sm:border-b-0 sm:border-r ${activeTab === 'buses' ? 'bg-blue-50 text-primary border-primary' : 'text-slate-600 hover:bg-slate-50 border-transparent sm:border-slate-100'}`}
          >
            <Bus className="w-5 h-5" /> Manage Buses
          </button>
          <button 
            onClick={() => setActiveTab('routes')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors border-b-2 sm:border-b-0 sm:border-r ${activeTab === 'routes' ? 'bg-amber-50 text-amber-600 border-amber-500' : 'text-slate-600 hover:bg-slate-50 border-transparent sm:border-slate-100'}`}
          >
            <Map className="w-5 h-5" /> Manage Routes
          </button>
          <button 
            onClick={() => setActiveTab('schedules')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors border-b-2 sm:border-b-0 sm:border-r ${activeTab === 'schedules' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'text-slate-600 hover:bg-slate-50 border-transparent sm:border-slate-100'}`}
          >
            <CalendarClock className="w-5 h-5" /> Manage Schedules
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors ${activeTab === 'bookings' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-500' : 'text-slate-600 hover:bg-slate-50 border-transparent border-b-2'}`}
          >
            <TicketCheck className="w-5 h-5" /> View Bookings
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          {/* BUS TAB */}
          {activeTab === 'buses' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-primary"/> Add New Bus</h3>
                <form onSubmit={handleAddBus} className="space-y-4">
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Bus Name</label><input required className="w-full p-2 border rounded" value={busForm.name} onChange={e => setBusForm({...busForm, name: e.target.value})} placeholder="e.g. Swift Express" /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Bus Number</label><input required className="w-full p-2 border rounded" value={busForm.number} onChange={e => setBusForm({...busForm, number: e.target.value})} placeholder="e.g. MH-12-AB-1234" /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
                    <select className="w-full p-2 border rounded" value={busForm.type} onChange={e => setBusForm({...busForm, type: e.target.value})}>
                      <option>AC</option><option>Non-AC</option><option>Sleeper</option><option>Semi-Sleeper</option>
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Seats (Generates SeatMap visual)</label><input type="number" required className="w-full p-2 border rounded" value={busForm.seats} onChange={e => setBusForm({...busForm, seats: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Amenities</label><input className="w-full p-2 border rounded" value={busForm.amenities} onChange={e => setBusForm({...busForm, amenities: e.target.value})} placeholder="WiFi, AC, Water Bottle" /></div>
                  <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-blue-700">Add Bus</button>
                </form>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Existing Buses</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left"><thead className="bg-slate-50 font-semibold border-b"><tr><th className="p-3">Bus Name & Number</th><th className="p-3">Type / Seats</th><th className="p-3 text-right">Action</th></tr></thead>
                  <tbody>
                    {buses.map(b => (
                      <tr key={b.id} className="border-b"><td className="p-3"><div className="font-bold">{b.bus_name}</div><div className="text-slate-500">{b.bus_number}</div></td><td className="p-3">{b.bus_type} - {b.total_seats} seats</td>
                      <td className="p-3 text-right"><button onClick={() => handleDelete('buses', b.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-5 h-5"/></button></td></tr>
                    ))}
                  </tbody></table>
                </div>
              </div>
            </div>
          )}

          {/* ROUTES TAB */}
          {activeTab === 'routes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-amber-50 p-6 rounded-xl border border-amber-100 h-fit">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-amber-500"/> Add New Route</h3>
                <form onSubmit={handleAddRoute} className="space-y-4">
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Source City</label><input required className="w-full p-2 border rounded" value={routeForm.source} onChange={e => setRouteForm({...routeForm, source: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Destination City</label><input required className="w-full p-2 border rounded" value={routeForm.destination} onChange={e => setRouteForm({...routeForm, destination: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Distance (km)</label><input type="number" required className="w-full p-2 border rounded" value={routeForm.distance} onChange={e => setRouteForm({...routeForm, distance: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Avg Duration (hours)</label><input type="number" step="0.5" required className="w-full p-2 border rounded" value={routeForm.duration} onChange={e => setRouteForm({...routeForm, duration: e.target.value})} /></div>
                  <button type="submit" className="w-full bg-amber-500 text-white py-2 rounded font-bold hover:bg-amber-600">Add Route</button>
                </form>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Existing Routes</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left"><thead className="bg-slate-50 font-semibold border-b"><tr><th className="p-3">Path</th><th className="p-3">Distance / Duration</th><th className="p-3 text-right">Action</th></tr></thead>
                  <tbody>
                    {routes.map(r => (
                      <tr key={r.id} className="border-b"><td className="p-3 font-bold">{r.source} → {r.destination}</td><td className="p-3">{r.distance_km} km / {r.duration_hours}h</td>
                      <td className="p-3 text-right"><button onClick={() => handleDelete('routes', r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-5 h-5"/></button></td></tr>
                    ))}
                  </tbody></table>
                </div>
              </div>
            </div>
          )}

          {/* SCHEDULES TAB */}
          {activeTab === 'schedules' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1 bg-emerald-50 p-6 rounded-xl border border-emerald-100 h-fit">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-500"/> Add Schedule</h3>
                <form onSubmit={handleAddSchedule} className="space-y-4">
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Bus</label>
                    <select required className="w-full p-2 border rounded" value={scheduleForm.busId} onChange={e => setScheduleForm({...scheduleForm, busId: e.target.value})}>
                      {buses.map(b => <option key={b.id} value={b.id}>{b.bus_name} ({b.bus_number})</option>)}
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Route</label>
                    <select required className="w-full p-2 border rounded" value={scheduleForm.routeId} onChange={e => setScheduleForm({...scheduleForm, routeId: e.target.value})}>
                      {routes.map(r => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Departure Time</label><input type="datetime-local" required className="w-full p-2 border rounded" value={scheduleForm.departure} onChange={e => setScheduleForm({...scheduleForm, departure: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Arrival Time</label><input type="datetime-local" required className="w-full p-2 border rounded" value={scheduleForm.arrival} onChange={e => setScheduleForm({...scheduleForm, arrival: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-slate-700 block mb-1">Ticket Price (₹)</label><input type="number" required className="w-full p-2 border rounded" value={scheduleForm.price} onChange={e => setScheduleForm({...scheduleForm, price: e.target.value})} /></div>
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700">Add Schedule</button>
                </form>
              </div>
              <div className="xl:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Active Schedules</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left"><thead className="bg-slate-50 font-semibold border-b"><tr><th className="p-3">Route & Bus</th><th className="p-3">Timings</th><th className="p-3">Price / Seats</th><th className="p-3 text-right">Action</th></tr></thead>
                  <tbody>
                    {schedules.map(s => (
                      <tr key={s.id} className="border-b">
                        <td className="p-3"><div className="font-bold">{s.routes?.source} → {s.routes?.destination}</div><div className="text-xs mt-1 text-slate-500 bg-slate-100 inline-block px-1.5 py-0.5 rounded">{s.buses?.bus_name}</div></td>
                        <td className="p-3 text-xs whitespace-nowrap"><div className="text-emerald-600 font-semibold mb-1">Dep: {new Date(s.departure_time).toLocaleString()}</div><div className="text-slate-500">Arr: {new Date(s.arrival_time).toLocaleString()}</div></td>
                        <td className="p-3"><div>₹{s.price}</div><div className="text-xs text-blue-500 font-medium">{s.available_seats} left</div></td>
                        <td className="p-3 text-right"><button onClick={() => handleDelete('schedules', s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-5 h-5"/></button></td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6">All Bookings</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-left"><thead className="bg-slate-50 font-semibold border-b"><tr><th className="p-3">ID / User</th><th className="p-3">Journey</th><th className="p-3">Seats / Amount</th><th className="p-3">Status</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="border-b">
                      <td className="p-3"><div className="font-mono text-xs mb-1">{b.id.substring(0,8).toUpperCase()}</div><div className="text-slate-500">{b.users?.email}</div></td>
                      <td className="p-3"><div className="font-semibold">{b.schedules?.routes?.source} → {b.schedules?.routes?.destination}</div><div className="text-xs text-slate-500">{new Date(b.schedules?.departure_time).toLocaleDateString()}</div></td>
                      <td className="p-3"><div>{b.seat_numbers.join(', ')}</div><div className="font-bold text-emerald-600 mt-1">₹{b.total_price}</div></td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{b.status}</span></td>
                    </tr>
                  ))}
                  {bookings.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-slate-500">No bookings yet</td></tr>}
                </tbody></table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Admin;
