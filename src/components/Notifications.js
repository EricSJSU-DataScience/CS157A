import React, { useState, useEffect } from 'react';

function Notifications({ loggedInUserId }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (loggedInUserId) {
            // console.log('Logged in User ID:', loggedInUserId); // Verify that user ID is available
            fetch(`http://localhost:5000/notifications/${loggedInUserId}`)
                .then(res => res.json())
                .then(data => {
                    console.log('Notifications fetched:', data);
                    setNotifications(data);
                })
                .catch(err => {
                    console.error('Error fetching notifications:', err);
                });
        } else {
            console.log('No loggedInUserId found');
        }
    }, [loggedInUserId]);
	
	const handleMarkAsRead = (notificationId) => {
        console.log(`Marking notification ${notificationId} as read`);
        fetch(`http://localhost:5000/notifications/${notificationId}/mark-read`, {
            method: 'PUT',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                // Update the state to reflect the read status
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.notification_id === notificationId
                            ? { ...notification, status: 'Read' }
                            : notification
                    )
                );
            })
            .catch(err => {
                console.error('Error updating notification status:', err);
            });
	};
	
	const unreadNotifications = notifications.filter(notification => notification.status !== 'Read');
    const readNotifications = notifications.filter(notification => notification.status === 'Read');
	
    return (
        <div style={styles.notificationsContainer}>
            <h2 style={styles.notificationsTitle}>Your Notifications</h2>
            {unreadNotifications.length > 0 ? (
                <ul style={styles.notificationsList}>
                    {unreadNotifications.map(notification => (
                        <li key={notification.notification_id} style={styles.notificationItem}>
                            <p style={styles.notificationMessage}>{notification.message}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                                <p style={styles.notificationDate}>{new Date(notification.notification_Date).toLocaleString()}</p>
                                <button 
                                    style={styles.readButton} 
                                    onClick={() => handleMarkAsRead(notification.notification_id)}
                                >
                                    Mark as Read
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No unread notifications at this time.</p>
            )}
            {readNotifications.length > 0 && (
                <>
                    <h3 style={{ marginTop: '30px', fontSize: '20px', fontWeight: 'bold' }}>Read Notifications</h3>
                    <ul style={styles.notificationsList}>
                        {readNotifications.map(notification => (
                            <li key={notification.notification_id} style={styles.notificationItem}>
                                <p style={styles.notificationMessage}>{notification.message}</p>
                                <p style={styles.notificationDate}>{new Date(notification.notification_Date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

const styles = {
    notificationsContainer: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    notificationsTitle: {
        textAlign: 'left',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    notificationsList: {
        listStyle: 'none',
        padding: '0',
    },
    notificationItem: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    notificationMessage: {
        fontSize: '16px',
        margin: '0',
    },
    notificationDate: {
        fontSize: '14px',
        color: '#666',
        marginTop: '10px',
    },
	readButton: {
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default Notifications;
