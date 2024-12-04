import React from 'react';

function Navbar({ setActiveSection, loggedIn }) {
    return (
        <nav style={styles.navbar}>
            <button style={styles.navButton} onClick={() => setActiveSection('home')}>
                Home
            </button>
            {!loggedIn && (
                <>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('login')}
                    >
                        Login
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('register')}
                    >
                        Register
                    </button>
                </>
            )}
            {loggedIn && (
                <>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('products')}
                    >
                        Products
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('auction')}
                    >
                        Auction
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('cart')}
                    >
                        ShoppingCart
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('orders')}
                    >
                        Orders
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('notifications')}
                    >
                        Notifications
                    </button>
                    <button
                        style={styles.navButton}
                        onClick={() => setActiveSection('review')}
                    >
                        Review
                    </button>
                </>
            )}
        </nav>
    );
}

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-around',
    },
    navButton: {
        color: 'white',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default Navbar;
