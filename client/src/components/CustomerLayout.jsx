import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NotificationBell from "../components/NotificationBell";
import AIChatbot from "../components/AIChatbot";
import "../assets/css/customer.css";

function CustomerLayout() {

    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [openSidebar, setOpenSidebar] = useState(false);


    /* ==========================
       CHECK LOGIN
    ========================== */

    useEffect(() => {

        const data =
            JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(sessionStorage.getItem("user"));

        if (!data) {
            navigate("/login");
            return;
        }

        setUser(data);

    }, [navigate]);


    /* ==========================
       LOGOUT
    ========================== */

    const logout = () => {

        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#193b68",
            cancelButtonColor: "#d33",

            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel"

        }).then((result) => {

            if (!result.isConfirmed) return;

            localStorage.removeItem("user");
            sessionStorage.removeItem("user");

            Swal.fire({
                title: "Logged Out!",
                text: "You have been logged out successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false

            }).then(() => {

                navigate("/login");

            });

        });

    };


    /* ==========================
       JSX
    ========================== */

    return (

        <>

        <div className="customer-layout">


            {/* ==========================
                MENU BUTTON
            ========================== */}

            <button
                className="menu-btn"
                onClick={() => setOpenSidebar(!openSidebar)}
            >
                ☰
            </button>


            {/* ==========================
                SIDEBAR
            ========================== */}

            <aside
                className={
                    openSidebar
                        ? "sidebar active"
                        : "sidebar"
                }
            >

                


                <h2>SURA MELATI</h2>

                <h3>E-LAUNDRY</h3>


                <ul>

                    <li>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>
                    </li>


                    <li>
                        <Link to="/submit-complaint">
                            Submit Complaint
                        </Link>
                    </li>


                    <li>
                        <Link to="/complaint-history">
                            My Complaints
                        </Link>
                    </li>


                    <li>
                        <Link to="/track-complaint">
                            Track Status
                        </Link>
                    </li>


                    <li>
                        <Link to="/feedback">
                            Feedback
                        </Link>
                    </li>


                    <li>
                        <Link to="/profile">
                            Profile
                        </Link>
                    </li>

                </ul>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="customer-logout"
                    onClick={logout}
                >
                    Logout
                </button>


            </aside>


            {/* ==========================
                PAGE CONTENT
            ========================== */}

            <main className="dashboard-content">
                
                <div className="customer-topbar">

                            <NotificationBell />

                        </div>

                <Outlet />

            </main>


        </div>

        {/* AI CHATBOT */}

        <AIChatbot />

    </>

    );

}

export default CustomerLayout;