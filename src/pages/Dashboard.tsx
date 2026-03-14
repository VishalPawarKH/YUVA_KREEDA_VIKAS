import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [sports, setSports] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin state
  const [stats, setStats] = useState<any>(null);
  const [newSlot, setNewSlot] = useState({ sportId: '', date: '', startTime: '', endTime: '', capacity: 10 });

  useEffect(() => {
    fetchData();
  }, [user, token, selectedSport]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sports
      const sportsRes = await fetch('/api/sports');
      const sportsData = await sportsRes.json();
      setSports(sportsData);

      // Fetch slots
      const slotsUrl = selectedSport ? `/api/slots?sportId=${selectedSport}` : '/api/slots';
      const slotsRes = await fetch(slotsUrl);
      const slotsData = await slotsRes.json();
      setSlots(slotsData);

      // Fetch user bookings
      if (token) {
        const bookingsRes = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }

        // Fetch admin stats if admin
        if (user?.role === 'admin') {
          const statsRes = await fetch('/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ slotId })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to book slot');
      
      setSuccess('Slot booked successfully!');
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');
      
      setSuccess('Booking cancelled successfully!');
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSlot)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create slot');
      
      setSuccess('Slot created successfully!');
      setNewSlot({ sportId: '', date: '', startTime: '', endTime: '', capacity: 10 });
      fetchData(); // Refresh data
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading && sports.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-emerald-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <div className="mb-12 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Admin Controls</h2>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Users</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Bookings</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Bookings</h3>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.activeBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Slots</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalSlots}</p>
              </div>
            </div>
          )}

          {/* Create Slot Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-emerald-600" /> Create New Slot
            </h3>
            <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Sport</label>
                <select 
                  required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  value={newSlot.sportId}
                  onChange={e => setNewSlot({...newSlot, sportId: e.target.value})}
                >
                  <option value="">Select Sport</option>
                  {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  value={newSlot.date}
                  onChange={e => setNewSlot({...newSlot, date: e.target.value})}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                <input 
                  type="time" required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  value={newSlot.startTime}
                  onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                <input 
                  type="time" required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  value={newSlot.endTime}
                  onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                <input 
                  type="number" min="1" required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                  value={newSlot.capacity}
                  onChange={e => setNewSlot({...newSlot, capacity: parseInt(e.target.value)})}
                />
              </div>
              <div className="md:col-span-1">
                <button type="submit" className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors font-medium">
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Available Slots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-900">Available Slots</h2>
            <select 
              className="rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">All Sports</option>
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>{sport.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.length === 0 ? (
              <p className="text-slate-500 col-span-2 py-8 text-center bg-white rounded-xl border border-slate-200">No slots available for the selected criteria.</p>
            ) : (
              slots.map(slot => {
                const sport = sports.find(s => s.id === slot.sportId);
                const isFull = slot.bookedCount >= slot.capacity;
                const isBookedByUser = bookings.some(b => b.slotId === slot.id && b.status === 'booked');

                return (
                  <div key={slot.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-900">{sport?.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isFull ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {slot.bookedCount} / {slot.capacity} Booked
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-slate-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                        {format(new Date(slot.date), 'MMMM d, yyyy')}
                      </div>
                      <div className="flex items-center text-slate-600 text-sm">
                        <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookSlot(slot.id)}
                      disabled={isFull || isBookedByUser}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isBookedByUser 
                          ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                          : isFull
                            ? 'bg-red-50 text-red-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isBookedByUser ? 'Already Booked' : isFull ? 'Slot Full' : 'Book Slot'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: My Bookings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">My Bookings</h2>
          
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-slate-500 py-8 text-center bg-white rounded-xl border border-slate-200">You haven't booked any slots yet.</p>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className={`bg-white p-5 rounded-xl shadow-sm border ${booking.status === 'cancelled' ? 'border-red-200 opacity-75' : 'border-emerald-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">{booking.sport?.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  {booking.slot && (
                    <div className="space-y-1 mb-4 text-sm text-slate-600">
                      <p>{format(new Date(booking.slot.date), 'MMMM d, yyyy')}</p>
                      <p>{booking.slot.startTime} - {booking.slot.endTime}</p>
                    </div>
                  )}

                  {booking.status === 'booked' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full py-2 px-4 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
