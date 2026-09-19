import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../assets/css/track.css";

function TrackComplaint() {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const user =
            JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(sessionStorage.getItem("user"));

        if (user) {
            getComplaintStatus(user.id);
        }
    }, []);

    const getComplaintStatus = async (user_id) => {
        try {
            const res = await API.get(`/track-complaint/${user_id}`);
            setComplaints(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const statusStep = (status) => {

    switch (status) {

                case "Pending":
                    return 1;

                case "In Progress":
                    return 2;

                case "Resolved":
                    return 3;

                default:
                    return 0;
            }
        };

    return (
        <div className="track-page">

            <div className="track-container">

                {/* Header */}
                <div className="track-header">

                    <h1>Complaint Tracking</h1>

                    <p>
                        Monitor the progress and latest updates for your
                        submitted complaints.
                    </p>

                </div>

                {/* Complaint List */}
                {complaints.length > 0 ? (

                    complaints.map((item) => (

                        <div
                            className="track-card"
                            key={item.complaint_id}
                        >

                            {/* Top Section */}
                            <div className="track-top">

                                <div className="complaint-title">

                                    <h3>{item.title}</h3>

                                    <p className="reference-id">
                                        Reference ID :
                                        {" "}
                                        SM-
                                        {String(item.complaint_id).padStart(4, "0")}
                                    </p>

                                </div>

                                <span
                                    className={`status-pill ${item.status
                                        .toLowerCase()
                                        .replace(" ", "-")}`}
                                >
                                    {item.status}
                                </span>

                            </div>

                            {/* Timeline */}
                            <div className="timeline">

                                <div
                                    className={
                                        statusStep(item.status) >= 1
                                            ? "active-step"
                                            : ""
                                    }
                                >
                                    <div className="timeline-circle"></div>

                                    <p>Submitted</p>
                                </div>

                                <div
                                    className={
                                        statusStep(item.status) >= 2
                                            ? "active-step"
                                            : ""
                                    }
                                >
                                    <div className="timeline-circle"></div>

                                    <p>Processing</p>
                                </div>

                                <div
                                    className={
                                        statusStep(item.status) >= 3
                                            ? "active-step"
                                            : ""
                                    }
                                >
                                    <div className="timeline-circle"></div>

                                    <p>Resolved</p>
                                </div>

                            </div>

                            {/* Information */}
                            <div className="track-info">

                                <div className="info-card">

                                    <label>Category</label>

                                    <p>{item.category}</p>

                                </div>

                                <div className="info-card">

                                    <label>Date Submitted</label>

                                    <p>
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                            </div>

                            {/* Admin Reply */}
                            <div className="reply-card">

                                <h4>Admin Response</h4>

                                <p>
                                    {item.admin_reply
                                        ? item.admin_reply
                                        : "Your complaint has been received. The administrator has not provided a response yet."}
                                </p>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="empty-track">

                        <h3>No Complaints Found</h3>

                        <p>
                            You have not submitted any complaints yet.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}

export default TrackComplaint;
