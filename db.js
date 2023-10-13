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
});

module.exports = db;