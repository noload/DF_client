import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!token) {
      toast.error('Invalid token!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:4000/api/user/reset-password', {
        token,
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password reset successful!');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <ToastContainer />

        {/* Icon Header */}
        <div className="flex justify-center items-center mb-6">
          <FaLock className="text-blue-500 text-5xl bg-blue-100 p-3 rounded-full" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create a strong password to secure your account.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter your new password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 flex justify-center items-center text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200 font-medium shadow-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <AiOutlineLoading3Quarters className="animate-spin text-xl mr-2" />
            ) : (
              <FaCheckCircle className="text-xl mr-2" />
            )}
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Decorative Elements */}
        <div className="absolute -top-5 -left-5 w-16 h-16 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-purple-400 rounded-full opacity-20"></div>
      </div>
    </div>
  );
}

export default ResetPassword;
