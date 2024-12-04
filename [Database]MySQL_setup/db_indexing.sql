-- indexing method


-- future functionality
CREATE INDEX idx_user_role_created ON User (Role, Created_At);

-- product and auction page if product is available
CREATE INDEX idx_product_type_status ON Product (Product_Type, Status);

-- future functionality
CREATE INDEX idx_product_seller ON Product (Seller_ID);

-- auction page
CREATE INDEX idx_auction_product_status ON Auction (Product_ID, Auction_Status);

-- when auction end, find highest bider
CREATE INDEX idx_bid_auction_amount ON Bid (Auction_ID, Bid_Amount);

-- shopping cart page
CREATE INDEX idx_cart_user_product ON ShoppingCart (User_ID, Product_ID);

-- order page
CREATE INDEX idx_order_user ON Orders (User_ID);

-- order page: payment information
CREATE INDEX idx_payment_order ON Payment (Order_ID);

-- notification page
CREATE INDEX idx_notification_user ON Notification (User_ID);