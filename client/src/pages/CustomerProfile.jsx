import React, {useEffect, useState} from "react";


function CustomerProfile(){

    const [user,setUser] = useState({});
    const [isEdit,setIsEdit] = useState(false);

    const [profileImage,setProfileImage] = useState(
    "/avatar.png"
    );


    useEffect(()=>{

    const data = JSON.parse(localStorage.getItem("user"));

        if(data){

            setUser(data);

            if(data.profileImage){

                setProfileImage(data.profileImage);

            }

        }

    },[]);

    const uploadImage = (e)=>{

    const file = e.target.files[0];


    if(file){

        const reader = new FileReader();


        reader.onload = ()=>{

            setProfileImage(reader.result);

        };


        reader.readAsDataURL(file);

    }

};

    const saveProfile = ()=>{

        localStorage.setItem(
            "user",
            JSON.stringify({
                ...user,
                profileImage: profileImage
            })
        );


        setIsEdit(false);

        alert("Profile updated successfully!");

    };

    return(

        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-header">
                    <img

                    src={profileImage}

                    alt="Profile"

                    className="profile-image"

                    />

                    {
                    isEdit && (

                    <label className="upload-btn">

                        📷 Change Photo

                        <input

                        type="file"

                        accept="image/*"

                        onChange={uploadImage}

                        hidden

                        />

                    </label>

                    )
                    }

                    {
                    isEdit ? (

                        <input

                        className="edit-input"

                        value={user.fullname || ""}

                        onChange={(e)=>
                            setUser({
                                ...user,
                                fullname:e.target.value
                            })
                        }

                        />

                    ) : (

                        <h2>
                            {user.fullname}
                        </h2>

                    )

                    }

                </div>

                <div className="profile-info">

                    {/* EMAIL */}

                    <div className="info-box">

                        <span>
                            📧
                        </span>

                        <div>

                            <small>
                                Email
                            </small>


                            {
                            isEdit ? (

                                <input

                                className="edit-input"

                                value={user.email || ""}

                                onChange={(e)=>
                                    setUser({
                                        ...user,
                                        email:e.target.value
                                    })
                                }

                                />

                            ) : (

                                <p>
                                    {user.email}
                                </p>

                            )
                            }
                        </div>
                    </div>

                    {/* PHONE */}

                    <div className="info-box">


                        <span>
                            📞
                        </span>


                        <div>

                            <small>
                                Phone
                            </small>


                            {
                            isEdit ? (

                                <input

                                className="edit-input"

                                value={user.phone || ""}

                                onChange={(e)=>
                                    setUser({
                                        ...user,
                                        phone:e.target.value
                                    })
                                }

                                />

                            ) : (

                                <p>
                                    {user.phone}
                                </p>

                            )
                            }

                        </div>
                    </div>

                    {/* ACCOUNT TYPE */}

                    <div className="info-box">
                        <span>
                            🏷️
                        </span>

                        <div>
                            <small>
                                Account Type
                            </small>

                            <p>
                                Customer 
                            </p>
                        </div>
                    </div>
                </div>

                <button

                className="edit-btn"

                onClick={
                    isEdit 
                    ? saveProfile 
                    : ()=>setIsEdit(true)
                }

                >
                    {
                    isEdit 
                    ? "💾 Save Profile"
                    : "✏️ Edit Profile"
                    }

                </button>
            </div>
        </div>
    );
}

export default CustomerProfile;