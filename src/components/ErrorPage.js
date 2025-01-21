import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaExclamationTriangle } from 'react-icons/fa'; // Importing an error icon for better visuals

const ErrorPage = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-red-100 via-red-200 to-red-300 p-4">
      <div className="text-center max-w-lg w-full shadow-lg bg-white rounded-lg p-8">
        <div className="flex justify-center items-center mb-6 animate-bounce">
          <FaExclamationTriangle className="text-red-500 text-6xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Something Went Wrong!</h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {message || "We encountered an unexpected issue. Please try again later."}
        </p>
        <Link
          to="/"
          className="inline-block bg-red-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
