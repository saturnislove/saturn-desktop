import { useState, useEffect } from 'react';
import { Battery, Wifi } from 'lucide-react';
import logoImage from 'figma:asset/d80719f250de8db1baa08d92b2d456c750d3e3dc.png';

export function MenuBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNumber = date.getDate();
    return `${dayName} ${monthName} ${dayNumber}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 min-h-6 bg-black/20 backdrop-blur-2xl border-b border-white/10 z-[10000] flex items-center justify-between px-3 pt-safe overflow-x-auto">
      {/* Left Side - Logo and Menu Items */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Custom Logo */}
        <div className="flex items-center">
          <img src={logoImage} alt="Logo" className="h-4 w-auto" />
        </div>

        {/* Menu Items - Hidden on small screens */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className="text-white text-[13px] font-semibold hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Finder
          </button>
          <button
            className="text-white/90 text-[13px] hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            File
          </button>
          <button
            className="text-white/90 text-[13px] hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Edit
          </button>
          <button
            className="text-white/90 text-[13px] hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            View
          </button>
          <button
            className="text-white/90 text-[13px] hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Go
          </button>
          <button
            className="text-white/90 text-[13px] hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Window
          </button>
          <button
            className="text-white/90 text-[13px] hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Help
          </button>
        </div>
      </div>

      {/* Right Side - Status Icons and Time */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Status Icons - Hidden on small screens */}
        <Wifi className="hidden sm:block w-4 h-4 text-white/90" strokeWidth={2} />
        <Battery className="hidden sm:block w-4 h-4 text-white/90" strokeWidth={2} />

        {/* Date and Time */}
        <div
          className="text-white/90 text-[13px] flex items-center gap-1"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}
        >
          <span className="hidden sm:inline">{formatDate(currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}