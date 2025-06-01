// backend/patientRoutes.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YeMariam@212324252627",
  database: "hospitaldb",
});

// GET all patients
router.get("/", (req, res) => {
  db.query("SELECT * FROM patient", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// SIGN UP new patient (all required fields)
router.post("/signup", (req, res) => {
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
    res.json({
      patient_id: result.insertId,
      name,
      gender,
      age,
      contact,
      address,
      insurance_id,
    });
  });
});

// PATIENT LOGIN (for login, not signup)
router.post("/login", (req, res) => {
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

module.exports = router;
