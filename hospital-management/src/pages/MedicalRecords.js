import { useEffect, useState } from "react";
import "./MedicalRecords.css";

const MedicalRecords = ({ showForm, onEdit, onAddNew, closeForm, editRecord }) => {
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    visit_date: "",
    diagnosis: "",
    notes: ""
  });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then(setPatients)
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  useEffect(() => {
    if (editRecord) setFormData(editRecord);
  }, [editRecord]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Always use the logged-in doctor's ID
    const doctorId = localStorage.getItem("doctor_id");
    const payload = { ...formData, doctor_id: doctorId };

    const method = editRecord ? "PUT" : "POST";
    const url = editRecord
      ? `http://localhost:5000/api/medicalrecords/${editRecord.record_id}`
      : "http://localhost:5000/api/medicalrecords";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        resetForm();
        closeForm();
      })
      .catch((err) => {
        console.error("Error saving record:", err);
        alert("Save failed.");
      });
  };

  const resetForm = () => {
    setFormData({ patient_id: "", doctor_id: "", visit_date: "", diagnosis: "", notes: "" });
  };

  return (
    <div className="page">
      <h2>Medical Records</h2>
      {showForm ? (
        <form onSubmit={handleSubmit} className="form vertical-form">
          <div className="form-group">
            <label>Patient</label>
            <select name="patient_id" value={formData.patient_id} onChange={handleChange} required>
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Doctor: show as text, not a dropdown */}
          <div className="form-group">
            <label>Doctor</label>
            <input
              type="text"
              value={localStorage.getItem("doctor_name") || ""}
              readOnly
              style={{ background: "#f5f7fa", color: "#333" }}
            />
          </div>

          <div className="form-group">
            <label>Visit Date</label>
            <input type="date" name="visit_date" value={formData.visit_date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Diagnosis</label>
            <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} rows={3}></textarea>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}></textarea>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="submit-btn">{editRecord ? "Update Record" : "Add Record"}</button>
            <button type="button" onClick={closeForm} className="delete-btn">Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={onAddNew} className="submit-btn" style={{ marginBottom: "20px" }}>
          + Add New Record
        </button>
      )}
    </div>
  );
};

export default MedicalRecords;
