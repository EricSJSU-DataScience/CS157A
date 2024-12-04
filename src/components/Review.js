import React, { useState, useEffect } from 'react';

function Review({ loggedInUserId }) {
    const [reviews, setReviews] = useState([]);
    const [ratingMap, setRatingMap] = useState({});
    const [hoverMap, setHoverMap] = useState({});
    const [reviewTextMap, setReviewTextMap] = useState({});

    useEffect(() => {
        if (loggedInUserId) {
            // Fetch reviews for the logged-in user
            fetch(`http://localhost:5000/show-review/${loggedInUserId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log('Reviews fetched:', data);
                    setReviews(data);
                })
                .catch((err) => {
                    console.error('Error fetching reviews:', err);
                });
        } else {
            console.log('No loggedInUserId found');
        }
    }, [loggedInUserId]);

    // Function to submit the review
    const handleSubmitReview = (productId, orderId) => {
        const rating = ratingMap[`${productId}-${orderId}`] || 0;
        const reviewText = reviewTextMap[`${productId}-${orderId}`] || '';

        console.log('Submitting review:', { productId, orderId, rating, reviewText });

        // submit the review
        fetch('http://localhost:5000/submit-review', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                orderId,
                rating,
                reviewText,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Review submitted:', data);

                if (data.message === 'Review updated successfully') {
                    // Update the reviews list after submission
                    setReviews((prevReviews) =>
                        prevReviews.map((review) =>
                            review.Product_ID === productId && review.Order_ID === orderId
                                ? { ...review, Rating: rating, Review_Text: reviewText, Review_Status: 'Rated' }
                                : review
                        )
                    );
                    // Clear the local states for rating and review text after submission
                    setRatingMap((prev) => ({ ...prev, [`${productId}-${orderId}`]: 0 }));
                    setReviewTextMap((prev) => ({ ...prev, [`${productId}-${orderId}`]: '' }));
                }
            })
            .catch((err) => {
                console.error('Error submitting review:', err);
            });
    };

    // Functions to handle rating, hover, and review text changes
    const handleRatingChange = (productId, orderId, ratingValue) => {
        setRatingMap((prev) => ({ ...prev, [`${productId}-${orderId}`]: ratingValue }));
    };

    const handleHoverChange = (productId, orderId, hoverValue) => {
        setHoverMap((prev) => ({ ...prev, [`${productId}-${orderId}`]: hoverValue }));
    };

    const handleReviewTextChange = (productId, orderId, text) => {
        setReviewTextMap((prev) => ({ ...prev, [`${productId}-${orderId}`]: text }));
    };

    // Separate rated and unrated reviews
    const unratedReviews = reviews.filter((review) => review.Review_Status !== 'Rated');
    const ratedReviews = reviews.filter((review) => review.Review_Status === 'Rated');

    // Render the component
    return (
        <div style={styles.reviewsContainer}>
            <h2 style={styles.reviewsTitle}>User Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews available.</p>
            ) : (
                <>
                    {/* Render Unrated Reviews First */}
                    <ul style={styles.reviewsList}>
                        {unratedReviews.map((review) => {
                            const rating = ratingMap[`${review.Product_ID}-${review.Order_ID}`] || 0;
                            const hover = hoverMap[`${review.Product_ID}-${review.Order_ID}`] || null;
                            const reviewText = reviewTextMap[`${review.Product_ID}-${review.Order_ID}`] || '';

                            return (
                                <li key={`${review.Product_ID}-${review.Order_ID}`} style={styles.reviewItem}>
                                    <div style={styles.reviewHeader}>
                                        <p style={styles.reviewProductTitle}>Product: {review.Product_Title}</p>
                                    </div>
                                    <p style={styles.reviewRating}>
                                        Rating: {review.Rating ? review.Rating : 'Not yet rated'}
                                    </p>
                                    <p style={styles.reviewText}>
                                        Review: {review.Review_Text ? review.Review_Text : 'No review text provided'}
                                    </p>
                                    {/* Rate review section */}
                                    <div style={styles.addReviewContainer}>
                                        <div style={styles.ratingContainer}>
                                            <p style={{ fontWeight: 'bold', margin: '0px 10px 0px 10px' }}>
                                                Overall rating
                                            </p>
                                            {[...Array(5)].map((star, index) => {
                                                const ratingValue = index + 1;
                                                return (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            fontSize: '24px',
                                                            cursor: 'pointer',
                                                            color:
                                                                ratingValue <= (hover || rating)
                                                                    ? '#ffc107'
                                                                    : '#e4e5e9',
                                                            transition: 'color 200ms',
                                                        }}
                                                        onClick={() =>
                                                            handleRatingChange(
                                                                review.Product_ID,
                                                                review.Order_ID,
                                                                ratingValue
                                                            )
                                                        }
                                                        onMouseEnter={() =>
                                                            handleHoverChange(
                                                                review.Product_ID,
                                                                review.Order_ID,
                                                                ratingValue
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            handleHoverChange(review.Product_ID, review.Order_ID, null)
                                                        }
                                                    >
                                                        &#9733;
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <textarea
                                            style={styles.textArea}
                                            value={reviewText}
                                            onChange={(e) =>
                                                handleReviewTextChange(
                                                    review.Product_ID,
                                                    review.Order_ID,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="What did you like or dislike? What did you use this product for?"
                                        />
                                        <button
                                            style={styles.submitButton}
                                            onClick={() =>
                                                handleSubmitReview(review.Product_ID, review.Order_ID)
                                            }
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Render Rated Reviews Below */}
                    <ul style={styles.reviewsList}>
                        {ratedReviews.map((review) => (
                            <li key={`${review.Product_ID}-${review.Order_ID}`} style={styles.reviewItem}>
                                <div style={styles.reviewHeader}>
                                    <p style={styles.reviewProductTitle}>Product: {review.Product_Title}</p>
                                </div>
                                <p style={styles.reviewRating}>
                                    Rating: {review.Rating ? review.Rating : 'Not yet rated'}
                                </p>
                                <p style={styles.reviewText}>
                                    Review: {review.Review_Text ? review.Review_Text : 'No review text provided'}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
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
        marginBottom: '10px',
        alignItems: 'center',
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
        margin: '0px 5px 5px -10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
    },
};

export default Review;
