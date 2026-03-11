// src/components/Sidebar.jsx

import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, UserCog, 
  Wallet, Crown, Layout, Settings, LogOut, 
  HelpCircle, FolderOpen, BarChart3, Bell
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: UserCog, label: 'User Management', id: 'user-management', permission: 'userManagement' },
  { icon: Package, label: 'Products', id: 'products', permission: 'products' },
  { icon: FolderOpen, label: 'Category', id: 'category-management', permission: 'categoryManagement' },
  { icon: ShoppingCart, label: 'Orders', id: 'orders', permission: 'orders' },
  { icon: Users, label: 'Customers', id: 'customers', permission: 'customers' },
  { icon: Wallet, label: 'Wallet', id: 'wallet', permission: 'wallet' },
  { icon: Crown, label: 'Membership', id: 'membership', permission: 'membership' },
  { icon: BarChart3, label: 'Reports', id: 'reports', permission: 'reports' },
  { icon: Layout, label: 'Home Page', id: 'home-page', permission: 'homepage' },
  { icon: Bell, label: 'Push Notifications', id: 'notifications', permission: 'notifications' },
  { icon: Settings, label: 'Settings', id: 'settings' },
  { icon: HelpCircle, label: 'Help & Support', id: 'help-support' },
];

export function Sidebar({ currentPage, onPageChange, onLogout, userRole = "Admin", currentUser }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = useMemo(() => {
    const userPerms = currentUser?.permissions || [];
    const role = (userRole || '').toLowerCase();
    const isAdmin = role === 'admin' || role === 'super admin';

    return MENU_ITEMS.filter(item => {
      if (isAdmin) return true;
      if (!item.permission) return true;
      return userPerms.includes(item.permission);
    });
  }, [currentUser, userRole]);

  // Working Logout Handler
  const handleLogout = () => {
    // Clear authentication data (adjust keys as per your app)
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');           // if you store JWT or similar
    localStorage.removeItem('user');            // if you store user data

    // Call parent logout handler (if passed)
    if (onLogout) {
      onLogout();
    }

    // Redirect to login page
    navigate('/login', { replace: true });
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40 flex flex-col shadow-sm
        ${isExpanded ? 'w-64' : 'w-20'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo/Header */}
      <div className="h-14 border-b border-gray-100 flex items-center px-4 flex-shrink-0 bg-white">
        <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xl">D</span>
        </div>

        <div className={`ml-3 flex flex-col transition-all duration-300 overflow-hidden whitespace-nowrap
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
        `}>
          <span className="font-semibold text-lg text-gray-900">Dynasty Premium</span>
          <span className="text-xs text-gray-500">Welcome {userRole}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 bg-white">
        <div className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === `/${item.id}`;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange?.(item.id);
                  navigate(`/${item.id}`);
                }}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon 
                  size={20} 
                  strokeWidth={1.8} 
                  className={`flex-shrink-0 transition-colors
                    ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}
                  `} 
                />

                <span className={`ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden text-left
                  ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                `}>
                  {item.label}
                </span>

                {isActive && isExpanded && (
                  <div className="ml-auto w-1.5 h-5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100 mt-auto bg-white">
        <button
          onClick={handleLogout} 
          className="w-full flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 group"
        >
          <LogOut 
            size={22} 
            strokeWidth={1.8} 
            className="flex-shrink-0 text-gray-500 group-hover:text-red-600" 
          />

          <span className={`ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden
            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
          `}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}