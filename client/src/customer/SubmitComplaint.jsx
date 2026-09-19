import React, {useState} from "react";
import API from "../api/API";
import {useNavigate} from "react-router-dom";
import "../assets/css/complaint.css";
import Swal from "sweetalert2";


function SubmitComplaint(){

    const navigate = useNavigate();

    const [title,setTitle] = useState("");
    const [category,setCategory] = useState("");
    const [description,setDescription] = useState("");
    const [image,setImage] = useState(null);
    const [errors,setErrors] = useState({});
    const [loading,setLoading] = useState(false);



    const handleSubmit = async(e)=>{
        e.preventDefault();

        let newErrors = {};

        if(!title.trim()){
            newErrors.title = "Complaint title is required.";
        }

        if(!category){
            newErrors.category = "Please select a category.";
        }

        if(!description.trim()){
            newErrors.description = "Problem description is required.";
        }


        if(Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return;
        }


        setErrors({});

        const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));

        console.log("USER:", user);
        console.log("USER ID:", user?.id);

        if(!user){
            navigate("/login");
            return;
        }

        // Check image size (300MB)
        if(image){

        const maxSize = 300 * 1024 * 1024; // 300MB


        if(image.size > maxSize){

        Swal.fire({

    title:"Image Too Large",

    text:"Image size cannot exceed 300MB",

    icon:"warning",

    confirmButtonColor:"#193b68"

});

        return;

    }

}

        const formData = new FormData();

        formData.append(
            "user_id",
            user.id
        );


        formData.append(
            "title",
            title
        );


        formData.append(
            "category",
            category
        );


        formData.append(
            "description",
            description
        );

        if(image){
            formData.append(
            "image",
            image
        );
        }
    
        try{

            setLoading(true);

            const res = await API.post(
                "/submit-complaint",
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );


            Swal.fire({

    title:"Complaint Submitted!",

    text:"Your complaint has been submitted successfully.",

    icon:"success",

    confirmButtonColor:"#193b68",

    confirmButtonText:"View Complaint"

}).then(()=>{

    navigate("/complaint-history");

});


        }catch (err) {

            console.log("FULL ERROR:", err);

            if(err.response){

    Swal.fire({

        title:"Submission Failed",

        text:err.response.data.message,

        icon:"error",

        confirmButtonColor:"#193b68"

    });

}
else{

    Swal.fire({

        title:"Server Error",

        text:"Server not connected.",

        icon:"error",

        confirmButtonColor:"#193b68"

    });

}

        }finally{

            setLoading(false);

        }


    };

    return(


            <div className="complaint-page">

            <div className="complaint-container">

            <div className="complaint-card">

            <div className="complaint-header">

            <h2>Submit Complaint</h2>

            <p>
            Please complete the form below. Our team will review your complaint and provide an update as soon as possible.
            </p>

            </div>




    <form onSubmit={handleSubmit}>


            <label>
                Complaint Category
            </label>

            <select
                value={category}
                className={errors.category ? "input-error" : ""}
                onChange={(e)=>{
                    setCategory(e.target.value);
                    setErrors({...errors,category:""});
                }}
            >
                <option value="">Select category</option>
                <option>Laundry Machine</option>
                <option>Service Issue</option>
                <option>Payment Issue</option>
                <option>Others</option>
            </select>

            {errors.category && (
                <small className="error-text">
                    {errors.category}
                </small>
            )}

            <label>
                Complaint Title
            </label>

            <input
                type="text"
                placeholder="Example: Washing machine not working"
                value={title}
                className={errors.title ? "input-error" : ""}
                onChange={(e)=>{
                    setTitle(e.target.value);
                    setErrors({...errors,title:""});
                }}
            />

            {errors.title && (
                <small className="error-text">
                    {errors.title}
                </small>
            )}

                <label>
                Problem Description
                </label>


                <textarea
                    rows="5"
                    placeholder="Explain your problem clearly..."
                    value={description}
                    className={errors.description ? "input-error" : ""}
                    onChange={(e)=>{
                        setDescription(e.target.value);
                        setErrors({...errors,description:""});
                    }}
                    >
                    </textarea>


                    {errors.description && (
                        <small className="error-text">
                            {errors.description}
                        </small>
                    )}

                <label>
                Upload Evidence Image
                </label>


                <div className="upload-box">


                <input

                type="file"

                accept="image/*"

                onChange={(e)=>setImage(e.target.files[0])}

                />


                <span>
                📷 Upload image (optional)
                </span>


                </div>


        {image && (

            <p className="upload-info">

            Selected: {image.name} 
                ({(image.size / 1024 / 1024).toFixed(2)} MB)
            </p>

        )}

            <button 
                className="submit-btn"
                type="submit"
                disabled={loading}
            >
                {
                    loading ? "Submitting..." : "Submit Complaint"
                }
            </button>

        </form>
    </div>
</div>

</div>

    );

}

export default SubmitComplaint;