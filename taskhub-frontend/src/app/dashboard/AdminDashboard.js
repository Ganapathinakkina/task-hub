import {
  Users,
  ClipboardList,
  AlarmClock,
  CheckCircle,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const IconCard = ({ icon: Icon, title, value, color }) => (
  <div className={`rounded-xl shadow-md p-6 ${color} border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4`}>
    <div className="flex items-center space-x-4">
      <Icon className="w-8 h-8" />
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ dashboardData }) => {
  const userRoleLabels = Object.keys(dashboardData.userCountByRole || {});
  const userRoleData = Object.values(dashboardData.userCountByRole || {});

  const pieChartData = {
    labels: userRoleLabels,
    datasets: [
      {
        label: "Users",
        data: userRoleData,
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <IconCard
          icon={Users}
          title="Total Users"
          value={dashboardData.totalUsers}
          color="bg-blue-100"
        />
        <IconCard
          icon={ClipboardList}
          title="Total Tasks"
          value={dashboardData.totalTasks}
          color="bg-purple-100"
        />
        <IconCard
          icon={AlarmClock}
          title="Overdue Tasks"
          value={dashboardData.overdueTasksCount}
          color="bg-red-100"
        />
        <IconCard
          icon={CheckCircle}
          title="Completion Rate"
          value={`${dashboardData.taskCompletionRate}`}
          color="bg-green-100"
        />
      </div>

      {/* Pie Chart and Status Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            User Count by Role
          </h3>
          <Pie data={pieChartData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Tasks by Status
          </h3>
          <div className="space-y-4">
            {Object.entries(dashboardData.tasksByStatus).map(([status, count], idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                  <span>{status}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${
                      status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{
                      width: `${(count / dashboardData.totalTasks) * 100 || 0}%`,
                    }}
                    title={`${count} tasks (${status})`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Top Performers</h3>
        {dashboardData.topPerformers.length === 0 ? (
          <p className="text-gray-500">No top performers to display.</p>
        ) : (
          <table className="min-w-full text-left border">
            <thead className="bg-blue-50 text-sm text-blue-800 font-semibold">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Completed Tasks</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topPerformers.map((user, idx) => (
                <tr key={idx} className="border-t text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 font-medium">{user.completedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
