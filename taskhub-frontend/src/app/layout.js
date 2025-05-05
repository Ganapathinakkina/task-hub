"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from '@/components/Header';


const inter = Inter({ subsets: ['latin'] });

const metadata = {
  title: 'TaskHub',
  description: 'Task management made easy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-50 min-h-screen`}>
        <Provider store={store}>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
