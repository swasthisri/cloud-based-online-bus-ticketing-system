import React from 'react';
import { Bus, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Bus className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">SwiftBus</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 gap-2">
              The premier online bus ticketing platform. Book your journeys with ease, comfort, and security.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors">Search Buses</Link></li>
              <li><Link to="/my-tickets" className="hover:text-primary transition-colors">My Bookings</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Offers & Discounts</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>123 Transit Hub Blvd, Metro City, 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@swiftbus.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SwiftBus Ticketing System. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm">Made with React & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
