// src/components/Unauthorized.tsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Unauthorized Access
          </h1>
          <div className="text-xl text-gray-700 mb-6">
            You don't have permission to access this page.
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go to Home
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Login with Different Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
