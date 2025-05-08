'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../lib/axios';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import DashboardLayout from '../dashboard/DashboardLayout';
import UsersPage from '../users/UsersPage';
import { showAlert } from '../redux/slices/alertSlice';
import { logout } from '../redux/slices/authSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function Tasks() {

  const dispatch = useDispatch();
  const { user,token } = useSelector(state => state.auth);
  const role = user?.role || null;

  const [tasks, setTasks] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    priority: '',
    dueDate: '',
    search: '',
  });

  const TASK_STATUS = {
    BACKLOG: "Backlog",
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const TASK_PRIORITY = {
    URGENT: "Urgent",
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
    NONE: "None",
  };

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    status: 'Pending',
  });

  const handleNewTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const createTask = async () => {
    try {
      const res = await axios.post('/auth/task', newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(showAlert({
        message: res.data.message,
        isError: res.data.isError,
      }));

      if (!res.data.isError) {
        setShowCreateModal(false);
        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          priority: 'Low',
          status: 'Pending',
        });
        fetchTasks(true);
      }
    } catch (err) {
      console.error('Error creating task:', err);
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

  const fetchTasks = async (isAfterTaskCreation=false) => {
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

      !isAfterTaskCreation && 
      dispatch(showAlert({
        message: res.data.message,
        isError: res.data.isError,
      }));

      if (!res.data.isError) {
        setTasks(res.data.data.tasks);
        setPagination({
          totalPages: res.data.data.totalPages,
          currentPage: parseInt(res.data.data.currentPage),
        });
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
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
    fetchTasks();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editableTask, setEditableTask] = useState(null);

  const handleEditTask = (task) => {
    setEditableTask({ ...task });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableTask((prev) => ({ ...prev, [name]: value }));
  };

  const updateTask = async () => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === editableTask._id ? editableTask : t))
    );

    try {
      const res = await axios.put(
        `/auth/task/${editableTask._id}`,
        editableTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(showAlert({
        message: res.data.message,
        isError: res.data.isError,
      }));
  
      if (!res.data.isError) {
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Error creating task:', err);
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

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      try
      {
        const res = await axios.delete(
          `/auth/task/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(showAlert({
          message: res.data.message,
          isError: res.data.isError,
        }));

      }
      catch (err) {
        console.error('Error deleting task:', err);
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


    }
  };



  const handleStatusChange = async (taskId, newStatus) => {
    try 
    {
      const res = await axios.put(
        `/auth/task/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(showAlert({
        message: res.data.message,
        isError: res.data.isError,
      }));

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
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
    <ProtectedRoute>
      <DashboardLayout>
        <div className="p-6 w-full overflow-x-hidden">
          {
            (role && (role === "admin" || role === "manager")) ? (
              <h1 className="text-2xl font-semibold text-blue-800 mb-6">Task Management</h1>
            )
            : (
              <h1 className="text-2xl font-semibold text-blue-800 mb-6">My Tasks</h1>
            )
          }

          {
            (role && (role === "admin" || role === "manager")) && (
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Task
                  </button>
                </div>
            )
          }
          

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
              <option value={TASK_STATUS.BACKLOG}>Backlog</option>
              <option value={TASK_STATUS.TODO}>Todo</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
              <option value={TASK_STATUS.CANCELLED}>Cancelled</option>
            </select>
            <select name="priority" value={filters.priority} onChange={handleChange} className="p-2 border rounded-md w-full">
              <option value="">All Priority</option>
              <option value={TASK_PRIORITY.LOW}>Low</option>
              <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
              <option value={TASK_PRIORITY.HIGH}>High</option>
              <option value={TASK_PRIORITY.URGENT}>URGENT</option>
            </select>
            <DatePicker
              selected={filters.dueDate ? new Date(filters.dueDate) : null}
              placeholderText="Select Due Date"
              dateFormat="yyyy-MM-dd"
              onChange={(date) =>
                handleChange({
                  target: {
                    name: "dueDate",
                    value: date.toISOString().split("T")[0] + "T00:00:00.000Z",
                  },
                })
              }
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
                    {
                      role && (role === "admin" || role === "manager") && (
                        <th className="px-4 py-2">Actions</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td className="px-4 py-2">{task.title}</td>
                      <td className="px-4 py-2">{task.description}</td>
                      <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{task.priority}</td>
                      <td className="px-4 py-2">
                        {role === "employee" ? (
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="border-2 border-blue-500 rounded px-2 py-1"
                          >
                            <option value={TASK_STATUS.BACKLOG} className="text-gray-600 font-bold">Backlog</option>
                            <option value={TASK_STATUS.TODO} className="text-blue-500 font-bold">Todo</option>
                            <option value={TASK_STATUS.IN_PROGRESS} className="text-yellow-600 font-bold">In Progress</option>
                            <option value={TASK_STATUS.COMPLETED} className="text-green-600 font-bold">Completed</option>
                            <option value={TASK_STATUS.CANCELLED} className="text-red-500 font-bold">Cancelled</option>
                          </select>
                        ) : (
                          task.status
                        )}
                      </td>
                      {
                        role && (role === "admin" || role === "manager") && (
                          <td className="p-4 flex gap-3">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="text-white bg-yellow-300 hover:bg-yellow-400 px-5 py-1 rounded-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTaskId(task._id);
                                setShowAssignModal(true);
                              }}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Assign Task
                            </button>
                          </td>
                        )
                      }
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

          {showCreateModal && (
            <div className="fixed inset-0 bg-gray-50/10 backdrop-blur-xs flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-blue-800 text-lg font-semibold mb-4 text-center">Create New Task</h3>

                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                  placeholder="Title"
                  className="w-full p-2 mb-1 border rounded"
                />
                <p className="text-xs text-gray-500 mb-2">Enter a brief and clear title for the task.</p>

                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleNewTaskChange}
                  placeholder="Description"
                  className="w-full p-2 mb-0 border rounded"
                />
                <p className="text-xs text-gray-500 mb-2">Add any additional details or context for the task.</p>

                <label className="block mb-1 font-medium">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleNewTaskChange}
                  className="w-full p-2 mb-1 border rounded"
                />
                <p className="text-xs text-gray-500 mb-2">Select the deadline by which this task should be completed.</p>

                <label className="block mb-1 font-medium">Priority</label>
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleNewTaskChange}
                  className="w-full p-2 mb-1 border rounded"
                >
                  <option value={TASK_PRIORITY.LOW}>Low</option>
                  <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                  <option value={TASK_PRIORITY.HIGH}>High</option>
                  <option value={TASK_PRIORITY.URGENT}>URGENT</option>
                </select>
                <p className="text-xs text-gray-500 mb-2">Choose how important this task is.</p>

                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleNewTaskChange}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value={TASK_STATUS.BACKLOG}>Backlog</option>
                  <option value={TASK_STATUS.TODO}>Todo</option>
                  <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  <option value={TASK_STATUS.CANCELLED}>Cancelled</option>
                </select>
                <p className="text-xs text-gray-500 mb-4">Set the current progress status of the task.</p>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={createTask}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}


          { showEditModal && editableTask && (
            <div className="fixed inset-0 bg-gray-50/10 backdrop-blur-xs flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-blue-800 text-lg font-semibold mb-4 text-center">Edit Task</h3>
                <input
                  type="text"
                  name="title"
                  value={editableTask.title}
                  onChange={handleEditChange}
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  name="description"
                  value={editableTask.description}
                  onChange={handleEditChange}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="date"
                  name="dueDate"
                  value={editableTask.dueDate}
                  onChange={handleEditChange}
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  name="priority"
                  value={editableTask.priority}
                  onChange={handleEditChange}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value={TASK_PRIORITY.LOW}>Low</option>
                  <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                  <option value={TASK_PRIORITY.HIGH}>High</option>
                  <option value={TASK_PRIORITY.URGENT}>URGENT</option>
                </select>
                <select
                  name="status"
                  value={editableTask.status}
                  onChange={handleEditChange}
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value={TASK_STATUS.BACKLOG}>Backlog</option>
                  <option value={TASK_STATUS.TODO}>Todo</option>
                  <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  <option value={TASK_STATUS.CANCELLED}>Cancelled</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                    onClick={updateTask}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}


          {showAssignModal && (
            <div
              className="fixed inset-0 bg-gray-50/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowAssignModal(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-3xl font-bold"
                  onClick={() => setShowAssignModal(false)}
                >
                  &times;
                </button>

                <UsersPage
                  taskId={selectedTaskId}
                  isPopup={showAssignModal}
                  setShowAssignModal={setShowAssignModal}
                />
              </div>
            </div>
          )}


        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
