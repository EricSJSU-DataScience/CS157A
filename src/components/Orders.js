import React, { useState, useEffect } from 'react';

function Orders({ loggedInUserId }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
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
	
	const markAsPaid = (orderId) => {
        fetch(`http://localhost:5000/orders/${orderId}/payment-status/mark-paid`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newStatus: 'Paid' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(orders.map(order => 
                        order.Order_ID === orderId ? { ...order, Payment_Status: 'Paid' } : order
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
                        <li key={order.Order_ID} style={styles.infoLine}>
                            <div style={styles.orderHeader}>
                                <h3 style={styles.orderTitle}>Order ID: {order.Order_ID}</h3>
                                <p style={styles.FontA}>Order Date: {new Date(order.Order_Date).toLocaleDateString()}</p>
                            </div>
							<div style={styles.sectionContainer}>
								<h4 style={styles.FontB}>Payment: </h4>
								<p style={styles.FontA}>Total Amount: ${order.Payment_Amount}</p>
								<p style={styles.FontA}>Status: {order.Payment_Status}</p>
								{order.Payment_Status === 'Pending' && (
									<button style={styles.updateButtonSmall} onClick={() => markAsPaid(order.Order_ID)}>
										Mark as Paid
									</button>
								)}
							</div>
							<div style={styles.sectionContainer}>
								<h4 style={styles.FontB}>Shipping: </h4>
								<p style={styles.FontA}>Address: {order.Shipping_Address}</p>
								<p style={styles.FontA}>Tracking Number: {order.Tracking_Number}</p>
							</div>
							<div style={styles.sectionContainer}>
								<p style={styles.FontA}>Method: {order.Shipping_Method}</p>
								<p style={styles.FontA}>Status: {order.Shipping_Status}</p>
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
    infoLine: {
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
    sectionContainer: {
		display: 'flex',
        //justifyContent: 'space-between',
		alignItems: 'center',
        gap: '30px',
		marginTop: '-20px',
        marginBottom: '10px',
    },
    FontA: {
		fontSize: '16px',
	},
	FontB: {
		fontSize: '18px',
		fontWeight: 'bold',
	},
    updateButtonSmall: {
        padding: '4px 5px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default Orders;
