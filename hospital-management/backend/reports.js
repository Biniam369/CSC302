const express = require("express");
const router = express.Router();
const db = require("./db"); // Update this if your db connection file is named differently

// 1. Patient Visit Trends (by month, last 3 years)
router.get("/visit-trends", (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(date, '%Y-%m') AS month,
      COUNT(*) AS visits
    FROM appointment
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 3 YEAR)
    GROUP BY month
    ORDER BY month ASC;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Top 2 Departments by Revenue (last year)
router.get("/top-departments", (req, res) => {
  const sql = `
    SELECT 
      Department.name AS department,
      SUM(Appointment.appointment_cost) AS revenue
    FROM Billing
    JOIN Appointment ON Billing.appointment_id = Appointment.appointment_id
    JOIN Doctor ON Appointment.doctor_id = Doctor.doctor_id
    JOIN Department ON Doctor.department_id = Department.department_id
    WHERE Billing.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    GROUP BY Department.name
    ORDER BY revenue DESC
    LIMIT 2;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// 3. Top 2 Doctors by Patient Volume (last year)
router.get("/top-doctors", (req, res) => {
  const sql = `
    SELECT doc.name AS doctor, COUNT(DISTINCT a.patient_id) AS patientCount
    FROM appointment a
    JOIN doctor doc ON a.doctor_id = doc.doctor_id
    WHERE a.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    GROUP BY doc.doctor_id
    ORDER BY patientCount DESC
    LIMIT 2;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 4. Medication Usage and Supply Report (date range, by supplier)
router.get("/med-usage", (req, res) => {
  const { start = "2024-01-01", end = "2024-12-31" } = req.query;
  const sql = `
    SELECT
        s.name AS supplier,
        m.name AS medication,
        COUNT(DISTINCT pr.patient_id) AS patients,
        COUNT(pr.prescription_id) AS used
        FROM supplieritem si
        JOIN supplier s ON si.supplier_id = s.supplier_id
        JOIN medication m ON si.item_id = m.medication_id
        JOIN prescription pr ON pr.medication_id = m.medication_id
        WHERE pr.date BETWEEN '2024-01-01' AND '2024-12-31'
        GROUP BY s.supplier_id, m.medication_id
        ORDER BY used DESC
        LIMIT 10;

  `;
  db.query(sql, [start, end], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// 5. Monthly Surgery Volume (by month)
router.get("/surgery-volume", (req, res) => {
  // This assumes that treatment table has surgery entries (e.g., by code/description)
  // If all treatments are surgeries, this is fine.
  // If not, add a WHERE filter for code/description LIKE '%surgery%'
  const sql = `
    SELECT 
      DATE_FORMAT(a.date, '%Y-%m') AS month,
      COUNT(*) AS surgeries
    FROM appointment a
    JOIN treatment t ON a.appointment_id = t.treatment_id
    WHERE a.date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    GROUP BY month
    ORDER BY month ASC;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 6. Inventory Shelf-Life Report (longest by supplier)
router.get("/shelf-life", (req, res) => {
  // Calculate the average shelf-life per supplier (supply_date to expiration_date)
  // Assumes supplieritem table has supply_date and expiration_date
  const sql = `
    SELECT 
      s.name AS supplier,
      AVG(DATEDIFF(si.expiration_date, si.supply_date)) AS avgDays
    FROM supplieritem si
    JOIN supplier s ON si.supplier_id = s.supplier_id
    WHERE si.expiration_date IS NOT NULL AND si.supply_date IS NOT NULL
    GROUP BY s.supplier_id
    ORDER BY avgDays DESC
    LIMIT 5;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
