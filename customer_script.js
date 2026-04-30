// --- 100% VEGETARIAN INDIAN MENU ---
let menuDB = [
    { 
        id: 1, name: "Woodfire Veggie Pizza", category: "Pizzas & Burgers", price: 345, 
        desc: "Authentic woodfire crust topped with bell peppers, olives, and melted mozzarella.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Pizza/Models/Pizza.glb" 
    },
    { 
        id: 2, name: "Classic Aloo Tikki Burger", category: "Pizzas & Burgers", price: 180, 
        desc: "Spiced potato patty with fresh lettuce, tomatoes, and tangy house sauce.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Burger/Models/Burger.glb",
        iosSrc: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Burger/Models/Burger.usdz"
    },
    { 
        id: 3, name: "Gourmet Club Sandwich", category: "Light Bites", price: 210, 
        desc: "Multi-layered grilled sandwich packed with fresh veggies and cheese.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Sandwich/Models/Sandwich.glb" 
    },
    { 
        id: 4, name: "Cheesy Garlic Bread", category: "Light Bites", price: 160, 
        desc: "Freshly baked artisan bread smothered in garlic butter and mozzarella.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Garlic_Bread/Models/Garlic_Bread.glb" 
    },
    { 
        id: 5, name: "Paneer Tikka Sizzler", category: "Mains & Sizzlers", price: 450, 
        desc: "A smoking hot platter of marinated paneer, grilled veggies, and spiced rice.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Sizzler/Models/Sizzler.glb" 
    },
    { 
        id: 6, name: "Signature Thick Shake", category: "Beverages", price: 150, 
        desc: "A rich, creamy, and indulgent milkshake topped with whipped cream.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Shake/Models/Shake.glb" 
    },
    { 
        id: 7, name: "Mango Lassi", category: "Beverages", price: 120, 
        desc: "Sweet, churned yogurt blended with fresh Alphonso mango puree.", 
        model: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Shake/Models/Shake.glb" 
    }
];

// Load dynamic menu synced from the owner's Local Storage
const savedMenu = localStorage.getItem('saffronMenuDB');
if (savedMenu) {
    try {
        menuDB = JSON.parse(savedMenu);
    } catch(e) {}
}

let categories = ["All", "Pizzas & Burgers", "Light Bites", "Mains & Sizzlers", "Beverages"];

menuDB.forEach(item => {
    if (!categories.includes(item.category)) categories.push(item.category);
});

// --- APP STATE ---
const state = {
    cart: {}, 
    activeCategory: "All",
    lastTotal: 0
};

