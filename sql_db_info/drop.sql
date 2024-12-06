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
drop table ordershipping;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS ProductSeller;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS UserRole;
DROP TABLE IF EXISTS User;