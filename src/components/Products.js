import React, { useEffect, useState } from 'react';

function Products({ loggedInUserId }) {
    const [products, setProducts] = useState([]);

/*     useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []); */
	useEffect(() => {
        // Fetch available products from the backend
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => {
                console.log('Products fetched:', data);
                setProducts(data);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    const addToCart = async (productId) => {
        if (!loggedInUserId) {
            alert('Please log in to add items to your cart.');
            return;
        }
        await fetch('http://localhost:5000/add-to-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: loggedInUserId, productId, quantity: 1 })
        });
        alert('Product added to cart');
    };

    /* return (
        <div>
            <h2>Available Products</h2>
            {products.map(product => (
                <div key={product.Product_ID}>
                    <h3>{product.Title}</h3>
                    <p>{product.Description}</p>
                    <p>Price: ${product.Price}</p>
                    <button onClick={() => addToCart(product.Product_ID)}>Add to Cart</button>
                </div>
            ))}
        </div>
    ); */
	return (
        <div style={styles.productsContainer}>
            <h2 style={styles.productsTitle}>Available Products</h2>
            {products.length === 0 ? (
                <p style={styles.noProductsMessage}>No products available.</p>
            ) : (
                <ul style={styles.productsList}>
                    {products.map(product => (
                        <li key={product.Product_ID} style={styles.productItem}>
                            <div style={styles.productHeader}>
                                <h3 style={styles.productTitle}>{product.Title}</h3>
                            </div>
                            <p style={styles.productDescription}>{product.Description}</p>
                            <div style={styles.productFooter}>
                                <p style={styles.productPrice}>Price: ${product.Price}</p>
                                <button style={styles.addToCartButton} onClick={() => addToCart(product.Product_ID)}>Add to Cart</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    productsContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    productsTitle: {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    productsList: {
        listStyle: 'none',
        padding: '0',
    },
    productItem: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    productHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    productTitle: {
        fontSize: '20px',
        margin: '0',
    },
    productDescription: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    productFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: '16px',
        fontWeight: 'bold',
    },
    addToCartButton: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    addToCartButtonHover: {
        backgroundColor: '#0056b3',
    },
};


export default Products;
