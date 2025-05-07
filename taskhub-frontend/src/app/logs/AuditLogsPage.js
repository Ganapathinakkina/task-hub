'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import API from '../lib/axios';
import { showAlert } from '../redux/slices/alertSlice';

const AUDIT_ACTIONS = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
  TASK_VIEWED: 'TASK_VIEWED',
  TASK_LISTED: 'TASK_LISTED',
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
};

const PAGE_SIZE = 10;

const AuditLogsPage = () => {

  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchLogs = async () => {
    try {
      const params = {
        // userId: null,
        limit: PAGE_SIZE,
        page,
      };

      if (action) params.action = action;
      if (from) params.from = new Date(from).toISOString();
      if (to) params.to = new Date(to).toISOString();

      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/auth/audit-logs?${queryString}`;

      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      dispatch(showAlert({
        message: response.data.message,
        isError: response.data.isError,
      }));

      setLogs(response.data.data.logs);
      setTotalPages(response.data.data.pagination.totalPages);
      
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      dispatch(showAlert({
        message: 'Something went wrong. please try again.',
        isError: true,
      }));
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, action, from, to]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-blue-800 text-2xl font-semibold mb-6 ">Audit Logs</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Actions</option>
          {Object.values(AUDIT_ACTIONS).map((act) => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="From Date"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="To Date"
        />
        <button
          onClick={() => { setPage(1); fetchLogs(); }}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {logs.length > 0 ? logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{log.userId?.name || 'N/A'}</td>
                <td className="px-4 py-2">{log.userId?.email || 'N/A'}</td>
                <td className="px-4 py-2">{log.userId?.role || 'N/A'}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.description}</td>
                <td className="px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="6">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogsPage;
