import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation
import { FaExclamationTriangle, FaUserCircle } from 'react-icons/fa'; // Danger and profile icons

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
  
      localStorage.removeItem('authToken');
  
      navigate('/'); 
  
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="bg-[#662671] text-white flex justify-between items-center p-6 h-[8vh] w-screen">
      <img src='/images/logo.png' alt="Logo" className="h-10" />

      <div onClick={toggleModal} className="cursor-pointer">
        <FaUserCircle className="h-10 w-10 text-white" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-500 mr-2 text-3xl" />
              <h3 className="text-xl font-semibold text-gray-800">Are you sure you want to logout?</h3>
            </div>
            <div className="flex justify-around">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
