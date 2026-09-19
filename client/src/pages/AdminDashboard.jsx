import React,{useEffect,useState} from "react";
import API from "../api/api";
import "../assets/css/admin.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


function AdminDashboard(){


const [admin,setAdmin]=useState({});
const [chartData, setChartData] = useState([]);

const [stats,setStats]=useState({

total:0,
pending:0,
progress:0,
resolved:0

});


const [complaints,setComplaints]=useState([]);

const [search,setSearch]=useState("");

const [selectedComplaint,setSelectedComplaint]=useState(null);



useEffect(()=>{


const data =

JSON.parse(localStorage.getItem("user")) ||

JSON.parse(sessionStorage.getItem("user"));



if(data){

setAdmin(data);

}


getStats();

getComplaints();



},[]);




const getStats=async()=>{

try{

const res=await API.get("/admin-stats");

console.log("STATS:", res.data);

setStats(res.data);


}

catch(err){

console.log(err);

}

};


const getComplaints = async () => {

    try {

        const res = await API.get("/admin-complaints");

        setComplaints(res.data);

        const categoryCount = {};

        res.data.forEach((item) => {

            const category = item.category || "Other";

            if (categoryCount[category]) {

                categoryCount[category]++;

            } else {

                categoryCount[category] = 1;

            }

        });

        const data = Object.keys(categoryCount).map((category) => ({

            category: category,
            complaints: categoryCount[category]

        }));

        setChartData(data);

    } catch (err) {

        console.log(err);

    }

};





const filteredComplaints = complaints.filter((item)=>{


return(

item.fullname?.toLowerCase()
.includes(search.toLowerCase())


||

item.title?.toLowerCase()
.includes(search.toLowerCase())


||

item.category?.toLowerCase()
.includes(search.toLowerCase())


);


});





return(


<div className="dashboard-content">


<div className="dashboard-card">
<div className="topbar">


<h1>

Welcome Back, {admin.fullname || "Admin"}

</h1>


<p>
Manage SURA MELATI E-LAUNDRY System
</p>


</div>





{/* CARD */}

<div className="stats">

    <div className="card total-card">
        <h4>Total Complaints</h4>
        <h1>{stats.total}</h1>
    </div>

    <div className="card pending-card">
        <h4>Pending</h4>
        <h1>{stats.pending}</h1>
    </div>

    <div className="card progress-card">
        <h4>In Progress</h4>
        <h1>{stats.progress}</h1>
    </div>

    <div className="card resolved-card">
        <h4>Resolved</h4>
        <h1>{stats.resolved}</h1>
    </div>

</div>

<div className="chart-container">

    <div className="chart-header">

        <h2>
            Complaint Overview
        </h2>

        <p>
            Number of complaints by category
        </p>

    </div>

    <ResponsiveContainer width="100%" height={350}>

        <LineChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
                dataKey="category"
            />

            <YAxis
                allowDecimals={false}
            />

            <Tooltip />

            <Legend />

            <Line
                type="monotone"
                dataKey="complaints"
                name="Complaints"
                stroke="#e74c3c"
                strokeWidth={4}
                dot={{
                    r: 5,
                    strokeWidth: 2
                }}
                activeDot={{
                    r: 8
                }}
            />

        </LineChart>

    </ResponsiveContainer>

</div>



{/* TABLE */}


<div className="table-box">


<div className="table-header">


<h2>
Complaint List
</h2>



<input

placeholder="Search complaint..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>
</div>
<table>
<thead>
<tr>
<th>
No.
</th>
<th>
Customer
</th>
<th>
Title
</th>
<th>
Category
</th>
<th>
Status
</th>
<th>
Action
</th>
</tr>
</thead>
<tbody>
{
filteredComplaints.length > 0 ?
filteredComplaints.map((item,index)=>(
<tr key={item.complaint_id}>
<td>
{index + 1}
</td>
<td>
{item.fullname}
</td>
<td>
{item.title}
</td>
<td>
{item.category}
</td>
<td>
<span
className={`status ${
item.status?.toLowerCase()
.replace(" ","-")
}`}
>
{item.status}
</span>
</td>
<td>
<button
className="view-btn"
onClick={()=>setSelectedComplaint(item)}
>
View Details
</button>
</td>
</tr>
))
:
<tr>
<td colSpan="6">
No Complaint Found
</td>
</tr>
}
</tbody>
</table>
</div>
{/* MODAL */}
{
selectedComplaint &&
<div
className="modal-overlay"
onClick={()=>setSelectedComplaint(null)}
>
<div
className="complaint-modal"
onClick={(e)=>e.stopPropagation()}
>
<h2>
Complaint Details
</h2>
<p>
<b>Customer:</b> {selectedComplaint.fullname}
</p>
<p>
<b>Title:</b> {selectedComplaint.title}
</p>
<p>
<b>Category:</b> {selectedComplaint.category}
</p>
<p>
<b>Status:</b> {selectedComplaint.status}
</p>
<p>
<b>Description:</b></p>
<p>
{selectedComplaint.description}
</p>
<button
className="close-btn"
onClick={()=>setSelectedComplaint(null)}
>
Close
</button>
</div>
</div>
}
</div>
</div>
);
}
export default AdminDashboard;
