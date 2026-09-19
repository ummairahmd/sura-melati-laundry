import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/api";
import { FaStar } from "react-icons/fa";
import "../assets/css/feedback.css";

function Feedback() {

    const location = useLocation();
    const navigate = useNavigate();

    const complaint_id = location.state?.complaint_id;

    const [rating, setRating] = useState("");
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    const [error, setError] = useState({
        rating: false,
        comment: false
    });

    const submitFeedback = async () => {

        if (!complaint_id) {

            Swal.fire({
                title: "Error",
                text: "Complaint ID not found.",
                icon: "error",
                confirmButtonColor: "#193b68"
            });

            return;
        }

        const newError = {
            rating: !rating,
            comment: !comment.trim()
        };

        setError(newError);

        if (newError.rating || newError.comment) {
            return;
        }

        try {

            await API.post("/feedback", {
                complaint_id,
                rating,
                comment
            });

            Swal.fire({
                title: "Feedback Submitted",
                text: "Thank you for sharing your experience.",
                icon: "success",
                confirmButtonColor: "#193b68"
            }).then(() => {
                navigate("/complaint-history");
            });

        } catch (err) {

            console.log(err);

            Swal.fire({
                title: "Submission Failed",
                text: "Unable to submit your feedback.",
                icon: "error",
                confirmButtonColor: "#193b68"
            });

        }

    };

    return (

        <div className="feedback-page">

            <div className="feedback-card">

                <div className="feedback-header">

                    <h2>Customer Feedback</h2>

                    <p>
                        We value your feedback. Please rate our service
                        and share your experience to help us improve.
                    </p>

                </div>

                <div className="form-group">

                    <div className="form-group">

                    <label>Service Rating</label>

                    <div className="rating-stars">

                        {[1,2,3,4,5].map((star)=>(

                            <FaStar
                                key={star}
                                className={
                                    star <= (hover || Number(rating))
                                    ? "star active"
                                    : "star"
                                }

                                onClick={()=>{
                                    setRating(star);
                                    setError({
                                        ...error,
                                        rating:false
                                    });
                                }}

                                onMouseEnter={()=>
                                    setHover(star)
                                }

                                onMouseLeave={()=>
                                    setHover(0)
                                }

                            />

                        ))}

                    </div>

                    <p className="rating-text">

                        {
                            rating === 5
                            ? "Excellent"

                            : rating === 4
                            ? "Good"

                            : rating === 3
                            ? "Satisfactory"

                            : rating === 2
                            ? "Poor"

                            : rating === 1
                            ? "Very Poor"

                            : "Select your rating"
                        }

                    </p>

                    {error.rating && (

                        <small className="error-text">
                            Please select a rating.
                        </small>

                    )}

                </div>

                </div>

                <div className="form-group">

                    <label>Your Comments</label>

                    <textarea
                        rows="6"
                        placeholder="Please share your experience..."
                        className={`feedback-input ${error.comment ? "error-input" : ""}`}
                        value={comment}
                        onChange={(e) => {

                            setComment(e.target.value);

                            setError({
                                ...error,
                                comment: false
                            });

                        }}
                    />

                    {error.comment && (
                        <small className="error-text">
                            Please enter your feedback.
                        </small>
                    )}

                </div>

                <button
                    className="feedback-btn"
                    onClick={submitFeedback}
                >
                    Submit Feedback
                </button>

            </div>

        </div>

    );

}

export default Feedback;
