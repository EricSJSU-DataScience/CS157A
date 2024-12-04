import React from 'react';

function Navbar({ setActiveSection }) {
    return (
        <header style={{ backgroundColor: '#333', color: 'white', padding: '10px', textAlign: 'center' }}>
            <h1>Marketplace</h1>
            <nav>
                <button onClick={() => setActiveSection('home')}>Home</button> |
                <button onClick={() => setActiveSection('login')}>Login</button> |
                <button onClick={() => setActiveSection('register')}>Register</button> |
                <button onClick={() => setActiveSection('products')}>Products</button> |
                <button onClick={() => setActiveSection('cart')}>Cart</button> |
                <button onClick={() => setActiveSection('review')}>Review</button> |
                <button onClick={() => setActiveSection('auction')}>Auction</button> |
                <button onClick={() => setActiveSection('shipping')}>Shipping</button> |
                <button onClick={() => setActiveSection('notifications')}>Notifications</button> |
                <button onClick={() => setActiveSection('orders')}>Orders</button>
            </nav>
        </header>
    );
}

export default Navbar;
