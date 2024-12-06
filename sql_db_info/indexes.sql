create index idx_userRole
on User (Role);
show indexes from User;
explain select * from User where Role = 'Buyer';

create index idx_userEmail 
on UserEmail (Email);
show indexes from UserEmail;
explain select * from UserEmail;

create index idx_status
on Product (Status);
show indexes from Product;
explain select * from Product where Status = 'Available';

create index idx_prodSell
on ProductSeller (Seller_ID, Product_ID);
show indexes from ProductSeller;
explain select * from ProductSeller;

create index idx_paymentStatus
on Orders (Payment_Status);
show indexes from Orders;
explain select * from Orders where Payment_Status = 'Paid';

create index idx_quantity
on OrderItems (Quantity);
show indexes from OrderItems;
explain select * from OrderItems;

create index idx_quantity
on ShoppingCart (Quantity);
show indexes from ShoppingCart;
explain select * from ShoppingCart;

create index idx_highestBid
on Auction (Highest_Bid);
show indexes from Auction;
explain select * from Auction;

create index idx_bidAmount
on Bid (Bid_Amount);
show indexes from Bid;
explain select * from Bid;

create index idx_notifStatus
on Notification (Status);
show indexes from Notification;
explain select * from Notification where Status = 'Unread';

create index idx_paymentMethod
on Payment (Payment_Method);
show indexes from Payment;
explain select * from Payment where Payment_Method = 'Credit Card';

create index idx_rating 
on Review (Rating);
show indexes from Review;
explain select * from Review where Rating = '5';

create index idx_orderShipMethod
on OrderShipping (Shipping_Method);
show indexes from OrderShipping;
explain select * from OrderShipping where Shipping_Method = 'Standard';
