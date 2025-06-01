import { useEffect, useState } from "react";
import "./AppointmentManager.css";

const AppointmentManager = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [addingPatient, setAddingPatient] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    patient_name: "",
    gender: "",
    age: "",
    contact: "",
    address: "",
    insurance_id: "",
    doctor_id: "",
    date: "",
    time: "",
    appointment_cost: "",
    reason: "",
    status: "Scheduled",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/patients").then(res => res.json()).then(setPatients);
    fetch("http://localhost:5000/api/doctors").then(res => res.json()).then(setDoctors);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let patientId = formData.patient_id;

    if (addingPatient && formData.patient_name) {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.patient_name,
          gender: formData.gender,
          age: formData.age,
          contact: formData.contact,
          address: formData.address,
          insurance_id: formData.insurance_id || null
        })
      });

      const newPatient = await res.json();
      if (newPatient?.patient_id) {
        setPatients(prev => [...prev, newPatient]);
        patientId = newPatient.patient_id;
      } else {
        alert("Failed to add new patient");
        return;
      }
    }

    const payload = {
      doctor_id: formData.doctor_id,
      patient_id: patientId,
      date: formData.date,
      time: formData.time,
      appointment_cost: formData.appointment_cost,
      reason: formData.reason,
      status: formData.status
    };

    fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(() => {
        alert("Appointment added!");
        setFormData({
          patient_id: "",
          patient_name: "",
          gender: "",
          age: "",
          contact: "",
          address: "",
          insurance_id: "",
          doctor_id: "",
          date: "",
          time: "",
          appointment_cost: "",
          reason: "",
          status: "Scheduled"
        });
        setAddingPatient(false);
      });
  };

  return (
    <div className="appointment-container">
      <h2 className="title">Appointment Manager</h2>
      <form onSubmit={handleSubmit} className="form vertical-form">
        <div className="form-group">
          <label>Patient</label>
          {addingPatient ? (
            <>
              <input name="patient_name" value={formData.patient_name} onChange={handleChange} placeholder="Full Name" required />
              <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
              <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" required />
              <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact" required />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
              <input name="insurance_id" value={formData.insurance_id} onChange={handleChange} placeholder="Insurance ID (optional)" />
            </>
          ) : (
            <select name="patient_id" value={formData.patient_id} onChange={handleChange} required>
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
              ))}
            </select>
          )}
          <button type="button" onClick={() => setAddingPatient(!addingPatient)} className="patient-toggle">
            {addingPatient ? "Select Existing" : "Add New Patient"}
          </button>
        </div>

        <div className="form-group">
          <label>Doctor</label>
          <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Cost</label>
          <input type="number" step="0.01" name="appointment_cost" value={formData.appointment_cost} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Reason</label>
          <input type="text" name="reason" value={formData.reason} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentManager;
