// Limon Cords LLC - Main JavaScript
// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = null;
let supabase = null;
let stripe = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateCartDisplay();
    loadProducts();
});

// Initialize Supabase and Stripe
function initializeApp() {
    // Initialize Supabase
    if (typeof window.supabase !== 'undefined') {
        const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    }

    // Initialize Stripe
    if (typeof Stripe !== 'undefined') {
        const stripeKey = process.env.STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_PUBLISHABLE_KEY';
        stripe = Stripe(stripeKey);
    }
}

// Product data structure
const products = [
    {
        id: 1,
        name: 'Professional-Grade Diamond Weave Bungee Cord',
        type: 'diamond-weave',
        colors: ['black'],
        lengths: ['17'],
        capacity: '261 lbs',
        price: 3.00,
        originalPrice: 5.00,
        inStock: true,
        description: 'Heavy-duty diamond weave shock cord designed for securing cargo and trailers.',
        images: {
            black: 'https://via.placeholder.com/300x250/000000/FFFFFF?text=Black+Diamond+Weave'
        }
    },
    {
        id: 2,
        name: 'Professional-Grade Half-Inch Bungee Cord',
        type: 'standard',
        colors: ['black'],
        lengths: ['17'],
        capacity: '555 lbs',
        price: 3.00,
        originalPrice: 5.00,
        inStock: true,
        description: 'Ultra-strong half-inch cord with maximum weight capacity for commercial use.',
        images: {
            black: 'https://via.placeholder.com/300x250/000000/FFFFFF?text=Black+Half+Inch'
        }
    },
    {
        id: 3,
        name: 'Professional-Grade Standard Bungee Cord',
        type: 'standard',
        colors: ['white', 'purple', 'beige'],
        lengths: ['12', '17', '24'],
        capacity: '200 lbs',
        price: 2.50,
        originalPrice: 4.00,
        inStock: true,
        description: 'Versatile standard bungee cord available in multiple colors and lengths.',
        images: {
            white: 'https://via.placeholder.com/300x250/FFFFFF/000000?text=White+Cord',
            purple: 'https://via.placeholder.com/300x250/800080/FFFFFF?text=Purple+Cord',
            beige: 'https://ik.imagekit.io/ujadxty3d/singleBaigeBungeeCord.png?updatedAt=1749432962875'
        }
    }
];

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Cart toggle
    const cartToggle = document.querySelector('.cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');

    if (cartToggle && cartSidebar) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
    }

    if (cartClose && cartSidebar) {
        cartClose.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // Product filters
    const colorFilter = document.querySelector('#color-filter');
    const lengthFilter = document.querySelector('#length-filter');

    if (colorFilter) {
        colorFilter.addEventListener('change', filterProducts);
    }

    if (lengthFilter) {
        lengthFilter.addEventListener('change', filterProducts);
    }

    // Contact form
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

// Load and display products
function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    products.forEach(product => {
        product.colors.forEach(color => {
            product.lengths.forEach(length => {
                const productCard = createProductCard(product, color, length);
                productGrid.appendChild(productCard);
            });
        });
    });
}

