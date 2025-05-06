'use client';

import { useState } from 'react';
import axios from '../lib/axios';
import { useRouter } from 'next/navigation';
import { loginSuccess } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const errs = {};

    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!formData.password.trim()) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/auth/login', formData);
      const { token, user } = res.data.data;

      dispatch(loginSuccess({ user, token }));
      localStorage.setItem('taskhub-auth', JSON.stringify({ user, token }));

      router.push('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

      <div>
        <input
          type="text"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
