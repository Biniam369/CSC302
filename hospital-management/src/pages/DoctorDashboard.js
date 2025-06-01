import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import DoctorAppointments from "./DoctorAppointments";
import MedicalRecords from "./MedicalRecords";
import PatientRecords from "./PatientRecords";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure doctor is logged in
    const doctorId = localStorage.getItem("doctor_id");
    const name = localStorage.getItem("doctor_name");
    if (!doctorId) {
      alert("Session expired. Please login again.");
      navigate("/");
    } else {
      setDoctorName(name);
    }
  }, [navigate]);

  const handleEdit = (record) => {
    setEditRecord(record);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditRecord(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditRecord(null);
    setShowForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "records":
        return (
          <MedicalRecords
            showForm={showForm}
            onEdit={handleEdit}
            onAddNew={handleAddNew}
            closeForm={closeForm}
            editRecord={editRecord}
          />
        );
      case "patients":
        return <PatientRecords />;
      case "appointments":
        return <DoctorAppointments />;
      default:
        return null;
    }
  };

  return (
    <div className="doctor-dashboard">
      {/* Optional: Show doctor info */}
      <div style={{ textAlign: "right", padding: "10px 30px", color: "#004080", fontWeight: "bold" }}>
        {doctorName ? `Dr. ${doctorName}` : ""}
      </div>
      <nav className="doctor-nav">
        <button className={activeTab === "records" ? "active" : ""} onClick={() => setActiveTab("records")}>
          Medical Records
        </button>
        <button className={activeTab === "patients" ? "active" : ""} onClick={() => setActiveTab("patients")}>
          Patient Records
        </button>
        <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>
          Appointments
        </button>
      </nav>
      <div className="doctor-content">{renderContent()}</div>
    </div>
  );
};

export default DoctorDashboard;
