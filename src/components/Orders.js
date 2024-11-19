import React, { useState, useEffect } from 'react';

function Orders({ loggedInUserId }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
		console.log('Logged in User ID:', loggedInUserId);
        fetch(`http://localhost:5000/orders/${loggedInUserId}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
            })
            .catch(err => console.error('Error fetching orders:', err));
    }, [loggedInUserId]);

    const markAsShipped = (orderId) => {
        fetch(`http://localhost:5000/orders/${orderId}/shipping-status/mark-shipped`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newStatus: 'Shipped' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(orders.map(order => 
                        order.Order_ID === orderId ? { ...order, Shipping_Status: 'Shipped' } : order
                    ));
                }
            })
            .catch(err => console.error('Error updating shipping status to shipped:', err));
    };

    const markAsDelivered = (orderId) => {
        fetch(`http://localhost:5000/orders/${orderId}/shipping-status/mark-delivered`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newStatus: 'Delivered' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(orders.map(order => 
                        order.Order_ID === orderId ? { ...order, Shipping_Status: 'Delivered' } : order
                    ));
                }
            })
            .catch(err => console.error('Error updating shipping status to delivered:', err));
    };

    return (
        <div style={styles.ordersContainer}>
            <h2 style={styles.ordersTitle}>Your Orders</h2>
            {orders.length === 0 ? (
                <p style={styles.noOrdersMessage}>No orders found.</p>
            ) : (
                <ul style={styles.ordersList}>
                    {orders.map(order => (
                        <li key={order.Order_ID} style={styles.orderItem}>
                            <div style={styles.orderHeader}>
                                <h3 style={styles.orderTitle}>Order ID: {order.Order_ID}</h3>
                            </div>
                            <p style={styles.orderAmount}>Total Amount: ${order.Total_Amount}</p>
                            <div style={styles.orderFooter}>
                                <p style={styles.paymentStatus}>Payment Status: {order.Payment_Status}</p>
                                <p style={styles.shippingStatus}>Shipping Status: {order.Shipping_Status}</p>
                                {order.Shipping_Status === 'Pending' && (
                                    <button style={styles.updateButtonSmall} onClick={() => markAsShipped(order.Order_ID)}>
                                        Mark as Shipped
                                    </button>
                                )}
                                {order.Shipping_Status === 'Shipped' && (
                                    <button style={styles.updateButtonSmall} onClick={() => markAsDelivered(order.Order_ID)}>
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    ordersContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    ordersTitle: {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    ordersList: {
        listStyle: 'none',
        padding: '0',
    },
    orderItem: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    orderTitle: {
        fontSize: '20px',
        margin: '0',
    },
    orderAmount: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    orderFooter: {
        display: 'flex',
        //justifyContent: 'space-between', // uncomment to space out evenly in whole line
        alignItems: 'center',
        borderTop: '1px solid #ccc',
        paddingTop: '10px',
        marginTop: '10px',
    },
    paymentStatus: {
        fontSize: '16px',
        marginRight: '20px',
    },
    shippingStatus: {
        fontSize: '16px',
        marginRight: '20px',
    },
    updateButton: {
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    updateButtonSmall: {
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default Orders;
