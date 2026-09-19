import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";

import "../assets/css/auth.css";

import logo_laundry from "../assets/images/logo_laundry.jpeg";
import imagehome from "../assets/images/imagehome.jpeg";
import google from "../assets/images/google.png";
import apple from "../assets/images/apple.png";

import {
  FaClock,
  FaShieldAlt,
  FaSoap,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Temporary user before verification
  const [pendingUser, setPendingUser] = useState(null);

  // Checkbox verification
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const socialUser = {
        id: user.uid,
        user_id: user.uid,
        fullname: user.displayName,
        email: user.email,
        role: "customer"
      };

      if (remember) {
        localStorage.setItem("user", JSON.stringify(socialUser));
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("user", JSON.stringify(socialUser));
        localStorage.removeItem("user");
      }

      Swal.fire({
        title: "Login Successful",
        text: `Welcome back, ${user.displayName}`,
        icon: "success",
        confirmButtonColor: "#193b68"
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Google Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#193b68"
      });
    }
  };

  // =========================
  // APPLE LOGIN
  // =========================
  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;

      const socialUser = {
        id: user.uid,
        user_id: user.uid,
        fullname: user.displayName || "Apple User",
        email: user.email,
        role: "customer"
      };

      if (remember) {
        localStorage.setItem("user", JSON.stringify(socialUser));
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("user", JSON.stringify(socialUser));
        localStorage.removeItem("user");
      }

      Swal.fire({
        title: "Login Successful",
        text: "Welcome back!",
        icon: "success",
        confirmButtonColor: "#193b68"
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Apple Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#193b68"
      });
    }
  };

  // =========================
  // NORMAL LOGIN
  // =========================
  const handleLogin = async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!email.trim()) {
    newErrors.email = "Email is required.";
  }

  if (!password.trim()) {
    newErrors.password = "Password is required.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  try {
    setLoading(true);

    console.log("========== FRONTEND LOGIN ==========");
    console.log("Sending login request...");

    const res = await API.post("/login", {
      email,
      password
    });

    console.log("LOGIN RESPONSE:", res);
    console.log("LOGIN RESPONSE DATA:", res.data);

    if (!res.data) {
      throw new Error("No response data received");
    }

    if (!res.data.user) {
      throw new Error("User data missing from response");
    }

    const user = res.data.user;

    console.log("USER FROM BACKEND:", user);

    const formattedUser = {
      ...user,
      id: user.id || user.user_id,
      user_id: user.user_id || user.id
    };

    console.log("FORMATTED USER:", formattedUser);

    setPendingUser(formattedUser);
    setIsVerified(false);
    setShowVerification(true);

    console.log("VERIFICATION MODAL SHOULD APPEAR");

  } catch (err) {
  console.error("FRONTEND LOGIN ERROR:", err);
  console.error("ERROR MESSAGE:", err.message);
  console.error("ERROR RESPONSE:", err.response);
  console.error("ERROR CODE:", err.code);

  Swal.fire({
    title: "LOGIN DEBUG",
    html: `
      <b>Message:</b> ${err.message}<br><br>
      <b>Code:</b> ${err.code || "N/A"}<br><br>
      <b>Status:</b> ${err.response?.status || "N/A"}
    `,
    icon: "error",
    confirmButtonColor: "#193b68"
  });

} finally {
    setLoading(false);
  }
};

  // =========================
  // CHECKBOX VERIFICATION
  // =========================
  const handleVerification = () => {
    if (!isVerified) {
      Swal.fire({
        title: "Verification Required",
        text: "Please confirm that you are not a robot.",
        icon: "warning",
        confirmButtonColor: "#193b68"
      });
      return;
    }

    setShowVerification(false);
    continueLogin();
  };

  // =========================
  // CONTINUE LOGIN
  // =========================
  const continueLogin = () => {
    const user = pendingUser;

    console.log("========== CONTINUE LOGIN ==========");
    console.log("PENDING USER:", user);

    if (!user || (!user.id && !user.user_id)) {
      Swal.fire({
        title: "Login Error",
        text: "User information is missing.",
        icon: "error",
        confirmButtonColor: "#193b68"
      });
      return;
    }

    if (remember) {
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("user");
    }

    Swal.fire({
      title: "Login Successful",
      text: `Welcome back, ${user.fullname}`,
      icon: "success",
      confirmButtonColor: "#193b68",
      confirmButtonText: "Continue"
    }).then(() => {
      if (user.role === "customer") {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    });
  };

  // =========================
  // CANCEL VERIFICATION
  // =========================
  const cancelVerification = () => {
    setShowVerification(false);
    setIsVerified(false);
    setPendingUser(null);
  };

  return (
    <div className="auth-container">
      {/* LEFT BRANDING */}
      <div className="auth-left">
        <div className="auth-overlay"></div>
        <div className="auth-content">
          <h1>SURA MELATI</h1>
          <h2>E-LAUNDRY</h2>
          <div className="line"></div>
          <div className="feature">
            <FaSoap className="feature-icon" />
            <p>Smart Laundry Solution</p>
          </div>
          <div className="feature">
            <FaClock className="feature-icon" />
            <p>Open 24 Hours</p>
          </div>
          <div className="feature">
            <FaShieldAlt className="feature-icon" />
            <p>Better Service Experience</p>
          </div>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <small className="error-text">{errors.email}</small>
            )}

            {/* PASSWORD */}
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <small className="error-text">{errors.password}</small>
            )}

            {/* REMEMBER */}
            <div className="remember-box">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button
              type="button"
              onClick={() => {
                window.location.href = "http://localhost:5000/auth/google";
              }}
            >
              <img src={google} alt="Google" />
            </button>
          </div>

          {/* REGISTER */}
          <div className="login-footer">
            <span>Don't have an account?</span>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>

      {/* CHECKBOX VERIFICATION */}
      {showVerification && (
        <div className="verification-overlay">
          <div className="verification-box">
            <div className="verification-header">
              <div className="verification-icon">🛡️</div>
              <div>
                <h2>Security Verification</h2>
                <p>Please confirm that you are not a robot.</p>
              </div>
            </div>

            <div className="robot-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                />
                <span>I'm not a robot</span>
              </label>
            </div>

            <div className="verification-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelVerification}
              >
                Cancel
              </button>
              <button
                type="button"
                className="verify-btn"
                onClick={handleVerification}
              >
                Verify
              </button>
            </div>

            <small className="verification-note">
              Security verification for your account
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;