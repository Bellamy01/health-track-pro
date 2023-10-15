const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/health.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
            id STRING PRIMARY KEY,
            heartbeat INTEGER,
            body_temp REAL,
            patient_name TEXT,
            national_ID TEXT,
            recent_sickness TEXT
        )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id STRING PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      nationalID TEXT UNIQUE,
      role TEXT
    )
  `);
});

module.exports = db;