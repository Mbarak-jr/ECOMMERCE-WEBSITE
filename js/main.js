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
    const cartToggle = document.getElementById('cartToggle');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const sidebarCartItems = document.getElementById('sidebarCartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartOverlay = document.getElementById('cartOverlay');

    // Initialize cart functionality
    initCart();

    function initCart() {
        setupCartToggle();
        updateCart();
        renderCartItems();
        
        if (document.querySelector('.cart-page')) {
            renderCartPage();
        }
    }

    function setupCartToggle() {
        if (cartToggle && cartSidebar) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.classList.add('active');
                if (cartOverlay) cartOverlay.classList.add('active');
                renderCartItems();
            });
        }
        
        if (closeCart && cartSidebar) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                if (cartOverlay) cartOverlay.classList.remove('active');
            });
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
                if (cartOverlay) cartOverlay.classList.remove('active');
            });
        }
    }

    function renderCartPage() {
        if (!cartItemsList) return;
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            updateCartTotals(0, 5.99);
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
        
        const subtotal = calculateSubtotal();
        const shipping = subtotal > 50 ? 0 : 5.99;
        updateCartTotals(subtotal, shipping);
        
        if (checkoutBtn) checkoutBtn.disabled = false;
        setupCartItemEventListeners();
    }

    function renderCartItems() {
        if (!sidebarCartItems) return;
        
        if (cart.length === 0) {
            sidebarCartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }
        
        sidebarCartItems.innerHTML = cart.map(item => `
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
        
        const total = calculateSubtotal();
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
        
        setupCartItemEventListeners();
    }

    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function updateCartTotals(subtotal, shipping) {
        const total = subtotal + shipping;
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    function setupCartItemEventListeners() {
        document.querySelectorAll('[data-id]').forEach(element => {
            element.addEventListener('click', handleCartItemAction);
        });
    }

    function handleCartItemAction(e) {
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
    }

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

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        renderCartPage();
        renderCartItems();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            }
        });
    }

    window.addToCart = function(productId, productData) {
        const product = productData || window.featuredProducts?.find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCart();
        renderCartItems();
        
        // Show feedback
        const button = document.querySelector(`[data-id="${productId}"]`);
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.backgroundColor = '';
            }, 2000);
        }
        
        // Show cart sidebar
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        }
    };
});