// Create product card HTML
function createProductCard(product, color, length) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.color = color;
    card.dataset.length = length;
    card.dataset.type = product.type;

    const isOnSale = product.originalPrice > product.price;
    const salePercentage = isOnSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.images[color] || product.images[Object.keys(product.images)[0]]}" 
                 alt="${product.name} - ${color}" 
                 class="product-image"
                 data-product-id="${product.id}"
                 data-color="${color}">
            ${isOnSale ? `<div class="sale-badge">${salePercentage}% OFF</div>` : ''}
        </div>

        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-specs">
                <div><strong>Color:</strong> ${color.charAt(0).toUpperCase() + color.slice(1)}</div>
                <div><strong>Length:</strong> ${length} inches</div>
                <div><strong>Capacity:</strong> ${product.capacity}</div>
                <div><strong>Type:</strong> ${product.type === 'diamond-weave' ? 'Diamond Weave' : 'Standard'}</div>
            </div>

            <div class="product-price">
                ${isOnSale ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                <span class="current-price">$${product.price.toFixed(2)}</span>
            </div>

            <div class="availability-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                ${product.inStock ? 'In Stock' : 'Currently Unavailable'}
            </div>

            <button class="add-to-cart" 
                    data-product-id="${product.id}"
                    data-color="${color}"
                    data-length="${length}"
                    ${!product.inStock ? 'disabled' : ''}>
                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
        </div>
    `;

    // Add click event for add to cart
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (addToCartBtn && product.inStock) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product.id, color, length);
        });
    }

    return card;
}

// Filter products based on selected criteria
function filterProducts() {
    const colorFilter = document.querySelector('#color-filter');
    const lengthFilter = document.querySelector('#length-filter');
    const productCards = document.querySelectorAll('.product-card');

    const selectedColor = colorFilter ? colorFilter.value : 'all';
    const selectedLength = lengthFilter ? lengthFilter.value : 'all';

    productCards.forEach(card => {
        const cardColor = card.dataset.color;
        const cardLength = card.dataset.length;

        const colorMatch = selectedColor === 'all' || cardColor === selectedColor;
        const lengthMatch = selectedLength === 'all' || cardLength === selectedLength;

        if (colorMatch && lengthMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update product images based on color selection
    if (selectedColor !== 'all') {
        updateProductImages(selectedColor);
    }
}

// Update product images when color is selected
function updateProductImages(selectedColor) {
    const productImages = document.querySelectorAll('.product-image');

    productImages.forEach(img => {
        const productId = parseInt(img.dataset.productId);
        const product = products.find(p => p.id === productId);

        if (product && product.images[selectedColor]) {
            img.src = product.images[selectedColor];
            img.alt = `${product.name} - ${selectedColor}`;
        }
    });
}

// Add item to cart
function addToCart(productId, color, length) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = {
        id: `${productId}-${color}-${length}`,
        productId: productId,
        name: product.name,
        color: color,
        length: length,
        price: product.price,
        image: product.images[color] || product.images[Object.keys(product.images)[0]],
        quantity: 1
    };

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === cartItem.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart display
    updateCartDisplay();

    // Save to Supabase if available
    saveCartToDatabase();

    // Show success message
    showNotification('Item added to cart!', 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    saveCartToDatabase();
}

// Update item quantity in cart
function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        saveCartToDatabase();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartContent = document.querySelector('.cart-content');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');

    if (!cartContent) return;

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Clear existing content
    cartContent.innerHTML = '';

    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.innerHTML = '';
        return;
    }

    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-specs">${item.color} - ${item.length}"</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `;
        cartContent.appendChild(cartItem);
    });

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.innerHTML = `
            <div class="cart-summary">
                <div class="subtotal">Subtotal: $${total.toFixed(2)}</div>
                <div class="tax">Tax (est.): $${(total * 0.08).toFixed(2)}</div>
                <div class="total">Total: $${(total * 1.08).toFixed(2)}</div>
            </div>
        `;
    }
}

// Handle contact form submission
async function handleContactForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        orderType: formData.get('order-type'),
        customLength: formData.get('custom-length'),
        customColor: formData.get('custom-color'),
        quantity: formData.get('quantity'),
        message: formData.get('message'),
        createdAt: new Date().toISOString()
    };

    try {
        // Save to Supabase if available
        if (supabase) {
            const { data, error } = await supabase
                .from('contact_requests')
                .insert([contactData]);

            if (error) throw error;
        }

        // Show success message
        showNotification('Thank you! Your custom order request has been submitted.', 'success');
        event.target.reset();

    } catch (error) {
        console.error('Error submitting contact form:', error);
        showNotification('Sorry, there was an error submitting your request. Please try again.', 'error');
    }
}

// Handle checkout process
async function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalWithTax = total * 1.08;

        if (stripe) {
            // Create Stripe checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart,
                    total: Math.round(totalWithTax * 100) // Convert to cents
                })
            });

            const session = await response.json();

            // Redirect to Stripe checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } else {
            // Fallback checkout process
            const orderData = {
                items: cart,
                total: totalWithTax,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Save order to Supabase
            if (supabase) {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([orderData]);

                if (error) throw error;
            }

            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();

            showNotification('Order placed successfully! You will receive a confirmation email shortly.', 'success');
        }

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('There was an error processing your order. Please try again.', 'error');
    }
}

// Save cart to database
async function saveCartToDatabase() {
    if (!supabase) return;

    try {
        const sessionId = getSessionId();

        // Clear existing cart items for this session
        await supabase
            .from('cart_items')
            .delete()
            .eq('session_id', sessionId);

        // Insert current cart items
        if (cart.length > 0) {
            const cartItems = cart.map(item => ({
                session_id: sessionId,
                product_id: item.productId,
                color: item.color,
                length: item.length,
                quantity: item.quantity,
                price: item.price
            }));

            const { data, error } = await supabase
                .from('cart_items')
                .insert(cartItems);

            if (error) throw error;
        }

    } catch (error) {
        console.error('Error saving cart to database:', error);
    }
}

// Get or create session ID
function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
    `;

    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();

        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.handleCheckout = handleCheckout;