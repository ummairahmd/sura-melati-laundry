import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";
import "../assets/css/complaint_history.css";

function ComplaintHistory() {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    useEffect(() => {
        const user =
            JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(sessionStorage.getItem("user"));
        console.log("User:", user);
        if(user){
            loadComplaints(user.id);
        }
    }, []);
    const loadComplaints = async(user_id)=>{
        try{
            const res = await API.get(`/my-complaints/${user_id}`);
            console.log("Response:", res.data);
            setComplaints(res.data);
        }catch(err){
            console.log(err);
        }
    };
    const getBadge = (status)=>{
        switch(status){
            case "pending":
                return "bg-warning";
            case "progress":
                return "bg-primary";
            case "resolved":
                return "bg-success";
            default:
                return "bg-secondary";
        }
    };
    const openFeedback = (id)=>{
    Swal.fire({
        title:"Give Feedback?",
        text:"Share your experience about this complaint.",
        icon:"question",
        showCancelButton:true,
        confirmButtonColor:"#193b68",
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes, Feedback"
    }).then((result)=>{
        if(result.isConfirmed){
            navigate("/feedback",{
                state:{
                    complaint_id:id
                }
            });
        }
    });
};
    return(
        <div className="history-page">
        <div className="history-container">
            <div className="history-header">
                <h2>Complaint History</h2>
                <p>
                    View and monitor the status of all complaints submitted.
                </p>
            </div>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Admin Reply</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                complaints.length > 0 ? (
                    complaints.map((item,index)=>(
                        <tr key={item.complaint_id}>
                            <td>
                                {index + 1}
                            </td>
                            <td>
                                {item.title}
                            </td>
                            <td>
                                {item.category}
                            </td>
                            <td>
                                <span className={`status ${item.status}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>
                                {item.admin_reply || "-"}
                            </td>
                            <td>
                                {new Date(item.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                <button
                                className="feedback-btn"
                                onClick={()=>openFeedback(item.complaint_id)}
                                >
                                Feedback
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center">
                            No complaints found.
                        </td>
                    </tr>
                )
                }
                </tbody>
            </table>
            </div>
        </div>
    );
}
export default ComplaintHistory;
