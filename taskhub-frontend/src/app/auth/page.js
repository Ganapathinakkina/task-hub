'use client';

import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useSearchParams } from 'next/navigation';

export default function AuthPage() {

    const searchParams = useSearchParams();
    const view = searchParams.get('view');

  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (view === 'register') setIsLogin(false);
    else setIsLogin(true);
  }, [view]);


  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-medium rounded-l-md ${
              isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-medium rounded-r-md ${
              !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-blue-600'
            }`}
          >
            Register
          </button>
        </div>
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </section>
  );
}
