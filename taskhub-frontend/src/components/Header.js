'use client';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/app/redux/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('taskhub-auth');
    router.push('/');
  };

  const handleAuthNavigation = (view) => {
    if (pathname === '/auth') {
      router.replace(`/auth?view=${view}`);
    } else {
      router.push(`/auth?view=${view}`);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">TaskHub</h1>

      <nav className="hidden md:block">
        <ul className="flex space-x-4 items-center">
          <li>
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              Home
            </a>
          </li>

          {user ? (
            <>
              <li className="text-blue-700 font-semibold">
                Hi, {user.name.split(' ')[0]}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={() => handleAuthNavigation('login')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAuthNavigation('register')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
                >
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}