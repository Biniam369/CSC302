const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

console.log("🟢 Starting server.js...");

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== MYSQL CONNECTION ====================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YeMariam@212324252627",
  database: "hospitaldb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// ==================== ROUTE IMPORTS ====================
const doctorRoutes = require("./doctorRoutes");
const inventoryRouter = require("./inventoryRoutes");
const medicalRoutes = require("./medicalRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const departmentRoutes = require("./departmentRoutes");
const reportsRouter = require("./reports"); // ⭐️ CORRECT path (no '/routes')

// ==================== ROUTES ====================
app.use("/api/doctors", doctorRoutes);
app.use("/api/inventory", inventoryRouter);
app.use("/api/medicalrecords", medicalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/reports", reportsRouter); // ⭐️ Added analytics/reports endpoints

// ==================== PATIENT ROUTES ====================

// GET all patients
app.get("/api/patients", (req, res) => {
  db.query("SELECT patient_id, name FROM patient", (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

// ADD new patient (for admin/backoffice, not signup)
app.post("/api/patients", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Patient name is required" });
  }
  const sql = "INSERT INTO patient (name) VALUES (?)";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("❌ Patient insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ patient_id: result.insertId, name });
  });
});

// PATIENT LOGIN
app.post("/api/patients/login", (req, res) => {
  const { name, patient_id } = req.body;
  const sql = "SELECT * FROM patient WHERE name = ? AND patient_id = ?";
  db.query(sql, [name, patient_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful", patient: results[0] });
  });
});
// adds a new medication purchase
app.post("/api/purchase-medication", (req, res) => {
  const { patient_id, medication_id, quantity } = req.body;
  if (!patient_id || !medication_id || !quantity) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const sql = `
    INSERT INTO medication_purchase (patient_id, medication_id, quantity)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [patient_id, medication_id, quantity], (err, result) => {
    if (err) {
      console.error("❌ Purchase insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, purchase_id: result.insertId });
  });
});

// PATIENT SIGNUP
app.post("/api/patients/signup", (req, res) => {
  // Accept all required patient fields from body
  const { name, gender, age, contact, address, insurance_id } = req.body;
  if (!name || !gender || !age || !contact || !address || !insurance_id) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = `
    INSERT INTO patient (name, gender, age, contact, address, insurance_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, gender, age, contact, address, insurance_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ patient_id: result.insertId, name });
  });
});

// ==================== INSURANCE ====================
app.get("/api/insurance", (req, res) => {
  console.log("📥 /api/insurance route HIT");
  db.query("SELECT * FROM insurance", (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch insurance:", err.message);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

// ==================== BILLING ====================
app.post("/api/billing", (req, res) => {
  const { patient_id, insurance_id, appointment_id, amount, total } = req.body;
  if (!patient_id || !insurance_id || amount == null || total == null) {
    return res.status(400).json({ error: "Missing required billing info." });
  }
  const today = new Date().toISOString().split("T")[0];
  const details = `Billed with insurance ID ${insurance_id} on ${today}`;
  const sql = `
    INSERT INTO billing 
    (patient_id, appointment_id, insurance_id, date, details, amount, final_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [patient_id, appointment_id || null, insurance_id, today, details, amount, total],
    (err, result) => {
      if (err) {
        console.error("❌ Billing insert error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ Billing saved", billing_id: result.insertId });
    }
  );
});
// ==================== MEDICATIONS ====================
app.get("/api/medications", (req, res) => {
  db.query("SELECT * FROM medication", (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch medications:", err.message);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

// View billing history
app.get("/api/billing-history", (req, res) => {
  const sql = `
    SELECT b.billing_id, b.date, b.amount, b.final_amount,
           p.name AS patient_name,
           i.provider AS insurance_provider,
           i.coverage_amount
    FROM billing b
    LEFT JOIN patient p ON b.patient_id = p.patient_id
    LEFT JOIN insurance i ON b.insurance_id = i.insurance_id
    ORDER BY b.billing_id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      // Always send an array, even on error
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

// ==================== TEST ====================
app.get("/api/test123", (req, res) => {
  res.send("✅ /api/test123 is working.");
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
