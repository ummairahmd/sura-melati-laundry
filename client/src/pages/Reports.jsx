import React, {useEffect, useState} from "react";
import API from "../api/api";
import "../assets/css/report.css";
import logo_laundry from "../assets/images/logo_laundry.jpeg";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";


function Reports(){


    const [stats,setStats] = useState({

        total:0,
        pending:0,
        progress:0,
        resolved:0

    });


    const [complaints,setComplaints] = useState([]);



    useEffect(()=>{

        getReport();
        getComplaints();

    },[]);



    const getReport = async()=>{

    try{

        const res = await API.get("/admin-stats");

        console.log("ADMIN STATS:", res.data);

        setStats(res.data);


    }catch(err){

        console.log(err);

    }

};



    const getComplaints = async()=>{

        try{

            const res = await API.get("/admin-complaints");

            console.log("Complaints:", res.data);

            setComplaints(res.data);


        }catch(err){

            console.log(err);

        }

    };



const chartData = [
    {
        name:"Pending",
        value:Number(stats.pending) || 0
    },

    {
        name:"In Progress",
        value:Number(stats.progress) || 0
    },

    {
        name:"Resolved",
        value:Number(stats.resolved) || 0
    }
];

    console.log("STATS:", stats);
    console.log("CHART:", chartData);

    const categoryCount = {};

complaints.forEach((item) => {

    const category = item.category || "Unknown";

    categoryCount[category] =
        (categoryCount[category] || 0) + 1;

});

const topCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0];


const monthCount = {};

complaints.forEach((item) => {

    if (!item.created_at) return;

    const date = new Date(item.created_at);

    const month = date.toLocaleString("en-US", {
        month: "long"
    });

    monthCount[month] =
        (monthCount[month] || 0) + 1;

});

const topMonth = Object.entries(monthCount)
    .sort((a, b) => b[1] - a[1])[0];


let recommendation =
    "Continue monitoring customer complaints and improve service quality based on recurring issues.";

