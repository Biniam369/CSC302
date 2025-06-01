// HomePage.js
import "../App.css";

const HomePage = () => {
  return (
    <div className="page">
      <h2>Welcome to the Hospital Management System</h2>
      <p>Choose a module from the left menu to begin.</p>

      <div className="features">
        <h3>System Features:</h3>
        <ul>
          <li>📅 Schedule and manage patient appointments</li>
          <li>📝 View and update patient medical records</li>
          <li>📦 Track and manage hospital inventory</li>
          <li>💳 Generate and process billing invoices</li>
        </ul>
      </div>

      <div className="quick-tips">
        <h3>Quick Tips:</h3>
        <p>Use the left menu to navigate to a module. Each section is role-based for doctors, nurses, and admin staff.</p>
      </div>
    </div>
  );
};

export default HomePage;
