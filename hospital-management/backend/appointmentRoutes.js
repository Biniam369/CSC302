console.log("✅ appointmentRoutes loaded!");

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

// ✅ GET all appointments
router.get("/", (req, res) => {
  const sql = `
    SELECT a.*, p.name AS patient_name, d.name AS doctor_name
    FROM appointment a
    JOIN patient p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
    ORDER BY a.date DESC, a.time DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ ADD new appointment
router.post("/", (req, res) => {
  const { patient_id, doctor_id, date, time, appointment_cost, reason, status } = req.body;
  if (!patient_id || !doctor_id || !date || !time || !appointment_cost || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const sql = `
    INSERT INTO appointment (patient_id, doctor_id, date, time, appointment_cost, reason, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [patient_id, doctor_id, date, time, appointment_cost, reason, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ appointment_id: result.insertId, ...req.body });
  });
});

// ✅ UPDATE appointment
router.put("/:id", (req, res) => {
  const { patient_id, doctor_id, date, time, appointment_cost, reason, status } = req.body;
  const sql = `
    UPDATE appointment
    SET patient_id = ?, doctor_id = ?, date = ?, time = ?, appointment_cost = ?, reason = ?, status = ?
    WHERE appointment_id = ?
  `;
  db.query(sql, [patient_id, doctor_id, date, time, appointment_cost, reason, status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment updated" });
  });
});


// ✅ DELETE appointment
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM appointment WHERE appointment_id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Appointment deleted" });
  });
});

// ✅ Get all appointments for a specific doctor
router.get("/by-doctor/:doctorId", (req, res) => {
  const { doctorId } = req.params;
  const sql = `
    SELECT a.*, p.name AS patient_name, d.name AS doctor_name
    FROM appointment a
    JOIN patient p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
    WHERE a.doctor_id = ?
    ORDER BY a.date DESC, a.time DESC
  `;
  db.query(sql, [doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Get all appointments for a specific patient (NEW!)
router.get("/by-patient/:patientId", (req, res) => {
  const { patientId } = req.params;
  const sql = `
    SELECT a.*, d.name AS doctor_name
    FROM appointment a
    JOIN doctor d ON a.doctor_id = d.doctor_id
    WHERE a.patient_id = ?
    ORDER BY a.date DESC, a.time DESC
  `;
  db.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
