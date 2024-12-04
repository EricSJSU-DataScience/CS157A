import React, { useState, useEffect } from 'react';


function Cart({ loggedInUserId }) {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingMethod, setShippingMethod] = useState('Standard');

    // Fetch cart items
    useEffect(() => {
        if (loggedInUserId) {
            fetch(`http://localhost:5000/cart/${loggedInUserId}`)
                .then((res) => res.json())
                .then((data) => {
                    setCartItems(data);
                    calculateTotalCost(data);
                })
                .catch((err) => console.error('Error fetching cart:', err));
        }
    }, [loggedInUserId]);

    const calculateTotalCost = (items) => {
        const total = items.reduce((acc, item) => {
			if (item.Product_Type === 'Auction') {
				return acc + parseFloat(item.Price);
			} else if (item.Product_Type === 'Listing') {
				return acc + parseFloat(item.Price) * item.Quantity;
			}
			return acc;
		}, 0);
        setTotalCost(total);
    };

    const handleDelete = (productId) => {
        fetch(`http://localhost:5000/cart/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: loggedInUserId, productId }),
        })
            .then(() => {
                const updatedCart = cartItems.filter((item) => item.Product_ID !== productId);
                setCartItems(updatedCart);
                calculateTotalCost(updatedCart);
            })
            .catch((err) => console.error('Error deleting item:', err));
    };

    // Handle placing the order
    const handleConfirmOrder = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        if (!shippingAddress.trim()) {
            alert('Please enter a valid shipping address.');
            return;
        }

        const orderDetails = {
            userId: loggedInUserId,
            shippingAddress,
            paymentMethod,
            shippingMethod,
        };

        try {
            const response = await fetch('http://localhost:5000/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                alert(errorResult.message || 'Failed to place order. Please try again.');
                return;
            }

            const result = await response.json();
            alert(result.message);
            // Clear the cart on frontend
            setCartItems([]);
            setTotalCost(0);
            setShowCheckout(false);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        }
    };

    return (
        <div style={styles.cartContainer}>
            {/* Cart Items Section */}
            <div style={{ flex: 2 }}>
                <h2 style={styles.pageTitle}>Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul style={styles.pageList}>
                        <div style={styles.sectionHeader}>
                            <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
                            <button style={styles.updateButtonSmall} onClick={() => setShowCheckout(true)}>
                                Checkout
                            </button>
                        </div>
                        {cartItems.map((item) => (
                            <div key={item.Product_ID} style={styles.infoLine}>
                                <h3 style={styles.FontB}>{item.Title}</h3>
                                <p style={styles.FontA}>{item.Description}</p>
                                <div style={styles.sectionContainer}>
                                    <p style={styles.FontA}>Price: ${item.Price}</p>
                                    <p style={styles.FontA}>Quantity: {item.Quantity}</p>
                                </div>
                                <button
                                    style={styles.updateButtonSmall}
                                    onClick={() => handleDelete(item.Product_ID)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </ul>
                )}
            </div>

            {/* Checkout Section */}
            {showCheckout && (
                <div style={styles.checkoutContainer}>
                    <h2>Checkout</h2>
                    <label>Payment Method:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                    </select>
                    <br />
                    <label>Shipping Address:</label>
                    <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                    />
                    <br />
                    <label>Shipping Method:</label>
                    <select
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Express">Express</option>
                    </select>
                    <br />
                    {/* Confirm Order Button */}
                    <button style={styles.updateButtonSmall} onClick={handleConfirmOrder}>
                        Confirm Order
                    </button>
                    <button
                        style={styles.updateButtonSmall}
                        onClick={() => setShowCheckout(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    pageContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    pageTitle: {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    pageList: {
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
    sectionHeader: {
        display: 'flex',
        //justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
		gap: '30px',
    },
    sectionContainer: {
        display: 'flex',
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
	checkoutContainer: {
        flex: 1,
        border: '1px solid #ccc',
        padding: '20px',
    },
    cartContainer: {
        display: 'flex',
        gap: '20px',
		padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
};


export default Cart;
