const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// ✅ MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "YeMariam@212324252627",
  database: "hospitaldb",
});

// ✅ GET all inventory items
router.get("/", (req, res) => {
  console.log("📥 GET /api/inventory HIT");
  db.query("SELECT * FROM inventoryitem", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ ADD new inventory item (no status column in DB)
router.post("/", (req, res) => {
  const { name, quantity, expiration_date } = req.body;
  console.log("📤 POST /api/inventory BODY:", req.body);

  if (!name || quantity === undefined || !expiration_date) {
    return res.status(400).json({ error: "Missing inventory information" });
  }

  const sql = `
    INSERT INTO inventoryitem (name, quantity, expiration_date)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, quantity, expiration_date], (err, result) => {
    if (err) {
      console.error("❌ Insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({
      item_id: result.insertId,
      name,
      quantity,
      expiration_date,
    });
  });
});

// ✅ DELETE inventory item
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM inventoryitem WHERE item_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Inventory item deleted" });
  });
});
// ✅ UPDATE inventory item
router.put("/:id", (req, res) => {
  const { name, quantity, expiration_date } = req.body;

  if (!name || quantity === undefined || !expiration_date) {
    return res.status(400).json({ error: "Missing update information" });
  }

  const sql = `
    UPDATE inventoryitem
    SET name = ?, quantity = ?, expiration_date = ?
    WHERE item_id = ?
  `;

  db.query(sql, [name, quantity, expiration_date, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Inventory item updated" });
  });
});

// ✅ Export router for server.js
module.exports = router;
