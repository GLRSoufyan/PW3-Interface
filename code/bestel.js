
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.cart-container')) {
        loadCartItems();
        setupCartButtons();
        setupCarousel();
        
        const buyButton = document.querySelector('.buy-button');
        if (buyButton) {
            buyButton.addEventListener('click', function() {
                window.location.href = 'bestelpagina.html';
            });
        }
    } else if (document.getElementById('orderForm')) {
        loadOrderItems();
        
        const orderForm = document.getElementById('orderForm');
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();
            processOrder();
        });
    } else {
        setupCartButtons();
    }
    
    updateCartCount();
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
    const itemList = document.querySelector('.item-list');
    
    if (!itemList) return;
    
    itemList.innerHTML = '';
    
    if (cartItems.length === 0) {
        itemList.innerHTML = '<div class="order-summary">Je winkelmandje is leeg</div>';
        
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = 'Eindprijs: €0.00';
        }
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

function loadOrderItems() {
    const cartItems = getCartItems();
    const selectedProductsContainer = document.getElementById('selectedProducts');
    
    if (!selectedProductsContainer) return;
    
    if (cartItems.length === 0) {
        return;
    }
    
    selectedProductsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        
        const price = parseFloat(item.price.replace('$', ''));
        subtotal += price;
        
        productElement.innerHTML = `
            <div class="product-info">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <span class="product-name">${item.name}</span>
            </div>
            <span class="product-price">€${price.toFixed(2)}</span>
        `;
        
        selectedProductsContainer.appendChild(productElement);
    });
    
    updateOrderSummary(subtotal);
}

function updateOrderSummary(subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !totalElement) return;
    
    const shippingCost = 3.00;
    
    subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
    totalElement.textContent = `€${(subtotal + shippingCost).toFixed(2)}`;
}

function setupCartButtons() {
    const cartButtons = document.querySelectorAll('.cart-button');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productNameElement = productCard.querySelector('h3');
            const productImageElement = productCard.querySelector('.product-image img');
            
            if (!productNameElement || !productImageElement) return;
            
            const productName = productNameElement.textContent;
            const productImage = productImageElement.src;
            
            const priceMatch = productName.match(/\$\d+/);
            if (!priceMatch) return;
            
            const priceText = priceMatch[0];
            
            const product = {
                id: Date.now().toString(),
                name: productName,
                price: priceText,
                image: productImage
            };
            
            addToCart(product);
            
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
            
            updateCartCount();
        });
    });
}

function setupCarousel() {
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    
    if (!leftArrow || !rightArrow) return;
    
    leftArrow.addEventListener('click', function() {
        console.log('Navigate left in carousel');
    });
    
    rightArrow.addEventListener('click', function() {
        console.log('Navigate right in carousel');
    });
}

function addToCart(product) {
    const cart = getCartItems();
    cart.push(product);
    saveCartItems(cart);
    
    alert(`${product.name} is toegevoegd aan je winkelmandje!`);
    
    if (document.querySelector('.cart-container')) {
        loadCartItems();
    }
}

function removeFromCart(index) {
    const cart = getCartItems();
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1)[0];
        saveCartItems(cart);
        
        alert(`${removedItem.name} is verwijderd uit je winkelmandje.`);
        
        loadCartItems();
        updateCartCount();
    }
}

function processOrder() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert('Je hebt geen producten in je winkelmandje. Voeg eerst producten toe.');
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        street: document.getElementById('street').value,
        housenumber: document.getElementById('housenumber').value,
        addition: document.getElementById('addition').value,
        postcode: document.getElementById('postcode').value,
        city: document.getElementById('city').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        products: cartItems
    };
    
    console.log('Order submitted:', formData);
    alert('Bedankt voor je bestelling! Je ontvangt spoedig een bevestiging per e-mail.');
    
    localStorage.removeItem('leafloomCart');
    updateCartCount();
    
    window.location.href = '/';
}

function updateCartCount() {
    const cartItems = getCartItems();
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cartItems.length;
        element.style.display = cartItems.length > 0 ? 'block' : 'none';
    });
}