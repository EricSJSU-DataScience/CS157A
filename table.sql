CREATE DATABASE marketplace_database;
USE marketplace_database;

CREATE TABLE User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Address TEXT,
    Phone VARCHAR(15),
    Role ENUM('Seller', 'Buyer') NOT NULL
);

CREATE TABLE Product (
    Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Seller_ID INT NOT NULL,
    Category VARCHAR(100),
    Quantity INT DEFAULT 0,
    Listing_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Available', 'Sold') DEFAULT 'Available',
    FOREIGN KEY (Seller_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE ShoppingCart (
    User_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
    Price DECIMAL(10, 2) NOT NULL,
    Date_Added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Is_Checked_Out ENUM('Yes', 'No') DEFAULT 'No',
    PRIMARY KEY (User_ID, Product_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

CREATE TABLE Auction (
    Auction_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT NOT NULL,
    Starting_Price DECIMAL(10, 2) NOT NULL,
    End_Date DATE NOT NULL,
    Highest_Bid_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

CREATE TABLE Bid (
    Bid_ID INT AUTO_INCREMENT PRIMARY KEY,
    Auction_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Bid_Amount DECIMAL(10, 2) NOT NULL,
    Bid_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Auction_ID) REFERENCES Auction(Auction_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    Buyer_ID INT NOT NULL,
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Total_Amount DECIMAL(10, 2) NOT NULL,
    Payment_Status ENUM('Paid', 'Pending') DEFAULT 'Pending',
    FOREIGN KEY (Buyer_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE Orders_Product (
    Order_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
    PRIMARY KEY (Order_ID, Product_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

CREATE TABLE Payment (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Payment_Method VARCHAR(50),
    Payment_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Payment_Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

CREATE TABLE Review (
    Review_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Review_Text TEXT,
    Review_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE Shipping (
    Shipping_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Shipping_Address TEXT NOT NULL,
    Shipping_Info TEXT,
    Shipping_Method ENUM('Standard', 'Express') DEFAULT 'Standard',
    Shipping_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Delivery_Date DATE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

CREATE TABLE Notification (
    Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,                     
    Message TEXT NOT NULL,                      
    Type ENUM('Order', 'Payment', 'Bid') NOT NULL, 
    Notification_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    Status ENUM('Read', 'Unread') DEFAULT 'Unread', 
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);
