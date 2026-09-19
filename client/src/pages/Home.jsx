import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../assets/css/style.css";
import home from "../assets/images/home.jpg";

function Home(){

    const [showPopup,setShowPopup] = useState(false);
    const navigate = useNavigate();


    const handleSubmitComplaint = () =>{

        setShowPopup(true);

    };


return(

<>


<section className="hero-section">


    <div className="hero-container">


        <div className="hero-content">


            <span className="hero-badge">
                SMART LAUNDRY SYSTEM
            </span>



            <h1>

                Report Laundry Issues.
                <br/>

                Get Fast Solutions.

            </h1>



            <p>

                Manage your laundry complaints easily
                with SURA MELATI E-LAUNDRY.
                Submit problems, track progress,
                and receive updates faster.

            </p>




            <div className="hero-buttons">


                <button
                onClick={handleSubmitComplaint}
                className="primary-btn"
                >

                    Submit Complaint

                </button>



                <button
                onClick={handleSubmitComplaint}
                className="secondary-btn"
                >

                    Track Complaint

                </button>


            </div>



        </div>





        <div className="hero-image-box">

            <img
                src={home}
                alt="Laundry Service"
            />

        </div>



    </div>


</section>





{/* SERVICES */}


<section className="services-section">


<h2>
    Our Services
</h2>


<p>
    Providing efficient laundry management and customer support.
</p>



<div className="service-grid">


<div className="service-card">


<h3>
    Complaint Submission
</h3>


<p>
Submit laundry problems quickly and easily.
</p>


</div>




<div className="service-card">


<h3>
    📦 Complaint Tracking
</h3>


<p>
Monitor your complaint status anytime.
</p>


</div>





<div className="service-card">


<h3>
    ⭐ Customer Feedback
</h3>


<p>
Share your experience and help us improve.
</p>


</div>



</div>


</section>






{
showPopup &&

<div className="popup-overlay">


    <div className="popup-box">


        <h3>
            Login Required
        </h3>


        <p>
            Please login or create an account
            before submitting a complaint.
        </p>



        <div className="popup-buttons">


            <button

            className="cancel-btn"

            onClick={()=>setShowPopup(false)}

            >

                Cancel

            </button>



            <button

            className="login-popup-btn"

            onClick={()=>navigate("/login")}

            >

                Login Now

            </button>


        </div>



    </div>


</div>


}



</>


);


}


export default Home;