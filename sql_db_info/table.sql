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
    Product_ID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    Price DECIMAL(10, 2),
    Seller_ID INT,
    Category_ID INT,
    Quantity INT,
    Listing_Date DATE,
    Status ENUM('Available', 'Sold'),
    FOREIGN KEY (Seller_ID) REFERENCES User(User_ID)
);

CREATE TABLE Auction (
    Auction_ID INT PRIMARY KEY,
    Product_ID INT,
    Starting_Price DECIMAL(10, 2),
    End_Date DATE,
    Highest_Bid_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

CREATE TABLE Bid (
    Bid_ID INT PRIMARY KEY,
    Auction_ID INT,
    User_ID INT,
    Bid_Amount DECIMAL(10, 2),
    Bid_Time TIMESTAMP,
    FOREIGN KEY (Auction_ID) REFERENCES Auction(Auction_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY,
    Product_ID INT,
    Buyer_ID INT,
    Order_Date DATE,
    Quantity INT,
    Total_Amount DECIMAL(10, 2),
    Payment_Status ENUM('Paid', 'Pending'),
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID),
    FOREIGN KEY (Buyer_ID) REFERENCES User(User_ID)
);

CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY,
    Order_ID INT,
    Payment_Method VARCHAR(50),
    Payment_Date DATE,
    Payment_Amount DECIMAL(10, 2),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
);

CREATE TABLE Review (
    Review_ID INT PRIMARY KEY,
    Product_ID INT,
    User_ID INT,
    Rating INT,
    Review_Text TEXT,
    Review_Date DATE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

CREATE TABLE Category (
    Category_ID INT PRIMARY KEY,
    Category_Name VARCHAR(100),
    Description TEXT
);

CREATE TABLE Shipping (
    Shipping_ID INT PRIMARY KEY,
    Order_ID INT,
    Shipping_Address TEXT,
    Shipping_Method VARCHAR(50),
    Shipping_Date DATE,
    Delivery_Date DATE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID)
);

CREATE TABLE Notification (
    Notification_ID INT PRIMARY KEY,
    User_ID INT,
    Message TEXT,
    Notification_Date DATE,
    Status ENUM('Read', 'Unread'),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);
