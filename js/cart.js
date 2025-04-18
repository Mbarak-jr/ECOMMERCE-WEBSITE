document.addEventListener('DOMContentLoaded', () => {
    // Get cart data from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const cartItemsList = document.getElementById('cartItemsList');
    const sidebarCartItems = document.getElementById('sidebarCartItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const orderTotalElement = document.getElementById('orderTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.getElementById('cartCount');
    
    // Cart sidebar elements
    const cartToggle = document.querySelector('#cartToggle');
    const closeCart = document.querySelector('#closeCart');
    const cartSidebar = document.querySelector('#cartSidebar');
    const cartTotal = document.querySelector('#cartTotal');
    
    // Setup cart sidebar toggle
    if (cartToggle && cartSidebar) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            renderSidebarCartItems();
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
            updateTotals(0, 0);
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }
        
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-page-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    ${item.color ? `<p class="cart-item-option">Color: ${item.color}</p>` : ''}
                    ${item.size ? `<p class="cart-item-option">Size: ${item.size}</p>` : ''}
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item btn btn-small" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
        
        // Calculate totals
        const subtotal = calculateSubtotal();
        const shipping = calculateShipping(subtotal);
        updateTotals(subtotal, shipping);
        
        // Set up event listeners for cart items
        setupCartItemEventListeners();
    }
    
    // Render sidebar cart items
    function renderSidebarCartItems() {
        if (!sidebarCartItems) return;
        
        if (cart.length === 0) {
            sidebarCartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        sidebarCartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    ${item.color ? `<p class="cart-item-option">Color: ${item.color}</p>` : ''}
                    ${item.size ? `<p class="cart-item-option">Size: ${item.size}</p>` : ''}
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item btn btn-small" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
        
        // Update sidebar total
        const subtotal = calculateSubtotal();
        cartTotal.textContent = (subtotal + calculateShipping(subtotal)).toFixed(2);
        
        // Set up event listeners for sidebar items
        if (sidebarCartItems) {
            sidebarCartItems.addEventListener('click', handleCartItemActions);
        }
    }
    
    // Calculate subtotal
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Calculate shipping
    function calculateShipping(subtotal) {
        return subtotal > 50 ? 0 : 5.99;
    }
    
    // Update all totals
    function updateTotals(subtotal, shipping) {
        const total = subtotal + shipping;
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = subtotal > 50 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.textContent = `$${total.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
    }
    
    // Set up event listeners for cart items
    function setupCartItemEventListeners() {
        if (cartItemsList) {
            cartItemsList.addEventListener('click', handleCartItemActions);
        }
    }
    
    // Handle cart item actions (quantity changes, removal)
    function handleCartItemActions(e) {
        const target = e.target;
        const button = target.closest('button');
        
        if (!button || !button.hasAttribute('data-id')) return;
        
        const productId = parseInt(button.getAttribute('data-id'));
        if (isNaN(productId)) return;
        
        if (button.classList.contains('minus')) {
            updateQuantity(productId, -1);
        } else if (button.classList.contains('plus')) {
            updateQuantity(productId, 1);
        } else if (button.classList.contains('remove-item')) {
            removeFromCart(productId);
        }
    }
    
    // Update item quantity
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            
            updateCart();
        }
    }
    
    // Remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    // Update cart in localStorage and UI
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartPage();
        renderSidebarCartItems();
    }
    
    // Update cart count in header
    function updateCartCount() {
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // Set up checkout button event
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                // In a real implementation, redirect to checkout page
                alert('Thank you for your order! Proceeding to checkout...');
                // window.location.href = 'checkout.html';
            }
        });
    }
    
    // Initialize the cart
    updateCartCount();
    renderCartPage();
    renderSidebarCartItems();
});