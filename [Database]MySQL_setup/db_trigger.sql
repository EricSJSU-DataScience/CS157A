USE market;

-- triggers
DELIMITER $$

-- notification for order created
CREATE TRIGGER notification_after_order_insert
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    INSERT INTO Notification (User_ID, Message, Notification_Date)
    VALUES (
        NEW.User_ID,
        CONCAT('You have placed a new order: #', NEW.Order_ID),
        CURRENT_TIMESTAMP
    );
END $$

-- notification for payment created
CREATE TRIGGER notification_after_payment_insert
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    INSERT INTO Notification (User_ID, Message, Notification_Date)
    VALUES (
        (SELECT User_ID FROM Orders WHERE Order_ID = NEW.Order_ID),
        CONCAT('The payment of order #', NEW.Order_ID, ' is ', NEW.Payment_Status, ', payment total $', FORMAT(NEW.Payment_Amount, 2)),
        CURRENT_TIMESTAMP
    );
END $$

-- notification for shipping created
CREATE TRIGGER notification_after_shipping_insert
AFTER INSERT ON Shipping
FOR EACH ROW
BEGIN
    INSERT INTO Notification (User_ID, Message, Notification_Date)
    VALUES (
        (SELECT User_ID FROM Orders WHERE Order_ID = NEW.Order_ID),
        CONCAT('You have a new package is being processed for shipping in order: #', NEW.Order_ID),
        CURRENT_TIMESTAMP
    );
END $$

-- notification for payment status update
CREATE TRIGGER notification_after_payment_update
AFTER UPDATE ON Payment
FOR EACH ROW
BEGIN
    IF NEW.Payment_Status != OLD.Payment_Status THEN
        INSERT INTO Notification (User_ID, Message, Notification_Date)
        VALUES (
            (SELECT User_ID FROM Orders WHERE Order_ID = NEW.Order_ID),
            CONCAT(
                'The payment of order #', NEW.Order_ID, 
                ' is ', NEW.Payment_Status, 
                ', payment total $', CAST(NEW.Payment_Amount AS CHAR)
            ),
            CURRENT_TIMESTAMP
        );
    END IF;
END$$

-- notification for shipping status update
CREATE TRIGGER notification_after_shipping_update
AFTER UPDATE ON Shipping
FOR EACH ROW
BEGIN
    IF NEW.Shipping_Status != OLD.Shipping_Status THEN
        INSERT INTO Notification (User_ID, Message, Notification_Date)
        VALUES (
            (SELECT User_ID FROM Orders WHERE Order_ID = NEW.Order_ID),
            CONCAT(
                'The package for order #', NEW.Order_ID, 
                ' has ', LOWER(NEW.Shipping_Status)
            ),
            CURRENT_TIMESTAMP
        );
    END IF;
END$$

-- !!! could be implement in the backend
-- after place order reduce product quantity based on new orderitems 
CREATE TRIGGER after_orderitems_insert
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE Product AS p
    SET p.Quantity = p.Quantity - NEW.Quantity
    WHERE p.Product_ID = NEW.Product_ID;
END$$

-- !!! Still have dot between AFTER OR BEFORE UPDATE should be more suitable
-- Product change to 'sold' when quantity 0
CREATE TRIGGER before_quantity_update
BEFORE UPDATE ON Product
FOR EACH ROW
BEGIN
    IF NEW.Quantity = 0 AND OLD.Quantity > 0 THEN
        SET NEW.Status = 'Sold';
    END IF;
END$$

-- make sure product add to cart isn't quantity 0
CREATE TRIGGER not_allow_product_zero_quantity_in_cart
BEFORE INSERT ON ShoppingCart
FOR EACH ROW
BEGIN
    IF (SELECT Quantity FROM Product WHERE Product_ID = NEW.Product_ID) = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add this product to the cart as it is out of stock.';
    END IF;
END$$

-- trigger: insert review after shipping is delivered
CREATE TRIGGER after_order_delivered
AFTER UPDATE ON Shipping
FOR EACH ROW
BEGIN
    -- upon shipping status has been changed to 'Delivered'
    IF NEW.Shipping_Status = 'Delivered' THEN
        -- Insert a review for each product in the order
        INSERT INTO Review (Product_ID, Order_ID)
        SELECT Product_ID, Order_ID
        FROM OrderItems
        WHERE Order_ID = NEW.Order_ID;
    END IF;
END$$

-- trigger: insert new auction when new product record is Auction type
CREATE TRIGGER after_product_insert
AFTER INSERT ON Product
FOR EACH ROW
BEGIN
    IF NEW.Product_Type = 'Auction' THEN
        -- Insert a new auction with calculated starting price=product_price*product_quantity
        INSERT INTO Auction (Product_ID, Starting_Price, End_Date)
        VALUES (NEW.Product_ID, NEW.Price * NEW.Quantity, DATE_ADD(NOW(), INTERVAL 3 DAY));
    END IF;
END $$

-- trigger: after auction status change to closed
CREATE TRIGGER after_auction_closed
AFTER UPDATE ON Auction
FOR EACH ROW
BEGIN
    -- Check if the auction status is updated to 'Closed'
    IF NEW.Auction_Status = 'Closed' THEN
        SET @highestBidUserId = NULL;
        SET @productId = New.Product_ID;
        SET @product_quantity = NULL;

        -- 1. Find the highest bid amount and user ID for the closed auction
        SELECT User_ID INTO @highestBidUserId
        FROM Bid
        WHERE Auction_ID = NEW.Auction_ID
        ORDER BY Bid_Amount DESC
        LIMIT 1;

        -- 2. Check if there is a highest bid to prevent Auction Unsuccessful.
        IF @highestBidUserId IS NOT NULL THEN
			-- Find product quantity
            SELECT p.Quantity INTO @product_quantity
            FROM Product AS p
            WHERE p.Product_ID = @productId;
            -- Add the product to the highest bidder's shopping cart
            INSERT INTO ShoppingCart (User_ID, Product_ID, Quantity)
            VALUES (@highestBidUserId, @productId, @product_quantity);
        END IF;
    END IF;
END $$

DELIMITER ;