// DoctorAppointments.js
import { useEffect, useState } from "react";
import "./MedicalRecords.css";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");
    if (!doctorId) return;

    // Fetch only appointments for this doctor
    fetch(`http://localhost:5000/api/appointments/by-doctor/${doctorId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Appointments fetched for doctor:", data);
        setAppointments(data);
      })
      .catch(console.error);

    fetch("http://localhost:5000/api/doctors")
      .then(res => res.json())
      .then(setDoctors)
      .catch(console.error);

    fetch("http://localhost:5000/api/patients")
      .then(res => res.json())
      .then(setPatients)
      .catch(console.error);
  }, []);

  // Use loose equality in case of type mismatch
  const getDoctorName = (id) =>
    doctors.find(d => d.doctor_id == id)?.name || id;

  const getPatientName = (id) =>
    patients.find(p => p.patient_id == id)?.name || id;

  return (
    <div className="page">
      <h2>Doctor's Appointments</h2>

      <ul className="appointment-list">
        {appointments.length === 0 ? (
          <li style={{
            textAlign: "center",
            color: "#888",
            fontSize: "18px",
            padding: "40px 0",
            background: "#fafcff",
            border: "none",
            boxShadow: "none"
          }}>
            No appointments found.
          </li>
        ) : (
          appointments.map(appt => (
            <li key={appt.appointment_id}>
              <p><strong>Date:</strong> {appt.date}</p>
              <p><strong>Time:</strong> {appt.time}</p>
              <p><strong>Patient:</strong> {getPatientName(appt.patient_id)}</p>
              <p><strong>Doctor:</strong> {getDoctorName(appt.doctor_id)}</p>
              <p><strong>Reason:</strong> {appt.reason}</p>
              <p><strong>Cost:</strong> ${appt.appointment_cost}</p>
              <p><strong>Status:</strong> {appt.status}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
