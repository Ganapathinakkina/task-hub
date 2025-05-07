"use client";

import {
  ClipboardList,
  ListChecks,
  AlarmClock,
  CheckCircle,
  UserCheck,
} from "lucide-react";

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

const ManagerDashboard = ({ dashboardData }) => {
  return (
    <>
      {/* Manager Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <IconCard
          icon={ClipboardList}
          title="Total Tasks Created"
          value={dashboardData.totalTasksCreated}
          color="bg-blue-100"
        />
        <IconCard
          icon={ListChecks}
          title="Assigned Tasks"
          value={dashboardData.assignedTasksCount}
          color="bg-yellow-100"
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

      {/* Task Summary by Employee */}
      <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">
          Task Summary by Employee
        </h3>
        {Object.keys(dashboardData.taskSummaryByEmployee).length === 0 ? (
          <p className="text-gray-500">No task summary available.</p>
        ) : (
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left px-4 py-2 text-sm font-semibold text-blue-800">
                  Employee
                </th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-blue-800">
                  Assigned
                </th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-blue-800">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dashboardData.taskSummaryByEmployee).map(
                ([employee, stats], idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 text-gray-700">{employee}</td>
                    <td className="px-4 py-2 text-gray-700">{stats.assigned}</td>
                    <td className="px-4 py-2 text-gray-700">{stats.completed}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManagerDashboard;
