import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateInput = (name: string, value: string): string => {
    switch (name) {
      case "username":
        return value ? "" : "Username is required.";
      case "email":
        return !value
          ? "Email is required."
          : !/\S+@\S+\.\S+/.test(value)
          ? "Email is invalid."
          : "";
      case "password":
        return value.length < 6
          ? "Password must be at least 6 characters long."
          : !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)
          ? "Password must contain one uppercase, one lowercase, and one number."
          : "";
      case "confirmPassword":
        return value !== password ? "Passwords do not match." : "";
      case "mobileNumber":
      case "emergencyContact":
        return !/07\d{8}/.test(value)
          ? "Must be 10 digits starting with 07."
          : "";
      default:
        return "";
    }
  };

  const handleBlur = (name: string) => {
    const value =
      {
        username,
        email,
        password,
        confirmPassword,
        mobileNumber,
        emergencyContact,
      }[name] || "";
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateInput(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {
      username: validateInput("username", username),
      email: validateInput("email", email),
      password: validateInput("password", password),
      confirmPassword: validateInput("confirmPassword", confirmPassword),
      mobileNumber: validateInput("mobileNumber", mobileNumber),
      emergencyContact: validateInput("emergencyContact", emergencyContact),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/register", {
        username,
        email,
        password,
        mobileNumber,
        emergencyContact,
      });
      console.log("Registration success:", response.data);

      setSuccessMessage(
        "Registration successful! Redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setServerError(error.response?.data?.detail || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPlaceholder = (field: string) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const fields = [
    { name: "username", type: "text" },
    { name: "email", type: "email" },
    { name: "mobileNumber", type: "text" },
    { name: "emergencyContact", type: "text" },
    { name: "password", type: "password" },
    { name: "confirmPassword", type: "password" },
  ];

  const getFieldValue = (field: string) => {
    switch (field) {
      case "username":
        return username;
      case "email":
        return email;
      case "mobileNumber":
        return mobileNumber;
      case "emergencyContact":
        return emergencyContact;
      case "password":
        return password;
      case "confirmPassword":
        return confirmPassword;
      default:
        return "";
    }
  };

  const setFieldValue = (field: string, value: string) => {
    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "mobileNumber":
        setMobileNumber(value);
        break;
      case "emergencyContact":
        setEmergencyContact(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="registration-container">
        <div className="registration-box">
          <div className="logo-box">
            <div className="logo-placeholder">
              <div className="logo-line"></div>
            </div>
          </div>
          <h1 className="title">MOODSYNC!</h1>
          {serverError && <p style={{ color: "red" }}>{serverError}</p>}
          {successMessage && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              {successMessage}
            </p>
          )}

          {isLoading ? (
            <Spinner />
          ) : (
            <form className="registration-form" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div className="input-container" key={field.name}>
                  <input
                    type={field.type}
                    id={field.name}
                    className={`input ${
                      errors[field.name] ? "input-error" : ""
                    }`}
                    placeholder={formatPlaceholder(field.name)}
                    value={getFieldValue(field.name)}
                    onChange={(e) => setFieldValue(field.name, e.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    required
                  />
                  {errors[field.name] && (
                    <p className="error-message">{errors[field.name]}</p>
                  )}
                </div>
              ))}
              <div className="terms-container">
                <input
                  type="checkbox"
                  id="terms"
                  className="terms-checkbox"
                  required
                />
                <label htmlFor="terms" className="terms-label">
                  I agree to the terms and conditions
                </label>
              </div>
              <button type="submit" className="submit-button">
                Register
              </button>
            </form>
          )}
          <p className="footer-text">
            Already have an account?{" "}
            <a href="/login" className="link">
              Login
            </a>
          </p>
        </div>
      </div>
      <style>{`
        html, body {
          height: 100%;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .registration-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-image: url('/src/assets/3.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .registration-box {
          text-align: center;
          max-width: 400px;
          width: 100%;
          padding: 24px;
          box-sizing: border-box;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          position: relative;
        }
        .logo-box {
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }
        .logo-placeholder {
          width: 80px;
          height: 80px;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .logo-line {
          width: 24px;
          height: 2px;
          background-color: white;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 32px;
        }
        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-container {
          position: relative;
        }
        .input {
          background-color: #f9f9f9;
          border: 1px solid #d1d5db;
          padding: 12px;
          width: 100%;
          font-size: 14px;
          border-radius: 4px;
          transition: border-color 0.3s ease;
        }
        .input-error {
          border-color: #f87171;
        }
        .error-message {
          color: #f87171;
          font-size: 12px;
          margin-top: 4px;
        }
        .terms-container {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }
        .terms-checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          background-color: #f9f9f9;
          transition: background-color 0.3s ease, border-color 0.3s ease;
          margin-right: 8px;
        }
        .terms-checkbox:checked {
          background-color: #10b981;
          border-color: #10b981;
        }
        .submit-button {
          background-color: #10b981;
          color: white;
          padding: 12px;
          width: 100%;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }
        .submit-button:hover {
          background-color: #059669;
        }
        .footer-text {
          color: black;
          font-size: 14px;
          margin-top: 16px;
        }
        .link {
          color: #10b981;
          text-decoration: underline;
        }
        .link:hover {
          color: #059669;
        }
      `}</style>
    </>
  );
};

export default Registration;
