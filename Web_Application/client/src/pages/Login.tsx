import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.tsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid.";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    if (
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }
    return "";
  };

  const handleBlur = (field: "email" | "password") => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]:
        field === "email" ? validateEmail(email) : validatePassword(password),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });
      console.log("Login success:", response.data);
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      // On successful login, redirect to the home page
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <div className="login-container">
          <div className="login-box">
            <div className="logo-box">
              <div className="logo-placeholder">
                <div className="logo-line"></div>
              </div>
            </div>
            <h1 className="title">MOODSYNC!</h1>
            {serverError && <p style={{ color: "red" }}>{serverError}</p>}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="email"
                  className={`input ${errors.email ? "input-error" : ""}`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  required
                />
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
              <div className="input-container">
                <input
                  type="password"
                  className={`input ${errors.password ? "input-error" : ""}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  required
                />
                {errors.password && (
                  <p className="error-message">{errors.password}</p>
                )}
              </div>
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
            <p className="footer-text">
              You don't have an account?{" "}
              <a href="/register" className="signup-link">
                SignUp
              </a>
            </p>
          </div>
        </div>
      )}

      <style>
        {`
          html, body {
            height: 100%;
            margin: 0;
            font-family: Arial, sans-serif;
          }

          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
          }

          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: url('/src/assets/3.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          .login-box {
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

          .login-form {
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

          .signup-link {
            color: #10b981;
            text-decoration: underline;
          }

          .signup-link:hover {
            color: #059669;
          }
        `}
      </style>
    </>
  );
};

export default Login;
