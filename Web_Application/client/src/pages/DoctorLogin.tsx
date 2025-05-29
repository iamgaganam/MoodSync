import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import {
  FaRegEye,
  FaRegEyeSlash,
  FaUserMd,
  FaStethoscope,
} from "react-icons/fa";
import { Brain, Heart, Shield, Clock } from "lucide-react";
import backgroundImage from "../assets/emergency.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  ENDPOINTS: {
    DOCTOR_LOGIN: "/auth/doctor/login",
    DOCTOR_PROFILE: "/doctor/profile",
  },
} as const;

const VALIDATION_RULES = {
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  LICENSE_REGEX: /^[A-Z0-9]{6,12}$/,
  MIN_PASSWORD_LENGTH: 8,
} as const;

const ERROR_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Please enter a valid email address",
  LICENSE_REQUIRED: "Medical license number is required",
  LICENSE_INVALID:
    "Please enter a valid license number (6-12 alphanumeric characters)",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  LOGIN_FAILED:
    "Invalid credentials. Please verify your license number and password.",
  ACCESS_DENIED: "Account not verified. Please contact administration.",
  CONNECTION_ERROR: "Connection error. Please try again later.",
  ACCOUNT_SUSPENDED: "Your account has been suspended. Please contact support.",
} as const;

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Welcome back, Doctor!",
  VERIFICATION_PENDING: "Your account is pending verification.",
} as const;

// Types
interface FormData {
  email: string;
  licenseNumber: string;
  password: string;
}

interface FormErrors {
  email?: string;
  licenseNumber?: string;
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
  code?: string;
}

interface DoctorLoginResponse {
  success: boolean;
  message?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    specialization?: string;
    hospital?: string;
    licenseNumber: string;
    verified: boolean;
    profileImage?: string;
  };
  token: string;
  refreshToken: string;
}

// Utility Functions
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 255);
};

const sanitizeLicenseNumber = (license: string): string => {
  return license
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
};

const validateEmail = (email: string): string | undefined => {
  if (!email) return ERROR_MESSAGES.EMAIL_REQUIRED;
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email))
    return ERROR_MESSAGES.EMAIL_INVALID;
  return undefined;
};

