import { Link } from "react-router-dom";
import "../App.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1>Hospital System</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/records">Medical Records</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/billing">Billing</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
