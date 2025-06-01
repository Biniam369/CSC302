import { useEffect, useState } from "react";
import "./AppointmentManager.css";

const PatientAppointmentManager = () => {
  const [formData, setFormData] = useState({
    doctor_id: "",
    date: "",
    time: "",
    appointment_cost: "",
    reason: "",
    status: "scheduled",
  });
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Patient info from localStorage
  const patient_id = localStorage.getItem("patient_id");
  const patient_name = localStorage.getItem("patient_name");

  useEffect(() => {
    // Fetch departments for the filter
    fetch("http://localhost:5000/api/departments")
      .then(res => res.json())
      .then(setDepartments)
      .catch(console.error);

    // Fetch doctors for the dropdown
    fetch("http://localhost:5000/api/doctors")
      .then(res => res.json())
      .then(setDoctors)
      .catch(console.error);

    // Fetch the patient's own appointments
    fetch(`http://localhost:5000/api/appointments/by-patient/${patient_id}`)
      .then(res => res.json())
      .then(setAppointments)
      .catch(console.error);
  }, [patient_id]);

  // Filter doctors by department
  const filteredDoctors = selectedDepartment
    ? doctors.filter(d => String(d.department_id) === String(selectedDepartment))
    : doctors;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, patient_id };

    fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then((data) => {
        setAppointments([data, ...appointments]);
        setFormData({
          doctor_id: "",
          date: "",
          time: "",
          appointment_cost: "",
          reason: "",
          status: "scheduled",
        });
      })
      .catch(console.error);
  };

  return (
    <div className="page">
      <h3>Book an Appointment</h3>
      <form onSubmit={handleSubmit} className="form vertical-form">
        <div className="form-group">
          <label>Patient</label>
          <input type="text" value={patient_name} readOnly style={{ background: "#f5f7fa", color: "#333" }} />
        </div>

        {/* Department filter */}
        <div className="form-group">
          <label>Department</label>
          <select
            value={selectedDepartment}
            onChange={e => {
              setSelectedDepartment(e.target.value);
              setFormData({ ...formData, doctor_id: "" }); // Reset doctor when department changes
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dep => (
              <option key={dep.department_id} value={dep.department_id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor filtered by department */}
        <div className="form-group">
          <label>Doctor</label>
          <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {filteredDoctors.map(d => (
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
          <input type="number" name="appointment_cost" value={formData.appointment_cost} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Reason</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} rows={2}></textarea>
        </div>
        <button type="submit" className="submit-btn">Book Appointment</button>
      </form>
    </div>
  );
};

export default PatientAppointmentManager;
