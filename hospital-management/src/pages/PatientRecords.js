import { useEffect, useState } from "react";
import "./MedicalRecords.css";

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    visit_date: "",
    diagnosis: "",
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");
    if (!doctorId) return;

    // Fetch only patient records for this doctor
    fetch(`http://localhost:5000/api/medicalrecords/by-doctor/${doctorId}`)
      .then((res) => res.json())
      .then(setRecords)
      .catch((err) => console.error("Error fetching records:", err));

    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then(setPatients)
      .catch((err) => console.error("Error fetching patients:", err));

    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    if (editRecord) setFormData(editRecord);
  }, [editRecord]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editRecord) return;

    const url = `http://localhost:5000/api/medicalrecords/${editRecord.record_id}`;

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        const updated = records.map((r) =>
          r.record_id === editRecord.record_id ? { ...formData, record_id: editRecord.record_id } : r
        );
        setRecords(updated);
        resetForm();
      })
      .catch((err) => console.error("Error saving record:", err));
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setFormData(record);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/medicalrecords/${id}`, { method: "DELETE" })
      .then(() => setRecords(records.filter((r) => r.record_id !== id)))
      .catch((err) => console.error("Delete failed:", err));
  };

  const resetForm = () => {
    setEditRecord(null);
    setFormData({ patient_id: "", doctor_id: "", visit_date: "", diagnosis: "", notes: "" });
  };

  // Get patient/doctor names using joined data, or fallback
  const getPatientName = (record) => record.patient_name || patients.find((p) => p.patient_id === record.patient_id)?.name || "";
  const getDoctorName = (record) => record.doctor_name || doctors.find((d) => d.doctor_id === record.doctor_id)?.name || "";

  const filteredRecords = records.filter((record) => {
    const name = getPatientName(record);
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page">
      <h2>Patient Records</h2>
      <input
        type="text"
        placeholder="Search by patient name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
      />

      {editRecord && (
        <form onSubmit={handleSubmit} className="form vertical-form">
          <select name="patient_id" value={formData.patient_id} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
            ))}
          </select>
          <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>
            ))}
          </select>
          <input type="date" name="visit_date" value={formData.visit_date} onChange={handleChange} required />
          <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Diagnosis" required />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" />
          <button type="submit" className="submit-btn">Update</button>
        </form>
      )}

      <ul className="appointment-list">
        {filteredRecords.length === 0 ? (
          <li style={{
            textAlign: "center",
            color: "#888",
            fontSize: "18px",
            padding: "40px 0",
            background: "#fafcff",
            border: "none",
            boxShadow: "none"
          }}>
            No patient records found.
          </li>
        ) : (
          filteredRecords.map((record) => (
            <li key={record.record_id}>
              <p><strong>Visit Date:</strong> {record.visit_date}</p>
              <p><strong>Patient:</strong> {getPatientName(record)}</p>
              <p><strong>Doctor:</strong> {getDoctorName(record)}</p>
              <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
              <p><strong>Notes:</strong> {record.notes}</p>
              <div className="record-actions">
                <button className="edit-btn" onClick={() => handleEdit(record)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(record.record_id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PatientRecords;
