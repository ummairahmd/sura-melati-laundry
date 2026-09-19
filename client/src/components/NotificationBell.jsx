import React, { useEffect, useState } from "react";
import API from "../api/api";
import Swal from "sweetalert2";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));

    const userId = user?.id;

    console.log("USER:", user);
    console.log("USER ID:", userId);


    const getNotifications = async () => {

        if (!userId) return;

        try {

            const res = await API.get(`/notifications/${userId}`);

            console.log("NOTIFICATIONS:", res.data);

            setNotifications(res.data);

        } catch (err) {

            console.log("NOTIFICATION ERROR:", err);

        }

    };


    useEffect(() => {

        getNotifications();

    }, [userId]);


    const unreadCount = notifications.filter(
        notification => Number(notification.is_read) === 0
    ).length;


    const handleNotificationClick = async (notification) => {

        try {

            await API.put(`/notifications/read/${notification.id}`);

            setNotifications(prev =>
                prev.map(item =>
                    item.id === notification.id
                        ? { ...item, is_read: 1 }
                        : item
                )
            );

            Swal.fire({
                title: "🔔 Notification",
                text: notification.message,
                icon: "info",
                confirmButtonColor: "#193b68"
            });

        } catch (err) {

            console.log("READ NOTIFICATION ERROR:", err);

        }

    };

    const markAllAsRead = async () => {

    try {

        await API.put(`/notifications/read-all/${userId}`);

        setNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                is_read: 1
            }))
        );

    } catch (err) {

        console.error(
            "MARK ALL READ ERROR:",
            err
        );

    }

};


    return (

        <div className="notification-container">

            {/* BELL */}

            <button
                className="notification-btn"
                onClick={() => {
                    setShowDropdown(!showDropdown);
                    getNotifications();
                }}
            >
                🔔

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount}
                    </span>
                )}
            </button>


            {/* DROPDOWN */}

            {showDropdown && (

                <div className="notification-dropdown">

                    <div className="notification-header">

                        <span>🔔 Notifications</span>

                        {unreadCount > 0 && (
                            <button
                                className="mark-all-btn"
                                onClick={markAllAsRead}
                                title="Mark all notifications as read"
                            >
                                ✓ Mark all
                            </button>
                        )}

                    </div>


                    {notifications.length === 0 ? (

                        <div className="no-notification">
                            No notifications
                        </div>

                    ) : (

                        notifications.map(notification => (

                            <div
                                key={notification.id}
                                className={
                                    Number(notification.is_read) === 0
                                        ? "notification-item unread"
                                        : "notification-item"
                                }
                                onClick={() =>
                                    handleNotificationClick(notification)
                                }
                            >

                                <p>
                                    {notification.message}
                                </p>

                                <small>
                                    {new Date(
                                        notification.created_at
                                    ).toLocaleString()}
                                </small>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>

    );

}

export default NotificationBell;
