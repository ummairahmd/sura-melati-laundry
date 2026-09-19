import { Routes, Route, useLocation} from "react-router-dom";

import CustomerLayout from "./components/CustomerLayout";
import AdminLayout from "./components/AdminLayout";


import Navbar from "./components/Navbar";

import GoogleSuccess from "./pages/GoogleSuccess";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./customer/SubmitComplaint";
import ComplaintHistory from "./customer/ComplaintHistory";
import TrackComplaint from "./customer/TrackComplaint";
import Feedback from "./customer/Feedback";
import Profile from "./customer/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import ManageComplaint from "./pages/ManageComplaint";
import AdminProfile from "./admin/AdminProfile";
import Reports from "./pages/Reports";
import Footer from "./components/Footer";

function App() {
    const location = useLocation();


  const hideNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/submit-complaint") ||
    location.pathname.startsWith("/complaint-history") ||
    location.pathname.startsWith("/track-complaint") ||
    location.pathname.startsWith("/feedback") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/admin-profile") ||
    location.pathname.startsWith("/manage-complaint") ||
    location.pathname.startsWith("/reports");



  return (

    <>


      {!hideNavbar && <Navbar />}

    <Routes>

    <Route path="/" element={<Home />} />

    <Route path="/about" element={<About />} />

    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />

    <Route path="/google-success" element={<GoogleSuccess />}/>

    {/* CUSTOMER ROUTES */}

    <Route element={<CustomerLayout />}>

    <Route path="dashboard" element={<Dashboard />} />

    <Route path="/submit-complaint" element={<SubmitComplaint />} />

    <Route path="/complaint-history" element={<ComplaintHistory />} />

    <Route path="/track-complaint" element={<TrackComplaint />} />

    <Route path="/profile" element={<Profile/>}/>

    <Route path="/feedback" element={<Feedback />} />

</Route>



    {/* ADMIN */}

<Route element={<AdminLayout/>}>


    <Route 
    path="admin-dashboard"
    element={<AdminDashboard/>}
    />


    <Route 
    path="manage-complaint"
    element={<ManageComplaint/>}
    />


    <Route 
    path="reports"
    element={<Reports/>}
    />


    <Route 
    path="admin-profile"
    element={<AdminProfile/>}
    />


</Route>

    <Route 
    path="*" 
    element={<h1>404 - Page Not Found</h1>} 
    />


</Routes>

      {!hideNavbar && <Footer />}

    </>

  );

}


export default App;