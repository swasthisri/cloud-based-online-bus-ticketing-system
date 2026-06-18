import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import {
  Home,
  Login,
  Register,
  SearchResults,
  SeatSelection,
  BookingConfirmation,
  MyTickets,
  Admin
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/seat-selection/:scheduleId" element={<SeatSelection />} />
                <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                {/* Normally Admin should have role check */}
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
