USE market;

INSERT INTO User (Name, Email, Password) VALUES
('Test User', 'test@test.com', 'hashedpassword0'),
('Alice Smith', 'alice@example.com', 'hashedpassword1'),
('Bob Johnson', 'bob@example.com', 'hashedpassword2'),
('Charlie Brown', 'charlie@example.com', 'hashedpassword3'),
('Diana Prince', 'diana@example.com', 'hashedpassword4');

INSERT INTO UserRole (User_ID, Role) VALUES
(1, 'Buyer'),
(2, 'Buyer'),
(3, 'Seller'),
(4, 'Buyer'),
(5, 'Seller');

INSERT INTO Product (Title, Description, Price, Quantity) VALUES
('Smartphone', 'Latest model smartphone', 699.99, 10),
('Leather Jacket', 'Stylish black leather jacket', 149.99, 5),
('Cookbook', 'A guide to gourmet cooking', 24.99, 20),
('Blender', 'High-speed kitchen blender', 89.99, 8);

INSERT INTO ProductSeller (Product_ID, Seller_ID) VALUES
(1, 3),
(2, 5),
(3, 3),
(4, 5); 

INSERT INTO ShoppingCart (User_ID, Product_ID, Quantity) VALUES
(1, 1, 1), 
(4, 2, 2),
(1, 3, 1); 

INSERT INTO Auction (Starting_Price, End_Date, Product_ID, Highest_Bid) VALUES
(500.00, '2024-12-15', 1, 1000),
(100.00, '2024-12-20', 2, NULL);

INSERT INTO Bid (Auction_ID, User_ID, Bid_Amount) VALUES
(1, 3, 49),
(1, 1, 500),
(2, 3, 1000);

INSERT INTO Orders (User_ID, Total_Amount, Payment_Status, Shipping_Status, Order_Date) VALUES
(1, 699.99, 'Pending', 'Pending', '2024-11-01 10:00:00'),
(2, 299.98, 'Pending', 'Pending', '2024-11-02 11:00:00'),
(3, 24.99, 'Pending', 'Pending', '2024-11-03 12:00:00'),
(4, 449.50, 'Pending', 'Pending', '2024-11-04 13:00:00');

INSERT INTO OrderItems (Order_ID, Product_ID, Quantity) VALUES
(1, 1, 1),
(2, 2, 2), 
(3, 3, 1), 
(4, 4, 5);

INSERT INTO Payment (Payment_Order_ID, Payment_Amount, Payment_Method, Payment_Date) VALUES
(1, 699.99, 'Credit Card', CURRENT_TIMESTAMP),
(2, 299.98, 'Paypal', CURRENT_TIMESTAMP),
(3, 24.99, 'Credit Card', CURRENT_TIMESTAMP),
(4, 449.50, 'Paypal', CURRENT_TIMESTAMP);

INSERT INTO OrderShipping (Order_ID, Shipping_Address, Shipping_Info, Shipping_Method, Shipping_Date, Delivery_Date, Tracking_Number) VALUES
(1, '123 Main St, Springfield', 'Leave at front door', 'Express', '2024-11-20', '2024-11-22', 'TRACK123456'),
(2, '456 Elm St, Shelbyville', 'Ring doorbell on arrival', 'Standard', '2024-11-21', '2024-11-25', 'TRACK789012');

INSERT INTO Review (Order_ID, Review_Text, Review_Status, Review_Date, Rating) VALUES
(1, 'Great product, fast delivery!', 'Rated', CURRENT_TIMESTAMP, 5),
(2, 'Satisfied with the purchase', 'Rated', CURRENT_TIMESTAMP, 4);

UPDATE Orders 
SET Shipping_Status = 'Shipped'
WHERE Order_ID = 1;

UPDATE Orders 
SET Shipping_Status = 'Delivered'
WHERE Order_ID = 1;
