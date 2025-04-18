// Sample featured products data with Unsplash URLs
const featuredProducts = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
        category: "electronics",
        rating: 4.8,
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Feature-rich smartwatch with health monitoring and waterproof design.",
        category: "electronics",
        rating: 4.6
    },
    {
        id: 3,
        name: "Portable Bluetooth Speaker",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Compact Bluetooth speaker with 20-hour battery life and rich bass.",
        category: "electronics",
        rating: 4.5,
        badge: "New"
    },
    {
        id: 4,
        name: "Designer Sunglasses",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "UV protection sunglasses with polarized lenses.",
        category: "fashion",
        rating: 4.7
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const featuredProductsContainer = document.getElementById('featuredProducts');

// Toggle Cart
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    renderCartItems();
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Render featured products
function renderFeaturedProducts() {
    if (!featuredProductsContainer) return;
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <article class="product-card">
            <div class="product-image-container">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span class="rating-count">(${Math.floor(Math.random() * 100) + 20})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </article>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Add to cart function
function addToCart(productId) {
    const product = featuredProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    renderCartItems();
    
    // Show feedback
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.backgroundColor = '#28a745';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Update cart in localStorage and UI
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    calculateTotal();
}

// Calculate cart total
function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Render cart items
function renderCartItems() {
    if (!cartItems) return;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    calculateTotal();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
        renderCartItems();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    renderCartItems();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
    updateCart();
    
    // Header scroll effect
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});