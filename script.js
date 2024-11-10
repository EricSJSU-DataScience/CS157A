// JavaScript functions

// Variable to track if the user is logged in
let isLoggedIn = false;

function showGeneralSection(generalSection) {
	// Check if the user is logged in before allowing access to any user-related sections
    
	// Check if the user is logged in before allowing access to certain sections
    if (['product', 'auction', 'order', 'review', 'shipping', 'notification'].includes(generalSection) && !isLoggedIn) {
        alert('Please log in to access this section.');
        return;
    }
	
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    // Define sub menu items based on general category selected
    const subMenuItems = {
        'user': ['Login', 'Register', 'Profile'],
        'product': ['Product Listing', 'Add New Product'],
        'auction': ['Auction Listings', 'Place Bid'],
        'order': ['View Orders', 'Track Order'],
        'review': ['Product Reviews'],
        'shipping': ['Shipping Information'],
        'notification': ['View Notifications']
    };

    // Update sub menu title to reflect the selected general option
    document.getElementById('sub-menu-title').innerText = generalSection.charAt(0).toUpperCase() + generalSection.slice(1);

    // Update sub menu
    const subMenu = document.getElementById('sub-menu');
    subMenu.innerHTML = '';
    if (subMenuItems[generalSection]) {
        subMenuItems[generalSection].forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="showSection('${item.toLowerCase().replace(/ /g, '-')}')">${item}</a>`;
            subMenu.appendChild(li);
        });
    }

    // Show the related section if applicable
    if (generalSection === 'user') {
        document.getElementById('login').style.display = 'block';
    }
}

function loginUser() {
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
	// Show loading indicator
    const loginButton = document.querySelector("#login button");
    loginButton.innerText = "Logging in...";
    loginButton.disabled = true;

    // Send login request to backend
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (response.ok) {
            alert('Login successful');
            isLoggedIn = true; // Set logged-in state
            showSection('profile'); // Show profile section after login
        } else {
            alert('Invalid email or password');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in');
		loginButton.innerText = "Login";
        loginButton.disabled = false;
    });
}


// register a new user
function registerUser() {
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('reg_email').value;
    const password = document.getElementById('reg_password').value;
    const role = document.getElementById('role').value;
	
	if (!name || !email || !password || !role) {
        alert('Name, Email, Password, and Role are required fields. Please fill them in.');
        return;
    }
	
	const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;

    // Send register request to backend
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, address, phone, role }),
    })
    .then(response => {
        if (response.ok) {
            alert('Registration successful');
            // Redirect to login page
            showSection('login');
        } else {
            return response.json().then(data => {
                console.error('Registration failed:', data);
                alert('Registration failed: ' + (data.message || 'Unknown error'));
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while registering');
    });
}

function updateProfile() {
    alert('Profile updated!');
}

function changePassword() {
    alert('Password changed!');
}

function addToCart(productId) {
    alert('Product ' + productId + ' added to cart!');
}

function placeBid(auctionId) {
    alert('Bid placed for auction ' + auctionId + '!');
}

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    if (sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }
}


