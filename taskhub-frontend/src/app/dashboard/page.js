'use client';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, token } = useSelector(state => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/dashboard/employee', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!json.isError) {
          setDashboardData(json.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">Employee Dashboard</h2>

          {loading ? (
            <div className="text-blue-600 animate-pulse">Loading analytics...</div>
          ) : dashboardData ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Assigned Tasks" value={dashboardData.assignedTasksCount} color="bg-blue-100" />
                <Card title="Completed Tasks" value={dashboardData.completedTasksCount} color="bg-green-100" />
                <Card title="Pending Tasks" value={dashboardData.pendingTasksCount} color="bg-yellow-100" />
                <Card title="Overdue Tasks" value={dashboardData.overdueTasksCount} color="bg-red-100" />
                <Card title="Completion Rate" value={dashboardData.taskCompletionRate} color="bg-purple-100" />
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-blue-700 mb-2">Upcoming Due Tasks</h3>
                {dashboardData.upcomingDueTasks.length === 0 ? (
                  <p className="text-gray-500">No upcoming tasks due soon.</p>
                ) : (
                  <ul className="list-disc list-inside text-blue-700 space-y-1">
                    {dashboardData.upcomingDueTasks.map((task, idx) => (
                      <li key={idx}>{task.title} (Due: {task.dueDate})</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
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
