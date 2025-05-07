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
  name: string;
  email: string;
  mobileNumber: string;
  emergencyContact: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const RegisterPage: React.FC = () => {
  // State variables for form data, validation, loading, and success messages
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobileNumber: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // React Router navigation

  // Validate form data before submitting
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      isValid = false;
    }

    // Mobile number validation
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile Number is required";
      isValid = false;
    }

    // Emergency contact validation
    if (!formData.emergencyContact) {
      newErrors.emergencyContact = "Emergency Contact is required";
      isValid = false;
    } else if (formData.emergencyContact === formData.mobileNumber) {
      newErrors.emergencyContact =
        "Emergency Contact cannot be the same as your Mobile Number";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else {
      // Additional password strength validation for Node.js backend
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        newErrors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        isValid = false;
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Special case for emergency contact validation when mobile number changes
    if (
      (name === "mobileNumber" && value === formData.emergencyContact) ||
      (name === "emergencyContact" && value === formData.mobileNumber)
    ) {
      setErrors((prev) => ({
        ...prev,
        emergencyContact:
          "Emergency Contact cannot be the same as your Mobile Number",
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
      // Call the registration API endpoint with Node.js backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          // Additional user data will be stored separately after registration
          // We could add a profile update endpoint later for mobile/emergency contacts
        }
      );

      console.log("Registration success:", response.data);

      // Show success message and redirect to login page after a short delay
      setSuccessMessage(
        "Registration successful! Redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Registration error:", error);

      // Updated error handling for Node.js backend
      let errorMessage = "Registration failed. Please try again.";

      if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response?.data) {
          errorMessage =
            axiosError.response.data.message ||
            axiosError.response.data.errors ||
            errorMessage;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Navbar at the top */}
      <Navbar />

      {/* Spacer to prevent overlapping with the navbar */}
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
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

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
            Create your account
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-200">
            Start your mental wellness journey with MoodSync
          </p>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white py-6 px-4 shadow-2xl sm:rounded-lg sm:py-8 sm:px-10 backdrop-filter backdrop-blur-sm bg-opacity-95">
            {/* General error message */}
            {errors.general && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-red-400"
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

            {/* Success message */}
            {successMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-green-400"
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

            {/* Registration form */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Name - changed from username to name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <div className="mt-1">
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    autoComplete="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.mobileNumber ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm`}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label
                  htmlFor="emergencyContact"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Emergency Contact
                </label>
                <div className="mt-1">
                  <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="tel"
                    autoComplete="tel"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.emergencyContact
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm`}
                  />
                  {errors.emergencyContact && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
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
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm pr-10`}
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm pr-10`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaRegEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FaRegEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
                      Creating account...
                    </>
                  ) : (
                    <>Create account</>
                  )}
                </button>
              </div>
            </form>

            {/* Social login buttons */}
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

              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-1 sm:mr-2" />
                    <span>Google</span>
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Link to login page */}
            <div className="mt-4 sm:mt-6">
              <div className="text-center">
                <Link
                  to="/login"
                  className="font-medium text-xs sm:text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Privacy Policy */}
        <div className="mt-4 sm:mt-8 text-center relative z-10 px-4">
          <p className="text-xxs sm:text-xs text-white">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="underline text-blue-300 hover:text-blue-200"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline text-blue-300 hover:text-blue-200"
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

export default RegisterPage;
