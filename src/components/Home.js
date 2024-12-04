import React, { useState, useEffect } from 'react';

function Home() {
    const [listings, setListings] = useState([]);
    const [auctions, setAuctions] = useState([]);

    // Fetch Listings
    const fetchListings = async () => {
        try {
            const response = await fetch('http://localhost:5000/products');
            const data = await response.json();
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    // Fetch Auctions
    const fetchAuctions = async () => {
        try {
            const response = await fetch('http://localhost:5000/auctions');
            const data = await response.json();
            setAuctions(data);
        } catch (error) {
            console.error('Error fetching auctions:', error);
        }
    };

    useEffect(() => {
        fetchListings();
        fetchAuctions();
    }, []);

    return (
        <div style={styles.container}>
            {/* Listings Section */}
            <section>
                <h2 style={styles.sectionTitle}>Listings</h2>
                {listings.length === 0 ? (
                    <p>No listings available.</p>
                ) : (
                    <ul style={styles.list}>
                        {listings.map((product) => (
                            <li key={product.Product_ID} style={styles.card}>
                                <h3>{product.Title}</h3>
                                <p>{product.Description}</p>
                                <p>Price: ${product.Price}</p>
                                <p>Quantity: {product.Quantity}</p>
                                <p>Status: {product.Status}</p>
                                <p>Listed on: {new Date(product.Listing_Date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Auctions Section */}
            <section>
                <h2 style={styles.sectionTitle}>Auctions</h2>
                {auctions.length === 0 ? (
                    <p>No auction products available.</p>
                ) : (
                    <ul style={styles.list}>
                        {auctions.map((auction) => (
                            <li key={auction.Product_ID} style={styles.card}>
                                <h3>{auction.Title}</h3>
                                <p>{auction.Description}</p>
                                <p>Current Bid: ${auction.Starting_Price}</p>
                                <p>Ends: {new Date(auction.End_Date).toLocaleString()}</p>
                                <p>Quantity: {auction.Quantity}</p> 
                                <p>Status: {auction.Status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    sectionTitle: {
        fontSize: '24px',
        marginBottom: '10px',
        borderBottom: '2px solid #ccc',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    card: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
};

export default Home;
