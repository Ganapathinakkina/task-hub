'use client';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* You can replace this with actual dashboard components soon */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Employee Dashboard</h2>
          <p className="text-blue-700">Welcome to your task overview.</p>
        </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}
