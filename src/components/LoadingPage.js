import React from "react";
import { Link } from "react-router-dom";

const LoadingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="text-center max-w-lg w-full">
        <div className="relative inline-block w-20 h-20 mb-6">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-blue-500 border-blue-200"></div>
          <div className="absolute inset-2.5 bg-blue-100 rounded-full"></div>
        </div>

        <h1 className="text-4xl font-bold text-blue-700 mb-4">Loading...</h1>
        <p className="text-lg text-gray-700 mb-6">
          Please hold tight while we prepare everything for you!
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default LoadingPage;
