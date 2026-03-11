// src/components/Header.jsx

import { useState, useEffect, useRef } from 'react';
import {
  Bell, AlertTriangle, CheckCircle, Info, AlertCircle, Maximize2, Minimize2,
  ChevronDown, User, LogOut
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Mock notifications (unchanged)
const mockNotifications = [
  { id: 1, type: 'success', title: 'New Order Received', message: 'Order #1234 placed.', time: '2 min ago', isRead: false },
  { id: 2, type: 'alert', title: 'Low Stock', message: 'Ghee 1L below minimum.', time: '1 hr ago', isRead: false },
  { id: 3, type: 'info', title: 'Payment Received', message: '₹2,500 via UPI.', time: '3 hrs ago', isRead: true },
];

const notificationIcons = {
  alert: AlertTriangle,
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
};

const notificationColors = {
  alert: 'text-red-600',
  success: 'text-green-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
};

// Simple path → title mapping (add more as needed)
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/user-management': 'User',
  '/products': 'Products',
  '/category-management': 'Category',
  '/orders': 'Orders',
  '/customers': 'Customers',
  '/wallet': 'Wallet',
  '/membership': 'Membership',
  '/reports': 'Reports',
  '/home-page': 'Home Page',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/help-support': 'Help & Support',
  '/profile': 'Profile',
};

export function Header({ onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifs] = useState(mockNotifications);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Dynamic left title
  const currentPath = location.pathname;
  const activeTitle = pageTitles[currentPath] || 'Management';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    alert("All marked as read (demo)");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Full-screen error:", err);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (onLogout) onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        {/* Left - Dynamic Title */}
        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600">
          <span className="font-medium text-gray-800">
            {activeTitle} <span className="text-gray-400">/</span> Management
          </span>
        </div>

        {/* Center - Time/Date (real-time) */}
        <div className="flex-1 flex justify-center">
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>{formattedTime}</span>
            <span className="text-gray-400">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Right - Notifications + Full-screen + Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className=" rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 text-sm">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => {
                    const Icon = notificationIcons[notification.type];
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer
                          ${!notification.isRead ? 'bg-red-50/30' : ''}
                        `}
                      >
                        <div className="flex gap-3">
                          <div className={`mt-0.5 ${notificationColors[notification.type]}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                              {!notification.isRead && (
                                <span className="h-2 w-2 rounded-full bg-red-500 mt-1.5 ring-2 ring-white"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={markAllAsRead}
                    className="w-full py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Full-screen Toggle Button */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? (
              <Minimize2 className="h-5 w-5 text-gray-600" />
            ) : (
              <Maximize2 className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Profile Icon + Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1 hover:opacity-90 transition-opacity"
            >
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 text-sm">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">Super Admin</p>
                  <p className="text-xs text-gray-500">admin@dynasty.com</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.href = "/profile";
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}