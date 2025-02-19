import React, { useState } from "react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-200 flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold text-indigo-700 text-center mb-6">
          {isSignUp ? "Create Account" : "Log In"}
        </h2>

        {/* Form */}
        <form className="space-y-6">
          {/* Name Field (Only for Sign Up) */}
          {isSignUp && (
            <div>
              <label className="block text-lg font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="johndoe@example.com"
              className="input w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="input w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-3 px-6 rounded-full w-full text-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </button>
          </div>
        </form>

        {/* Switch between Sign Up and Log In */}
        <div className="mt-6 text-center">
          <button
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Log In"
              : "Don’t have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
