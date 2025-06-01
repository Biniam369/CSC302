// DoctorDashboard.js
import { useState } from "react";
import MedicalRecords from "./MedicalRecords";
import "../App.css";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

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
      default:
        return null;
    }
  };

  return (
    <div className="doctor-dashboard">
      <nav className="doctor-nav">
        <button
          className={activeTab === "records" ? "active" : ""}
          onClick={() => setActiveTab("records")}
        >
          Medical Records
        </button>
      </nav>
      <div className="doctor-content">{renderContent()}</div>
    </div>
  );
};

export default DoctorDashboard;
