require("dotenv").config();
const express = require("express");
const pool = require("./src/config/db");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT 'Backend is alive' AS status");
  res.json(result.rows[0]);
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
