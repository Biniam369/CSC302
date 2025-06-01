import { useEffect, useState } from "react";
import "./BillingHistory.css";

const BillingHistory = () => {
  const [billingRecords, setBillingRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/billing-history")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Billing records fetched:", data);
        // Only set if the data is an array; otherwise, set to empty array
        if (Array.isArray(data)) {
          setBillingRecords(data);
        } else {
          setBillingRecords([]);
          console.error("❌ Unexpected data from API:", data);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load billing history:", err);
        setBillingRecords([]);
      });
  }, []);

  // Only filter if billingRecords is actually an array
  const filtered = Array.isArray(billingRecords)
    ? billingRecords.filter(
        (record) =>
          record.patient_name &&
          record.patient_name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="billing-history">
      <h2>Billing History</h2>
      <input
        type="text"
        className="billing-search"
        placeholder="Search by patient name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="billing-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Insurance</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Coverage</th>
            <th>Final</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No billing records found.
              </td>
            </tr>
          ) : (
            filtered.map((record) => (
              <tr key={record.billing_id}>
                <td>{record.billing_id}</td>
                <td>{record.patient_name}</td>
                <td>{record.insurance_provider}</td>
                <td>{record.date}</td>
                <td>${record.amount}</td>
                <td>${record.coverage_amount}</td>
                <td>${record.final_amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BillingHistory;
