// backend/departmentRoutes.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// DB connection (reuse details, or require from db.js if you have that setup)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YeMariam@212324252627",
  database: "hospitaldb",
});

// GET all departments
router.get("/", (req, res) => {
  db.query("SELECT * FROM department", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
