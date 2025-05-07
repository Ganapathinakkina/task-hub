'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../lib/axios';
import { showAlert } from '../redux/slices/alertSlice';
import { logout } from '../redux/slices/authSlice';

export default function UsersPage({ taskId = null, isPopup=true, setShowAssignModal = () => {} }) {

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || null;
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const [userRoleFilter, setUserRoleFilter] = useState('employee');
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);



  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: filters.page,
          limit: filters.limit,
          role: userRoleFilter,
          search: filters.search,
        },
      });

      dispatch(showAlert({
        message: res.data.message,
        isError: res.data.isError,
      }));

      if (!res.data.isError) {
        setUsers(res.data.data.users);
        setPagination({
          totalPages: res.data.data.totalPages,
          currentPage: parseInt(res.data.data.currentPage),
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) 
      {
        dispatch(showAlert({
          message: 'Session expired. Please log in again.',
          isError: true,
        }));
        dispatch(logout());
      } 
      else
      {
        dispatch(showAlert({
          message: 'Something went wrong. please try again.',
          isError: true,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleRoleChange = (e) => {
    setUserRoleFilter(e.target.value);
    fetchUsers();
  }

  const handleTaskAssign = async (userId) => {

    try {
      const res = await axios.put(
        `/auth/task/${taskId}`,
        {
          assignedTo: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(showAlert({
        message: "Task Assigned Successfully.",
        isError: res.data.isError,
      }));
  
      if (!res.data.isError) {
        setShowAssignModal(false);
      }
    } catch (err) {
      console.error('Error While Assigning task:', err);
      if (err.response?.status === 401) 
      {
        dispatch(showAlert({
          message: 'Session expired. Please log in again.',
          isError: true,
        }));
        dispatch(logout());
      } 
      else
      {
        dispatch(showAlert({
          message: 'Something went wrong. please try again.',
          isError: true,
        }));
      }
    }

  };


  return (
    <>
        <div className="p-6">
          {
            (role === 'admin' && !isPopup) ? (
              <h1 className="text-2xl font-semibold text-blue-800 mb-6">Manage Users</h1>
            )
            : (
              <h1 className="text-2xl font-semibold text-blue-800 mb-6">Employees</h1>
            )
          }

          {/* Search Input */}
          {/* Search & Role Filter */}
            <div className="mb-6 flex flex-col sm:flex-row content-start gap-10">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {(role === 'admin' && !isPopup) && (
                    <select
                    name="userRoleFilter"
                    value={userRoleFilter}
                    onChange={(e) => handleRoleChange(e)}
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="manager">Employee</option>
                    <option value="employee">Manager</option>
                    </select>
                )}
            </div>


          {/* Users Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {loading ? (
              <p className="p-4 text-blue-600 font-medium">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="p-4 text-red-600 font-medium">No users found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-left">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    { isPopup ? (
                      <>
                        <th className="px-4 py-2">Action</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Created At</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      
                      { isPopup ? (
                        <>
                          <td className="px-4 py-2 capitalize">
                            <button
                                onClick={() => handleTaskAssign(user._id)}
                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                Assign Task
                              </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 capitalize">{user.role}</td>
                          <td className="px-4 py-2">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:opacity-50"
                >
                Previous
                </button>
                <span className="text-sm">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <button
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={filters.page === pagination.totalPages}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:opacity-50"
                >
                Next
                </button>
            </div>
        </div>
    </>
  );
}
