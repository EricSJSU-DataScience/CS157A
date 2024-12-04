import React, { useState, useEffect } from 'react';

function Auction({ loggedInUserId }) {
    const [auctions, setAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [selectedAuctionId, setSelectedAuctionId] = useState(null);

    // Fetch auction items
    const fetchAuctionData = async () => {
        try {
            const response = await fetch('http://localhost:5000/auctions');
            const data = await response.json();
            // Set auctions where Product_Type is 'Auction'
            setAuctions(data);
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    // Handle placing a bid
    const handlePlaceBid = async (auctionId, bidAmount, currentBid) => {
        if (!loggedInUserId) {
            alert("Please log in to place a bid.");
            return;
        }

        if (bidAmount <= currentBid) {
            alert("Your bid must be higher than the current bid.");
            return;
        }

        const payload = {
            auctionId,
            userId: loggedInUserId,
            bidAmount
        };

        try {
            const response = await fetch('http://localhost:5000/place-bid', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);

                // Update the auction's current bid locally
                setAuctions(prevAuctions =>
                    prevAuctions.map(auction =>
                        auction.Auction_ID === auctionId
                            ? { ...auction, Starting_Price: bidAmount } // Update the current price
                            : auction
                    )
                );

                setBidAmount(''); // Clear bid input
                setSelectedAuctionId(null); // Close bid input field
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error placing bid:", error);
            alert("Failed to place bid.");
        }
    };



const handleEndAuction = async (auctionId) => {
    try {
        // End the auction
		// eslint-disable-next-line
        const response = await fetch(`http://localhost:5000/auctions/${auctionId}/end`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error ending auction:', error);
        alert('Failed to end the auction.');
    }
};




    // Fetch auction data when the component loads
    useEffect(() => {
        fetchAuctionData();
    }, []);

    return (
        <div style={styles.auctionContainer}>
            <h2 style={styles.title}>Active Auctions</h2>
            {auctions.length === 0 ? (
                <p style={styles.noAuctionsMessage}>No active auctions found.</p>
            ) : (
                <ul style={styles.auctionList}>
                    {auctions.map((auction) => (
                        <li key={auction.Auction_ID} style={styles.auctionItem}>
                            <h3 style={styles.auctionTitle}>
								{auction.Title}<span style={styles.quantityText}>Quantity: {auction.Quantity}</span>
							</h3>
                            <p style={styles.auctionDescription}>{auction.Description}</p>
                            <p style={styles.auctionPrice}>
                                Current Bid: ${auction.Starting_Price}
                            </p>
                            <p style={styles.auctionEndDate}>
                                Ends: {new Date(auction.End_Date).toLocaleString()}
                            </p>
                            <div style={styles.buttonsContainer}>
                                {selectedAuctionId === auction.Auction_ID ? (
                                    <div style={styles.bidSection}>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder="Enter your bid"
                                            style={styles.bidInput}
                                        />
                                        <button
                                            onClick={() =>
                                                handlePlaceBid(
                                                    auction.Auction_ID,
                                                    parseFloat(bidAmount),
                                                    auction.Starting_Price
                                                )
                                            }
                                            style={styles.placeBidButton}
                                        >
                                            Place Bid
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setSelectedAuctionId(auction.Auction_ID)}
                                        style={styles.placeBidButton}
                                    >
                                        Place Bid
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEndAuction(auction.Auction_ID)}
                                    style={styles.endAuctionButton}
                                >
                                    End Auction
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    auctionContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    noAuctionsMessage: {
        fontSize: '16px',
        color: '#555',
    },
    auctionList: {
        listStyle: 'none',
        padding: 0,
    },
    auctionItem: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    auctionTitle: {
        fontSize: '20px',
        marginBottom: '10px',
    },
	quantityText: {
        fontSize: '16px',
        marginLeft: '15px',
        color: 'gray',
    },
    auctionDescription: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    auctionPrice: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    auctionEndDate: {
        fontSize: '14px',
        marginBottom: '10px',
        color: '#555',
    },
    buttonsContainer: {
        display: 'flex',
        gap: '10px',
    },
    bidSection: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
    },
    bidInput: {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '120px',
    },
    placeBidButton: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    endAuctionButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Auction;
