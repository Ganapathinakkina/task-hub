'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import Header from '@/components/Header';
import { hideAlert } from './redux/slices/alertSlice';
import AlertModal from '@/components/common/AlertModal';

const inter = Inter({ subsets: ['latin'] });

function AlertWrapper() {
  const dispatch = useDispatch();
  const { message, isError } = useSelector((state) => state.alert);

  return (
    <AlertModal
      message={message}
      isError={isError}
      onClose={() => dispatch(hideAlert())}
    />
  );
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-50 min-h-screen`}>
        <Provider store={store}>
          <Header />
          <AlertWrapper />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
