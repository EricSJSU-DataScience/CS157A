import React, { useState } from 'react';

function Auction() {
    const [bidAmount, setBidAmount] = useState('');

    const placeBid = () => {
        alert(`Bid of $${bidAmount} placed successfully!`);
        setBidAmount('');
    };

    return (
        <div>
            <h2>Place a Bid</h2>
            <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Enter your bid" />
            <button onClick={placeBid}>Place Bid</button>
        </div>
    );
}

export default Auction;
