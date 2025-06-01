import { useState } from "react";
import "./AdminDashboard.css";
import AnalyticsReports from "./AnalyticsReports"; // ✅ Import the analytics page
import BillingHistory from "./BillingHistory";
import BillingInterface from "./BillingInterface";
import InventorySystem from "./InventorySystem";
import StaffManagement from "./StaffManagement";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("inventory");

  const renderSection = () => {
    switch (activeSection) {
      case "inventory":
        return <InventorySystem />;
      case "billing":
        return <BillingInterface />;
      case "history":
        return <BillingHistory />;
      case "staff":
        return <StaffManagement />;
      case "analytics":
        return <AnalyticsReports />; // ✅ Render analytics & reports
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <button
          className={activeSection === "inventory" ? "active" : ""}
          onClick={() => setActiveSection("inventory")}
        >
          Inventory System
        </button>
        <button
          className={activeSection === "billing" ? "active" : ""}
          onClick={() => setActiveSection("billing")}
        >
          Billing Interface
        </button>
        <button
          className={activeSection === "history" ? "active" : ""}
          onClick={() => setActiveSection("history")}
        >
          Billing History
        </button>
        <button
          className={activeSection === "staff" ? "active" : ""}
          onClick={() => setActiveSection("staff")}
        >
          Staff Management
        </button>
        <button
          className={activeSection === "analytics" ? "active" : ""}
          onClick={() => setActiveSection("analytics")}
        >
          Analytics & Reports
        </button>
      </nav>
      <div className="admin-content">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
