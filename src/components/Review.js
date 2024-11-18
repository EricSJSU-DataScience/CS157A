import React, { useState, useEffect } from 'react';

function Review({ loggedInUserId }) {
    const [productsToReview, setProductsToReview] = useState([]);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
    // Fetch products eligible for review
    fetch(`http://localhost:5000/products-to-review/${loggedInUserId}`)
        .then(res => res.json())
        .then(data => {
            console.log('Products to review:', data); // Log the received data
            if (Array.isArray(data)) {
                setProductsToReview(data);
            } else {
                console.error('Unexpected response format:', data);
                setProductsToReview([]);
            }
        })
        .catch(err => {
            console.error('Error fetching products to review:', err);
            setProductsToReview([]);
        });
}, [loggedInUserId]);


    const submitReview = async () => {
        alert('Thank you for your review!');
        setRating(5);
        setReviewText('');
    };

    return (
        <div>
            <h2>Leave a Review</h2>
            {productsToReview.length === 0 ? (
                <p>No products to be reviewed.</p>
            ) : (
                productsToReview.map(product => (
                    <div key={product.Product_ID}>
                        <h3>{product.Title}</h3>
                        <p>{product.Description}</p>
                        <label>Rating (1-5):</label>
                        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" />
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your review..." />
                        <button onClick={submitReview}>Submit Review</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Review;
