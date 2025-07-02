
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleMenu() {
    document.getElementById("navbar").classList.toggle("active");
}

function addToCart(productName, price, imageSrc) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parseFloat(price.replace('$', '')),
            image: imageSrc,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showAddedToCartMessage();
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

function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.textContent = 'Added to Cart!';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}


document.addEventListener('DOMContentLoaded', function() {
    updateCartIcon();
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.pro');
            const productName = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.price').textContent;
            const imageSrc = productCard.querySelector('.product-img').src;
            
            addToCart(productName, price, imageSrc);
        });
    });
    
    const shoppingBagIcon = document.querySelector('#navbar img[src*="shopping-bag"]');
    if (shoppingBagIcon) {
        shoppingBagIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
});

const mainimg = document.getElementById("mainimg");
const smallimg = document.getElementsByClassName("small");

if (smallimg.length > 0) {
    smallimg[0].addEventListener("click", function(){
        mainimg.src = smallimg[0].src;
    });
    smallimg[1].addEventListener("click", function(){
        mainimg.src = smallimg[1].src;
    });
    smallimg[2].addEventListener("click", function(){
        mainimg.src = smallimg[2].src;
    });
    smallimg[3].addEventListener("click", function(){
        mainimg.src = smallimg[3].src;
    });
}
