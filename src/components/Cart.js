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
                .then(res => res.json())
                .then(data => {
                    setCartItems(data);
                    calculateTotalCost(data);
                })
                .catch(err => console.error('Error fetching cart:', err));
        }
    }, [loggedInUserId]);

    const calculateTotalCost = (items) => {
        const total = items.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
        setTotalCost(total);
    };

    const handleDelete = (productId) => {
        fetch(`http://localhost:5000/cart/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: loggedInUserId, productId })
        })
        .then(() => {
            const updatedCart = cartItems.filter(item => item.Product_ID !== productId);
            setCartItems(updatedCart);
            calculateTotalCost(updatedCart);
        })
        .catch(err => console.error('Error deleting item:', err));
    };

    // Handle placing the order
    const handleConfirmOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!shippingAddress.trim()) {
            alert("Please enter a valid shipping address.");
            return;
        }

        const orderDetails = {
            userId: loggedInUserId,
            cartItems,
            paymentMethod,
            shippingAddress,
            shippingMethod,
            totalCost
        };

        try {
            const response = await fetch('http://localhost:5000/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails)
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
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Cart Items Section */}
            <div style={{ flex: 2 }}>
                <h2>Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
						<div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
							<h3>Total Cost: ${totalCost.toFixed(2)}</h3>
							<button onClick={() => setShowCheckout(true)}>Checkout</button>
						</div>
                        {cartItems.map(item => (
                            <div key={item.Product_ID}>
                                <h3>{item.Title}</h3>
                                <p>{item.Description}</p>
								<div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <p>Price: ${item.Price}</p>
                                <p>Quantity: {item.Quantity}</p>
								</div>
                                <button onClick={() => handleDelete(item.Product_ID)}>Delete</button>
                            </div>
                        ))}
						
                    </ul>
                )}
            </div>

            {/* Checkout Section */}
            {showCheckout && (
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
                    <h2>Checkout</h2>
                    <label>Payment Method:</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                    </select>
                    <br />
                    <label>Shipping Address:</label>
                    <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
                    <br />
                    <label>Shipping Method:</label>
                    <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                        <option value="Standard">Standard</option>
                        <option value="Express">Express</option>
                    </select>
                    <br />
					{/* Confirm Order Button */}
                    <button onClick={handleConfirmOrder}>Confirm Order</button>
                    <button onClick={() => setShowCheckout(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Cart;
