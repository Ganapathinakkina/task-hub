'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AlertModal({ message, isError=true, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timeout = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [message, onClose]);

  if (!message) return null;


  return (
    <div className="fixed top-4 inset-x-0 flex justify-center z-50 pointer-events-none">
      <div
        className={`transition-all duration-300 transform flex items-center gap-3 text-sm font-medium rounded-md px-5 py-4 shadow-md
          ${show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
          ${isError ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}
        `}
      >
        {isError ? (
                <XCircle className="w-5 h-5 text-red-600" />
            ): 
            (
                <CheckCircle className="w-5 h-5 text-green-600" />
            )
        }
        <span>{message}</span>
      </div>
    </div>
  );
}
