document.addEventListener('DOMContentLoaded', () => {
    // Get cart data from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const cartItemsList = document.getElementById('cartItemsList');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const orderTotalElement = document.getElementById('orderTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.getElementById('cartCount');
    
    // Cart sidebar elements (for cross-page compatibility)
    const cartToggle = document.querySelector('#cartToggle');
    const closeCart = document.querySelector('#closeCart');
    const cartSidebar = document.querySelector('#cartSidebar');
    const cartItems = document.querySelector('#cartItems');
    const cartTotal = document.querySelector('#cartTotal');
    
    // Setup cart sidebar if it exists on this page
    if (cartToggle && cartSidebar) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            renderCartItems();
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Render the main cart page
    function renderCartPage() {
        if (!cartItemsList) return;
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            if (subtotalElement) subtotalElement.textContent = '$0.00';
            if (shippingElement) shippingElement.textContent = '$0.00';
            if (orderTotalElement) orderTotalElement.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }
        
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-page-item">
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
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
        
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + shipping;
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = subtotal > 50 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.textContent = `$${total.toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        // Set up event delegation for cart items
        if (cartItemsList) {
            // Remove existing event listeners to prevent duplicates
            const newCartItemsList = cartItemsList.cloneNode(true);
            if (cartItemsList.parentNode) {
                cartItemsList.parentNode.replaceChild(newCartItemsList, cartItemsList);
            }
            
            // Add event listener to the new element
            const updatedCartItemsList = document.getElementById('cartItemsList');
            if (updatedCartItemsList) {
                updatedCartItemsList.addEventListener('click', handleCartItemsClick);
            }
        }
    }
    
    // Handle clicks on cart page items
    function handleCartItemsClick(e) {
        const target = e.target;
        if (!target.hasAttribute('data-id')) return;
        
        const productId = parseInt(target.getAttribute('data-id'));
        if (isNaN(productId)) return;
        
        if (target.classList.contains('minus')) {
            updateQuantity(productId, -1);
        } else if (target.classList.contains('plus')) {
            updateQuantity(productId, 1);
        } else if (target.classList.contains('remove-item')) {
            removeFromCart(productId);
        }
    }
    
    // Render cart sidebar items (for cross-page compatibility)
    function renderCartItems() {
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }
        
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
        
        // Set up event delegation for cart sidebar items
        const newCartItems = cartItems.cloneNode(true);
        if (cartItems.parentNode) {
            cartItems.parentNode.replaceChild(newCartItems, cartItems);
        }
        
        // Add event listener to the new element
        const updatedCartItems = document.querySelector('#cartItems');
        if (updatedCartItems) {
            updatedCartItems.addEventListener('click', (e) => {
                const target = e.target;
                const productId = parseInt(target.getAttribute('data-id'));
                
                if (isNaN(productId)) return;
                
                if (target.classList.contains('minus')) {
                    updateQuantity(productId, -1);
                } else if (target.classList.contains('plus')) {
                    updateQuantity(productId, 1);
                } else if (target.classList.contains('remove-item')) {
                    removeFromCart(productId);
                }
            });
        }
        
        // Update cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }
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
            renderCartPage();
            renderCartItems();
        }
    }
    
    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        renderCartPage();
        renderCartItems();
    }
    
    // Update cart in localStorage and update cart count in header
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in header if it exists
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }
    
    // Set up checkout button event
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Thank you for your order! Proceeding to checkout...');
                // Normally would redirect to a checkout page
                // window.location.href = 'checkout.html';
            }
        });
    }
    
    // Initialize the cart page
    renderCartPage();
    renderCartItems();
});