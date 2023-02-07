const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
	database: "postgres",
	host: "db1",
	password: "itw4ffKB4wgAGN1rBcAe6TJj",
	user: "root",
	port: 5432,
});

module.exports = pool;
