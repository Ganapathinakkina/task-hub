'use client';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import DashboardLayout from '../dashboard/DashboardLayout';
import AuditLogsPage from './AuditLogsPage';


export default function Dashboard() {

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AuditLogsPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

