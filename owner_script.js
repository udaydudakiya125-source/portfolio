// --- 100% VEGETARIAN INDIAN MENU (Mapped to your 3D models) ---
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
        iosSrc: "https://raw.githubusercontent.com/abhidudakiya-glitch/Tea_Post/main/Burger/Models/Burger.usdz" // Added iOS support
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

// Load any dynamically added dishes from Local Storage
const savedMenu = localStorage.getItem('saffronMenuDB');
if (savedMenu) {
    try {
        menuDB = JSON.parse(savedMenu);
    } catch(e) {
        console.error("Error loading saved menu", e);
    }
}

const categories = ["All", "Pizzas & Burgers", "Light Bites", "Mains & Sizzlers", "Beverages"];

// Extract any newly added categories from the loaded menuDB so they persist on refresh
menuDB.forEach(item => {
    if (!categories.includes(item.category)) {
        categories.push(item.category);
    }
});

// --- APP STATE ---
const state = {
    cart: {}, // Format: { itemId: quantity }
    activeCategory: "All",
    lastTotal: 0,
    currentDishId: null,
    deleteMode: false,
    dishesToDelete: []
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

    // Render Food Grid with 3D Models & AR Buttons
    renderMenu: function() {
        const grid = document.getElementById('menu-grid');

        const renderItem = (item) => {
            const qty = state.cart[item.id] || 0;
            const isSelected = state.deleteMode && state.dishesToDelete.includes(item.id);
            
            return `
            <div class="food-card" style="position: relative; ${isSelected ? 'border-color: #DC2626; box-shadow: 0 0 0 1px #DC2626;' : ''}">
                ${state.deleteMode ? `
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 20; cursor: pointer; background: ${isSelected ? 'rgba(220, 38, 38, 0.05)' : 'transparent'}; border-radius: inherit;" onclick="app.toggleDishSelection(${item.id})">
                        <div style="position: absolute; top: 12px; right: 12px; background: white; border-radius: 4px; padding: 2px; box-shadow: var(--shadow-sm);">
                            <input type="checkbox" style="transform: scale(1.3); pointer-events: none;" ${isSelected ? 'checked' : ''}>
                        </div>
                    </div>
                ` : `
                    <button class="dish-opt-btn" onclick="app.openDishOptions(${item.id})" title="Dish Options">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                    </button>
                `}
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
                
                <div class="food-info" style="cursor: pointer;" ${!state.deleteMode ? `onclick="app.openDishDetails(${item.id})"` : ''}>
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

        if (state.deleteMode) {
            const allSelected = state.dishesToDelete.length > 0 && state.dishesToDelete.length === menuDB.length;
            html += `
                <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; background: #FEF2F2; padding: 10px 15px; border-radius: 8px; border: 1px solid #FCA5A5;">
                    <span style="color: #DC2626; font-weight: 600;">Select dishes to delete</span>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #DC2626; font-size: 0.9rem; font-weight: 600;">
                        <input type="checkbox" onchange="app.toggleSelectAllDishes(event)" ${allSelected ? 'checked' : ''} style="transform: scale(1.2);"> Select All
                    </label>
                </div>
            `;
        }

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

        if (!state.deleteMode) {
            html += `
                <div style="grid-column: 1 / -1; margin-top: 1.5rem;">
                    <h3 class="serif" style="font-size: 1.5rem; color: var(--primary); border-bottom: 2px solid var(--primary-light); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">Manage Menu</h3>
                </div>
                <div class="food-card" style="display: flex; justify-content: center; align-items: center; cursor: pointer; min-height: 40px; border: 2px dashed var(--primary); background: transparent; box-shadow: none;" onclick="app.showAddDishForm()">
                    <div style="text-align: center; color: var(--primary);">
                        <div style="font-size: 2rem; font-weight: 300; margin-bottom: 2px; line-height: 1;">+</div>
                        <h3 style="font-size: 0.75rem; font-weight: 600;">Add New Dish</h3>
                    </div>
                </div>
                <div class="food-card" style="display: flex; justify-content: center; align-items: center; cursor: pointer; min-height: 40px; border: 2px dashed #DC2626; background: transparent; box-shadow: none;" onclick="app.toggleDeleteMode()">
                    <div style="text-align: center; color: #DC2626;">
                        <div style="font-size: 2rem; font-weight: 300; margin-bottom: 2px; line-height: 1;">−</div>
                        <h3 style="font-size: 0.75rem; font-weight: 600;">Delete Dish</h3>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="grid-column: 1 / -1; margin-top: 1.5rem;">
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-primary" style="flex: 1; background: #DC2626;" onclick="app.confirmBulkDelete()">Delete Selected (${state.dishesToDelete.length})</button>
                        <button class="btn-primary" style="flex: 1; background: var(--text-muted); box-shadow: none;" onclick="app.toggleDeleteMode()">Cancel</button>
                    </div>
                </div>
            `;
        }

        grid.innerHTML = html;
    },

    updateCart: function(itemId, change, event) {
        if(!state.cart[itemId]) state.cart[itemId] = 0;
        
        state.cart[itemId] += change;
        if(state.cart[itemId] <= 0) delete state.cart[itemId];
        
        this.renderMenu(); 
        this.updateBadge();
        
        if(document.getElementById('cart').classList.contains('active')) {
            this.renderCart();
        }

        // Add to Cart Button Feedback
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
    },

    toggleDeleteMode: function() {
        state.deleteMode = !state.deleteMode;
        state.dishesToDelete = [];
        this.renderMenu();
    },

    toggleDishSelection: function(id) {
        if (!state.deleteMode) return;
        if (state.dishesToDelete.includes(id)) {
            state.dishesToDelete = state.dishesToDelete.filter(dishId => dishId !== id);
        } else {
            state.dishesToDelete.push(id);
        }
        this.renderMenu();
    },

    toggleSelectAllDishes: function(e) {
        if (e.target.checked) {
            state.dishesToDelete = menuDB.map(d => d.id);
        } else {
            state.dishesToDelete = [];
        }
        this.renderMenu();
    },

    confirmBulkDelete: function() {
        if (state.dishesToDelete.length === 0) {
            alert("No dishes selected for deletion.");
            return;
        }
        if (confirm(`Are you sure you want to delete ${state.dishesToDelete.length} selected dish(es)?`)) {
            menuDB = menuDB.filter(d => !state.dishesToDelete.includes(d.id));
            localStorage.setItem('saffronMenuDB', JSON.stringify(menuDB));
            
            state.dishesToDelete.forEach(id => {
                if (state.cart[id]) delete state.cart[id];
            });
            
            this.updateBadge();
            state.deleteMode = false;
            state.dishesToDelete = [];
            this.renderMenu();
            if(document.getElementById('cart').classList.contains('active')) this.renderCart();
        }
    },

    showAddDishForm: function(isEdit) {
        const select = document.getElementById('new-dish-category');
        
        // Populate dropdown with all current categories (excluding "All")
        select.innerHTML = categories.filter(c => c !== 'All').map(c => 
            `<option value="${c}">${c}</option>`
        ).join('') + `<option value="NEW_SECTION">+ Add New Section</option>`;
        
        document.getElementById('new-dish-category-name').style.display = 'none';
        
        if (isEdit !== true) {
            state.currentDishId = null;
            document.getElementById('add-dish-title').innerText = "Add New 3D Dish";
            document.getElementById('new-dish-name').value = '';
            document.getElementById('new-dish-price').value = '';
            document.getElementById('new-dish-desc').value = '';
            document.getElementById('new-dish-model').value = '';
            document.getElementById('new-dish-category-name').value = '';
            if (state.activeCategory !== "All") select.value = state.activeCategory;
        }

        document.getElementById('add-dish-modal').style.display = 'flex';
    },

    checkNewCategory: function() {
        const select = document.getElementById('new-dish-category');
        const newCatInput = document.getElementById('new-dish-category-name');
        newCatInput.style.display = select.value === 'NEW_SECTION' ? 'block' : 'none';
        if (select.value === 'NEW_SECTION') newCatInput.focus();
    },

    openDishOptions: function(id) {
        state.currentDishId = id;
        document.getElementById('dish-options-modal').style.display = 'flex';
    },

    closeDishOptions: function() {
        state.currentDishId = null;
        document.getElementById('dish-options-modal').style.display = 'none';
    },

    deleteDish: function() {
        if (!state.currentDishId) return;
        if (confirm("Are you sure you want to delete this dish?")) {
            menuDB = menuDB.filter(d => d.id !== state.currentDishId);
            localStorage.setItem('saffronMenuDB', JSON.stringify(menuDB));
            
            if (state.cart[state.currentDishId]) {
                delete state.cart[state.currentDishId];
                this.updateBadge();
            }

            this.closeDishOptions();
            this.renderMenu();
            if(document.getElementById('cart').classList.contains('active')) this.renderCart();
        }
    },

    editDish: function() {
        if (!state.currentDishId) return;
        const dish = menuDB.find(d => d.id === state.currentDishId);
        if (!dish) return;

        this.closeDishOptions();
        this.showAddDishForm(true);
        
        document.getElementById('add-dish-title').innerText = "Edit Dish";
        document.getElementById('new-dish-name').value = dish.name;
        document.getElementById('new-dish-price').value = dish.price;
        document.getElementById('new-dish-desc').value = dish.desc;
        document.getElementById('new-dish-model').value = dish.model;
        document.getElementById('new-dish-category').value = dish.category;
        
        this.checkNewCategory();
    },

    closeAddDishForm: function() {
        document.getElementById('add-dish-modal').style.display = 'none';
        document.getElementById('new-dish-name').value = '';
        document.getElementById('new-dish-price').value = '';
        document.getElementById('new-dish-desc').value = '';
        document.getElementById('new-dish-model').value = '';
        document.getElementById('new-dish-category-name').value = '';
        state.currentDishId = null;
    },

    submitNewDish: function() {
        const name = document.getElementById('new-dish-name').value;
        let category = document.getElementById('new-dish-category').value;
        const price = document.getElementById('new-dish-price').value;
        const desc = document.getElementById('new-dish-desc').value;
        const model = document.getElementById('new-dish-model').value;

        // Handle saving a completely new section
        if (category === 'NEW_SECTION') {
            category = document.getElementById('new-dish-category-name').value.trim();
            if (!category) {
                alert("Please provide a name for the new section.");
                return;
            }
            // Add the new section to the master list if it doesn't exist
            if (!categories.includes(category)) categories.push(category);
        }

        if (!name || !price || !model) {
            alert("Please provide the Name, Price, and 3D Model URL.");
            return;
        }

        if (state.currentDishId) {
            // Update existing dish
            const dishIndex = menuDB.findIndex(d => d.id === state.currentDishId);
            if (dishIndex !== -1) {
                menuDB[dishIndex].name = name;
                menuDB[dishIndex].category = category;
                menuDB[dishIndex].price = Number(price);
                menuDB[dishIndex].desc = desc;
                menuDB[dishIndex].model = model;
            }
            state.currentDishId = null;
        } else {
            // Add new dish
            const newId = menuDB.length > 0 ? Math.max(...menuDB.map(d => d.id)) + 1 : 1;
            menuDB.push({
                id: newId,
                name: name,
                category: category,
                price: Number(price),
                desc: desc || "A delicious new addition to our menu.",
                model: model
            });
        }

        // Save the updated menu securely to Local Storage
        localStorage.setItem('saffronMenuDB', JSON.stringify(menuDB));

        this.closeAddDishForm();
        this.renderCategories(); // Re-render the top navbar to show the new section
        this.renderMenu();
    }
};

window.onload = () => app.init();
window.app = app;

window.addEventListener('resize', () => {
    document.getElementById('desktop-cat-title').style.display = app.isDesktop() ? 'block' : 'none';
});