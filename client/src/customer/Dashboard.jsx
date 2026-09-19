import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../assets/css/style.css";
import API from "../api/API";
import Swal from "sweetalert2";



function Dashboard(){
    

    const navigate = useNavigate();

    const [user,setUser] = useState({});

    const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0
});
    
    const getDashboard = async (user_id) => {
        try {
            const res = await API.get(`/dashboard/${user_id}`);
            setStats(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(()=>{

        const data = JSON.parse(localStorage.getItem("user"));

        if(!data){
            navigate("/login");
            return;
        }

        setUser(data);
        getDashboard(data.id);

    },[navigate]);

    const logout = () => {

    Swal.fire({

        title:"Logout?",
        text:"Are you sure you want to logout?",
        icon:"warning",

        showCancelButton:true,

        confirmButtonColor:"#193b68",
        cancelButtonColor:"#d33",

        confirmButtonText:"Yes, Logout",
        cancelButtonText:"Cancel"

    }).then((result)=>{


        if(result.isConfirmed){


            localStorage.removeItem("user");

            sessionStorage.removeItem("user");


            Swal.fire({

                title:"Logged Out!",
                text:"You have been logged out successfully.",
                icon:"success",
                timer:1500,
                showConfirmButton:false

            }).then(()=>{

                navigate("/login");

            });


        }


    });


};


    return(

        <div className="customer-dashboard">

            {/* SIDEBAR */}
            <div className="sidebar">
                <h2>
                    SURA MELATI
                </h2>

                <h3>
                    E-LAUNDRY
                </h3>

                <ul>

                    <li className="active">
                        DASHBOARD
                    </li>

                    <li>
                        <Link to="/submit-complaint">
                        SUBMIT COMPLAINT
                        </Link>
                    </li>

                    <li>
                        <Link to="/complaint-history">
                        MY COMPLAINTS
                        </Link>
                    </li>

                    <li>
                        UPLOAD IMAGES
                    </li>

                    <li>
                        <Link to="/track-complaint">
                        TRACK STATUS
                        </Link>
                    </li>

                    <li>
                        PROFILE
                    </li>

                    <li>

<button 
    className="customer-logout"
    onClick={logout}
>

    <FaSignOutAlt />

    <span>
        Logout
    </span>

</button>

</li>

                </ul>

            </div>

            {/* CONTENT */}

            <div className="dashboard-content">

                <div className="topbar">
                    <h1>
                        Welcome Back, {user.fullname}!
                    </h1>

                    <div className="profile">
                        🔔
                        <span>
                            👤 {user.fullname}
                        </span>
                    </div>
                </div>

                {/* STAT CARD */}
                <div className="stats">
                    <div className="stat-card">
                        <span>
                            📋
                        </span>
                        <h3>
                            Total Complaints
                        </h3>
                        <b>{stats.total}</b>
                    </div>

                    <div className="stat-card">
                        <span>
                            🟡
                        </span>
                        <h3>
                            Pending
                        </h3>
                        <b>{stats.pending}</b>
                    </div>

                    <div className="stat-card">
                        <span>
                            🔵
                        </span>
                        <h3>
                            Progress
                        </h3>
                        <b>{stats.progress}</b>
                    </div>

                    <div className="stat-card">
                        <span>
                            🟢
                        </span>
                        <h3>
                            Resolved
                        </h3>
                        <b>{stats.resolved}</b>
                    </div>

                </div>

                {/* LOWER SECTION */}

                <div className="bottom">
                    <div className="complaint-box">
                        <h2>
                            Current Complaints Status
                        </h2>
                        <label>
                            Complaint ID
                        </label>

                        <input type="text"/>
                    
                        <label>
                            Category
                        </label>

                        <input type="text"/>

                        <label>
                            Status
                        </label>

                        <input type="text"/>

                        <button>
                            Submit
                        </button>

                    </div>

                    <div className="notification-box">
                        <h2>
                            Notifications
                        </h2>

                        <div className="notice">
                            ✅ Complaint Updated!
                        </div>

                        <div className="notice">
                            ✅ Complaint Successfully!
                        </div>

                        <div className="notice">
                            ✅ Profile Updated
                        </div>

                    </div>

                </div>

            </div>
        </div>

    );

}

export default Dashboard;