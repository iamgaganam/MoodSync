import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import backgroundImage from "../assets/3.jpg"; // Background image
import { Brain } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Type definitions for form data and errors
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  // State variables for form data, validation, loading, and success messages
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Validate form data before submitting
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change and update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors
    setSuccessMessage(""); // Clear success message

    try {
      // Call the login API endpoint
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login success:", response.data);
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      // Navigate to dashboard after successful login
      navigate("/");
    } catch (error: any) {
      console.error("Authentication error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navbar at the top */}
      <Navbar />
      {/* Spacer to prevent overlapping with a transparent background */}
      <div className="h-20 bg-transparent"></div>

      <div
        className="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay to improve form readability */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
          <div className="flex justify-center">
            <Link to="/">
              {/* Logo */}
              <div className="flex items-center space-x-1">
                <Brain className="h-10 w-10 text-blue-600" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  MoodSync
                </span>
              </div>
            </Link>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
            Welcome back to MoodSync
          </p>
        </div>

        <div className="mt-6 sm:mt-8 mx-auto w-full sm:max-w-md z-10 relative">
          <div className="bg-white bg-opacity-95 py-6 sm:py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 backdrop-filter backdrop-blur-sm">
            {/* Display error or success messages */}
            {errors.general && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-red-700">
                      {errors.general}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-green-700">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Login form */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FaRegEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember me & Forgot password links */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs sm:text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-xs sm:text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>Sign in</>
                  )}
                </button>
              </div>
            </form>

            {/* Social login options */}
            <div className="mt-5 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                    <span>Google</span>
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Link to register page */}
            <div className="mt-5 sm:mt-6">
              <div className="text-center">
                <Link
                  to="/register"
                  className="font-medium text-xs sm:text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Privacy Policy */}
        <div className="mt-6 text-center z-10 relative px-4">
          <p className="text-xs text-gray-300">
            By signing in or creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="underline text-gray-200 hover:text-white"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline text-gray-200 hover:text-white"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </>
  );
};

export default LoginPage;
