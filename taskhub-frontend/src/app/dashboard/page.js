'use client';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';
import { useEffect, useState } from 'react';
import API from '../lib/axios';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

export default function Dashboard() {
  const { user, token } = useSelector(state => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const validRoles = ['admin', 'manager', 'employee'];
  const role = validRoles.includes(user?.role) ? user.role : null;


  const fetchDashboardData = async () => {

    try {
      let endpoint = "";
      if (user && token && role)
      {
        switch (role) {
          case 'employee':
            endpoint = "/auth/dashboard/employee";
            break;
          case 'manager':
            endpoint = "/auth/dashboard/manager";
            break;
          case 'admin':
            endpoint = "/auth/dashboard/admin";
            break;
          default:
            console.error('Unknown user role:', role);
            break;
        }
  
        const res = await API.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { data } = res.data;
        setDashboardData(data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          {loading ? (
            <div className="text-blue-600 animate-pulse">Loading analytics...</div>
          ) : (dashboardData && role) ? (
              role === "employee" ? (
                <>
                  <h2 className="text-2xl font-semibold text-blue-800 mb-6">Employee Dashboard</h2>
                  <EmployeeDashboard dashboardData={dashboardData} />
                </>
              )
              :
              (
                role === "manager" ? (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-800 mb-6">Manager Dashboard</h2>
                    <ManagerDashboard dashboardData={dashboardData} />
                  </>
                )
                :
                (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-800 mb-6">Admin Dashboard</h2>
                    <AdminDashboard dashboardData={dashboardData}/>
                  </>
                )
              )
            
          ) : (
            <div className="text-red-500">Failed to load data.</div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow-md p-6 ${color} border border-gray-200 hover:shadow-xl transition-shadow duration-300`}>
      <h4 className="text-sm font-semibold text-gray-600 mb-1">{title}</h4>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