// --- APP LOGIC ---
const app = {
    isDesktop: function() {
        return window.innerWidth >= 768;
    },

    init: function() {
        if(this.isDesktop()) {
            document.getElementById('desktop-cat-title').style.display = 'block';
        }
        this.renderCategories();
        this.renderMenu();
    },

    navigate: function(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        
        if(pageId === 'menu') this.renderMenu();
        if(pageId === 'cart') this.renderCart();
        window.scrollTo(0,0);
    },

    renderCategories: function() {
        const nav = document.getElementById('category-list');
        nav.innerHTML = categories.map(cat => `
            <button class="cat-btn ${cat === state.activeCategory ? 'active' : ''}" 
                    onclick="app.filterCategory('${cat}')">
                ${cat}
            </button>
        `).join('');
    },

    filterCategory: function(category) {
        state.activeCategory = category;
        document.getElementById('current-cat-title').innerText = category;
        this.renderCategories(); 
        this.renderMenu();
    },

    renderMenu: function() {
        const grid = document.getElementById('menu-grid');

        const renderItem = (item) => {
            const qty = state.cart[item.id] || 0;
            
            return `
            <div class="food-card">
                <div class="model-box">
                    <model-viewer 
                        id="viewer-${item.id}"
                        src="${item.model}" 
                        ${item.iosSrc ? `ios-src="${item.iosSrc}"` : ''}
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        auto-rotate 
                        camera-controls 
                        shadow-intensity="1"
                        loading="lazy">
                    </model-viewer>
                    <div class="model-hint">360° View</div>
                </div>
                
                <div class="food-info" style="cursor: pointer;" onclick="app.openDishDetails(${item.id})">
                    <div class="veg-tag"></div>
                    <h3 class="food-title">${item.name}</h3>
                    <p class="food-desc">${item.desc}</p>
                    <span class="tap-details">Tap for details</span>
                </div>
                
                <div class="food-action-row">
                    <span class="food-price">₹${item.price}</span>
                    
                    <div class="action-stack">
                        <button class="view-ar-btn" onclick="document.getElementById('viewer-${item.id}').activateAR()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            View on table
                        </button>

                        ${qty > 0 ? `
                            <div class="qty-controls">
                                <button class="qty-btn" onclick="app.updateCart(${item.id}, -1)">−</button>
                                <span style="width: 20px; text-align:center;">${qty}</span>
                                <button class="qty-btn" onclick="app.updateCart(${item.id}, 1)">+</button>
                            </div>
                        ` : `
                            <button class="add-btn" onclick="app.updateCart(${item.id}, 1, event)">Add to Cart</button>
                        `}
                    </div>
                </div>
            </div>
        `};

        let html = '';

        if (state.activeCategory === "All") {
            categories.filter(c => c !== "All").forEach(cat => {
                const catItems = menuDB.filter(i => i.category === cat);
                if (catItems.length > 0) {
                    html += `
                        <div style="grid-column: 1 / -1; margin-top: ${html === '' ? '0' : '1.5rem'};">
                            <h3 class="serif" style="font-size: 1.5rem; color: var(--primary); border-bottom: 2px solid var(--primary-light); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">${cat}</h3>
                        </div>
                    `;
                    html += catItems.map(renderItem).join('');
                }
            });
        } else {
            const filtered = menuDB.filter(i => i.category === state.activeCategory);
            html += filtered.map(renderItem).join('');
        }

        grid.innerHTML = html;
    },

    updateCart: function(itemId, change, event) {
        if(!state.cart[itemId]) state.cart[itemId] = 0;
        
        state.cart[itemId] += change;
        if(state.cart[itemId] <= 0) delete state.cart[itemId];
        
        this.renderMenu(); 
        this.updateBadge();
        
        if(document.getElementById('cart').classList.contains('active')) this.renderCart();

        if(event && event.target) {
            const btn = event.target;
            const originalText = btn.innerText;
            btn.innerText = "Added ✓";
            btn.style.backgroundColor = "var(--primary)";
            btn.style.color = "white";
            setTimeout(() => { 
                btn.innerText = originalText; 
                btn.style.backgroundColor = ""; 
                btn.style.color = ""; 
            }, 1000);
        }
    },

    updateBadge: function() {
        let total = 0;
        for(let id in state.cart) total += state.cart[id];
        const badge = document.getElementById('cart-badge');
        badge.innerText = total;
        badge.style.transform = "scale(1.4)";
        setTimeout(() => badge.style.transform = "scale(1)", 200);
    },

    renderCart: function() {
        const container = document.getElementById('cart-items-container');
        const btnCheckout = document.getElementById('btn-checkout');
        
        let cartHTML = "";
        let subtotal = 0;

        for(let id in state.cart) {
            const item = menuDB.find(i => i.id == id);
            if(item) {
                const qty = state.cart[id];
                subtotal += (item.price * qty);
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>₹${item.price}</p>
                        </div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="app.updateCart(${item.id}, -1)">−</button>
                            <span style="font-weight: 600; width: 24px; text-align:center;">${qty}</span>
                            <button class="qty-btn" onclick="app.updateCart(${item.id}, 1)">+</button>
                        </div>
                        <div style="font-weight: 700; font-size: 1.2rem; min-width: 80px; text-align: right;">
                            ₹${item.price * qty}
                        </div>
                    </div>
                `;
            }
        }

        if(subtotal === 0) {
            container.innerHTML = `
                <div style="padding: 3rem; text-align: center; border: 1px dashed var(--border-color); border-radius: 12px; background: var(--bg-surface);">
                    <div style="margin-bottom: 1rem; opacity: 0.3; display: flex; justify-content: center;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                    <h3 style="color: var(--text-muted); font-weight: 400;">Your plate is empty</h3>
                    <p style="margin-top: 10px; cursor:pointer; color: var(--primary); font-weight: 500;" onclick="app.navigate('menu')">Browse our menu to add items.</p>
                </div>`;
            btnCheckout.disabled = true;
        } else {
            container.innerHTML = cartHTML;
            btnCheckout.disabled = false;
        }
        this.calcTotals(subtotal);
    },

    calcTotals: function(subtotal) {
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + tax;
        document.getElementById('summ-subtotal').innerText = `₹${subtotal}`;
        document.getElementById('summ-tax').innerText = `₹${tax}`;
        document.getElementById('summ-total').innerText = `₹${total}`;
        state.lastTotal = total;
    },

    togglePayment: function() {
        const method = document.querySelector('input[name="payment"]:checked').value;
        
        document.querySelectorAll('.pay-radio').forEach(el => el.classList.remove('active'));
        document.getElementById('form-card').classList.remove('active');
        document.getElementById('form-upi').classList.remove('active');
        document.getElementById('payment-error').style.display = "none";
        
        if(method === "Card") {
            document.getElementById('lbl-card').classList.add('active');
            document.getElementById('form-card').classList.add('active');
        } else if(method === "UPI") {
            document.getElementById('lbl-upi').classList.add('active');
            document.getElementById('form-upi').classList.add('active');
        } else {
            document.getElementById('lbl-cash').classList.add('active');
        }
    },

    validatePayment: function() {
        const method = document.querySelector('input[name="payment"]:checked').value;
        const errorText = document.getElementById('payment-error');
        errorText.style.display = "none";

        if (method === "Card") {
            const num = document.getElementById('card-num').value;
            const exp = document.getElementById('card-exp').value;
            const cvv = document.getElementById('card-cvv').value;
            const name = document.getElementById('card-name').value;
            if(!num || !exp || !cvv || !name) {
                errorText.innerText = "Please complete all Card details.";
                errorText.style.display = "block";
                return false;
            }
        }
        return true; 
    },

    processOrder: function() {
        if(Object.keys(state.cart).length === 0) return;
        if(!this.validatePayment()) return;

        const btn = document.getElementById('btn-checkout');
        btn.innerText = "Securely Processing...";
        btn.disabled = true;
        
        const method = document.querySelector('input[name="payment"]:checked').value;
        
        const completeOrder = () => {
            const orderId = Math.floor(100000 + Math.random() * 900000);
            document.getElementById('order-id').innerText = orderId;

            let receiptHTML = "";
            for(let id in state.cart) {
                const item = menuDB.find(i => i.id == id);
                receiptHTML += `
                    <div class="r-row">
                        <span>${state.cart[id]} x ${item.name}</span>
                        <span>₹${item.price * state.cart[id]}</span>
                    </div>
                `;
            }
            receiptHTML += `
                <div class="i-total">
                    <span>Grand Total</span>
                    <span>₹${state.lastTotal}</span>
                </div>
            `;
            document.getElementById('receipt-details').innerHTML = receiptHTML;

            // Clear the cart so the user can start a new order immediately
            state.cart = {};
            this.updateBadge();

            btn.innerText = "Proceed to Checkout";
            btn.disabled = false;
            document.getElementById('card-num').value = "";
            document.getElementById('card-exp').value = "";
            document.getElementById('card-cvv').value = "";
            document.getElementById('card-name').value = "";

            this.navigate('receipt');
        };

        if (method === "UPI") {
            // Replace 'your_restaurant_upi@bank' with YOUR actual business UPI ID!
            const restaurantUPI = "your_restaurant_upi@bank"; 
            window.location.href = `upi://pay?pa=${restaurantUPI}&pn=Saffron%20and%20Smoke&am=${state.lastTotal}&cu=INR&tn=Food%20Order`;
            setTimeout(completeOrder, 2000); // Give the phone time to open the app, then show receipt
        } else {
            // Standard processing time for Card / Cash
            setTimeout(completeOrder, 1200);
        }
    },

    resetApp: function() {
        state.cart = {};
        this.updateBadge();
        this.navigate('home');
    },

    openDishDetails: function(id) {
        const item = menuDB.find(i => i.id === id);
        if(!item) return;
        
        document.getElementById('sheet-content').innerHTML = `
            <div class="veg-tag" style="margin-bottom: 12px;"></div>
            <h3 class="sheet-title">${item.name}</h3>
            <span class="sheet-price">₹${item.price}</span>
            <p class="sheet-desc">${item.desc}</p>
        `;
        
        const overlay = document.getElementById('dish-details-overlay');
        overlay.style.display = 'flex';
        void overlay.offsetWidth; // Trigger reflow for smooth animation
        overlay.classList.add('active');
    },

    closeDishDetails: function() {
        const overlay = document.getElementById('dish-details-overlay');
        overlay.classList.remove('active');
        setTimeout(() => { if(!overlay.classList.contains('active')) overlay.style.display = 'none'; }, 400); 
    }
};

window.onload = () => app.init();
window.app = app;

window.addEventListener('resize', () => {
    document.getElementById('desktop-cat-title').style.display = app.isDesktop() ? 'block' : 'none';
});

// === REAL-TIME SYNC MAGIC ===
// This listens for changes made by the owner in another tab!
window.addEventListener('storage', (e) => {
    if (e.key === 'saffronMenuDB') {
        try {
            menuDB = JSON.parse(e.newValue);
            
            // Rebuild categories
            categories = ["All", "Pizzas & Burgers", "Light Bites", "Mains & Sizzlers", "Beverages"];
            menuDB.forEach(item => {
                if (!categories.includes(item.category)) categories.push(item.category);
            });
            
            // Refresh the screen dynamically
            app.renderCategories();
            app.renderMenu();
            if(document.getElementById('cart').classList.contains('active')) app.renderCart();
        } catch(err) {
            console.error("Error syncing menu", err);
        }
    }
});