document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('productDetail');
    const relatedProductsContainer = document.getElementById('relatedProducts');
    const productCategory = document.getElementById('productCategory');
    const productName = document.getElementById('productName');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Find the product and related products
    const product = allProducts.find(p => p.id === productId);
    const relatedProducts = allProducts.filter(p => p.id !== productId && p.category === product?.category);
    
    if (product) {
        // Update breadcrumb
        productCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        productName.textContent = product.name;
        
        // Render product detail
        productDetailContainer.innerHTML = `
            <div class="product-images">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="thumbnail-images">
                    <img src="${product.image}" alt="${product.name}">
                    <img src="${product.image}" alt="${product.name}">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            </div>
            <div class="product-info">
                <h1>${product.name}</h1>
                <div class="product-meta">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                        <span class="rating-count">(${Math.floor(Math.random() * 100) + 20} reviews)</span>
                    </div>
                </div>
                <p class="description">${product.description}</p>
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity-value">1</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
                
                <div class="product-details">
                    <h3>Product Details</h3>
                    <ul>
                        <li><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                        <li><strong>SKU:</strong> PRD${product.id.toString().padStart(3, '0')}</li>
                        <li><strong>Availability:</strong> In Stock</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Add event listener to add-to-cart button
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const quantity = parseInt(document.querySelector('.quantity-value').textContent);
            const productToAdd = {...product, quantity};
            addToCart(product.id, productToAdd);
            
            // Show feedback
            const button = document.querySelector('.add-to-cart-btn');
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.backgroundColor = '';
            }, 2000);
        });
        
        // Quantity selector functionality
        document.querySelector('.quantity-btn.minus').addEventListener('click', () => {
            const quantityElement = document.querySelector('.quantity-value');
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantityElement.textContent = quantity - 1;
            }
        });
        
        document.querySelector('.quantity-btn.plus').addEventListener('click', () => {
            const quantityElement = document.querySelector('.quantity-value');
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = quantity + 1;
        });
    } else {
        productDetailContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Product not found</h2>
                <p>Sorry, the product you're looking for doesn't exist.</p>
                <a href="products.html" class="btn">Browse Products</a>
            </div>
        `;
    }
    
    // Render related products
    if (relatedProducts.length > 0) {
        relatedProductsContainer.innerHTML = relatedProducts.slice(0, 4).map(product => `
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
                const product = relatedProducts.find(p => p.id === productId);
                if (product) {
                    addToCart(productId, product);
                }
            });
        });
    } else {
        relatedProductsContainer.innerHTML = '<p>No related products found.</p>';
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