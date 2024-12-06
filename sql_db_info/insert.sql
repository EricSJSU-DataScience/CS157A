USE market;

-- Insert Users
INSERT INTO User (Name, Password, Role) VALUES
('Test User', 'hashedpassword0', 'Buyer'),
('Alice Smith', 'hashedpassword1', 'Buyer'),
('Bob Johnson', 'hashedpassword2', 'Seller'),
('Charlie Brown', 'hashedpassword3', 'Buyer'),
('Diana Prince', 'hashedpassword4', 'Seller');

-- Insert User Emails
INSERT INTO UserEmail (User_ID, Email) VALUES
(1, 'test@test.com'),
(2, 'alice@example.com'),
(3, 'bob@example.com'),
(4, 'charlie@example.com'),
(5, 'diana@example.com');

-- Insert Products
INSERT INTO Product (Title, Description, Price, Quantity) VALUES
('Smartphone', 'Latest model smartphone', 699.99, 10),
('Leather Jacket', 'Stylish black leather jacket', 149.99, 5),
('Cookbook', 'A guide to gourmet cooking', 24.99, 20),
('Blender', 'High-speed kitchen blender', 89.99, 8);

-- Link Products to Sellers
INSERT INTO ProductSeller (Product_ID, Seller_ID) VALUES
(1, 3),
(2, 5),
(3, 3),
(4, 5);

-- Insert Shopping Cart Items
INSERT INTO ShoppingCart (User_ID, Product_ID, Quantity) VALUES
(1, 1, 1),
(4, 2, 2),
(1, 3, 1);

-- Insert Auctions
INSERT INTO Auction (Starting_Price, End_Date, Product_ID) VALUES
(500.00, '2024-12-15', 1),
(100.00, '2024-12-20', 2);

-- Insert Bids
INSERT INTO Bid (Auction_ID, User_ID, Bid_Amount, Bid_Time) VALUES
(1, 3, 520.00, CURRENT_TIMESTAMP),
(1, 1, 530.00, CURRENT_TIMESTAMP),
(2, 3, 120.00, CURRENT_TIMESTAMP);

-- Insert Orders
INSERT INTO Orders (User_ID, Total_Amount, Payment_Status, Shipping_Status, Order_Date) VALUES
(1, 699.99, 'Paid', 'Shipping', '2024-11-01 10:00:00'),
(2, 299.98, 'Paid', 'Shipping', '2024-11-02 11:00:00'),
(3, 24.99, 'Paid', 'Shipping', '2024-11-03 12:00:00'),
(4, 449.50, 'Paid', 'Shipping', '2024-11-04 13:00:00');

-- Insert Order Items
INSERT INTO OrderItems (Order_ID, Product_ID, Quantity) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 1),
(4, 4, 5);

-- Insert Payments
INSERT INTO Payment (Payment_Order_ID, Payment_Amount, Payment_Method) VALUES
(1, 699.99, 'Credit Card'),
(2, 299.98, 'PayPal'),
(3, 24.99, 'Credit Card'),
(4, 449.50, 'PayPal');

-- Insert Order Shipping Details
INSERT INTO OrderShipping (Order_ID, User_ID, Shipping_Address, Tracking_Number, Shipping_Method, Shipping_Date, Delivery_Date) VALUES
(1, 1, '123 Main St, Springfield', 'TRACK123456', 'Express', '2024-11-20', '2024-11-22'),
(2, 2, '456 Elm St, Shelbyville', 'TRACK789012', 'Standard', '2024-11-21', '2024-11-25');

-- Insert Reviews
INSERT INTO Review (Order_ID, Review_Text, Rating) VALUES
(1, 'Great product, fast delivery!', 5),
(2, 'Satisfied with the purchase', 4);


-- Update Order Statuses
UPDATE Orders 
SET Shipping_Status = 'Shipped'
WHERE Order_ID = 1;

UPDATE Orders 
SET Shipping_Status = 'Delivered'
WHERE Order_ID = 2;
