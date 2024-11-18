CREATE DATABASE IF NOT EXISTS market;
USE market;

-- Table: User
CREATE TABLE User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,  -- Hashed password
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
    Seller_ID INT NOT NULL,
    Quantity INT DEFAULT 0,
    Listing_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Available', 'Sold') DEFAULT 'Available',
    FOREIGN KEY (Seller_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);


-- Table: Orders
CREATE TABLE Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Shipping_Address VARCHAR(255),  -- Moved the column definition here
    Quantity INT DEFAULT 1,
    Total_Amount DECIMAL(10, 2) NOT NULL,
    Payment_Status ENUM('Paid', 'Pending', 'Cancelled') DEFAULT 'Pending',
    Shipping_Status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

CREATE TABLE OrderItems (
    OrderItem_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Table: ShoppingCart
CREATE TABLE ShoppingCart (
    Cart_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Quantity INT DEFAULT 1,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Table: Auction
CREATE TABLE Auction (
    Auction_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_ID INT NOT NULL,
    Starting_Price DECIMAL(10, 2) NOT NULL,
    End_Date DATE NOT NULL,
    Highest_Bid_ID INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Table: Bid
CREATE TABLE Bid (
    Bid_ID INT AUTO_INCREMENT PRIMARY KEY,
    Auction_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Bid_Amount DECIMAL(10, 2) NOT NULL,
    Bid_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Auction_ID) REFERENCES Auction(Auction_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    CHECK (Bid_Amount > 0)
);


-- Table: Payment
CREATE TABLE Payment (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Payment_Method ENUM('Credit Card', 'PayPal') NOT NULL,
    Payment_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Payment_Amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);

-- Table: Review
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

-- Table: Shipping (New Table)
CREATE TABLE Shipping (
    Shipping_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_ID INT NOT NULL,
    Shipping_Address TEXT NOT NULL,
    Shipping_Info TEXT,
    Shipping_Method ENUM('Standard', 'Express') DEFAULT 'Standard',
    Tracking_Number VARCHAR(50),
    Shipping_Date DATE,
    Delivery_Date DATE,
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
