// leadtests/test-db.spec.js

const { test, expect } = require('@playwright/test');
const mysql = require('mysql2/promise');
require('dotenv').config(); // ensure .env is loaded

test('Check MySQL connection', async () => {
  try {
    console.log('Connecting with:', {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USERNAME,
      database: process.env.MYSQL_DATABASE
    });

    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      // uncomment if remote DB requires SSL
      // ssl: { rejectUnauthorized: true }
    });

    const [rows] = await conn.query('SELECT 1 + 1 AS result');
    console.log('DB result:', rows);

    expect(rows[0].result).toBe(2);

    await conn.end();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    throw err;
  }
});

