import React, {useEffect, useState} from "react";
import API from "../api/API";
import Swal from "sweetalert2";


function ManageComplaint(){

    const [complaints,setComplaints] = useState([]);


    useEffect(()=>{

        getComplaints();

    },[]);



    const getComplaints = async ()  => {

    try {

        const res = await API.get("/complaints");

        console.log("Complaints:", res.data);

        setComplaints(res.data);

    } catch(err){

    console.log("FULL ERROR:", err);

    if(err.response){
        console.log(err.response.data);
    }

}

};


    const updateStatus = async(id, status, admin_reply) => {


    const result = await Swal.fire({

        title: "Update Complaint?",

        text: "Are you sure you want to update this complaint?",

        icon: "question",

        showCancelButton:true,

        confirmButtonColor:"#193b68",

        cancelButtonColor:"#d33",

        confirmButtonText:"Yes, Update",

        cancelButtonText:"Cancel"

    });



    if(!result.isConfirmed){

        return;

    }



    try {


        await API.put(`/update-status/${id}`, {

            status,

            admin_reply

        });



        Swal.fire({

            title:"Updated!",

            text:"Complaint updated successfully.",

            icon:"success",

            confirmButtonColor:"#193b68"

        });



        getComplaints();



    }catch(err){


        console.log(err);


        Swal.fire({

            title:"Error",

            text:"Failed to update complaint.",

            icon:"error"

        });


    }

};


    const detectPriority = (complaint) => {

    const text = `
        ${complaint.title || ""}
        ${complaint.description || ""}
        ${complaint.category || ""}
    `.toLowerCase();

    const emergencyKeywords = [
        "fire",
        "smoke",
        "electric shock",
        "electric",
        "electrical",
        "sparking",
        "spark",
        "explosion",
        "gas leak",
        "flood",
        "water leaking",
        "leaking water",
        "danger",
        "injury",
        "hurt",
        "unsafe"
    ];

    const highKeywords = [
        "machine broken",
        "machine not working",
        "machine stopped",
        "stuck",
        "damaged",
        "urgent",
        "cannot use",
        "not working"
    ];

    const isEmergency = emergencyKeywords.some(keyword =>
        text.includes(keyword)
    );

    const isHigh = highKeywords.some(keyword =>
        text.includes(keyword)
    );

    if (isEmergency) {
        return {
            level: "Emergency",
            className: "priority-emergency",
            icon: "⚠️"
        };
    }

    if (isHigh) {
        return {
            level: "High",
            className: "priority-high",
            icon: "🔶"
        };
    }

    return {
        level: "Normal",
        className: "priority-normal",
        icon: "●"
    };
};



    return(

<div className="content">

    <div className="page-header">
        <h2>Manage Customer Complaints</h2>
        <p>Review, update and respond to customer complaints.</p>
    </div>


    <div className="complaint-card">

        <table className="complaint-table">

            <thead>

                <tr>
                    <th>Customer</th>
                    <th>Complaint Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Admin Reply</th>
                    <th>Action</th>
                </tr>

            </thead>


            <tbody>

            {
                complaints.map((item)=>(

                <tr key={item.complaint_id}>


                    <td>
                        {item.fullname}
                    </td>


                    <td>
                        {item.title}
                    </td>


                    <td>
                        {item.category}
                    </td>


                    <td className="description">
                        {item.description}
                    </td>

                    <td>
                        {(() => {

                            const priority = detectPriority(item);

                            return (

                                <div className={`priority-badge ${priority.className}`}>
                                    <span className="priority-dot"></span>
                                    {priority.level}
                                </div>

                            );

                        })()}
                    </td>


                    <td>

                        <select

                        className={`status-select ${item.status.replace(" ","-").toLowerCase()}`}

                        value={item.status}

                        onChange={(e)=>{

                            const update = complaints.map(c =>
                                c.complaint_id === item.complaint_id
                                ? {...c,status:e.target.value}
                                : c
                            );

                            setComplaints(update);

                        }}

                        >

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Resolved">
                                Resolved
                            </option>


                        </select>


                    </td>



                    <td>

                        <textarea

                        className="reply-box"

                        placeholder="Enter reply..."

                        value={item.admin_reply || ""}

                        onChange={(e)=>{


                            const update = complaints.map(c =>
                                c.complaint_id === item.complaint_id
                                ? {...c,admin_reply:e.target.value}
                                : c
                            );


                            setComplaints(update);


                        }}

                        />

                    </td>



                    <td>

                        <button

                        className="update-btn"

                        onClick={()=>
                            updateStatus(
                                item.complaint_id,
                                item.status,
                                item.admin_reply
                            )
                        }

                        >

                            Update

                        </button>

                    </td>


                </tr>

                ))
            }


            </tbody>


        </table>


    </div>

    {complaints.some(item => detectPriority(item).level === "Emergency") && (

    <div className="emergency-warning">

        <span>⚠️</span>

        <div>
            <strong>Emergency Complaint Detected</strong>
            <p>
                One or more complaints require immediate attention.
            </p>
        </div>

    </div>

)}


</div>

);

}


export default ManageComplaint;