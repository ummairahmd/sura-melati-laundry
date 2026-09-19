import React, { useEffect, useState } from "react";
import "../assets/css/admin.css";
import API from "../api/api";
import Swal from "sweetalert2";

function AdminProfile() {

    const [admin, setAdmin] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [profileImage, setProfileImage] = useState("/avatar.png");
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {

    const loadAdminProfile = async () => {

        try {

            const storedUser =
                JSON.parse(localStorage.getItem("user")) ||
                JSON.parse(sessionStorage.getItem("user"));

            console.log("STORED USER:", storedUser);

            if (!storedUser || !storedUser.id) {
                console.log("ADMIN ID NOT FOUND");
                return;
            }

            const res = await API.get(
                `/profile/${storedUser.id}`
            );

            console.log("DATABASE PROFILE:", res.data);

            setAdmin(res.data);

            if (res.data.profile_image) {

                setProfileImage(
                    `http://localhost:5000/uploads/profile/${res.data.profile_image}`
                );

            } else {

                setProfileImage("/avatar.png");

            }

        } catch (error) {

            console.error(
                "LOAD ADMIN PROFILE ERROR:",
                error
            );

        }

    };

    loadAdminProfile();

}, []);

    const uploadImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // Simpan file sebenar untuk dihantar ke backend
    setSelectedFile(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);

    setProfileImage(previewUrl);

};


    const saveProfile = async () => {

    try {

        console.log("========== SAVE ADMIN PROFILE ==========");
        console.log("ADMIN ID:", admin.id);
        console.log("FULLNAME:", admin.fullname);
        console.log("EMAIL:", admin.email);
        console.log("PHONE:", admin.phone);

        const formData = new FormData();

        formData.append("fullname", admin.fullname);
        formData.append("email", admin.email);
        formData.append("phone", admin.phone);

        if (selectedFile) {
            formData.append(
                "profile_image",
                selectedFile
            );
        }

        const res = await API.put(
            `/profile/${admin.id}`,
            formData
        );

        console.log(
            "========== API RESPONSE =========="
        );

        console.log(res.data);

        const updatedAdmin = {
            ...admin,
            profile_image:
                res.data.profile_image ||
                admin.profile_image
        };

        setAdmin(updatedAdmin);

        if (res.data.profile_image) {

            setProfileImage(
                `http://localhost:5000/uploads/profile/${res.data.profile_image}`
            );

        }

        if (localStorage.getItem("user")) {

            localStorage.setItem(
                "user",
                JSON.stringify(updatedAdmin)
            );

        } else {

            sessionStorage.setItem(
                "user",
                JSON.stringify(updatedAdmin)
            );

        }

        setIsEdit(false);

        Swal.fire({
            title: "Saved!",
            text: "Profile updated successfully.",
            icon: "success",
            confirmButtonColor: "#193b68"
        });

    } catch (error) {

        console.error(
            "ADMIN PROFILE ERROR:",
            error
        );

        Swal.fire({
            title: "Failed!",
            text:
                error.response?.data?.message ||
                "Unable to update profile.",
            icon: "error",
            confirmButtonColor: "#193b68"
        });

    }

};


    return (

        <div className="admin-profile-page">

            <div className="admin-profile-card">

                {/* PROFILE HEADER */}

                <div className="admin-profile-header">

                    <div className="profile-image-wrapper">

                        <img
                            src={profileImage}
                            alt="Admin Profile"
                            className="admin-profile-image"
                        />

                        {isEdit && (

                            <label className="profile-upload">

                                Change Photo

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadImage}
                                    hidden
                                />

                            </label>

                        )}

                    </div>


                    <div className="admin-profile-title">

                        {isEdit ? (

                            <input
                                type="text"
                                className="profile-name-input"
                                value={admin.fullname || ""}
                                onChange={(e) =>
                                    setAdmin({
                                        ...admin,
                                        fullname: e.target.value
                                    })
                                }
                            />

                        ) : (

                            <h2>
                                {admin.fullname || "Administrator"}
                            </h2>

                        )}

                        <span className="admin-role">
                            Administrator
                        </span>

                    </div>

                </div>


                {/* PROFILE INFORMATION */}

                <div className="profile-section">

                    <h3>
                        Personal Information
                    </h3>

                    <div className="profile-divider"></div>


                    {/* FULL NAME */}

                    <div className="profile-field">

                        <label>
                            Full Name
                        </label>

                        {isEdit ? (

                            <input
                                type="text"
                                value={admin.fullname || ""}
                                onChange={(e) =>
                                    setAdmin({
                                        ...admin,
                                        fullname: e.target.value
                                    })
                                }
                            />

                        ) : (

                            <p>
                                {admin.fullname || "-"}
                            </p>

                        )}

                    </div>


                    {/* EMAIL */}

                    <div className="profile-field">

                        <label>
                            Email Address
                        </label>

                        {isEdit ? (

                            <input
                                type="email"
                                value={admin.email || ""}
                                onChange={(e) =>
                                    setAdmin({
                                        ...admin,
                                        email: e.target.value
                                    })
                                }
                            />

                        ) : (

                            <p>
                                {admin.email || "-"}
                            </p>

                        )}

                    </div>


                    {/* PHONE */}

                    <div className="profile-field">

                        <label>
                            Phone Number
                        </label>

                        {isEdit ? (

                            <input
                                type="tel"
                                value={admin.phone || ""}
                                onChange={(e) =>
                                    setAdmin({
                                        ...admin,
                                        phone: e.target.value
                                    })
                                }
                            />

                        ) : (

                            <p>
                                {admin.phone || "-"}
                            </p>

                        )}

                    </div>


                    {/* ACCOUNT TYPE */}

                    <div className="profile-field">

                        <label>
                            Account Type
                        </label>

                        <p>
                            Administrator Account
                        </p>

                    </div>

                </div>


                {/* ACTION BUTTON */}

                <div className="profile-actions">

                    <button
                        className={
                            isEdit
                                ? "save-profile-btn"
                                : "edit-profile-btn"
                        }
                        onClick={
                            isEdit
                                ? saveProfile
                                : () => setIsEdit(true)
                        }
                    >

                        {isEdit
                            ? "Save Changes"
                            : "Edit Profile"
                        }

                    </button>

                    {isEdit && (

                        <button
                            className="cancel-profile-btn"
                            onClick={() => setIsEdit(false)}
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </div>

        </div>

    );
}

export default AdminProfile;
