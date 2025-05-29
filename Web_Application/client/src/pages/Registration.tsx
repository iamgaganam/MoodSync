import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { FaRegEye, FaRegEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import backgroundImage from "../assets/emergency.jpg";
import { Brain } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  ENDPOINTS: {
    REGISTER: "/auth/register",
  },
} as const;

const VALIDATION_RULES = {
  EMAIL_REGEX: /\S+@\S+\.\S+/,
  PHONE_REGEX: /^[\d\s\-\+\(\)]{7,15}$/,
  MIN_PASSWORD_LENGTH: 8,
  PASSWORD_STRENGTH_REGEX: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /\d/,
    SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
  },
} as const;

const ERROR_MESSAGES = {
  NAME_REQUIRED: "Name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Email address is invalid",
  MOBILE_REQUIRED: "Mobile Number is required",
  MOBILE_INVALID: "Please enter a valid mobile number",
  EMERGENCY_REQUIRED: "Emergency Contact is required",
  EMERGENCY_SAME: "Emergency Contact cannot be the same as your Mobile Number",
  EMERGENCY_INVALID: "Please enter a valid emergency contact number",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_STRENGTH:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password",
  PASSWORDS_NO_MATCH: "Passwords do not match",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
} as const;

const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "Registration successful! Redirecting to login page...",
} as const;

const REDIRECT_DELAY = 2000;

// Types
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

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: string;
}

// Utility Functions
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 255);
};

const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d\s\-\+\(\)]/g, "").slice(0, 20);
};

const validateName = (name: string): string | undefined => {
  if (!name) return ERROR_MESSAGES.NAME_REQUIRED;
  if (name.length < 2) return "Name must be at least 2 characters";
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email) return ERROR_MESSAGES.EMAIL_REQUIRED;
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email))
    return ERROR_MESSAGES.EMAIL_INVALID;
  return undefined;
};

const validatePhoneNumber = (phone: string): string | undefined => {
  if (!phone) return ERROR_MESSAGES.MOBILE_REQUIRED;
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone.replace(/\s/g, ""))) {
    return ERROR_MESSAGES.MOBILE_INVALID;
  }
  return undefined;
};

const validateEmergencyContact = (
  emergencyContact: string,
  mobileNumber: string
): string | undefined => {
  if (!emergencyContact) return ERROR_MESSAGES.EMERGENCY_REQUIRED;
  if (!VALIDATION_RULES.PHONE_REGEX.test(emergencyContact.replace(/\s/g, ""))) {
    return ERROR_MESSAGES.EMERGENCY_INVALID;
  }
  if (emergencyContact === mobileNumber) return ERROR_MESSAGES.EMERGENCY_SAME;
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return ERROR_MESSAGES.PASSWORD_REQUIRED;
  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
  }

  const { UPPERCASE, LOWERCASE, NUMBER, SPECIAL_CHAR } =
    VALIDATION_RULES.PASSWORD_STRENGTH_REGEX;
  if (
    !UPPERCASE.test(password) ||
    !LOWERCASE.test(password) ||
    !NUMBER.test(password) ||
    !SPECIAL_CHAR.test(password)
  ) {
    return ERROR_MESSAGES.PASSWORD_STRENGTH;
  }
  return undefined;
};

const validateConfirmPassword = (
  confirmPassword: string,
  password: string
): string | undefined => {
  if (!confirmPassword) return ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  if (password !== confirmPassword) return ERROR_MESSAGES.PASSWORDS_NO_MATCH;
  return undefined;
};

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errors ||
      ERROR_MESSAGES.REGISTRATION_FAILED
    );
  }
  return ERROR_MESSAGES.REGISTRATION_FAILED;
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

