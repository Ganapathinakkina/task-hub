'use client';

import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');


  const validate = () => {
    const errs = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!formData.name.trim()) {
      errs.name = 'Name is required.';
    } else if (!nameRegex.test(formData.name)) {
      errs.name = 'Name must contain only letters and spaces.';
    }
  
    if (!emailRegex.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }
  
    if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
  
    return errs;
  };
  

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      const { token, user } = res.data.data;

      dispatch(loginSuccess({ user, token }));
      localStorage.setItem('taskhub-auth', JSON.stringify({ user, token }));

      router.push('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && <p className="text-red-600">{serverError}</p>}

      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.name}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.email}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
