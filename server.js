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

/* // Place an order
app.post('/place-order', (req, res) => {
    const { userId, shippingAddress } = req.body;

    // Start a transaction 
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ message: 'Error placing order' });
        }
		// using commit and rollback reference
		// https://www.digitalocean.com/community/tutorials/sql-commit-sql-rollback?form=MG0AV3
        // Step 1: Insert a new record into the Orders table
        const insertOrderQuery = `
            INSERT INTO Orders (User_ID, Shipping_Address, Total_Amount)
            SELECT sc.User_ID, ?, SUM(p.Price * sc.Quantity)
            FROM ShoppingCart sc
            JOIN Product p ON sc.Product_ID = p.Product_ID
            WHERE sc.User_ID = ?
            GROUP BY sc.User_ID
        `;

        db.query(insertOrderQuery, [shippingAddress, userId], (err, results) => {
            if (err) {
                console.error('Error inserting order:', err);
                return db.rollback(() => {
                    res.status(500).json({ message: 'Error placing order' });
                });
            }

            // Step 2: Get the newly generated Order_ID
            const orderId = results.insertId;

            // Step 3: Insert records into the OrderItems table for each item in the ShoppingCart
            const insertOrderItemsQuery = `
                INSERT INTO OrderItems (Order_ID, Product_ID, Quantity)
                SELECT ?, sc.Product_ID, sc.Quantity
                FROM ShoppingCart sc
                WHERE sc.User_ID = ?
            `;

            db.query(insertOrderItemsQuery, [orderId, userId], (err) => {
                if (err) {
                    console.error('Error inserting order items:', err);
                    return db.rollback(() => {
                        res.status(500).json({ message: 'Error placing order' });
                    });
                }

                // Step 4: Delete the records from ShoppingCart
                const deleteCartQuery = 'DELETE FROM ShoppingCart WHERE User_ID = ?';

                db.query(deleteCartQuery, [userId], (err) => {
                    if (err) {
                        console.error('Error clearing shopping cart:', err);
                        return db.rollback(() => {
                            res.status(500).json({ message: 'Error placing order' });
                        });
                    }

                    // Commit the transaction
                    db.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Error placing order' });
                            });
                        }

                        res.status(200).json({ message: 'Order placed successfully' });
                    });
                });
            });
        });
    });
});
 */

app.post('/place-order', (req, res) => {
    const { userId, shippingAddress } = req.body;
    // Step 1: Check if enough product quantity is available
    const checkProductQuantityQuery = `
        SELECT p.Product_ID, p.Quantity, sc.Quantity AS CartQuantity
        FROM ShoppingCart sc
        JOIN Product p ON sc.Product_ID = p.Product_ID
        WHERE sc.User_ID = ?
        HAVING p.Quantity >= sc.Quantity
    `;
    db.query(checkProductQuantityQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error checking product quantities:', err);
            return res.status(500).json({ message: 'Error placing order' });
        }
        // If no results are returned, it means there is insufficient stock for at least one product
        if (results.length === 0) {
            return res.status(400).json({ message: 'One or more products in your cart are out of stock or not enough quantity available' });
        }
        // Step 2: Start the transaction to place an order
        db.beginTransaction((err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ message: 'Error placing order' });
            }
            // Step 3: Insert the order record into the Orders table
            const insertOrderQuery = `
                INSERT INTO Orders (User_ID, Shipping_Address, Total_Amount)
                SELECT sc.User_ID, ?, SUM(p.Price * sc.Quantity)
                FROM ShoppingCart sc
                JOIN Product p ON sc.Product_ID = p.Product_ID
                WHERE sc.User_ID = ?
                GROUP BY sc.User_ID
            `;

            db.query(insertOrderQuery, [shippingAddress, userId], (err, results) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return db.rollback(() => {
                        res.status(500).json({ message: 'Error placing order' });
                    });
                }

                // Step 4: Get the newly generated Order_ID
                const orderId = results.insertId;

                // Step 5: Insert records into the OrderItems table for each item in the ShoppingCart
                const insertOrderItemsQuery = `
                    INSERT INTO OrderItems (Order_ID, Product_ID, Quantity)
                    SELECT ?, sc.Product_ID, sc.Quantity
                    FROM ShoppingCart sc
                    WHERE sc.User_ID = ?
                `;

                db.query(insertOrderItemsQuery, [orderId, userId], (err) => {
                    if (err) {
                        console.error('Error inserting order items:', err);
                        return db.rollback(() => {
                            res.status(500).json({ message: 'Error placing order' });
                        });
                    }

                    // Step 6: Delete the records from ShoppingCart
                    const deleteCartQuery = 'DELETE FROM ShoppingCart WHERE User_ID = ?';

                    db.query(deleteCartQuery, [userId], (err) => {
                        if (err) {
                            console.error('Error clearing shopping cart:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Error placing order' });
                            });
                        }

                        // Step 7: Commit the transaction
                        db.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                return db.rollback(() => {
                                    res.status(500).json({ message: 'Error placing order' });
                                });
                            }

                            res.status(200).json({ message: 'Order placed successfully' });
                        });
                    });
                });
            });
        });
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
	// console.log(`Orders fetched for user: ${userId}`);
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        //console.log('Orders fetched for user:', results); // Log to see if data is correct
        res.status(200).json(results);
    });
});

