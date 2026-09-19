import React, {useEffect, useState} from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    FaTachometerAlt,
    FaTasks,
    FaUsers,
    FaChartBar,
    FaSignOutAlt
} from "react-icons/fa";

import "../assets/css/admin.css";


function AdminLayout(){

    const navigate = useNavigate();

    const [admin,setAdmin] = useState({});
    const [openSidebar,setOpenSidebar] = useState(false);



    /* CHECK LOGIN */

    useEffect(()=>{

        const data =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));


        if(!data){

            navigate("/login");
            return;

        }


        setAdmin(data);


    },[navigate]);





    /* LOGOUT */

    const logout=()=>{


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

<div className="admin-layout">

                {/* SIDEBAR */}

                 <button
                    className="menu-btn"
                    onClick={() => setOpenSidebar(!openSidebar)}
                >
                    ☰
                </button>

                {/* SIDEBAR */}

                <div className={openSidebar ? "sidebar active" : "sidebar"}>

                    <button
                        className="sidebar-close-btn"
                        onClick={() => setOpenSidebar(false)}
                    >
                        ✕
                    </button>


<h2>
SURA MELATI
</h2>


<h3>
ADMIN PANEL
</h3>


<ul>

<li>
<Link to="/admin-dashboard">
Dashboard
</Link>
</li>


<li>
<Link to="/manage-complaint">
Complaint Management
</Link>
</li>


<li>
<Link to="/admin-profile">
Profile
</Link>
</li>


<li>
<Link to="/reports">
Report
</Link>
</li>


<li 
className="logout"
onClick={logout}
>
Logout
</li>
</ul>
</div>


{/* CONTENT */}

<div className="dashboard-content">


<Outlet/>


</div>





</div>


);


}


export default AdminLayout;