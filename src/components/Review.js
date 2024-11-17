import React, { useState } from 'react';

function Review() {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    const submitReview = async () => {
        alert('Thank you for your review!');
        setRating(5);
        setReviewText('');
    };

    return (
        <div>
            <h2>Leave a Review</h2>
            <label>Rating (1-5):</label>
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" />
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your review..." />
            <button onClick={submitReview}>Submit Review</button>
        </div>
    );
}

export default Review;
