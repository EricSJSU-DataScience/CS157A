import React, { useEffect, useState } from 'react';

function Products({ loggedInUserId }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data));
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

    return (
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
    );
}

export default Products;
