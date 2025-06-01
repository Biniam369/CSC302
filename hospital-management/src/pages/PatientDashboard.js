import { useState } from "react";
import BuyMedications from "./BuyMedications";
import PatientAppointmentManager from "./PatientAppointmentManager";
import "./PatientDashboard.css"; // Ensure this is imported
import ScheduledAppointments from "./ScheduledAppointments";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const patientName = localStorage.getItem("patient_name");
  const patientId = localStorage.getItem("patient_id");

  return (
    <div className="dashboard-root">
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul className="navbar-list">
          <li>
            <button
              className={`navbar-btn${activeTab === "appointments" ? " active" : ""}`}
              onClick={() => setActiveTab("appointments")}
            >
              Appointment Manager
            </button>
          </li>
          <li>
            <button
              className={`navbar-btn${activeTab === "scheduled" ? " active" : ""}`}
              onClick={() => setActiveTab("scheduled")}
            >
              Scheduled Appointments
            </button>
          </li>
          <li>
            <button
              className={`navbar-btn${activeTab === "medications" ? " active" : ""}`}
              onClick={() => setActiveTab("medications")}
            >
              Buy Medications
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Card */}
      <div className="dashboard-content">
        <h2>Welcome, {patientName || "Patient"}!</h2>
        {activeTab === "appointments" && <PatientAppointmentManager />}
        {activeTab === "scheduled" && <ScheduledAppointments />}
        {activeTab === "medications" && <BuyMedications patientId={patientId} />}
      </div>
    </div>
  );
};

export default PatientDashboard;