const validateLicenseNumber = (license: string): string | undefined => {
  if (!license) return ERROR_MESSAGES.LICENSE_REQUIRED;
  if (!VALIDATION_RULES.LICENSE_REGEX.test(license))
    return ERROR_MESSAGES.LICENSE_INVALID;
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

    if (axiosError.response?.status === 401) {
      return ERROR_MESSAGES.LOGIN_FAILED;
    }
    if (axiosError.response?.status === 403) {
      const code = axiosError.response.data?.code;
      if (code === "ACCOUNT_SUSPENDED") return ERROR_MESSAGES.ACCOUNT_SUSPENDED;
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

const StatusMessage: React.FC<{
  message: string;
  type: "error" | "success" | "warning";
}> = ({ message, type }) => {
  const getStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        );
      case "success":
        return (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        );
      case "warning":
        return (
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`mb-4 rounded-md p-4 border ${getStyles()}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${
              type === "error"
                ? "text-red-400"
                : type === "success"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            {getIcon()}
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

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
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
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
  showPasswordToggle,
  onTogglePassword,
  required = false,
  maxLength,
  icon,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="mt-1 relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div className="text-gray-400">{icon}</div>
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
          icon ? "pl-10" : ""
        } ${showPasswordToggle ? "pr-10" : ""} ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
            <FaRegEye className="h-4 w-4" />
          ) : (
            <FaRegEyeSlash className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
);

const FeatureBadge: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <div className="flex items-center space-x-2 text-sm text-blue-600">
    {icon}
    <span>{text}</span>
  </div>
);

// Main Component
const DoctorLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    licenseNumber: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState;
  const redirectPath = locationState?.from || "/doctor-dashboard";

  // Redirect if already logged in as doctor
  useEffect(() => {
    if (
      isLoggedIn &&
      (user?.role === "doctor" || user?.role === "professional")
    ) {
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, user, navigate, redirectPath]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const licenseError = validateLicenseNumber(formData.licenseNumber);
    if (licenseError) {
      newErrors.licenseNumber = licenseError;
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

      let sanitizedValue = sanitizeInput(value);

      // Special handling for license number
      if (name === "licenseNumber") {
        sanitizedValue = sanitizeLicenseNumber(value);
      }

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

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");

      try {
        const response = await axios.post<DoctorLoginResponse>(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCTOR_LOGIN}`,
          {
            email: formData.email,
            licenseNumber: formData.licenseNumber,
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
          const { user: doctorUser, token, refreshToken } = response.data;

          // Check if doctor account is verified
          if (!doctorUser.verified) {
            setErrors({
              general:
                "Your account is pending verification. Please contact administration.",
            });
            return;
          }

          setSuccessMessage(SUCCESS_MESSAGES.LOGIN_SUCCESS);

          // Use the login function from AuthContext
          login(
            {
              id: doctorUser.id,
              name: doctorUser.name,
              email: doctorUser.email,
              role: doctorUser.role,
              specialization: doctorUser.specialization,
              hospital: doctorUser.hospital,
              profileImage: doctorUser.profileImage,
            },
            token,
            refreshToken,
            rememberMe
          );

          // Short delay to show success message
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          setErrors({
            general: response.data.message || ERROR_MESSAGES.LOGIN_FAILED,
          });
        }
      } catch (error) {
        console.error("Doctor login error:", error);
        const errorMessage = extractErrorMessage(error);
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, rememberMe, validateForm, login, navigate, redirectPath]
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
          <div className="text-center mt-4">
            <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaUserMd className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Doctor Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-200">
              Sign in to your professional account
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 mx-auto w-full sm:max-w-md z-10 relative">
          <div className="bg-white bg-opacity-95 py-6 sm:py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 backdrop-filter backdrop-blur-sm">
            {/* Feature badges */}
            <div className="mb-6 space-y-2">
              <FeatureBadge
                icon={<Shield className="h-4 w-4" />}
                text="Secure & HIPAA Compliant"
              />
              <FeatureBadge
                icon={<Clock className="h-4 w-4" />}
                text="24/7 Patient Access"
              />
              <FeatureBadge
                icon={<Heart className="h-4 w-4" />}
                text="Mental Health Focused"
              />
            </div>

            {/* Status Messages */}
            {errors.general && (
              <StatusMessage message={errors.general} type="error" />
            )}
            {successMessage && (
              <StatusMessage message={successMessage} type="success" />
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                error={errors.email}
                placeholder="doctor@hospital.com"
                autoComplete="email"
                onChange={handleInputChange}
                required
                maxLength={255}
                icon={<FaUserMd className="h-4 w-4" />}
              />

              <FormInput
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                label="Medical License Number"
                value={formData.licenseNumber}
                error={errors.licenseNumber}
                placeholder="Enter your medical license"
                autoComplete="off"
                onChange={handleInputChange}
                required
                maxLength={12}
                icon={<FaStethoscope className="h-4 w-4" />}
              />

              <FormInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={handleInputChange}
                showPasswordToggle
                onTogglePassword={togglePasswordVisibility}
                required
                maxLength={128}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
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
                    to="/doctor/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? <LoadingSpinner /> : "Sign In to Portal"}
                </button>
              </div>
            </form>

            {/* Registration Link */}
            <div className="mt-5 sm:mt-6">
              <div className="text-center">
                <span className="text-xs sm:text-sm text-gray-600">
                  New to MoodSync?{" "}
                  <Link
                    to="/doctor/register"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    Register as a Healthcare Professional
                  </Link>
                </span>
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Need help with your account?
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <Link
                    to="/doctor/support"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Technical Support
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/doctor/verification"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Account Verification
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center z-10 relative px-4">
          <p className="text-xs text-gray-300">
            By signing in, you agree to our{" "}
            <Link
              to="/doctor/terms"
              className="underline text-gray-200 hover:text-white"
            >
              Professional Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/doctor/privacy"
              className="underline text-gray-200 hover:text-white"
            >
              HIPAA Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DoctorLogin;
