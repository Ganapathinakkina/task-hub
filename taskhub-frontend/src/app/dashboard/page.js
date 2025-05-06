'use client';

import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useSelector } from 'react-redux';
import DashboardLayout from './DashboardLayout';
import { useEffect, useState } from 'react';
import API from '../lib/axios';

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
              )
              :
              (
                role === "manager" ? (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-800 mb-6">Manager Dashboard</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card title="Total Tasks Created" value={dashboardData.totalTasksCreated} color="bg-blue-100" />
                      <Card title="Assigned Tasks" value={dashboardData.assignedTasksCount} color="bg-yellow-100" />
                      <Card title="Overdue Tasks" value={dashboardData.overdueTasksCount} color="bg-red-100" />
                      <Card title="Completion Rate" value={dashboardData.taskCompletionRate} color="bg-green-100" />
                    </div>
                
                    <div className="mt-10">
                      <h3 className="text-lg font-medium text-blue-700 mb-4">Task Summary by Employee</h3>
                      {Object.keys(dashboardData.taskSummaryByEmployee).length === 0 ? (
                        <p className="text-gray-500">No task summary available.</p>
                      ) : (
                        <table className="min-w-full bg-white border rounded-lg shadow-sm">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="text-left px-4 py-2 text-sm font-semibold text-blue-800">Employee</th>
                              <th className="text-left px-4 py-2 text-sm font-semibold text-blue-800">Assigned</th>
                              <th className="text-left px-4 py-2 text-sm font-semibold text-blue-800">Completed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(dashboardData.taskSummaryByEmployee).map(([employee, stats], idx) => (
                              <tr key={idx} className="border-t">
                                <td className="px-4 py-2 text-gray-700">{employee}</td>
                                <td className="px-4 py-2 text-gray-700">{stats.assigned}</td>
                                <td className="px-4 py-2 text-gray-700">{stats.completed}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )
                :
                (
                  <>
                    <h2 className="text-2xl font-semibold text-blue-800 mb-6">Admin Dashboard</h2>

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
