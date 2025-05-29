import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";

const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  ENDPOINTS: {
    ADMIN_LOGIN: "/auth/admin/login",
  },
} as const;

const VALIDATION_RULES = {
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  MIN_PASSWORD_LENGTH: 8,
} as const;

const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  LOGIN_FAILED: "Invalid credentials. Please try again.",
  ACCESS_DENIED: "You do not have permission to access the admin dashboard",
  CONNECTION_ERROR: "Connection error. Please try again later.",
} as const;

// Types
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: string;
}

interface AdminLoginResponse {
  success: boolean;
  message?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

// Utility Functions
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 255);
};

const validateEmail = (email: string): string | undefined => {
  if (!email) return ERROR_MESSAGES.EMAIL_REQUIRED;
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email))
    return ERROR_MESSAGES.EMAIL_INVALID;
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return ERROR_MESSAGES.PASSWORD_REQUIRED;
  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return undefined;
};

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Handle specific HTTP status codes
    if (axiosError.response?.status === 401) {
      return ERROR_MESSAGES.LOGIN_FAILED;
    }
    if (axiosError.response?.status === 403) {
      return ERROR_MESSAGES.ACCESS_DENIED;
    }
    if (
      axiosError.code === "ECONNREFUSED" ||
      axiosError.code === "NETWORK_ERROR"
    ) {
      return ERROR_MESSAGES.CONNECTION_ERROR;
    }

    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errors ||
      ERROR_MESSAGES.LOGIN_FAILED
    );
  }
  return ERROR_MESSAGES.LOGIN_FAILED;
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className="inline-flex items-center">
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    Signing in...
  </div>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <div
    className="mb-4 rounded-md bg-red-50 p-4 border border-red-200"
    role="alert"
  >
    <div className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-800">{message}</p>
      </div>
    </div>
  </div>
);

const FormInput: React.FC<{
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({
  id,
  name,
  type,
  label,
  value,
  error,
  placeholder,
  autoComplete,
  onChange,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
      }`}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
);

// Main Component
const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const sanitizedValue = sanitizeInput(value);

      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));

      // Clear field-specific errors when user types
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }

      // Clear general error when user starts typing
      if (errors.general) {
        setErrors((prev) => ({
          ...prev,
          general: undefined,
        }));
      }
    },
    [errors]
  );

  const handleRememberMeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});

      try {
        const response = await axios.post<AdminLoginResponse>(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_LOGIN}`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            timeout: 15000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          const { user: adminUser, token, refreshToken } = response.data;

          // Verify the user is an admin
          if (adminUser.role !== "admin") {
            setErrors({ general: ERROR_MESSAGES.ACCESS_DENIED });
            return;
          }

          // Use the login function from AuthContext
          login(adminUser, token, refreshToken, rememberMe);

          // Redirect to admin dashboard
          navigate("/admin", { replace: true });
        } else {
          setErrors({
            general: response.data.message || ERROR_MESSAGES.LOGIN_FAILED,
          });
        }
      } catch (error) {
        console.error("Admin login error:", error);
        const errorMessage = extractErrorMessage(error);
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, rememberMe, validateForm, login, navigate]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-indigo-800">MoodSync</h1>
            <p className="text-gray-600 mt-2">Admin Portal</p>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Display */}
          {errors.general && <ErrorAlert message={errors.general} />}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              error={errors.email}
              placeholder="admin@moodsync.com"
              autoComplete="email"
              onChange={handleInputChange}
              required
            />

            <FormInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              onChange={handleInputChange}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors"
                  onClick={() => {
                    // TODO: Implement forgot password functionality
                    console.log("Forgot password clicked");
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? <LoadingSpinner /> : "Sign In"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This is a secure admin portal. Only authorized personnel should
              access this system.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help accessing your account?{" "}
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
              onClick={() => {
                console.log("Contact support clicked");
              }}
            >
              Contact IT Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
