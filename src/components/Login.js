import React, { useState } from 'react';

function Login({ setLoggedInUserId }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
	const [userName, setUserName] = useState('');     
	const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.ok) {
            setLoggedInUserId(result.user.User_ID);
			setUserName(result.user.User_Name); // Set the user's name from the response
            setIsLoggedIn(true); // Set the login status to true
            alert('Logged in successfully');
        } else {
            alert(result.message);
        }
    };

    return (
        <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.formHeader}>
                <h2>User Login</h2>
            </div>
            <div style={styles.formGroup}>
                <div style={styles.inputIcon}>
                    <input
                        type="email"
                        id="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="User Email"
                        required
                        style={styles.input}
                    />
                </div>
            </div>
            <div style={styles.formGroup}>
                <div style={styles.inputIcon}>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={styles.input}
                    />
                </div>
            </div>
            <button type="submit" style={styles.loginButton}>Login</button>
        </form>
    );
}

const styles = {
    loginForm: {
        width: '300px',
        margin: '50px auto',
        fontFamily: 'Arial, sans-serif',
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    formHeader: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    formGroup: {
        position: 'relative',
        marginBottom: '15px',
    },
    inputIcon: {
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    input: {
        flex: '1',
        border: 'none',
        outline: 'none',
        padding: '10px',
        fontSize: '16px',
    },
    loginButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px',
    },
};

export default Login;
