// src/components/AnalyticsReports.js

import { useEffect, useState } from "react";
import {
    Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import "./AnalyticsReports.css";

// ==== CHANGE: Use absolute URLs to the backend ====
const endpoints = [
  { state: "visitTrends", url: "http://localhost:5000/api/reports/visit-trends" },
  { state: "topDepartments", url: "http://localhost:5000/api/reports/top-departments" },
  { state: "topDoctors", url: "http://localhost:5000/api/reports/top-doctors" },
  { state: "medUsage", url: "http://localhost:5000/api/reports/med-usage" },
  { state: "surgeryVolume", url: "http://localhost:5000/api/reports/surgery-volume" },
  { state: "shelfLife", url: "http://localhost:5000/api/reports/shelf-life" }
];

const AnalyticsReports = () => {
  const [visitTrends, setVisitTrends] = useState([]);
  const [topDepartments, setTopDepartments] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [medUsage, setMedUsage] = useState([]);
  const [surgeryVolume, setSurgeryVolume] = useState([]);
  const [shelfLife, setShelfLife] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all reports on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all(endpoints.map(ep =>
      fetch(ep.url)
        .then(res => res.json())
        .catch(() => null)
    )).then(([vt, td, doc, mu, sv, sh]) => {
      setVisitTrends(Array.isArray(vt) ? vt : []);
      setTopDepartments(Array.isArray(td) ? td : []);
      setTopDoctors(Array.isArray(doc) ? doc : []);
      setMedUsage(Array.isArray(mu) ? mu : []);
      setSurgeryVolume(Array.isArray(sv) ? sv : []);
      setShelfLife(Array.isArray(sh) ? sh : []);
      setLoading(false);
      if ([vt, td, doc, mu, sv, sh].some(v => v === null)) {
        setError("Some report data could not be loaded. Check your backend and network.");
      }
    }).catch(err => {
      setError("Failed to load analytics data.");
      setLoading(false);
    });
  }, []);

  return (
    <div className="reports-page">
      <h2>Analytics & Reports</h2>
      {loading ? (
        <div style={{ textAlign: "center", margin: "48px" }}>
          <span style={{ fontWeight: 600, fontSize: "1.25rem", color: "#1976d2" }}>Loading reports...</span>
        </div>
      ) : (
        <>
          {error && (
            <div style={{ background: "#fff7f6", color: "#e53935", border: "1px solid #ffdada", padding: 16, borderRadius: 8, marginBottom: 24 }}>
              {error}
            </div>
          )}

          {/* 1. Patient Visit Trends */}
          <div className="report-section">
            <h3>Patient Visit Trends (Monthly, Last Year)</h3>
            {visitTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={visitTrends}>
                  <CartesianGrid stroke="#f1f4f8" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" stroke="#003366" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "#aaa", textAlign: "center", padding: 16 }}>No data found for visit trends.</div>
            )}
          </div>

          {/* 2. Top Departments and Doctors */}
          <div className="report-section">
            <h3>Top Performing Departments (By Revenue)</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Revenue ($)</th>
                </tr>
              </thead>
              <tbody>
                {topDepartments.length > 0 ? topDepartments.map((d, i) => (
                  <tr key={i}>
                    <td>{d.department || d.name}</td>
                    <td>{d.revenue ? d.revenue.toLocaleString() : "-"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} style={{ color: "#aaa" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <h4 style={{ marginTop: "18px" }}>Top Doctors (By Patient Volume)</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Patient Count</th>
                </tr>
              </thead>
              <tbody>
                {topDoctors.length > 0 ? topDoctors.map((d, i) => (
                  <tr key={i}>
                    <td>{d.doctor || d.name}</td>
                    <td>{d.patientCount}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} style={{ color: "#aaa" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3. Medication Usage and Supply */}
          <div className="report-section">
            <h3>Medication Usage and Supply</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Supplier</th>
                  <th>Used</th>
                  <th>Patients</th>
                  <th>Inventory Turnover</th>
                </tr>
              </thead>
              <tbody>
                {medUsage.length > 0 ? medUsage.map((m, i) => (
                  <tr key={i}>
                    <td>{m.medication || m.name}</td>
                    <td>{m.supplier}</td>
                    <td>{m.used}</td>
                    <td>{m.patients}</td>
                    <td>{m.turnover || "-"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ color: "#aaa" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 4. Monthly Surgery Volume */}
          <div className="report-section">
            <h3>Monthly Surgery Volume</h3>
            {surgeryVolume.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={surgeryVolume}>
                  <CartesianGrid stroke="#f1f4f8" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="surgeries" fill="#0072ce" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "#aaa", textAlign: "center", padding: 16 }}>No data found for surgery volume.</div>
            )}
          </div>

          {/* 5. Inventory Shelf-Life */}
          <div className="report-section">
            <h3>Inventory Shelf-Life (Longest by Supplier)</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Avg Days in Inventory</th>
                </tr>
              </thead>
              <tbody>
                {shelfLife.length > 0 ? shelfLife.map((s, i) => (
                  <tr key={i}>
                    <td>{s.supplier}</td>
                    <td>{s.avgDays}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} style={{ color: "#aaa" }}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsReports;
