import React, { useState } from 'react';

function Notifications() {
    const [notifications] = useState([
        { id: 1, message: "Your order has been shipped!" },
        { id: 2, message: "New product available: Leather Jacket!" }
    ]);

    return (
        <div>
            <h2>Your Notifications</h2>
            {notifications.length > 0 ? (
                notifications.map(notification => (
                    <p key={notification.id}>{notification.message}</p>
                ))
            ) : (
                <p>No notifications at this time.</p>
            )}
        </div>
    );
}

export default Notifications;
