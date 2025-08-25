// utils/dbHelper.js
const mysql = require('mysql2/promise');

async function queryDB({ host, port, user, password, database }, sql, params = []) {
  const conn = await mysql.createConnection({ host, port, user, password, database });
  const [rows] = await conn.execute(sql, params);
  await conn.end();
  return rows;
}

module.exports = { queryDB };
