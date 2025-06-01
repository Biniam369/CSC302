import { useState } from "react";
import "../App.css";
import AppointmentManager from "./AppointmentManager";
import ScheduledAppointments from "./ScheduledAppointments";

const NurseDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <div className="nurse-dashboard-container">
      {/* NAVIGATION BAR */}
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
              className={`navbar-btn${activeTab === "schedule" ? " active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              Scheduled Appointments
            </button>
          </li>
        </ul>
      </nav>

      <main className="content">
        {activeTab === "appointments" && <AppointmentManager />}
        {activeTab === "schedule" && <ScheduledAppointments />}
      </main>
    </div>
  );
};

export default NurseDashboard;
