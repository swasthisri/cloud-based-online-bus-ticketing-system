import React from 'react';
import { Compass as SteeringWheel } from 'lucide-react';

const generateSeats = () => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows.forEach(row => {
    seats.push(`${row}1`);
    seats.push(`${row}2`);
    seats.push(`${row}3`);
    seats.push(`${row}4`);
  });
  return seats;
};

const SeatMap = ({ bookedSeats, selectedSeats, onSeatClick }) => {
  const allSeats = generateSeats();

  const handleSeatClick = (seatId, isBooked) => {
    if (isBooked) return;
    onSeatClick(seatId);
  };

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* Bus Body Frame */}
      <div className="bg-slate-100 border-4 border-slate-300 rounded-[40px_40px_20px_20px] p-6 pt-12 shadow-2xl relative overflow-hidden">
        
        {/* Roof Accent */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-slate-200/50"></div>
        
        {/* Front Section (Driver & Door) */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-slate-200">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-4 border-slate-400 flex items-center justify-center bg-white shadow-inner animate-pulse-slow">
              <SteeringWheel className="w-6 h-6 text-slate-500 transform -rotate-12" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Driver</span>
          </div>
          
          <div className="w-16 h-4 bg-slate-300 rounded-full flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-400/30 rounded-full"></div>
          </div>
          
          <div className="text-right">
            <div className="w-10 h-8 border-r-4 border-slate-300 rounded-r-lg bg-slate-200/50 flex items-center justify-end pr-1">
              <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mt-1">Entry</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-5 gap-y-5 gap-x-2 relative z-10">
          {allSeats.map((seatId, index) => {
            const isBooked = bookedSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);
            
            // Create aisle gap (2nd column is aisle)
            const colIndex = index % 4;
            const isAisle = colIndex === 1;

            return (
              <React.Fragment key={seatId}>
                <div className="relative group">
                  <button
                    onClick={() => handleSeatClick(seatId, isBooked)}
                    disabled={isBooked}
                    title={isBooked ? `Seat ${seatId} (Booked)` : `Seat ${seatId}`}
                    className={`
                      relative w-10 h-11 transition-all duration-300 transform
                      flex flex-col items-center justify-center
                      ${isBooked ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 active:scale-95 cursor-pointer'}
                    `}
                  >
                    {/* Seat Visual Component */}
                    <div className={`
                      w-9 h-9 rounded-lg relative z-10 border-2
                      ${isBooked ? 'bg-slate-300 border-slate-400' : ''}
                      ${isSelected ? 'bg-primary border-blue-600 shadow-lg shadow-blue-200' : ''}
                      ${!isBooked && !isSelected ? 'bg-white border-emerald-500 hover:border-emerald-600' : ''}
                    `}>
                      {/* Cushion lines */}
                      <div className={`absolute top-1 left-1.5 right-1.5 h-0.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-slate-100'}`}></div>
                      
                      <span className={`
                        text-[10px] font-black
                        ${isBooked ? 'text-slate-500' : ''}
                        ${isSelected ? 'text-white' : 'text-slate-700'}
                      `}>
                        {seatId}
                      </span>
                    </div>
                    
                    {/* Seat Back Rest */}
                    <div className={`
                      absolute -top-1 w-8 h-3 rounded-t-md border-x-2 border-t-2
                      ${isBooked ? 'bg-slate-300 border-slate-400' : ''}
                      ${isSelected ? 'bg-primary border-blue-600' : ''}
                      ${!isBooked && !isSelected ? 'bg-white border-emerald-500' : ''}
                    `}></div>
                    
                    {/* Selected Indicator Glow */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 blur-md rounded-full -z-10 animate-pulse"></div>
                    )}
                  </button>
                </div>
                
                {isAisle && (
                  <div className="w-4 h-full flex items-center justify-center">
                    <div className="w-0.5 h-full bg-slate-200 rounded-full opacity-50"></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between gap-1">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-white border-2 border-emerald-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Available</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-primary border-2 border-blue-600"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Selected</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-slate-300 border-2 border-slate-400"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;

