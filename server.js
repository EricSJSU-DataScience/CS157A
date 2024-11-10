const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors');
app.use(cors());
// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with localhost user
  password: 'sql+016886922', // replace with localhost password
  database: 'marketplace_database', // Replace with your database name
  port: 3306 // replace with port in MySQL workbench 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM User WHERE Email = ? AND Password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error connecting to the database');
    } else if (results.length > 0) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  });
});
// Register Endpoint
app.post('/register', (req, res) => {
    const { name, email, password, address, phone, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = 'INSERT INTO User (Name, Email, Password, Address, Phone, Role) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, address, phone, role], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});


// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});