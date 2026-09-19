import React, { useEffect, useRef, useState } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

import "../assets/css/dashboard.css";


function AIChatbot() {

    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! Welcome to Sura Melati E-Laundry. How can I assist you today?"
        }
    ]);


    const messagesEndRef = useRef(null);


    /* ==========================
       AUTO SCROLL
    ========================== */

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);


    /* ==========================
       SEND MESSAGE
    ========================== */

    const sendMessage = () => {

        const text = message.trim();

        if (!text) return;


        /* USER MESSAGE */

        setMessages((prev) => [

            ...prev,

            {
                sender: "user",
                text: text
            }

        ]);


        setMessage("");


        /* TEMPORARY AI RESPONSE */

        setTimeout(() => {

            let reply =
                "Thank you for contacting Sura Melati E-Laundry. Our team will assist you shortly.";


            const lowerText = text.toLowerCase();


            if (
                lowerText.includes("complaint") ||
                lowerText.includes("aduan")
            ) {

                reply =
                    "You can submit your complaint through the 'Submit Complaint' page. You may also track your complaint status from the 'Track Status' page.";

            }


            else if (
                lowerText.includes("status") ||
                lowerText.includes("track")
            ) {

                reply =
                    "You can check your complaint status through the 'Track Status' page. The available statuses are Pending, In Progress and Resolved.";

            }


            else if (
                lowerText.includes("pending")
            ) {

                reply =
                    "A Pending complaint means your complaint has been received and is waiting to be reviewed by the administrator.";

            }


            else if (
                lowerText.includes("progress") ||
                lowerText.includes("in progress")
            ) {

                reply =
                    "In Progress means your complaint is currently being reviewed or handled by our laundry management team.";

            }


            else if (
                lowerText.includes("resolved") ||
                lowerText.includes("selesai")
            ) {

                reply =
                    "Resolved means the issue reported in your complaint has been addressed by the laundry management team.";

            }


            else if (
                lowerText.includes("feedback")
            ) {

                reply =
                    "You can submit feedback after your complaint has been resolved. Your feedback helps us improve our laundry service.";

            }


            else if (
                lowerText.includes("hello") ||
                lowerText.includes("hi") ||
                lowerText.includes("hai")
            ) {

                reply =
                    "Hello! How can I help you with your laundry complaint today?";

            }


            setMessages((prev) => [

                ...prev,

                {
                    sender: "bot",
                    text: reply
                }

            ]);

        }, 800);

    };


    /* ==========================
       ENTER KEY
    ========================== */

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();

        }

    };


    return (

        <div className="ai-chatbot">


            {/* ==========================
                CHAT WINDOW
            ========================== */}

            {open && (

                <div className="chatbot-window">


                    {/* HEADER */}

                    <div className="chatbot-header">


                        <div className="chatbot-header-left">


                            <div className="chatbot-avatar">

                                <FaRobot />

                            </div>


                            <div className="chatbot-title">

                                <strong>
                                    Sura Melati Assistant
                                </strong>

                                <span>
                                    ● Online • AI Support
                                </span>

                            </div>


                        </div>


                        <button
                            className="chatbot-close"
                            onClick={() => setOpen(false)}
                            title="Close"
                        >

                            <FaTimes />

                        </button>


                    </div>



                    {/* CHAT BODY */}

                    <div className="chatbot-body">


                        {/* WELCOME MESSAGE */}

                        <div className="bot-message">

                            <div className="message">

                                Hello! Welcome to Sura Melati E-Laundry.
                                How can I assist you today?

                            </div>

                        </div>


                        {/* MESSAGES */}

                        {messages.slice(1).map((item, index) => (

                            item.sender === "user" ? (

                                <div
                                    className="user-message"
                                    key={index}
                                >

                                    <div className="message">

                                        {item.text}

                                    </div>

                                </div>

                            ) : (

                                <div
                                    className="bot-message"
                                    key={index}
                                >

                                    <div className="message">

                                        {item.text}

                                    </div>

                                </div>

                            )

                        ))}


                        <div ref={messagesEndRef}></div>


                    </div>



                    {/* INPUT */}

                    <div className="chatbot-input">


                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                        />


                        <button
                            className="chatbot-send"
                            onClick={sendMessage}
                            title="Send message"
                        >

                            <FaPaperPlane />

                        </button>


                    </div>


                </div>

            )}



            {/* ==========================
                FLOATING CHAT BUTTON
            ========================== */}

            {!open && (

                <button
                    className="chatbot-button"
                    onClick={() => setOpen(true)}
                    title="Open AI Assistant"
                >

                    <FaRobot />

                </button>

            )}


        </div>

    );

}


export default AIChatbot;