const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./database');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('frontpage')); 

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/login', (req, res) => res.sendFile(__dirname + '/login.html'));

app.get('/register', (req, res) => res.sendFile(__dirname + '/register.html'));

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required!');
    }

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
    [name, email, password], (err) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).send('Email already registered');
            }
            return res.status(500).send('Error registering user');
        }
        res.redirect('/login.html');
    });
});

// User Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        if (row) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// Server Start
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
