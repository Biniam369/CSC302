// NurseDashboard.js
import AppointmentManager from "./pages/AppointmentManager";

const NurseDashboard = () => {
  return (
    <div className="page">
      <h2>Nurse Dashboard</h2>
      <AppointmentManager />
      <div className="section">
        <h3>Vitals Entry</h3>
        <p>Record blood pressure, temperature, heart rate, etc.</p>
      </div>
      <div className="section">
        <h3>Patient Monitoring Notes</h3>
        <p>Nurses can update observations and track patient conditions.</p>
      </div>
    </div>
  );
};

export default NurseDashboard;
