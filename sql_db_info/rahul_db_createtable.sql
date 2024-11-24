CREATE DATABASE IF NOT EXISTS market;
USE market;

CREATE TABLE User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE UserContact (
    Contact_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Phone VARCHAR(15),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE UserRole (
    Role_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Role ENUM('Seller', 'Buyer') NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE Product (
    Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Quantity INT DEFAULT 0,
    Listing_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Available', 'Sold') DEFAULT 'Available'
);

CREATE TABLE ProductSeller (
    ProductSeller_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT NOT NULL,
    Seller_ID INT NOT NULL,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (Seller_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);




CREATE TABLE Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Total_Amount DECIMAL(10, 2) NOT NULL,
    Payment_Status ENUM('Paid', 'Pending', 'Cancelled') DEFAULT 'Pending',
    Shipping_Status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE ShippingDetails (
    Shipping_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Shipping_Address VARCHAR(255) NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);




CREATE TABLE OrderItems (
    Order_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (Order_ID, Product_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);





CREATE TABLE ShoppingCart (
    User_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
	PRIMARY KEY ( User_ID, Product_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);


CREATE TABLE Auction (
    Auction_ID INT AUTO_INCREMENT PRIMARY KEY,
    Starting_Price DECIMAL(10, 2) NOT NULL,
    End_Date DATE NOT NULL
);
CREATE TABLE ProductAuction (
    Product_ID INT PRIMARY KEY,
    Auction_ID INT UNIQUE NOT NULL,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

CREATE TABLE BidDetails (
    Auction_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Bid_Amount DECIMAL(10, 2) NOT NULL,
    Bid_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Auction_ID, User_ID),
    FOREIGN KEY (Auction_ID) REFERENCES Auction(Auction_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    CHECK (Bid_Amount > 0)
);

CREATE TABLE Bid (
    Bid_ID INT AUTO_INCREMENT PRIMARY KEY,
    Auction_ID INT NOT NULL,
    User_ID INT NOT NULL,
    FOREIGN KEY (Auction_ID, User_ID) REFERENCES BidDetails(Auction_ID, User_ID) ON DELETE CASCADE
);

CREATE TABLE AuctionHighestBid (
    Auction_ID INT PRIMARY KEY,
    Highest_Bid_ID INT UNIQUE,
    FOREIGN KEY (Auction_ID) REFERENCES Auction(Auction_ID) ON DELETE CASCADE,
    FOREIGN KEY (Highest_Bid_ID) REFERENCES Bid(Bid_ID) ON DELETE SET NULL
);








CREATE TABLE Payment (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);
CREATE TABLE OrderPayment (
    Order_ID INT PRIMARY KEY,
    Payment_Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);
CREATE TABLE PaymentDetails (
    Order_ID INT PRIMARY KEY,
    Payment_Method ENUM('Credit Card', 'PayPal') NOT NULL,
    Payment_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);


CREATE TABLE OrderInfo (
    Order_ID INT PRIMARY KEY,
    Product_ID INT NOT NULL,
    User_ID INT NOT NULL,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);
CREATE TABLE Review (
    Review_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Review_Text TEXT DEFAULT NULL,
    Review_Status ENUM('Pending', 'Rated') DEFAULT 'Pending',
    Review_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Order_ID) REFERENCES OrderInfo(Order_ID) ON DELETE CASCADE
);

CREATE TABLE ReviewRating (
    Review_ID INT PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5) DEFAULT NULL,
    FOREIGN KEY (Review_ID) REFERENCES Review(Review_ID) ON DELETE CASCADE
);

CREATE TABLE Tracking (
    Tracking_Number VARCHAR(50) PRIMARY KEY,
    Shipping_Method ENUM('Standard', 'Express') DEFAULT 'Standard',
    Shipping_Date DATE,
    Delivery_Date DATE
);
CREATE TABLE Shipping (
    Shipping_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Tracking_Number VARCHAR(50),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Tracking_Number) REFERENCES Tracking(Tracking_Number)
);
CREATE TABLE OrderShipping (
    Order_ID INT PRIMARY KEY,
    Shipping_Address TEXT NOT NULL,
    Shipping_Info TEXT,
    Shipping_Method ENUM('Standard', 'Express') DEFAULT 'Standard',
    Shipping_Date DATE,
    Delivery_Date DATE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);


DELIMITER $$

CREATE TRIGGER after_order_delivered
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    IF NEW.Shipping_Status = 'Delivered' AND OLD.Shipping_Status != 'Delivered' THEN
        INSERT INTO Review (Order_ID, Review_Status)
        VALUES (NEW.Order_ID, 'Pending');
    END IF;
END; $$

CREATE TRIGGER after_order_insert
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    DECLARE notification_message VARCHAR(255);
    SET notification_message = CONCAT(
        NEW.Order_Date, ' - You have placed a new order: Order Number #', NEW.Order_ID
    );
    INSERT INTO Notification (User_ID, Message, Notification_Date)
    VALUES (NEW.User_ID, notification_message, NOW());
END; $$

CREATE TRIGGER order_shipping_status_update
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    DECLARE notification_message VARCHAR(255);
    IF NEW.Shipping_Status <> OLD.Shipping_Status THEN
        SET notification_message = CONCAT(
            NOW(), ' - Order Number ', NEW.Order_ID, ' shipping status updated to: ', NEW.Shipping_Status
        );
        INSERT INTO Notification (User_ID, Message, Notification_Date)
        VALUES (NEW.User_ID, notification_message, NOW());
    END IF;
END; $$

CREATE TRIGGER after_orderitems_insert
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Product
    SET Quantity = Quantity - NEW.Quantity
    WHERE Product_ID = NEW.Product_ID;
END; $$

CREATE TRIGGER after_quantity_update
AFTER UPDATE ON Product
FOR EACH ROW
BEGIN
    IF NEW.Quantity = 0 AND OLD.Quantity > 0 THEN
        UPDATE Product
        SET Status = 'Sold'
        WHERE Product_ID = NEW.Product_ID;
    END IF;
END; $$

CREATE TRIGGER before_order_item_insert
BEFORE INSERT ON OrderItems
FOR EACH ROW
BEGIN
    DECLARE product_quantity INT;
    SELECT Quantity INTO product_quantity
    FROM Product
    WHERE Product_ID = NEW.Product_ID;
    IF product_quantity < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Not enough quantity available for product';
    END IF;
END; $$

CREATE TRIGGER after_bid_insert
AFTER INSERT ON BidDetails
FOR EACH ROW
BEGIN
    DECLARE current_highest DECIMAL(10, 2);
    SELECT MAX(Bid_Amount) INTO current_highest
    FROM BidDetails
    WHERE Auction_ID = NEW.Auction_ID;

    UPDATE AuctionHighestBid
    SET Highest_Bid_ID = (SELECT Bid_ID FROM Bid WHERE Auction_ID = NEW.Auction_ID AND User_ID = NEW.User_ID)
    WHERE Auction_ID = NEW.Auction_ID AND current_highest = NEW.Bid_Amount;
END; $$

DELIMITER ;


/* CREATE TRIGGER before_order_item_insert
BEFORE INSERT ON OrderItems
FOR EACH ROW
BEGIN
    DECLARE product_quantity INT;
    SELECT Quantity INTO product_quantity
    FROM Product
    WHERE Product_ID = NEW.Product_ID;
    IF product_quantity < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Not enough quantity available for product';
    END IF;
END$$ */

DROP TRIGGER IF EXISTS after_order_delivered;
DROP TRIGGER IF EXISTS after_order_insert;
DROP TRIGGER IF EXISTS order_shipping_status_update;
DROP TRIGGER IF EXISTS after_orderitems_insert;
DROP TRIGGER IF EXISTS after_quantity_update;

DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Shipping;
DROP TABLE IF EXISTS Review;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Bid;
DROP TABLE IF EXISTS Auction;
DROP TABLE IF EXISTS ShoppingCart;
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS ShippingDetails;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS ProductSeller;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS UserRole;
DROP TABLE IF EXISTS UserContact;
DROP TABLE IF EXISTS User;