// logger.js
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "playwright.log");

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
  console.log(message); // optional, to still see in console
}

module.exports = { log };