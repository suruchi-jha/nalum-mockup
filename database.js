const sqlite3 = require('sqlite3').verbose();

// Connecting to SQLite Database
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database');
    }
});

// Creating the Users Table (if not exists)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating table:', err.message);
        } else {
            console.log('✅ Users table ready');
        }
    });
});

module.exports = db;
