const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Modern way to handle JSON requests

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234567', // Replace with your MySQL password
    database: 'market',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// User Registration
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const query = 'INSERT INTO User (Name, Email, Password, Role) VALUES (?, ?, ?, "Buyer")';
    db.query(query, [name, email, password], (err, results) => {
        if (err) {
            console.error('Error registering user:', err.message);
            return res.status(500).json({ message: 'Registration failed' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM User WHERE Email = ? AND Password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Fetch Products
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM Product WHERE Status = "Available"';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.status(200).json(results);
    });
});

// Add to Cart
app.post('/add-to-cart', (req, res) => {
    const { userId, productId, quantity } = req.body;
    const query = `
        INSERT INTO ShoppingCart (User_ID, Product_ID, Quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity)
    `;
    db.query(query, [userId, productId, quantity], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding to cart' });
        res.status(201).json({ message: 'Product added to cart' });
    });
});

// Fetch cart items for checkout
app.get('/checkout/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT p.Product_ID, p.Title, p.Description, p.Price, sc.Quantity
        FROM ShoppingCart sc
        JOIN Product p ON sc.Product_ID = p.Product_ID
        WHERE sc.User_ID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching checkout items:', err);
            return res.status(500).json({ message: 'Error fetching checkout items' });
        }
        res.status(200).json(results);
    });
});

// Fetch Cart Items for a User
app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT p.Product_ID, p.Title, p.Description, p.Price, sc.Quantity
        FROM ShoppingCart sc
        JOIN Product p ON sc.Product_ID = p.Product_ID
        WHERE sc.User_ID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching cart items' });
        res.status(200).json(results);
    });
});

// Delete an item from the cart
app.delete('/cart/delete', (req, res) => {
    const { userId, productId } = req.body;
    const query = 'DELETE FROM ShoppingCart WHERE User_ID = ? AND Product_ID = ?';
    db.query(query, [userId, productId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting item from cart' });
        res.status(200).json({ message: 'Item deleted successfully' });
    });
});

// Place an order
// Place an order
app.post('/place-order', (req, res) => {
    const { userId, cartItems, paymentMethod, shippingAddress, totalCost } = req.body;

    // Loop through the cart items and insert each one into the Orders table
    const orderQueries = cartItems.map(item => {
        return new Promise((resolve, reject) => {
            const orderQuery = `
                INSERT INTO Orders (User_ID, Product_ID, Shipping_Address, Quantity, Total_Amount, Payment_Status, Shipping_Status)
                VALUES (?, ?, ?, ?, ?, 'Paid', 'Pending')
            `;
            db.query(orderQuery, [userId, item.Product_ID, shippingAddress, item.Quantity, totalCost], (err, results) => {
                if (err) {
                    console.error('Error placing order:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });

    // Execute all the order insertion promises
    Promise.all(orderQueries)
        .then(() => {
            // Clear the shopping cart for the user after all orders are placed successfully
            const clearCartQuery = 'DELETE FROM ShoppingCart WHERE User_ID = ?';
            db.query(clearCartQuery, [userId], (err) => {
                if (err) {
                    console.error('Error clearing cart:', err);
                    return res.status(500).json({ message: 'Error clearing cart' });
                }
                res.status(200).json({ message: 'Order placed successfully' });
            });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error placing order' });
        });
});


// Fetch orders for a user
app.get('/orders/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT Order_ID, Total_Amount, Payment_Status, Shipping_Status
        FROM Orders
        WHERE User_ID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        //console.log('Orders fetched for user:', results); // Log to see if data is correct
        res.status(200).json(results);
    });
});

// Fetch products eligible for review
app.get('/products-to-review/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT p.Product_ID, p.Title, p.Description
        FROM Product AS p
        JOIN Orders AS o ON p.Product_ID = o.Product_ID
        JOIN OrderItems AS oi ON o.Order_ID = oi.Order_ID
        WHERE o.User_ID = ? AND o.Shipping_Status = 'Delivered'
        GROUP BY p.Product_ID, p.Title, p.Description
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching products to review:', err);
            return res.status(500).json({ message: 'Error fetching products to review' });
        }
        console.log('Products fetched for review:', results); // Log the results
        res.status(200).json(results);
    });
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
