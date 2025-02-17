import api from '@/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate()

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await api.post('/reset-password/', passwords);
      setSuccess('Password changed successfully');
      navigate('/login')
      setError('');
      console.log('Password reset submitted:', passwords.newPassword);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-400 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold tracking-wider">
            ELEGANT WARDROBE★
          </h1>
        </div>

        <h2 className="text-center text-gray-800 text-lg font-medium mb-6">
          RESET YOUR PASSWORD
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
              placeholder="Enter your old password"
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors duration-200"
          >
            RESET
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
