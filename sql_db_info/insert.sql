INSERT INTO User VALUES
(1, 'Alice Smith', 'alice@example.com', 'password123', '123 Main St', '1234567890', 'Seller'),
(2, 'Bob Jones', 'bob@example.com', 'password456', '456 Oak St', '0987654321', 'Buyer');

INSERT INTO Product VALUES
(1, 'Laptop', 'Gaming Laptop', 999.99, 1, 1, 10, '2024-10-01', 'Available');

INSERT INTO Auction VALUES
(1, 1, 500.00, '2024-11-01', NULL);

INSERT INTO Bid VALUES
(1, 1, 2, 600.00, '2024-10-20 14:30:00');

INSERT INTO Orders VALUES
(1, 1, 2, '2024-10-22', 1, 999.99, 'Paid');

INSERT INTO Payment VALUES
(1, 1, 'Credit Card', '2024-10-22', 999.99);


INSERT INTO Review VALUES
(1, 1, 2, 5, 'Great product!', '2024-10-23');

INSERT INTO Category VALUES
(1, 'Electronics', 'Electronic devices and accessories');

INSERT INTO Shipping VALUES
(1, 1, '123 Main St', 'Express', '2024-10-23', '2024-10-25');

INSERT INTO Notification VALUES
(1, 2, 'Your bid was accepted', '2024-10-20', 'Unread');