const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// ✅ DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YeMariam@212324252627",
  database: "hospitaldb",
});

// ✅ GET all medical records
router.get("/", (req, res) => {
  const sql = "SELECT * FROM medicalrecord ORDER BY visit_date DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ GET all medical records for a specific doctor  <<<<<<<< ADD THIS
router.get("/by-doctor/:doctorId", (req, res) => {
  const doctorId = req.params.doctorId;
  const sql = `
    SELECT m.*, p.name AS patient_name, d.name AS doctor_name
    FROM medicalrecord m
    JOIN patient p ON m.patient_id = p.patient_id
    JOIN doctor d ON m.doctor_id = d.doctor_id
    WHERE m.doctor_id = ?
    ORDER BY m.visit_date DESC
  `;
  db.query(sql, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ ADD new medical record
router.post("/", (req, res) => {
  const { patient_id, doctor_id, visit_date, diagnosis, notes } = req.body;
  if (!patient_id || !doctor_id || !visit_date || !diagnosis) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const sql = `
    INSERT INTO medicalrecord (patient_id, doctor_id, visit_date, diagnosis, notes)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [patient_id, doctor_id, visit_date, diagnosis, notes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ record_id: result.insertId, ...req.body });
  });
});

// ✅ UPDATE medical record
router.put("/:id", (req, res) => {
  const { patient_id, doctor_id, visit_date, diagnosis, notes } = req.body;
  const sql = `
    UPDATE medicalrecord
    SET patient_id = ?, doctor_id = ?, visit_date = ?, diagnosis = ?, notes = ?
    WHERE record_id = ?
  `;
  db.query(sql, [patient_id, doctor_id, visit_date, diagnosis, notes, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Record updated" });
  });
});

// ✅ DELETE medical record
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM medicalrecord WHERE record_id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Record deleted" });
  });
});
// GET all medical records for a specific doctor (for patient records tab)
router.get("/by-doctor/:doctorId", (req, res) => {
  const { doctorId } = req.params;
  const sql = `
    SELECT m.*, p.name AS patient_name, d.name AS doctor_name
    FROM medicalrecord m
    JOIN patient p ON m.patient_id = p.patient_id
    JOIN doctor d ON m.doctor_id = d.doctor_id
    WHERE m.doctor_id = ?
    ORDER BY m.visit_date DESC
  `;
  db.query(sql, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
