import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaRegEye, FaRegEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import backgroundImage from "../assets/emergency.jpg";
import { Brain } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  ENDPOINTS: {
    LOGIN: "/auth/login",
  },
} as const;

const VALIDATION_RULES = {
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  MIN_PASSWORD_LENGTH: 8,
} as const;

const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Email address is invalid",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  LOGIN_FAILED: "Login failed. Please check your credentials.",
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

interface LocationState {
  from?: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    mobileNumber?: string;
    emergencyContact?: string;
    profileImage?: string;
  };
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
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4">
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
        <p className="text-xs sm:text-sm text-red-700">{message}</p>
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
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}> = ({
  id,
  name,
  type,
  label,
  value,
  error,
  autoComplete,
  onChange,
  showPasswordToggle,
  onTogglePassword,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative">
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${
          showPasswordToggle ? "pr-10" : ""
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {showPasswordToggle && onTogglePassword && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          onClick={onTogglePassword}
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          {type === "password" ? (
            <FaRegEye className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <FaRegEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs sm:text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
);

const SocialLoginButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full inline-flex justify-center py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Main Component
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState;
  const redirectPath = locationState?.from || "/userprofile";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      const { name, value, type, checked } = e.target;

      if (type === "checkbox") {
        if (name === "remember-me") {
          setRememberMe(checked);
        }
      } else {
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
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});

      try {
        const response = await axios.post<LoginResponse>(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
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

        const { token, refreshToken, user } = response.data;

        login(
          {
            name: user.name,
            email: user.email,
            role: user.role,
            id: user.id,
            mobileNumber: user.mobileNumber,
            emergencyContact: user.emergencyContact,
            profileImage: user.profileImage,
          },
          token,
          refreshToken,
          rememberMe
        );

        navigate(redirectPath, { replace: true });
      } catch (error) {
        console.error("Authentication error:", error);
        const errorMessage = extractErrorMessage(error);
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, rememberMe, validateForm, login, navigate, redirectPath]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const socialLoginButtons = useMemo(
    () => [
      {
        icon: <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />,
        label: "Google",
        onClick: () => console.log("Google login not implemented"),
      },
      {
        icon: (
          <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
        ),
        label: "Facebook",
        onClick: () => console.log("Facebook login not implemented"),
      },
    ],
    []
  );

  return (
    <>
      <Navbar />
      <div className="h-20 bg-transparent" />

      <div
        className="min-h-screen flex flex-col justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50 z-0" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 relative">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center space-x-1">
              <Brain className="h-10 w-10 text-blue-600" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                MoodSync
              </span>
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
            {errors.general && <ErrorMessage message={errors.general} />}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={formData.email}
                error={errors.email}
                autoComplete="email"
                onChange={handleInputChange}
              />

              <FormInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                error={errors.password}
                autoComplete="current-password"
                onChange={handleInputChange}
                showPasswordToggle
                onTogglePassword={togglePasswordVisibility}
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleInputChange}
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

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLoginButtons.map((button, index) => (
                  <SocialLoginButton
                    key={index}
                    icon={button.icon}
                    label={button.label}
                    onClick={button.onClick}
                  />
                ))}
              </div>
            </div>

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

      <Footer />
    </>
  );
};

export default LoginPage;
