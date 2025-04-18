// Extended product data with categories and Unsplash images
const allProducts = [
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
        name: "Professional Laptop Backpack",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Durable backpack with USB charging port and anti-theft design.",
        category: "accessories",
        rating: 4.7
    },
    {
        id: 5,
        name: "True Wireless Earbuds",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Premium wireless earbuds with charging case and touch controls.",
        category: "electronics",
        rating: 4.4
    },
    {
        id: 6,
        name: "Premium Leather Phone Case",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Genuine leather case with card slots and magnetic closure.",
        category: "accessories",
        rating: 4.3
    },
    {
        id: 7,
        name: "4K Ultra HD Smart TV",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "55-inch smart TV with HDR and voice control.",
        category: "electronics",
        rating: 4.9,
        badge: "Popular"
    },
    {
        id: 8,
        name: "Wireless Charging Stand",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Fast wireless charger for phones and earbuds.",
        category: "electronics",
        rating: 4.2
    },
    {
        id: 9,
        name: "Stainless Steel Water Bottle",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Insulated bottle that keeps drinks cold for 24 hours.",
        category: "home",
        rating: 4.7
    },
    {
        id: 10,
        name: "Smart Home Security Camera",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1591378603223-e15b45a81640?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "1080p HD camera with night vision and motion detection.",
        category: "home",
        rating: 4.5
    },
    {
        id: 11,
        name: "Designer Sunglasses",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "UV protection sunglasses with polarized lenses.",
        category: "fashion",
        rating: 4.6,
        badge: "Trending"
    },
    {
        id: 12,
        name: "Premium Coffee Maker",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        description: "Programmable coffee maker with thermal carafe.",
        category: "home",
        rating: 4.8
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const allProductsContainer = document.getElementById('allProducts');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    
    // Initial render
    renderProducts(allProducts);
    
    // Filter event listeners
    categoryFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', filterProducts);
    
    function filterProducts() {
        let filteredProducts = [...allProducts];
        
        // Category filter
        const selectedCategory = categoryFilter.value;
        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(
                product => product.category === selectedCategory
            );
        }
        
        // Sort products
        const sortOption = sortBy.value;
        switch(sortOption) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                filteredProducts.sort((a, b) => a.id - b.id);
        }
        
        renderProducts(filteredProducts);
    }
    
    function renderProducts(products) {
        allProductsContainer.innerHTML = products.map(product => `
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
                const product = allProducts.find(p => p.id === productId);
                if (product) {
                    addToCart(productId, product);
                }
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
});