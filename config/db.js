const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

/* const client = new Client(process.env.DATABASE_URL); */
const pool = new Pool(databaseConfig);

module.exports = pool;
