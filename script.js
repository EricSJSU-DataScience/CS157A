// JavaScript functions

// Variable to track if the user is logged in
let isLoggedIn = false;
let loggedInUser_id = null;
let loggedInUser_name = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initially update the menu to show only "User," "Product," and "Auction"
    updateMenu();

    // Set visibility for sections explicitly
    document.querySelectorAll('section').forEach(section => {
        if (['user', 'product', 'auction'].includes(section.id)) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
});

function showGeneralSection(generalSection) {
	
	// Check if the user is logged in before allowing access to certain sections
    if (['order', 'review', 'shipping', 'notification'].includes(generalSection) && !isLoggedIn) {
        alert('Please log in to access this section.');
        return;
    }
	
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    // Define sub menu items based on general category selected
    const subMenuItems = {
        'user': ['Login', 'Register'],
		'logged_user': ['Logout', 'Profile'],
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
        loginButton.innerText = "Login";
        loginButton.disabled = false;
        if (response.ok) {
            return response.json();
        } else {
            alert('Invalid email or password');
            throw new Error('Login failed');
        }
    })
    .then(user => {
        alert('Login successful');
        isLoggedIn = true; // Set logged-in state
		//alert('isLoggedIn set');
        loggedInUser_name = user.name;
        loggedInUser_id = user.user_id;
		//alert('user info set');
        showLoggedInView(); // Update the view for logged-in users
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in');
		loginButton.innerText = "Login";
        loginButton.disabled = false;
    });
}

function showLoggedInView() {
    document.querySelectorAll('.pre-login').forEach(element => {
        element.style.display = 'none'; // Hide elements for non-logged-in users
    });
    
    document.querySelectorAll('.post-login').forEach(element => {
        element.style.display = 'block'; // Show elements for logged-in users
    });
	updateMenu();
}

// Function to log out the user
function logoutUser() {
    isLoggedIn = false;
    loggedInUser_name = null;
    loggedInUser_id = null;
    alert('You have been logged out.');
    updateMenu(); // Update the menu to show the pre-login options
    showSection('login'); // Redirect to login section
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

// Function to update the menu after a user logs in
function updateMenu() {
    const menu = document.querySelector('.general-sidebar');
    if (isLoggedIn && loggedInUser_name) {
        menu.innerHTML = `
			<h2>Welcome, ${loggedInUser_name}</h2>
			<ul>
				<li><a href="#" onclick="showGeneralSection('logged_user')">User</a></li>
				<li><a href="#" onclick="showGeneralSection('product')">Product</a></li>
				<li><a href="#" onclick="showGeneralSection('auction')">Auction</a></li>
				<li><a href="#" onclick="showGeneralSection('order')">Order</a></li>
				<li><a href="#" onclick="showGeneralSection('review')">Review</a></li>
				<li><a href="#" onclick="showGeneralSection('shipping')">Shipping</a></li>
				<li><a href="#" onclick="showGeneralSection('notification')">Notification</a></li>
			</ul>`;
			// redirect to product after login
			showGeneralSection('product');
			showSection('product listing');
    } else {
        menu.innerHTML = `
            <h2>Menu</h2>
			<h2></h2>
			<h2></h2>
            <ul>
                <li><a href="#" onclick="showGeneralSection('user')">User</a></li>
                <li><a href="#" onclick="showGeneralSection('product')">Product</a></li>
                <li><a href="#" onclick="showGeneralSection('auction')">Auction</a></li>
            </ul>`;
    }
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


