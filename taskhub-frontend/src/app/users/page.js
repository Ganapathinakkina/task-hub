'use client';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import DashboardLayout from '../dashboard/DashboardLayout';
import UsersPage from './UsersPage';

export default function Page() 
{
  
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <UsersPage isPopup={false}/>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
