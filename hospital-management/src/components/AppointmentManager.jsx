import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    appointment_cost: '',
    reason: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    //fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/appointments', formData);
    fetchAppointments();
    setFormData({
      patient_id: '',
      doctor_id: '',
      date: '',
      time: '',
      appointment_cost: '',
      reason: '',
      status: 'Scheduled'
    });
  };

  const deleteAppointment = async (id) => {
    await axios.delete(`http://localhost:5000/api/appointments/${id}`);
    fetchAppointments();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Appointment Manager</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-2">
        {['patient_id', 'doctor_id', 'date', 'time', 'appointment_cost', 'reason'].map(field => (
          <input key={field} name={field} value={formData[field]} onChange={handleChange} placeholder={field.replace('_', ' ')} required />
        ))}
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-2">Appointments</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Cost</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app.appointment_id}>
              <td>{app.appointment_id}</td>
              <td>{app.patient_id}</td>
              <td>{app.doctor_id}</td>
              <td>{app.date}</td>
              <td>{app.time}</td>
              <td>{app.appointment_cost}</td>
              <td>{app.status}</td>
              <td><button onClick={() => deleteAppointment(app.appointment_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
