import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/API";
import Swal from "sweetalert2";

import "../assets/css/auth.css";

import google from "../assets/images/google.png";
import apple from "../assets/images/apple.png";

import {
  FaClock,
  FaShieldAlt,
  FaSoap,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // 1. Validation Semakan Ruangan Kosong
    if (!fullname.trim()) {
      newErrors.fullname = "Full name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password does not match.";
    }

    if (!agree) {
      newErrors.agree = "Please agree to the Terms of Service.";
    }

    // Jika ada sebarang error, simpan state dan hentikan submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // 2. Submit API Request
    try {
      setLoading(true);

      const res = await API.post("/register", {
        fullname,
        email,
        phone,
        password
      });

      Swal.fire({
        title: "Registration Successful!",
        text: res.data.message || "Your account has been created.",
        icon: "success",
        confirmButtonColor: "#193b68",
        confirmButtonText: "Go to Login"
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      console.error(err);

      if (err.response) {
        Swal.fire({
          title: "Registration Failed",
          text: err.response.data.message || "Unable to create account.",
          icon: "error",
          confirmButtonColor: "#193b68"
        });
      } else {
        Swal.fire({
          title: "Server Error",
          text: "Server not connected.",
          icon: "error",
          confirmButtonColor: "#193b68"
        });
      }
    } finally {
      setLoading(false);
    }
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

      {/* REGISTER FORM */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join us and make laundry easier</p>
          </div>

          <form onSubmit={handleRegister}>
            {/* FULL NAME */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => {
                  setFullname(e.target.value);
                  setErrors({ ...errors, fullname: "" });
                }}
                className={errors.fullname ? "input-error" : ""}
              />
              {errors.fullname && (
                <small className="error-text">{errors.fullname}</small>
              )}
            </div>

            {/* EMAIL */}
            <div className="form-group">
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
            </div>

            {/* PHONE */}
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors({ ...errors, phone: "" });
                }}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <small className="error-text">{errors.phone}</small>
              )}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={errors.password ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <small className="error-text">{errors.password}</small>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-box">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <small className="error-text">{errors.confirmPassword}</small>
              )}
            </div>

            {/* TERMS */}
            <div className="remember-box">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>
            {errors.agree && (
              <small className="error-text">{errors.agree}</small>
            )}

            {/* REGISTER BUTTON */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            {/* GOOGLE */}
            <button
              type="button"
              onClick={() => {
                window.location.href = "http://localhost:5000/auth/google";
              }}
            >
              <img src={google} alt="Google" />
            </button>
          </div>

          {/* FOOTER */}
          <div className="login-footer">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;