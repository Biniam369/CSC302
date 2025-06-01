import { useEffect, useState } from "react";
import "./ScheduledAppointments.css";

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const patient_id = localStorage.getItem("patient_id");

  // Fetch appointments, doctors, departments
  useEffect(() => {
    if (!patient_id) return;
    fetch(`http://localhost:5000/api/appointments/by-patient/${patient_id}`)
      .then(res => res.json())
      .then(setAppointments)
      .catch(console.error);

    fetch("http://localhost:5000/api/doctors")
      .then(res => res.json())
      .then(setDoctors)
      .catch(console.error);

    fetch("http://localhost:5000/api/departments")
      .then(res => res.json())
      .then(setDepartments)
      .catch(console.error);
  }, [patient_id]);

  // Field validation helper
  const editFormFieldsValid = () =>
    !!(
      editForm.date &&
      editForm.time &&
      editForm.doctor_id &&
      editForm.appointment_cost &&
      editForm.reason
    );

  // Edit start
  const handleEditClick = (appt) => {
    setEditingId(appt.appointment_id);
    setDeptFilter(appt.department_id || "");
    setEditForm({
      date: appt.date,
      time: appt.time,
      appointment_cost: appt.appointment_cost,
      reason: appt.reason,
      doctor_id: appt.doctor_id,
      patient_id: appt.patient_id,
      status: appt.status,
    });
  };

  // Edit field change
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    // If doctor changes, update dept filter too
    if (e.target.name === "doctor_id") {
      const doc = doctors.find(d => d.doctor_id === Number(e.target.value));
      if (doc) setDeptFilter(doc.department_id);
    }
  };

  // Department filter (in edit mode)
  const handleDeptFilterChange = (e) => {
    const newDeptId = e.target.value;
    setDeptFilter(newDeptId);
    // Optionally reset doctor if not in new department
    const doctorIds = doctors.filter(d => d.department_id == newDeptId).map(d => d.doctor_id);
    if (!doctorIds.includes(Number(editForm.doctor_id))) {
      setEditForm({ ...editForm, doctor_id: "" });
    }
  };

  // Save edits
  const handleEditSave = (id) => {
    if (!editFormFieldsValid()) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    fetch(`http://localhost:5000/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then(res => res.json())
      .then(updated => {
        setAppointments(prev =>
          prev.map(a => a.appointment_id === id ? { ...a, ...editForm } : a)
        );
        setEditingId(null);
        setEditForm({});
      })
      .catch(console.error);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    fetch(`http://localhost:5000/api/appointments/${id}`, { method: "DELETE" })
      .then(() => setAppointments(prev => prev.filter(a => a.appointment_id !== id)))
      .catch(console.error);
  };

  if (!appointments.length) {
    return (
      <div className="scheduled-container">
        <h2 className="title">Scheduled Appointments</h2>
        <p style={{ color: "#888", textAlign: "center", padding: "20px" }}>You have no scheduled appointments.</p>
      </div>
    );
  }

  return (
    <div className="scheduled-container">
      <h2 className="title">Scheduled Appointments</h2>
      <ul className="appointment-list">
        {appointments.map(appt => (
          <li className="appointment-card" key={appt.appointment_id}>
            {editingId === appt.appointment_id ? (
              <div className="appt-info">
                <div>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      required
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="time"
                      name="time"
                      value={editForm.time}
                      onChange={handleEditChange}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Department:
                    <select value={deptFilter} onChange={handleDeptFilterChange}>
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Doctor:
                    <select name="doctor_id" value={editForm.doctor_id} onChange={handleEditChange} required>
                      <option value="">Select Doctor</option>
                      {doctors
                        .filter(d => !deptFilter || d.department_id == deptFilter)
                        .map(d => (
                          <option key={d.doctor_id} value={d.doctor_id}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    Cost:
                    <input
                      type="number"
                      name="appointment_cost"
                      value={editForm.appointment_cost}
                      onChange={handleEditChange}
                      min={1}
                      required
                    />
                  </label>
                  <label>
                    Reason:
                    <input
                      type="text"
                      name="reason"
                      value={editForm.reason}
                      onChange={handleEditChange}
                      required
                    />
                  </label>
                </div>
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditSave(appt.appointment_id)}
                    disabled={!editFormFieldsValid()}
                    style={{ opacity: editFormFieldsValid() ? 1 : 0.6, cursor: editFormFieldsValid() ? "pointer" : "not-allowed" }}
                  >
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleEditCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="appt-info">
                  <span className="datetime">{appt.date} {appt.time}</span> — <strong>with Dr. {appt.doctor_name}</strong>
                  <div className="details">
                    Reason: {appt.reason} | Cost: ${appt.appointment_cost} | 
                    Status: <span className={`status ${appt.status?.toLowerCase()}`}>{appt.status}</span>
                  </div>
                </div>
                <div className="actions">
                  {appt.status !== "Cancelled" && (
                    <>
                      <button className="delete-btn" onClick={() => handleDelete(appt.appointment_id)}>Cancel</button>
                      <button className="edit-btn" onClick={() => handleEditClick(appt)}>Edit</button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduledAppointments;