if (topCategory) {

    if (
        topCategory[0].toLowerCase().includes("machine")
    ) {

        recommendation =
            "Machine-related complaints are the most common issue. Consider scheduling regular machine maintenance to reduce service interruptions.";

    } else {

        recommendation =
            `${topCategory[0]} is the most common complaint category. Consider reviewing this issue and improving the related service process.`;

    }

}



    const printReport = ()=>{

        window.print();

    };



    return(


    <section className="report-container">



<div className="report-header">

    <div className="header-brand">

        <div className="report-logo">
            <img
                src={logo_laundry}
                alt="Laundry Logo"
            />
        </div>

        <div className="brand-text">

            <h1>
                SURA MELATI
            </h1>

            <h2>
                E-LAUNDRY SYSTEM
            </h2>

        </div>

    </div>

    <div className="header-report">

        <h2>
            COMPLAINT REPORT
        </h2>

        <p>
            Generated Date : {new Date().toLocaleDateString()}
        </p>

    </div>

</div>

<div className="report-title">

    <div>

        <span>
            ADMINISTRATION
        </span>

        <h2>
            Complaint Overview
        </h2>

        <p>
            Monitor customer complaints and analyse service performance.
        </p>

    </div>

</div>

        <div className="report-cards">

<div className="report-card total-card">

    <div className="card-icon">
        📊
    </div>

    <div className="card-content">

        <span>
            TOTAL COMPLAINTS
        </span>

        <h2>
            {stats.total}
        </h2>

        <p>
            All customer complaints
        </p>

    </div>

</div>

<div className="report-card pending-card">

    <div className="card-icon">
        ⏳
    </div>

    <div className="card-content">

        <span>
            PENDING
        </span>

        <h2>
            {stats.pending}
        </h2>

        <p>
            Waiting for action
        </p>

    </div>

</div>


<div className="report-card progress-card">

    <div className="card-icon">
        🔄
    </div>

    <div className="card-content">

        <span>
            IN PROGRESS
        </span>

        <h2>
            {stats.progress}
        </h2>

        <p>
            Currently being handled
        </p>

    </div>

</div>

<div className="report-card resolved-card">

    <div className="card-icon">
        ✓
    </div>

    <div className="card-content">

        <span>
            RESOLVED
        </span>

        <h2>
            {stats.resolved}
        </h2>

        <p>
            Successfully completed
        </p>

    </div>

</div>


        </div>

<div className="chart-box">

    <div className="section-heading">

        <div>

            <span>
                ANALYTICS
            </span>

            <h2>
                Complaint Status
            </h2>

        </div>

        <div className="status-dot">
            ● Live Data
        </div>

    </div>


<PieChart width={400} height={300}>

        <Pie
            data={chartData.filter(item => item.value > 0)}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
        >

        {
            chartData.map((entry,index)=>(

                <Cell
                    key={`cell-${index}`}
                    fill={
                        [
                            "#facc15",
                            "#3b82f6",
                            "#22c55e"
                        ][index]
                    }
                />

            ))
        }

    </Pie>


    <Tooltip />

    <Legend />

</PieChart>


        </div>

        <div className="ai-report-box">

    <div className="ai-report-header">

        <div>

            <h2>
                AI Complaint Analysis
            </h2>

            <p>
                Automated analysis based on customer complaint records
            </p>

        </div>

        <span className="ai-label">
            AI ANALYSIS
        </span>

    </div>


    <div className="ai-analysis-grid">


        {/* MOST COMMON */}

        <div className="ai-analysis-card">

            <span>
                Most Common Complaint
            </span>

            <h3>
                {topCategory
                    ? topCategory[0]
                    : "No Data"
                }
            </h3>

            <p>
                {topCategory
                    ? `${topCategory[1]} complaints`
                    : "No complaint data available"
                }
            </p>

        </div>


        {/* PEAK MONTH */}

        <div className="ai-analysis-card">

            <span>
                Peak Complaint Month
            </span>

            <h3>
                {topMonth
                    ? topMonth[0]
                    : "No Data"
                }
            </h3>

            <p>
                {topMonth
                    ? `${topMonth[1]} complaints`
                    : "No complaint data available"
                }
            </p>

        </div>


        {/* TOTAL */}

        <div className="ai-analysis-card">

            <span>
                Total Complaints Analysed
            </span>

            <h3>
                {complaints.length}
            </h3>

            <p>
                Customer complaint records
            </p>

        </div>

    </div>


    {/* MAIN ISSUE */}

    <div className="ai-main-analysis">

        <h3>
            Main Customer Issue
        </h3>

        <p>

            {topCategory

                ? `Based on the complaint records, ${topCategory[0]} is currently the most frequently reported issue with ${topCategory[1]} complaints.`

                : "There is not enough data available for analysis."

            }

        </p>

    </div>


    {/* RECOMMENDATION */}

    <div className="ai-recommendation">

        <div className="recommendation-icon">
            💡
        </div>

        <div>

            <h3>
                Recommended Improvement
            </h3>

            <p>
                {recommendation}
            </p>

        </div>

    </div>

</div>

        <div className="table-box">


            <h2>
                Complaint Details
            </h2>

        <div className="table-wrapper">

        </div>

            <table>


                <thead>

                    <tr>
                        <th>No.</th>
                        <th>Complaint Details</th>
                        <th>Category</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>


                {complaints.map((complaint, index) => (
                    <tr key={complaint.complaint_id}>
                        <td>{index + 1}</td>

                        <td>{complaint.title}</td>
                        <td>{complaint.category}</td>
                        <td>{complaint.status}</td>
                    </tr>
                ))}


                </tbody>


            </table>


        </div>

<div className="report-summary">

    <div className="summary-header">

        <div>
            <span>
                REPORT OVERVIEW
            </span>

            <h2>
                Complaint Summary
            </h2>
        </div>

        <p>
            Current complaint status breakdown
        </p>

    </div>


    <div className="summary-grid">

        <div className="summary-item">

            <div className="summary-icon total">
                📊
            </div>

            <div>
                <span>
                    TOTAL COMPLAINTS
                </span>

                <strong>
                    {stats.total}
                </strong>
            </div>

        </div>


        <div className="summary-item">

            <div className="summary-icon pending">
                ⏳
            </div>

            <div>
                <span>
                    PENDING
                </span>

                <strong>
                    {stats.pending}
                </strong>
            </div>

        </div>


        <div className="summary-item">

            <div className="summary-icon progress">
                🔄
            </div>

            <div>
                <span>
                    IN PROGRESS
                </span>

                <strong>
                    {stats.progress}
                </strong>
            </div>

        </div>


        <div className="summary-item">

            <div className="summary-icon resolved">
                ✓
            </div>

            <div>
                <span>
                    RESOLVED
                </span>

                <strong>
                    {stats.resolved}
                </strong>
            </div>

        </div>

    </div>

</div>

<div className="print-container">
    <button
        className="print-btn"
        onClick={printReport}
    >
        🖨 Print Report
    </button>
</div>


    </section>


    );

}


export default Reports;
