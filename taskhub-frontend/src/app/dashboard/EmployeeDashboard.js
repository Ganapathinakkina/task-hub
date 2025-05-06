'use client';

import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlarmClockOff,
  PercentCircle
} from 'lucide-react';

export default function EmployeeDashboard({ dashboardData }) {
  const cards = [
    {
      title: 'Assigned Tasks',
      value: dashboardData.assignedTasksCount,
      color: 'bg-blue-100',
      icon: ClipboardList
    },
    {
      title: 'Completed Tasks',
      value: dashboardData.completedTasksCount,
      color: 'bg-green-100',
      icon: CheckCircle
    },
    {
      title: 'Pending Tasks',
      value: dashboardData.pendingTasksCount,
      color: 'bg-yellow-100',
      icon: Clock
    },
    {
      title: 'Overdue Tasks',
      value: dashboardData.overdueTasksCount,
      color: 'bg-red-100',
      icon: AlarmClockOff
    },
    {
      title: 'Completion Rate',
      value: dashboardData.taskCompletionRate,
      color: 'bg-purple-100',
      icon: PercentCircle
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            title={card.title}
            value={card.value}
            color={card.color}
            Icon={card.icon}
          />
        ))}
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
  );
}

function Card({ title, value, color, Icon }) {
  return (
    <div className={`rounded-xl shadow-md p-6 ${color} border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4`}>
      <Icon className="w-8 h-8 text-blue-600" />
      <div>
        <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
