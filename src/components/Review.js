import React, { useState, useEffect } from 'react';

function Review({ loggedInUserId }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        if (loggedInUserId) {
            // Fetch reviews for the logged-in user
            fetch(`http://localhost:5000/show-review/${loggedInUserId}`)
                .then(res => res.json())
                .then(data => {
                    console.log('Reviews fetched:', data);
                    setReviews(data);
                })
                .catch(err => {
                    console.error('Error fetching reviews:', err);
                });
        } else {
            console.log('No loggedInUserId found');
        }
    }, [loggedInUserId]);

    const handleSubmitReview = () => {
        console.log('Submitting review:', { rating, reviewText });
        // Assuming there's an endpoint to submit the review
        fetch('http://localhost:5000/submit-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: loggedInUserId,
                rating,
                reviewText,
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Review submitted:', data);
                // Update the reviews list after submission
                setReviews(prevReviews => [...prevReviews, data]);
                setRating(0);
                setReviewText('');
            })
            .catch(err => {
                console.error('Error submitting review:', err);
            });
    };

    return (
        <div style={styles.reviewsContainer}>
            <h2 style={styles.reviewsTitle}>User Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews available.</p>
            ) : (
                <ul style={styles.reviewsList}>
                    {reviews.map(review => (
                        <li key={review.Review_ID} style={styles.reviewItem}>
                            <div style={styles.reviewHeader}>
                                <p style={styles.reviewProductTitle}>Product: {review.Product_Title}</p>
                            </div>
                            <p style={styles.reviewRating}>Rating: {review.Rating ? review.Rating : 'Not yet rated'}</p>
                            <p style={styles.reviewText}>Review: {review.Review_Text ? review.Review_Text : 'No review text provided'}</p>
                        </li>
                    ))}
                </ul>
            )}
            <div style={styles.addReviewContainer}>
                <h3>Add a written review</h3>
                <div style={styles.ratingContainer}>
                    <p style={{ fontWeight: 'bold', marginRight: '10px' }}>Overall rating</p>
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <span
                                key={index}
                                style={{
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
                                    transition: 'color 200ms',
                                }}
                                onClick={() => setRating(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                            >
                                &#9733;
                            </span>
                        );
                    })}
                </div>
                <textarea
                    style={styles.textArea}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you like or dislike? What did you use this product for?"
                />
                <button style={styles.submitButton} onClick={handleSubmitReview}>Submit</button>
            </div>
        </div>
    );
}

const styles = {
    reviewsContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    reviewsTitle: {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    reviewsList: {
        listStyle: 'none',
        padding: '0',
    },
    reviewItem: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    reviewProductTitle: {
        fontSize: '20px',
        margin: '0',
    },
    reviewRating: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    reviewText: {
        fontSize: '16px',
        color: '#666',
    },
    ratingContainer: {
        display: 'flex',
        marginBottom: '20px',
    },
    addReviewContainer: {
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#FFD700',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    textArea: {
        width: '100%',
        height: '100px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
    },
};

export default Review;
