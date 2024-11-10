// JavaScript functions
function addToCart(productId) {
    alert('Product ' + productId + ' added to cart!');
}

function placeBid(auctionId) {
    alert('Bid placed for auction ' + auctionId + '!');
}

function loginUser() {
    alert('User logged in!');
}

function registerUser() {
    alert('User registered!');
}

function updateProfile() {
    alert('Profile updated!');
}

function changePassword() {
    alert('Password changed!');
}

function showGeneralSection(generalSection) {
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

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}
