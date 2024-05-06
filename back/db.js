const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "movez",
  password: "movez",
  host: "4.156.32.216",
  port: 5432,
  database: "balance"
});




module.exports = pool;