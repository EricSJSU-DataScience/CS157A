CREATE DATABASE IF NOT EXISTS market;
USE market;

-- Table: User
CREATE TABLE User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,  -- Hashed password ideally
    Phone VARCHAR(15),
    Role ENUM('Seller', 'Buyer') NOT NULL, 
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: Product
CREATE TABLE Product (
    Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Seller_ID INT,
    Quantity INT DEFAULT 0,
	Product_type ENUM('Listing', 'Auction') DEFAULT 'Listing' NOT NULL,
    Listing_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Available', 'Sold') DEFAULT 'Available',
    FOREIGN KEY (Seller_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

-- Table: ShoppingCart
CREATE TABLE ShoppingCart (
    User_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
	PRIMARY KEY (User_ID, Product_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Table: Orders
CREATE TABLE Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL, 
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE OrderItems (
    Order_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT NOT NULL,
	PRIMARY KEY (Order_ID, Product_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Table: Payment
CREATE TABLE Payment (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
	Payment_Status ENUM('Pending', 'Paid') DEFAULT 'Pending',
    Payment_Method ENUM('Credit Card', 'PayPal') NOT NULL,
    Payment_Date TIMESTAMP DEFAULT NULL,
    Payment_Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

-- Table: Shipping 
CREATE TABLE Shipping (
    Shipping_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Shipping_Address TEXT NOT NULL,
    Shipping_Info TEXT,
    Shipping_Method ENUM('Standard', 'Express') DEFAULT 'Standard',
	Shipping_Status ENUM('Pending', 'Shipped', 'Delivered') DEFAULT 'Pending',
    Tracking_Number VARCHAR(50),
    Shipping_Date TIMESTAMP DEFAULT NULL,
    Delivery_Date TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

-- Table: Auction
CREATE TABLE Auction (
    Auction_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT NOT NULL,
    Starting_Price DECIMAL(10, 2) NOT NULL,
    End_Date DATE NOT NULL,
	Auction_Status ENUM('Open', 'Closed') DEFAULT 'Open',
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Table: Bid
CREATE TABLE Bid (
    Auction_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Bid_Amount DECIMAL(10, 2) NOT NULL,
    Bid_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (Auction_ID, User_ID),
    FOREIGN KEY (Auction_ID) REFERENCES Auction(Auction_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

-- Table: Review
CREATE TABLE Review (
    Product_ID INT NOT NULL,
    Order_ID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5) DEFAULT NULL,
    Review_Text TEXT DEFAULT NULL,
    Review_Status ENUM('Pending', 'Rated') DEFAULT 'Pending',
    Review_Date TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (Product_ID, Order_ID),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

-- Table: Notification
CREATE TABLE Notification (
    Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Message TEXT,
    Notification_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Read', 'Unread') DEFAULT 'Unread',
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

