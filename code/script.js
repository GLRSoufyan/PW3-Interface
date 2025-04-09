document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    
    setupCartButtons();
    
    document.querySelector('.buy-button').addEventListener('click', function() {
        window.location.href = 'bestelpagina.html';
    });
    setupCarousel();
});

function getCartItems() {
    const cartItems = localStorage.getItem('leafloomCart');
    return cartItems ? JSON.parse(cartItems) : [];
}

function saveCartItems(items) {
    localStorage.setItem('leafloomCart', JSON.stringify(items));
}

function loadCartItems() {
    const cartItems = getCartItems();
    updateCartSummary(cartItems);
}

function updateCartSummary(cartItems) {
    const itemList = document.querySelector('.item-list');
    
    itemList.innerHTML = '';
    
    if (cartItems.length === 0) {
        itemList.innerHTML = '<div class="order-summary">Je winkelmandje is leeg</div>';
        document.querySelector('.cart-total').textContent = 'Eindprijs: €0.00';
        return;
    }
    
    let subtotal = 0;
    const shippingCost = 3.00;
    
    cartItems.forEach((item, index) => {
        const price = parseFloat(item.price.replace('$', ''));
        subtotal += price;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-summary';
        orderItem.textContent = `Plant ${index + 1}: €${price.toFixed(2)}`;
        itemList.appendChild(orderItem);
    });
    
    const separator1 = document.createElement('div');
    separator1.className = 'line-separator';
    itemList.appendChild(separator1);
    
    const shipping = document.createElement('div');
    shipping.className = 'order-summary';
    shipping.textContent = `Verzend Kosten: €${shippingCost.toFixed(2)}`;
    itemList.appendChild(shipping);
    
    const separator2 = document.createElement('div');
    separator2.className = 'line-separator';
    itemList.appendChild(separator2);
    
    const giftCode = document.createElement('div');
    giftCode.className = 'order-summary';
    giftCode.textContent = 'Cadeaucode: [00000000]';
    itemList.appendChild(giftCode);
    
    const separator3 = document.createElement('div');
    separator3.className = 'line-separator';
    itemList.appendChild(separator3);
    
    const total = document.createElement('div');
    total.className = 'cart-total';
    total.textContent = `Eindprijs: €${(subtotal + shippingCost).toFixed(2)}`;
    itemList.appendChild(total);
    
    const separator4 = document.createElement('div');
    separator4.className = 'line-separator';
    itemList.appendChild(separator4);
}

function setupCartButtons() {
    const cartButtons = document.querySelectorAll('.cart-button');
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            const priceText = productName.match(/\$\d+/)[0];
            
            const product = {
                id: Date.now().toString(),
                name: productName,
                price: priceText,
                image: productImage
            };
            
            addToCart(product);
            loadCartItems();
        });
    });
    
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            removeFromCart(index);
            loadCartItems();
        });
    });
}

function addToCart(product) {
    const cart = getCartItems();
    cart.push(product);
    saveCartItems(cart);
    
    alert(`${product.name} is toegevoegd aan je winkelmandje!`);
}

function removeFromCart(index) {
    const cart = getCartItems();
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1)[0];
        saveCartItems(cart);
        
        alert(`${removedItem.name} is verwijderd uit je winkelmandje.`);
    }
}

function setupCarousel() {
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    
    leftArrow.addEventListener('click', function() {
        console.log('Navigate left in carousel');
    });
    
    rightArrow.addEventListener('click', function() {
        console.log('Navigate right in carousel');
    });
}