import React, { useState } from 'react';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            setName('');
            setEmail('');
            setPassword('');
        } else {
            alert(result.message);
        }
    };

    return (
        <form onSubmit={handleRegister} style={styles.registerForm}>
            <div style={styles.formHeader}>
                <h2>Create an Account</h2>
            </div>
            <div style={styles.formGroup}>
                <div style={styles.inputIcon}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                        style={styles.input}
                    />
                </div>
            </div>
            <div style={styles.formGroup}>
                <div style={styles.inputIcon}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        style={styles.input}
                    />
                </div>
            </div>
            <div style={styles.formGroup}>
                <div style={styles.inputIcon}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={styles.input}
                    />
                </div>
            </div>
            <button type="submit" style={styles.registerButton}>Register</button>
        </form>
    );
}

const styles = {
    registerForm: {
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
    registerButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px',
    },
};

export default Register;
