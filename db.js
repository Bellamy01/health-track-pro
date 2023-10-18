const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/health.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY,
      heartbeat INTEGER,
      body_temp REAL,
      patient_name TEXT,
      national_ID TEXT,
      recent_sickness TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      nationalID TEXT UNIQUE,
      role TEXT
    )
  `);

  db.run(`CREATE TABLE IF NOT EXISTS patient_recordings (
    id TEXT PRIMARY KEY,
    body_temperature REAL,
    heart_rate INTEGER,
    frequent_sickness TEXT,
    user_id TEXT,
    createdAt TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // db.run(`DROP TABLE IF EXISTS users`);
  //db.run(`DROP TABLE IF EXISTS patient_recordings`);
});

module.exports = db;