'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../lib/axios';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import DashboardLayout from '../dashboard/DashboardLayout';

export default function Tasks() {
  const { token } = useSelector(state => state.auth);

  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    priority: '',
    dueDate: '',
    search: '',
  });

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { page, limit, status, priority, dueDate, search } = filters;
      const res = await axios.get('/auth/task', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
          status,
          priority,
          dueDate,
          search,
        },
      });

      if (!res.data.isError) {
        setTasks(res.data.data.tasks);
        setPagination({
          totalPages: res.data.data.totalPages,
          currentPage: parseInt(res.data.data.currentPage),
        });
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 w-full overflow-x-hidden">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">My Tasks</h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by title"
              className="p-2 border rounded-md w-full"
            />
            <select name="status" value={filters.status} onChange={handleChange} className="p-2 border rounded-md w-full">
              <option value="">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <select name="priority" value={filters.priority} onChange={handleChange} className="p-2 border rounded-md w-full">
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={filters.dueDate}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            {loading ? (
              <div className="text-center p-4 text-blue-600 animate-pulse">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center p-4 text-gray-500">No tasks found.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-left">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Due Date</th>
                    <th className="px-4 py-2">Priority</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">{task.description}</td>
                      <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{task.priority}</td>
                      <td className="px-4 py-2">{task.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-md border ${
                  pagination.currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
