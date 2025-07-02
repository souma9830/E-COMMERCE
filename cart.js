
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleMenu() {
    document.getElementById("navbar").classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartIcon();
});

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartSection = document.getElementById('empty-cart');
    const cartContainer = document.getElementById('cart-container');
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCartSection.style.display = 'block';
        return;
    }
    
    cartContainer.style.display = 'grid';
    emptyCartSection.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Brand: Adidas</p>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       onchange="updateQuantityInput(${index}, this.value)" min="1">
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateTotals();
}

function updateQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;
    if (newQuantity >= 1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartIcon();
    }
}

function updateQuantityInput(index, value) {
    const newQuantity = parseInt(value);
    if (newQuantity >= 1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartIcon();
    } else {
        loadCartItems(); 
    }
}


function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartIcon();
}

function updateTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateCartIcon() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.querySelector('#navbar img[src*="shopping-bag"]');
    
    if (cartIcon) {
      
        const existingCount = cartIcon.parentElement.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        if (cartCount > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = cartCount;
            countElement.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: red;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            `;
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(countElement);
        }
    }
}


function buyNow() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 5.00;
    let orderSummary = 'Order Summary:\n\n';
    cart.forEach(item => {
        orderSummary += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderSummary += `\nSubtotal: $${(total - 5.00).toFixed(2)}`;
    orderSummary += `\nShipping: $5.00`;
    orderSummary += `\nTotal: $${total.toFixed(2)}`;
    
    
    const confirmed = confirm(`${orderSummary}\n\nProceed with purchase?`);
    
    if (confirmed) {
      
        showOrderProcessing();
        setTimeout(() => {
            cart = [];
            localStorage.removeItem('cart');
            showOrderSuccess();
            loadCartItems();
            updateCartIcon();
        }, 3000);
    }
}

function showOrderProcessing() {
    const processingDiv = document.createElement('div');
    processingDiv.id = 'order-processing';
    processingDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #4CAF50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <h3>Processing Your Order...</h3>
                <p>Please wait while we process your payment and confirm your order.</p>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(processingDiv);
}


function showOrderSuccess() {
    const processingDiv = document.getElementById('order-processing');
    if (processingDiv) {
        processingDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    text-align: center;
                    max-width: 400px;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: #4CAF50;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        font-size: 30px;
                        color: white;
                    ">✓</div>
                    <h3>Order Successful!</h3>
                    <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
                    <button onclick="this.closest('#order-processing').remove(); window.location.href='index.html';" 
                            style="
                                background: #4CAF50;
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                cursor: pointer;
                                margin-top: 20px;
                            ">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
    }
} 