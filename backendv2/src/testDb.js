require("dotenv").config();
const pool = require("./config/db");

(async () => {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows);
  process.exit(0);
})();
