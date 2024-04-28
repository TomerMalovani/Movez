const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "movezSadna",
  host: "localhost",
  port: 5432,
  database: "movez"
});

module.exports = pool;