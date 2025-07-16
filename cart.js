const cartItems = {};
const cartList = document.getElementById('cart-items');

window.addEventListener('DOMContentLoaded', loadCart);

const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Add to Cart
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const price = parseFloat(btn.getAttribute('data-price'));
        const image = btn.getAttribute('data-image');
        const desc = btn.getAttribute('data-description') || '';

        if (cartItems[title]) {
            cartItems[title].qty++;
        } else {
            cartItems[title] = { qty: 1, price, image, desc };
        }
        renderCart();
        saveCart();
    });
});

// Render Cart
function renderCart() {
    cartList.innerHTML = '';
    let totalCount = 0;
    let totalPrice = 0;

    for (const [title, item] of Object.entries(cartItems)) {
        totalCount += item.qty;
        totalPrice += item.qty * item.price;

        const li = document.createElement('li');
        li.style.marginBottom = '12px';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '10px';

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = title;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';

        const detailsDiv = document.createElement('div');
        detailsDiv.style.flex = '1';

        const name = document.createElement('div');
        name.style.fontWeight = 'bold';
        name.textContent = `${title} × ${item.qty}`;

        const desc = document.createElement('div');
        desc.style.fontSize = '0.85rem';
        desc.style.color = '#555';
        desc.textContent = item.desc;

        const controls = document.createElement('div');

        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        styleButton(addBtn, '#2ecc71');
        addBtn.onclick = () => {
            item.qty++;
            renderCart();
            saveCart();
        };

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '−';
        styleButton(minusBtn, '#e67e22');
        minusBtn.onclick = () => {
            item.qty--;
            if (item.qty <= 0) delete cartItems[title];
            renderCart();
            saveCart();
        };

        controls.appendChild(addBtn);
        controls.appendChild(minusBtn);

        detailsDiv.appendChild(name);
        detailsDiv.appendChild(desc);
        detailsDiv.appendChild(controls);

        li.appendChild(img);
        li.appendChild(detailsDiv);
        cartList.appendChild(li);
    }

    const totalDiv = document.createElement('div');
    totalDiv.style.marginTop = '15px';
    totalDiv.style.fontWeight = 'bold';
    totalDiv.textContent = `Total: ₹${totalPrice.toFixed(2)}`;
    cartList.appendChild(totalDiv);

    document.getElementById('cart-count').textContent = totalCount;
}

function styleButton(btn, bgColor) {
    btn.style.marginRight = '6px';
    btn.style.padding = '2px 6px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.background = bgColor;
    btn.style.color = 'white';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '0.9rem';
}

// WhatsApp Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (Object.keys(cartItems).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phone = "919873152377";
    const messageLines = Object.entries(cartItems).map(
        ([title, item], i) => `${i + 1}. ${title} × ${item.qty}`
    );

    const message = `Hi Urban Kalakari 👋,%0A%0AI'd like to order the following posters:%0A%0A` +
        messageLines.join('%0A') +
        `%0A%0APlease let me know the payment and delivery details.`;

    const whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, '_blank');

    for (const item in cartItems) delete cartItems[item];
    saveCart();
    renderCart();
});

// Toggle cart
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-drawer-overlay').classList.toggle('open');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-drawer-overlay').classList.remove('open');
}

// Save/load
function saveCart() {
    localStorage.setItem('urbanKalakariCart', JSON.stringify(cartItems));
}

function loadCart() {
    const saved = localStorage.getItem('urbanKalakariCart');
    if (saved) {
        const parsed = JSON.parse(saved);
        for (const key in parsed) cartItems[key] = parsed[key];
        renderCart();
    }
}