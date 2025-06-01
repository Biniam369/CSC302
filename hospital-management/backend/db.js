const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "YeMariam@212324252627", // Your MySQL password
  database: "hospitaldb",            // Your actual DB name
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database!");
});

module.exports = db;
