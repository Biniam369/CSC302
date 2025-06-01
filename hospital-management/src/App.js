// App.js
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

// ✅ Imports
import Login from "./Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import PatientDashboard from "./pages/PatientDashboard"; // Make sure this file exists!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/nurse" element={<NurseDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} /> {/* Added this line */}
      </Routes>
    </Router>
  );
}

export default App;
