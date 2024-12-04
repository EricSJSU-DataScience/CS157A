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

/* Auction page */
//
app.get('/auctions', (req, res) => {
    const query = `
        SELECT 
            a.Auction_ID, 
            a.Product_ID, 
            a.Starting_Price, 
            a.End_Date, 
            p.Title, 
            p.Description, 
            p.Product_Type, 
            p.Status,
            p.Quantity,
            COALESCE(MAX(b.Bid_Amount), a.Starting_Price) AS Bid_Amount
        FROM Auction a
        JOIN Product p ON a.Product_ID = p.Product_ID
        LEFT JOIN Bid b ON a.Auction_ID = b.Auction_ID
        WHERE p.Product_Type = 'Auction' 
        AND p.Status = 'Available' -- Include only items marked as Available
		AND a.Auction_status = 'Open'
        GROUP BY a.Auction_ID;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching auctions:", err);
            res.status(500).json({ message: "Error fetching auctions" });
        } else {
            res.status(200).json(results);
        }
    });
});

app.put('/end-auction/:auctionId', (req, res) => {
    const auctionId = req.params.auctionId;

    const updateQuantityQuery = `
        UPDATE Product
        SET Quantity = Quantity - 1, 
            Status = CASE WHEN Quantity - 1 = 0 THEN 'Unavailable' ELSE 'Available' END
        WHERE Product_ID = (SELECT Product_ID FROM Auction WHERE Auction_ID = ?)
          AND Quantity > 0
    `;

    db.query(updateQuantityQuery, [auctionId], (err, results) => {
        if (err) {
            console.error('Error ending auction:', err);
            return res.status(500).json({ success: false, message: 'Error ending auction.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Auction not found or already ended.' });
        }

        res.status(200).json({ success: true, message: 'Auction ended successfully!' });
    });
});

// 
app.put('/products/:auctionId/update-quantity', (req, res) => {
    const auctionId = req.params.auctionId;

    // Decrement the Quantity and check if it should be marked as "Sold"
    const updateQuantityAndStatusQuery = `
        UPDATE Product
        SET 
            Quantity = Quantity,
            Status = CASE 
                WHEN Quantity - 1 = 0 THEN 'Sold' 
                ELSE 'Available' 
            END
        WHERE Product_ID = (SELECT Product_ID FROM Auction WHERE Auction_ID = ?) AND Quantity > 0
    `;

    db.query(updateQuantityAndStatusQuery, [auctionId], (err, result) => {
        if (err) {
            console.error('Error updating product quantity and status:', err);
            return res.status(500).json({ success: false, message: 'Error updating quantity and status.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No quantity left to update or product not found.' });
        }

        res.status(200).json({ success: true, message: 'Quantity updated and status checked successfully!' });
    });
});

app.post('/place-bid', (req, res) => {
    const { auctionId, userId, bidAmount } = req.body;

    // Check the latest bid for the auction
    const checkLatestBidQuery = `
        SELECT User_ID, Bid_Amount
        FROM Bid
        WHERE Auction_ID = ?
        ORDER BY Bid_Time DESC
        LIMIT 1
    `;
    db.query(checkLatestBidQuery, [auctionId], (err, results) => {
        if (err) {
            console.error('Error checking latest bid:', err);
            return res.status(500).json({ success: false, message: 'Error checking latest bid.' });
        }

        // If there is a latest bid, check if it belongs to the same user
        if (results.length > 0 && results[0].User_ID === userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot place multiple consecutive bids. Wait for another user to bid first.',
            });
        }

        // Insert or update the bid as per the existing logic
        const checkExistingBidQuery = `
            SELECT * FROM Bid WHERE Auction_ID = ? AND User_ID = ?
        `;
        db.query(checkExistingBidQuery, [auctionId, userId], (err, results) => {
            if (err) {
                console.error('Error checking existing bid:', err);
                return res.status(500).json({ success: false, message: 'Error checking existing bid.' });
            }


            if (results.length > 0) {
                // If a bid exists, update it
                const updateBidQuery = `
                    UPDATE Bid SET Bid_Amount = ?, Bid_Time = NOW()
                    WHERE Auction_ID = ? AND User_ID = ?
                `;
                db.query(updateBidQuery, [bidAmount, auctionId, userId], (err) => {
                    if (err) {
                        console.error('Error updating bid:', err);
                        return res.status(500).json({ success: false, message: 'Error updating bid.' });
                    }

                    // Update the auction's starting price
                    const updateAuctionQuery = 'UPDATE Auction SET Starting_Price = ? WHERE Auction_ID = ?';
                    db.query(updateAuctionQuery, [bidAmount, auctionId], (err) => {
                        if (err) {
                            console.error('Error updating auction price:', err);
                            return res.status(500).json({ success: false, message: 'Error updating auction price.' });
                        }

                        //handleQuantityUpdate(); // Decrement quantity after a successful bid

                        return res.status(200).json({ success: true, message: 'Bid updated successfully!' });
                    });
                });
            } else {
                // Insert a new bid if no existing bid is found
                const insertBidQuery = `
                    INSERT INTO Bid (Auction_ID, User_ID, Bid_Amount, Bid_Time)
                    VALUES (?, ?, ?, NOW())
                `;
                db.query(insertBidQuery, [auctionId, userId, bidAmount], (err) => {
                    if (err) {
                        console.error('Error placing bid:', err);
                        return res.status(500).json({ success: false, message: 'Error placing bid.' });
                    }

                    // Update the auction's starting price
                    const updateAuctionQuery = 'UPDATE Auction SET Starting_Price = ? WHERE Auction_ID = ?';
                    db.query(updateAuctionQuery, [bidAmount, auctionId], (err) => {
                        if (err) {
                            console.error('Error updating auction price:', err);
                            return res.status(500).json({ success: false, message: 'Error updating auction price.' });
                        }

                        //handleQuantityUpdate(); // Decrement quantity after a successful bid

                        return res.status(200).json({ success: true, message: 'Bid placed successfully!' });
                    });
                });
            }
        });
    });
});

app.put('/auctions/:auctionId/end', (req, res) => {
    const auctionId = req.params.auctionId;
	// Pre-Step: update Auction Status to 'Closed'
	const updateAuctionStatus = `
		UPDATE Auction AS a
		SET a.Auction_Status = 'Closed'
		WHERE a.Auction_ID = ?
	`;

	db.query(updateAuctionStatus, [auctionId], (err) => {
		if (err) {
			console.error('Error resetting auction price:', err);
			return res.status(500).json({ success: false, message: 'Error resetting auction price.' });
		}

		res.status(200).json({ success: true, message: 'Auction ended successfully and reset for a new round!' });
	});
});

app.get('/all-products', (req, res) => {
    const query = 'SELECT * FROM Product';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        res.status(200).json(results);
    });
});

/* Product Page */
// Fetch Products that is listing
app.get('/products', (req, res) => {
    const query = `
		SELECT * 
		FROM Product 
		WHERE Status = "Available" and Product_type = "Listing"
	`;
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

/* ShoppingCart Page */
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

app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT 
            p.Product_ID, 
            p.Title, 
            p.Description, 
			p.Product_Type,
            CASE 
                WHEN p.Product_Type = 'Auction' THEN (
                    SELECT MAX(b.Bid_Amount)
                    FROM Bid b
                    WHERE b.Auction_ID = (
                        SELECT Auction_ID 
                        FROM Auction a 
                        WHERE a.Product_ID = p.Product_ID
                        ORDER BY a.Auction_ID DESC LIMIT 1
                    )
                )
                ELSE p.Price
            END AS Price,
            sc.Quantity
        FROM ShoppingCart sc
        JOIN Product p ON sc.Product_ID = p.Product_ID
        WHERE sc.User_ID = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).json({ message: 'Error fetching cart items' });
        }
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
app.post('/place-order', (req, res) => {
    const { userId, shippingAddress, paymentMethod, shippingMethod } = req.body;
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
                INSERT INTO Orders (User_ID)
                VALUES (?)
            `;

            db.query(insertOrderQuery, [userId], (err, results) => {
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

                    // Step 6: Insert record into the Payment table
					// to be modify
                    const paymentAmountQuery = `
                        SELECT SUM(
        		   CASE
            		WHEN p.Product_Type = 'Auction' THEN 
                	(SELECT MAX(b.Bid_Amount) FROM Bid b WHERE b.Auction_ID = a.Auction_ID) 
            		ELSE 
                		p.Price * sc.Quantity
        		END
    			) AS TotalAmount
    			FROM ShoppingCart sc
    			JOIN Product p ON sc.Product_ID = p.Product_ID
    			LEFT JOIN Auction a ON p.Product_ID = a.Product_ID
    			WHERE sc.User_ID = ?
                    `;



                    db.query(paymentAmountQuery, [userId], (err, results) => {
                        if (err) {
                            console.error('Error calculating payment amount:', err);
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Error placing order' });
                            });
                        }

                        const totalAmount = results[0].TotalAmount;
                        const insertPaymentQuery = `
                            INSERT INTO Payment (Order_ID, Payment_Method, Payment_Amount)
                            VALUES (?, ?, ?)
                        `;

                        db.query(insertPaymentQuery, [orderId, paymentMethod, totalAmount], (err) => {
                            if (err) {
                                console.error('Error inserting payment record:', err);
                                return db.rollback(() => {
                                    res.status(500).json({ message: 'Error placing order' });
                                });
                            }

                            // Step 7: Insert record into the Shipping table
                            const insertShippingQuery = `
                                INSERT INTO Shipping (Order_ID, Shipping_Address, Shipping_Method, Tracking_Number)
                                VALUES (?, ?, ?, 'Not available yet')
                            `;

                            db.query(insertShippingQuery, [orderId, shippingAddress, shippingMethod], (err) => {
                                if (err) {
                                    console.error('Error inserting shipping record:', err);
                                    return db.rollback(() => {
                                        res.status(500).json({ message: 'Error placing order' });
                                    });
                                }

                                // Step 8: Delete the records from ShoppingCart
                                const deleteCartQuery = 'DELETE FROM ShoppingCart WHERE User_ID = ?';

                                db.query(deleteCartQuery, [userId], (err) => {
                                    if (err) {
                                        console.error('Error clearing shopping cart:', err);
                                        return db.rollback(() => {
                                            res.status(500).json({ message: 'Error placing order' });
                                        });
                                    }

                                    // Step 9: Commit the transaction
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
        });
    });
});

/* Order page */
// Fetch orders for a user
app.get('/orders/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT o.Order_ID, o.Order_Date, p.Payment_Amount, p.Payment_Status, 
		  s.Shipping_Address, s.Shipping_Method, s.Shipping_Status, s.Tracking_Number
		FROM Orders AS o
		LEFT JOIN Payment AS p ON o.Order_ID = p.Order_ID
		LEFT JOIN Shipping AS s ON o.Order_ID = s.Order_ID
		WHERE o.User_ID = ?
		ORDER BY o.Order_ID DESC;
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

/* Shipping page */
// Mark an shipping status as shipped
app.put('/orders/:orderId/shipping-status/mark-shipped', (req, res) => {
    const orderId = req.params.orderId;
	const trackingNumber = `TRACK${Math.floor(100000 + Math.random() * 900000)}`;
    const query = `
		UPDATE Shipping
		SET Shipping_Status = 'Shipped', Tracking_Number = ?, Shipping_Date = CURRENT_TIMESTAMP
		WHERE Order_ID = ?
	`;
	// TO-DO: add query for shipping table
    db.query(query, [trackingNumber, orderId], (err, results) => {
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

// Mark an shipping status as delivered
app.put('/orders/:orderId/shipping-status/mark-delivered', (req, res) => {
    const orderId = req.params.orderId;
    const updateOrderQuery = `
		UPDATE Shipping 
		SET Shipping_Status = 'Delivered', Delivery_Date = CURRENT_TIMESTAMP
		WHERE Order_ID = ?
	`;

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

/* Payment page */
// Mark an payment status as paid
app.put('/orders/:orderId/payment-status/mark-paid', (req, res) => {
    const orderId = req.params.orderId;
    const updateOrderQuery = `
		UPDATE Payment 
		SET Payment_Status = 'Paid', Payment_Date = CURRENT_TIMESTAMP
		WHERE Order_ID = ?
	`;

    // Update the order payment status to 'Paid'
    db.query(updateOrderQuery, [orderId], (err, results) => {
        if (err) {
            console.error('Error updating payment status to paid:', err);
            return res.status(500).json({ success: false, message: 'Error updating payment status to paid' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order marked as paid' });
    });
});

/* Review page */
// Fetch reviews 
app.get('/show-review/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT r.Product_ID, r.Order_ID, r.Review_Status, r.Rating, r.Review_Text, r.Review_Date, p.Title AS Product_Title
		FROM Review AS r
		JOIN Product AS p ON r.Product_ID = p.Product_ID
		JOIN Orders AS o ON r.Order_ID = o.Order_ID
		WHERE o.User_ID = ?;
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
    const { productId, orderId, rating, reviewText } = req.body;

    // Validate the required fields
    if (!productId || !orderId) {
        return res.status(400).json({ message: 'Product ID and Order ID are required' });
    }

    // Update query to modify the review in the Review table if it exists
    const query = `
        UPDATE Review
        SET Rating = ?, Review_Text = ?, Review_Status = 'Rated', Review_Date = CURRENT_TIMESTAMP
        WHERE Product_ID = ? AND Order_ID = ?
    `;

    const values = [rating || null, reviewText || null, productId, orderId];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating review:', err);
            return res.status(500).json({ message: 'Error updating review' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Fetch the updated review details to send back to the client
        const selectQuery = `
            SELECT Product_ID, Order_ID, Rating, Review_Text, Review_Status, Review_Date
            FROM Review
            WHERE Product_ID = ? AND Order_ID = ?
        `;

        db.query(selectQuery, [productId, orderId], (err, updatedResults) => {
            if (err) {
                console.error('Error fetching updated review:', err);
                return res.status(500).json({ message: 'Error fetching updated review' });
            }

            // Respond with a success message and updated data
            res.status(200).json({
                message: 'Review updated successfully',
                ...updatedResults[0], // Send back the updated review details
            });
        });
    });
});

/* Notifacation page */
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
