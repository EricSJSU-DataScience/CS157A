USE market;

-- Insert data into User table
INSERT INTO User (Name, Email, Password, Phone, Role) VALUES
('test', 'test@test.com', '111', '3416789012', 'Buyer'),
('Alice Smith', 'alice@example.com', '111', '1234567890', 'Buyer'),
('Bob Johnson', 'bob@example.com', 'hashedpassword2', '2345678901', 'Seller'),
('Charlie Brown', 'charlie@example.com', 'hashedpassword3', '3456789012', 'Buyer'),
('Diana Prince', 'diana@example.com', 'hashedpassword4', '4567890123', 'Seller');

-- Insert data into Product table
INSERT INTO Product (Title, Description, Price, Seller_ID, Quantity) VALUES
('Smartphone', 'Latest model smartphone', 699.99, 2, 10),
('Leather Jacket', 'Stylish black leather jacket', 149.99, 4, 5),
('Cookbook', 'A guide to gourmet cooking', 24.99, 2, 20),
('Blender', 'High-speed kitchen blender', 89.99, 4, 8);

-- Insert data into ShoppingCart table
INSERT INTO ShoppingCart (User_ID, Product_ID, Quantity) VALUES
(1, 1, 1),
(3, 2, 2),
(1, 3, 1);

-- Insert data into Auction table
INSERT INTO Auction (Product_ID, Starting_Price, End_Date) VALUES
(1, 500.00, '2024-12-15'),
(2, 100.00, '2024-12-20');

-- Insert data into Bid table
INSERT INTO Bid (Auction_ID, User_ID, Bid_Amount) VALUES
(1, 3, 520.00),
(1, 1, 530.00),
(2, 3, 120.00);

-- Insert data into Orders table
INSERT INTO Orders (User_ID, Product_ID, Quantity, Total_Amount, Payment_Status, Shipping_Status) VALUES
(1, 1, 1, 699.99, 'Paid', 'Shipped'),
(3, 2, 1, 149.99, 'Pending', 'Pending');

-- Insert data into Payment table
INSERT INTO Payment (Order_ID, Payment_Method, Payment_Amount) VALUES
(1, 'Credit Card', 699.99),
(2, 'PayPal', 149.99);

-- Insert data into Review table
INSERT INTO Review (Product_ID, User_ID, Rating, Review_Text) VALUES
(1, 1, 5, 'Excellent product!'),
(2, 3, 4, 'Very stylish and comfortable'),
(3, 1, 3, 'Decent content but could be better');

-- Insert data into Shipping table
INSERT INTO Shipping (Order_ID, Shipping_Address, Shipping_Info, Shipping_Method, Tracking_Number, Shipping_Date, Delivery_Date) VALUES
(1, '123 Main St, Springfield', 'Leave at front door', 'Express', 'TRACK123456', '2024-11-20', '2024-11-22'),
(2, '456 Elm St, Metropolis', 'Ring doorbell on arrival', 'Standard', 'TRACK789012', '2024-11-21', '2024-11-25');

-- Insert data into Notification table
INSERT INTO Notification (User_ID, Message, Status) VALUES
(1, 'Your order has been shipped', 'Unread'),
(3, 'New bid placed on your auction', 'Read');


INSERT INTO Orders (User_ID, Product_ID, Shipping_Address, Quantity, Total_Amount, Payment_Status, Shipping_Status)
VALUES (5, 2, '123 Example St, Example City, EX 12345', 1, 699.99, 'Paid', 'Delivered');
INSERT INTO OrderItems (Order_ID, Product_ID, Quantity)
VALUES (LAST_INSERT_ID(), 1, 2);
