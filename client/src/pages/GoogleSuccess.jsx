import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const userString = params.get("user");

    if (!token || !userString) {
      Swal.fire({
        title: "Login Failed",
        text: "Unable to get Google account information.",
        icon: "error",
        confirmButtonColor: "#193b68",
      }).then(() => {
        navigate("/login");
      });

      return;
    }

    try {
      const user = JSON.parse(
        decodeURIComponent(userString)
      );

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        title: "Login Successful!",
        text: `Welcome, ${user.fullname}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      });

    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error);

      Swal.fire({
        title: "Login Failed",
        text: "Invalid Google login data.",
        icon: "error",
        confirmButtonColor: "#193b68",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Signing you in...</h2>
    </div>
  );
}

export default GoogleSuccess;