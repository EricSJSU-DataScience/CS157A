INSERT INTO User VALUES
(1, 'Alice Smith', 'alices@example.com', 'password1', '123 Main St, Springfield', '1000123456', 'Seller'),
(2, 'Bob Jones', 'bobj@example.com', 'password2', '456 Oak St, Springfield', '1000789432', 'Seller'),
(3, 'Michael Johnson', 'mjohnson@example.com', 'password3', '789 Elm St, Springfield', '1000432178', 'Seller'),
(4, 'Emily Davis', 'edavis@example.com', 'password4', '101 Maple Ave, Springfield', '1000654321', 'Seller'),
(5, 'William Brown', 'wbrown@example.com', 'password5', '202 Birch Blvd, Springfield', '1000987654', 'Seller'),
(6, 'Ava Wilson', 'awilson@example.com', 'password6', '303 Pine Dr, Springfield', '1000234876', 'Buyer'),
(7, 'James Anderson', 'janderson@example.com', 'password7', '404 Cedar Ln, Springfield', '1000789123', 'Buyer'),
(8, 'Sophia Martinez', 'smartinez@example.com', 'password8', '505 Aspen St, Springfield', '1000345678', 'Buyer'),
(9, 'Oliver Garcia', 'ogarcia@example.com', 'password9', '606 Redwood Rd, Springfield', '1000567894', 'Buyer'),
(10, 'Mia Rodriguez', 'mrodriguez@example.com', 'password10', '707 Spruce St, Springfield', '1000456789', 'Buyer');



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