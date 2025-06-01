const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YeMariam@212324252627",
  database: "hospitaldb",
});

// =================== DOCTOR ROUTES ===================

// GET all doctors
router.get("/", (req, res) => {
  db.query("SELECT * FROM doctor", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ADD a doctor
router.post("/", (req, res) => {
  const { name, specialization, contact, department_id } = req.body;
  if (!name || !specialization || !contact || !department_id) {
    return res.status(400).json({ error: "Missing doctor information" });
  }
  const sql = `
    INSERT INTO doctor (name, specialization, contact, department_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [name, specialization, contact, department_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ doctor_id: result.insertId, name, specialization, contact, department_id });
  });
});

// UPDATE doctor by ID
router.put("/:id", (req, res) => {
  const doctorId = req.params.id;
  const { name, specialization, contact, department_id } = req.body;

  // Debugging logs
  console.log("🟡 PUT /api/doctors/:id called", doctorId, req.body);

  if (!name || !specialization || !contact || !department_id) {
    return res.status(400).json({ error: "All fields are required for update." });
  }

  const sql = `
    UPDATE doctor
    SET name = ?, specialization = ?, contact = ?, department_id = ?
    WHERE doctor_id = ?
  `;
  db.query(sql, [name, specialization, contact, department_id, doctorId], (err, result) => {
    if (err) {
      console.error("❌ SQL error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Doctor not found." });
    }
    // Return the updated doctor object (optional, matches React pattern)
    res.json({ doctor_id: Number(doctorId), name, specialization, contact, department_id });
  });
});

// DELETE doctor
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM doctor WHERE doctor_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Doctor deleted" });
  });
});

// LOGIN doctor
router.post("/login", (req, res) => {
  let { name, doctor_id } = req.body;
  if (!name || !doctor_id) {
    return res.status(400).json({ error: "Name and Doctor ID are required" });
  }
  name = name.trim().toLowerCase();
  const doctorId = parseInt(doctor_id);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Doctor ID must be a number" });
  }
  const sql = "SELECT * FROM doctor WHERE LOWER(TRIM(name)) = ? AND doctor_id = ?";
  db.query(sql, [name, doctorId], (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (results.length === 1) {
      return res.json({ message: "Login successful", doctor: results[0] });
    } else {
      return res.status(401).json({ error: "Invalid doctor name or ID" });
    }
  });
});

// SIGNUP doctor
router.post("/signup", (req, res) => {
  const { name, specialization, contact, department_id } = req.body;
  if (!name || !specialization || !contact || !department_id) {
    return res.status(400).json({ error: "All fields required." });
  }
  const sql = `
    INSERT INTO doctor (name, specialization, contact, department_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [name, specialization, contact, department_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ doctor_id: result.insertId, name, specialization, contact, department_id });
  });
});


// =================== INVENTORY ROUTES ===================

const inventoryRouter = express.Router();

inventoryRouter.get("/", (req, res) => {
  db.query("SELECT * FROM inventoryitem", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

inventoryRouter.post("/", (req, res) => {
  const { item_name, quantity, expiration_date, status } = req.body;
  if (!item_name || !quantity || !expiration_date || !status) {
    return res.status(400).json({ error: "Missing inventory item details" });
  }
  const sql = `
    INSERT INTO inventoryitem (item_name, quantity, expiration_date, status)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [item_name, quantity, expiration_date, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, item_name, quantity, expiration_date, status });
  });
});

inventoryRouter.delete("/:id", (req, res) => {
  db.query("DELETE FROM inventoryitem WHERE item_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Item deleted" });
  });
});

// Optional: add PUT for inventory updates if needed, like you did for doctor.

module.exports = router;
module.exports.inventoryRouter = inventoryRouter;
