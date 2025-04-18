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

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
    setupHeaderScroll();
});

// Render featured products
function renderFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
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
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </article>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
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

// Header scroll effect
function setupHeaderScroll() {
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}