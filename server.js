const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./database');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files like HTML & CSS

app.get('/login.html', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/register.html', (req, res) => res.sendFile(__dirname + '/public/register.html'));

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err) => {
        if (err) {
            return res.status(500).send('Error registering');
        }
        res.redirect('/login.html');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (row) {
            res.send('Login successful!');
        } else {
            res.send('Invalid credentials');
        }
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
