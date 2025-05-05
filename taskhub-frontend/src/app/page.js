'use client';

export default function Home() {

  return (
    
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          Welcome to TaskHub
        </h1>
        <p className="text-lg text-blue-900 mb-6">
          Streamline your task management with an easy-to-use dashboard, smart analytics, and powerful collaboration features.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/auth?view=login" className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-50 transition">
            Login
          </a>
          <a href="/auth?view=register" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