const StatusMessage: React.FC<{
  message: string;
  type: "error" | "success";
}> = ({ message, type }) => {
  const isError = type === "error";

  return (
    <div
      className={`mb-4 ${
        isError ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500"
      } border-l-4 p-3 sm:p-4`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              isError ? "text-red-400" : "text-green-400"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            {isError ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </div>
        <div className="ml-3">
          <p
            className={`text-xs sm:text-sm ${
              isError ? "text-red-700" : "text-green-700"
            }`}
          >
            {message}
          </p>
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
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  maxLength?: number;
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
  maxLength,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs sm:text-sm font-medium text-gray-700"
    >
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
        maxLength={maxLength}
        className={`appearance-none block w-full px-3 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${
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
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

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

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const mobileError = validatePhoneNumber(formData.mobileNumber);
    if (mobileError) {
      newErrors.mobileNumber = mobileError;
      isValid = false;
    }

    const emergencyError = validateEmergencyContact(
      formData.emergencyContact,
      formData.mobileNumber
    );
    if (emergencyError) {
      newErrors.emergencyContact = emergencyError;
      isValid = false;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      let sanitizedValue = sanitizeInput(value);

      // Special handling for phone numbers
      if (name === "mobileNumber" || name === "emergencyContact") {
        sanitizedValue = sanitizePhoneNumber(value);
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

      // Special validation for emergency contact when mobile number changes
      if (
        name === "mobileNumber" &&
        sanitizedValue === formData.emergencyContact
      ) {
        setErrors((prev) => ({
          ...prev,
          emergencyContact: ERROR_MESSAGES.EMERGENCY_SAME,
        }));
      }

      if (
        name === "emergencyContact" &&
        sanitizedValue === formData.mobileNumber
      ) {
        setErrors((prev) => ({
          ...prev,
          emergencyContact: ERROR_MESSAGES.EMERGENCY_SAME,
        }));
      }
    },
    [errors, formData.emergencyContact, formData.mobileNumber]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");

      try {
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          },
          {
            timeout: 15000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Registration success:", response.data);
        setSuccessMessage(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);

        setTimeout(() => {
          navigate("/login");
        }, REDIRECT_DELAY);
      } catch (error) {
        console.error("Registration error:", error);
        const errorMessage = extractErrorMessage(error);
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, navigate]
  );

  const togglePasswordVisibility = useCallback(
    (field: "password" | "confirmPassword") => {
      if (field === "password") {
        setShowPassword((prev) => !prev);
      } else {
        setShowConfirmPassword((prev) => !prev);
      }
    },
    []
  );

  const socialLoginButtons = useMemo(
    () => [
      {
        icon: (
          <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-1 sm:mr-2" />
        ),
        label: "Google",
        onClick: () => console.log("Google registration not implemented"),
      },
      {
        icon: (
          <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2" />
        ),
        label: "Facebook",
        onClick: () => console.log("Facebook registration not implemented"),
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
        <div className="absolute inset-0 bg-black bg-opacity-50" />

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
            Create your account
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-200">
            Start your mental wellness journey with MoodSync
          </p>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white py-6 px-4 shadow-2xl sm:rounded-lg sm:py-8 sm:px-10 backdrop-filter backdrop-blur-sm bg-opacity-95">
            {errors.general && (
              <StatusMessage message={errors.general} type="error" />
            )}
            {successMessage && (
              <StatusMessage message={successMessage} type="success" />
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <FormInput
                id="name"
                name="name"
                type="text"
                label="Full Name"
                value={formData.name}
                error={errors.name}
                autoComplete="name"
                onChange={handleInputChange}
                maxLength={100}
              />

              <FormInput
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                label="Mobile Number"
                value={formData.mobileNumber}
                error={errors.mobileNumber}
                autoComplete="tel"
                onChange={handleInputChange}
                maxLength={20}
              />

              <FormInput
                id="emergencyContact"
                name="emergencyContact"
                type="tel"
                label="Emergency Contact"
                value={formData.emergencyContact}
                error={errors.emergencyContact}
                autoComplete="tel"
                onChange={handleInputChange}
                maxLength={20}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={formData.email}
                error={errors.email}
                autoComplete="email"
                onChange={handleInputChange}
                maxLength={255}
              />

              <FormInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                error={errors.password}
                autoComplete="new-password"
                onChange={handleInputChange}
                showPasswordToggle
                onTogglePassword={() => togglePasswordVisibility("password")}
                maxLength={128}
              />

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                autoComplete="new-password"
                onChange={handleInputChange}
                showPasswordToggle
                onTogglePassword={() =>
                  togglePasswordVisibility("confirmPassword")
                }
                maxLength={128}
              />

              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
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

              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3">
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

        <div className="mt-4 sm:mt-8 text-center relative z-10 px-4">
          <p className="text-xs text-white">
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

      <Footer />
    </>
  );
};

export default RegisterPage;
