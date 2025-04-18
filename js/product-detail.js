document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('productDetail');
    const relatedProductsContainer = document.getElementById('relatedProducts');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Find the product
    const product = allProducts.find(p => p.id === productId);
    const relatedProducts = allProducts.filter(p => p.id !== productId && p.category === product?.category);
    
    if (product) {
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
                    <span class="rating">★★★★☆ (24 reviews)</span>
                </div>
                <p class="description">${product.description}</p>
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity-value">1</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
                
                <div class="product-details">
                    <h3>Details</h3>
                    <ul>
                        <li><strong>Category:</strong> ${product.category}</li>
                        <li><strong>SKU:</strong> PRD${product.id.toString().padStart(3, '0')}</li>
                        <li><strong>Availability:</strong> In Stock</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Add event listener to add-to-cart button
        document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const quantity = parseInt(document.querySelector('.quantity-value').textContent);
            for (let i = 0; i < quantity; i++) {
                addToCart(product.id);
            }
            alert(`${quantity} ${product.name}(s) added to cart!`);
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
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </a>
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="product-detail.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
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
    } else {
        relatedProductsContainer.innerHTML = '<p>No related products found.</p>';
    }
});