import React from 'react';
import { Shield, Clock, IndianRupee, Star, Quote } from 'lucide-react';
import SearchForm from '../components/SearchForm';

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-800 text-white min-h-[500px] flex items-center pt-16 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Book Your <span className="text-amber-400">Bus Tickets</span> Online
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 font-light">
            Fast, secure, and hassle-free booking. Over 500+ routes across the country.
          </p>
        </div>
      </section>

      {/* Search Form (Overlapping Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-20 mb-20">
        <SearchForm />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Why Choose SwiftBus</h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Easy Booking</h3>
            <p className="text-slate-600 leading-relaxed">
              Book your tickets in just 3 clicks. Simple interface, quick selection, and instant confirmation.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow transform md:-translate-y-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Safe Travel</h3>
            <p className="text-slate-600 leading-relaxed">
              We partner only with verified, top-rated operators to ensure your journey is secure.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IndianRupee className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Best Prices</h3>
            <p className="text-slate-600 leading-relaxed">
              Transparent pricing with zero hidden fees. Enjoy exclusive discounts on advanced bookings.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Popular Routes</h2>
              <p className="text-slate-500 mt-2">Explore our most frequently traveled destinations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { from: "Mumbai", to: "Pune", price: 450, img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { from: "Delhi", to: "Jaipur", price: 600, img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { from: "Bangalore", to: "Chennai", price: 850, img: "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { from: "Hyderabad", to: "Vijayawada", price: 500, img: "https://images.unsplash.com/photo-1588731247530-4076bfc54c41?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { from: "Pune", to: "Goa", price: 1200, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
              { from: "Ahmedabad", to: "Mumbai", price: 900, img: "https://images.unsplash.com/photo-1566324483737-f1be20cebe43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            ].map((route, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 block border border-slate-100">
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={route.img} alt={`${route.from} to ${route.to}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full font-bold text-sm text-slate-800 z-20 shadow-lg">
                  ₹{route.price}
                </div>
                <div className="bg-white p-5 border-t border-slate-100 z-20 relative">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg text-slate-800">{route.from}</span>
                    <div className="flex-1 border-t-2 border-dashed border-slate-200 relative">
                      <div className="w-2 h-2 rounded-full border-2 border-primary bg-white absolute -top-1 right-0"></div>
                    </div>
                    <span className="font-semibold text-lg text-slate-800">{route.to}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">What Our Travelers Say</h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Rahul Sharma", route: "Mumbai to Pune", text: "The booking process was incredibly smooth. I loved being able to select my exact seat. The bus arrived on time." },
            { name: "Priya Patel", route: "Delhi to Jaipur", text: "Best prices I could find online. The customer support was helpful when I needed to change my travel date." },
            { name: "Vikram Singh", route: "Bangalore to Chennai", text: "A very premium experience using this website. The e-ticket feature saved me a lot of hassle at the boarding point." }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative pt-12">
              <div className="absolute -top-6 left-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <Quote className="h-5 w-5 text-white" />
              </div>
              <div className="flex text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-slate-600 mb-6 italic leading-relaxed text-sm">"{testimonial.text}"</p>
              <div>
                <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{testimonial.route}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
