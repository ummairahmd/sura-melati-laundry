import React, { useEffect, useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";
import "../assets/css/profile.css";

function Profile(){

    const [user,setUser] = useState({});

    const [fullname,setFullname] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");

    const [image,setImage] = useState(null);
    const [preview,setPreview] = useState(null);



    /* =========================
       GET LOGIN USER
    ========================= */

    useEffect(()=>{


        const data =
            JSON.parse(localStorage.getItem("user")) ||
            JSON.parse(sessionStorage.getItem("user"));


        if(data){

            setUser(data);

            setFullname(data.fullname);
            setEmail(data.email);
            setPhone(data.phone || "");


            if(data.profile_image){

                setPreview(
                    `http://localhost:5000/uploads/profile/${data.profile_image}`
                );

            }

        }


    },[]);



    /* =========================
       IMAGE PREVIEW
    ========================= */


    const handleImage=(e)=>{


        const file = e.target.files[0];


        if(file){

            setImage(file);


            setPreview(
                URL.createObjectURL(file)
            );

        }


    };



    /* =========================
       SAVE PROFILE
    ========================= */
        const saveProfile = async () => {

            try {

                const formData = new FormData();

                formData.append("fullname", fullname);
                formData.append("email", email);
                formData.append("phone", phone);

                if (image) {
                    formData.append("profile_image", image);
                }

                const userId = user.id;

                console.log("USER:", user);
                console.log("USER ID:", user.id);

                const res = await API.put(
                    `/profile/${userId}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                console.log("PROFILE UPDATED:", res.data);
                console.log("NOTIFICATION:", res.data.notification);    


                // =========================
                // UPDATE USER STORAGE
                // =========================

                const updatedUser = {
                    ...user,
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    profile_image:
                        res.data.profile_image ||
                        user.profile_image
                };


                if (localStorage.getItem("user")) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(updatedUser)
                    );

                } else {

                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(updatedUser)
                    );

                }


                setUser(updatedUser);


                Swal.fire({
                    title: "Saved!",
                    text: "Profile updated successfully.",
                    icon: "success",
                    confirmButtonColor: "#193b68"
                });


            } catch (err) {

                console.error("PROFILE UPDATE ERROR:", err);

                Swal.fire({
                    title: "Failed!",
                    text:
                        err.response?.data?.message ||
                        "Unable to update profile.",
                    icon: "error",
                    confirmButtonColor: "#193b68"
                });

            }

        };


    return(

        <div className="profile-page">


            <div className="profile-card">


                <h2>
                    My Profile
                </h2>



                {/* IMAGE */}

                <div className="profile-image-box">


                    <img

                    src={
                        preview ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }

                    alt="profile"

                    />


                    <label className="upload-photo">


                        Change Photo


                        <input

                        type="file"

                        accept="image/*"

                        onChange={handleImage}

                        />


                    </label>


                </div>




                {/* FORM */}


                <div className="profile-form">


                    <label>
                        Full Name
                    </label>


                    <input

                    value={fullname}

                    onChange={(e)=>setFullname(e.target.value)}

                    />



                    <label>
                        Email
                    </label>


                    <input

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                    />



                    <label>
                        Phone Number
                    </label>


                    <input

                    value={phone}

                    onChange={(e)=>setPhone(e.target.value)}

                    />



                    <button

                    onClick={saveProfile}

                    >

                        Save Changes

                    </button>


                </div>



            </div>



        </div>

    );


}


export default Profile;
