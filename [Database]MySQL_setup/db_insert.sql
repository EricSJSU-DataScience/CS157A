USE market;

-- Insert data into User table
INSERT INTO User (Name, Email, Password, Phone, Role) VALUES
('test', 'test@test.com', '111', '3416789012', 'Buyer'),
('Alice Smith', 'alice@example.com', 'hashedpassword1', '1234567890', 'Buyer'),
('Bob Johnson', 'bob@example.com', 'hashedpassword2', '2345678901', 'Buyer'),
('Charlie Brown', 'charlie@example.com', 'hashedpassword3', '3456789012', 'Buyer'),
('Diana Prince', 'diana@example.com', 'hashedpassword4', '4567890123', 'Seller');

-- Insert data into Product table
INSERT INTO Product (Title, Description, Price, Seller_ID, Quantity) VALUES
('US M4 Tank Model', 'The M4 Sherman is one of the most iconic medium tanks used by the United States and its allies during World War II. Named after the famous American Civil War general William T. Sherman', 299.99, 5, 20),
('Smartphone', 'A latest model smartphone featuring cutting-edge technology and a sleek, modern design.', 699.99, 5, 10),
('Leather Jacket', 'A stylish black leather jacket made from premium quality leather, perfect for all seasons.', 149.99, 5, 5),
('Cookbook', 'A comprehensive guide to gourmet cooking, filled with delicious recipes and cooking tips.', 24.99, 5, 20),
('Blender', 'A high-speed kitchen blender that blends, purees, and pulverizes ingredients to perfection.', 89.99, 5, 15),
('Mechanical Keyboard', 'A high-quality mechanical keyboard with RGB backlighting, durable switches, and ergonomic design.', 99.99, 5, 25),
('Aviator Sunglasses', 'Classic aviator-style sunglasses with UV400 protection, suitable for outdoor activities and everyday wear.', 29.99, 5, 40);

INSERT INTO Product (Title, Description, Price, Seller_ID, Quantity, Product_type)
VALUES
('Crystal Chandelier', 'A luxurious crystal chandelier that adds elegance to any room.', 500.00, 5, 5, 'Auction'),
('Vintage Record Player', 'A classic record player with a modern touch, perfect for audiophiles.', 600.00, 5, 10, 'Auction'),
('Smart Home Speaker', 'A voice-controlled speaker with advanced AI features.', 120.00, 5, 1, 'Auction'),
('Eco-friendly Electric Scooter', 'A lightweight and eco-friendly electric scooter with a 50-mile range.', 800.00, 5, 2, 'Auction'),
('Antique Pocket Watch', 'A beautifully crafted antique pocket watch from the early 1900s.', 900.00, 5, 1, 'Auction');


-- Insert data into ShoppingCart table
INSERT INTO ShoppingCart (User_ID, Product_ID, Quantity) VALUES
(1, 1, 1),
(3, 2, 2),
(1, 3, 1);

-- Insert data into Auction table -- handle by trigger upon Auction type Product insert
-- INSERT INTO Auction (Product_ID, Starting_Price, End_Date) VALUES



-- Insert data into Orders table
INSERT INTO Orders (User_ID) VALUES
(1),
(2),
(3),
(4);

-- Insert data into OrderItems table
INSERT INTO OrderItems (Order_ID, Product_ID, Quantity) VALUES
(1, 2, 1),
(2, 3, 2),
(3, 4, 1),
(4, 5, 5);

-- Insert data into Payment table
INSERT INTO Payment (Order_ID, Payment_Method, Payment_Amount) VALUES
(1, 'Credit Card', 699.99),
(2, 'PayPal', 299.98),
(3, 'Credit Card', 24.99),
(4, 'PayPal', 449.5);

-- Insert data into Review table
-- Review create upon order 'Delivered'

-- Insert data into Shipping table
INSERT INTO Shipping (Order_ID, Shipping_Address, Shipping_Info, Shipping_Method, Tracking_Number, Shipping_Date, Delivery_Date) VALUES
(1, '123 Main St, Springfield', 'Leave at front door', 'Express', 'TRACK123456', '2024-11-20', '2024-11-22'),
(2, '456 Elm St, Metropolis', 'Ring doorbell on arrival', 'Standard', 'TRACK789012', '2024-11-21', '2024-11-25'),
(3, '789 Oak St, Ogdenville', 'Please call upon arrival', 'Standard', 'TRACK345678', '2024-11-22', '2024-11-26'),
(4, '321 Pine St, Capital City', 'Leave with neighbor if not home', 'Express', 'TRACK901234', '2024-11-23', '2024-11-27');

-- Insert data into Notification table
-- Notification create upon order creation.
-- Notification create upon order shipping status change.
-- UPDATE Orders SET Shipping_Status = 'Shipped' WHERE Order_ID = 1;
-- UPDATE Orders SET Shipping_Status = 'Delivered' WHERE Order_ID = 1;

