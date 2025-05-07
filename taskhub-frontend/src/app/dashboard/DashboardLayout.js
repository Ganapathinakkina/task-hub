'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/app/redux/slices/authSlice';
import { showAlert } from '../redux/slices/alertSlice';
import { usePathname } from 'next/navigation';


const navItems = {
  admin: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/users', label: 'Users' },
    { href: '/logs', label: 'Audit Logs' },
  ],
  manager: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/users', label: 'Users' },
  ],
  employee: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'My Tasks' },
  ],
};

export default function DashboardLayout({ children }) {
  const { user } = useSelector(state => state.auth);
  const pathname = usePathname();
  const role = user?.role || 'employee';
  const name = user?.name?.split(' ')[0] || '';

  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleLogout = () => {
      dispatch(logout());
      dispatch(showAlert({
        message: 'Logged out successfully.',
        isError: false,
      }));
    };
  

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-white shadow-md flex-col justify-between hidden md:flex', 
          isSidebarOpen ? 'block' : 'hidden md:block'
        )}
      >
        <div>
          <div className="p-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 text-center">{role.toUpperCase()}</p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems[role].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-2 rounded-lg font-medium transition',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-blue-700 hover:bg-blue-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200 text-sm text-blue-600">
          Logged in as <span className="font-semibold">{name}</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden px-6 md:px-4 py-6 md:py-4">
        {children}
      </main>

      

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center p-4 absolute top-16 left-0 z-50">
        <button
          onClick={toggleSidebar}
          className="text-blue-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>



 

      <aside
        className={cn(
          'md:hidden fixed inset-0 top-15 left-0 w-64 bg-white shadow-md z-49 transform transition-all duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          <div className="p-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 text-center">{role.toUpperCase()}</p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems[role].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-2 rounded-lg font-medium transition',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-blue-700 hover:bg-blue-100'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
                key='/'
                href='/'
                className={cn(
                  'block px-4 py-2 rounded-lg font-medium transition',
                  pathname === '/'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-blue-700 hover:bg-blue-100'
                )}
              >
                Home
              </Link>
          </nav>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200 text-sm text-blue-600 space-y-3">
          <div>
            Logged in as <span className="font-semibold">{name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Logout
          </button>
        </div>


        
      </aside>

    </div>
  );
}