// Mark an order as shipped
app.put('/orders/:orderId/shipping-status/mark-shipped', (req, res) => {
    const orderId = req.params.orderId;
    const query = `UPDATE Orders SET Shipping_Status = 'Shipped' WHERE Order_ID = ?`;
	// TO-DO: add query for shipping table
    db.query(query, [orderId], (err, results) => {
        if (err) {
            console.error('Error marking order as shipped:', err);
            return res.status(500).json({ success: false, message: 'Error updating shipping status to shipped' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order marked as shipped' });
    });
});

// Mark an order as delivered
app.put('/orders/:orderId/shipping-status/mark-delivered', (req, res) => {
    const orderId = req.params.orderId;
    const updateOrderQuery = `UPDATE Orders SET Shipping_Status = 'Delivered' WHERE Order_ID = ?`;

    // Update the order shipping status to 'Delivered'
    db.query(updateOrderQuery, [orderId], (err, results) => {
        if (err) {
            console.error('Error updating shipping status to delivered:', err);
            return res.status(500).json({ success: false, message: 'Error updating shipping status to delivered' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order marked as delivered' });
    });
});


// Fetch reviews for a user
app.get('/show-review/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT r.Review_ID, r.Product_ID, r.Order_ID, r.Review_Status, r.Rating, r.Review_Text, r.Review_Date, p.Title AS Product_Title
        FROM Review AS r
        JOIN Product AS p ON r.Product_ID = p.Product_ID
        WHERE r.User_ID = ?
    `;
    
    db.query(query, [userId], (err, results) => {
		// console.log('Number of records found:', results.length);
        if (err) {
            console.error('Error fetching reviews for user:', err);
            return res.status(500).json({ message: 'Error fetching reviews for user' });
        }
        
        res.status(200).json(results);
    });
});

// submit a review
app.put('/submit-review', (req, res) => {
    const { userId, productId, orderId, rating, reviewText } = req.body;

    // Validate the required fields
    if (!userId || !productId || !orderId) {
        return res.status(400).json({ message: 'User ID, Product ID, and Order ID are required' });
    }

    // Update query to modify the review in the Review table if it exists
    const query = `
        UPDATE Review
        SET Rating = ?, Review_Text = ?, Review_Status = ?
        WHERE User_ID = ? AND Product_ID = ? AND Order_ID = ?
    `;

    const reviewStatus = rating ? 'Rated' : 'Pending';
    const values = [rating || null, reviewText || null, reviewStatus, userId, productId, orderId];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating review:', err);
            return res.status(500).json({ message: 'Error updating review' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Review updated successfully' });
    });
});

// Fetch Notifications for a User
app.get('/notifications/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT n.notification_id, n.message, n.notification_Date, n.status
        FROM notification AS n
        WHERE n.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ message: 'Error fetching notifications' });
        }
		// console.log(`Number of notifications found for user ${userId}:`, results.length);
        res.status(200).json(results);
    });
});

// update notification to 'Read'
app.put('/notifications/:notificationId/mark-read', (req, res) => {
    const { notificationId } = req.params;

    const query = `
        UPDATE Notification
        SET Status = 'Read'
        WHERE Notification_ID = ?
    `;

    db.query(query, [notificationId], (err, results) => {
        if (err) {
            console.error('Error updating notification status:', err);
            return res.status(500).json({ message: 'Error updating notification status' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification status updated to Read' });
    });
});




// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
