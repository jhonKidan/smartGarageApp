import mysql from 'mysql2/promise';

const dbConfig = {
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);


async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export { query };