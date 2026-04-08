alert("JS WORKING");
const API_BASE = "https://dos-backend-ly3a.onrender.com";

// ===== Generate User ID =====
function generateUserId() {
    let id = localStorage.getItem("user_id");
    if (!id) {
        id = "user-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("user_id", id);
    }
    return id;
}

// ===== Cart Management =====
const STORAGE_KEY = 'shophub_cart';

class CartManager {
    constructor() {
        this.API_BASE = API_BASE;
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.attachEventListeners();
        this.updateCartCount();
    }

    loadCart() {
        const stored = localStorage.getItem(STORAGE_KEY);
        this.cart = stored ? JSON.parse(stored) : [];
    }

    saveCart() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // ✅ FIXED BACKEND FUNCTION
    async sendToBackend(methodType, action, item = null) {
        try {
            const options = {
                method: methodType,
                headers: {
                    "Content-Type": "application/json"
                }
            };

            if (methodType !== "GET") {
                options.body = JSON.stringify({
                    user_id: generateUserId(),
                    action: action,
                    item: item
                });
            }

            const res = await fetch(`${this.API_BASE}/`, options);
            const result = await res.json();

            console.log("🔍 Backend Response:", result);

            if (result.decision === "BLOCK") {
                this.showNotification("🚫 Blocked by security system!");
                return false;
            }

            if (result.decision === "SUSPICIOUS") {
                this.showNotification("⚠️ Suspicious activity detected!");
            }

            return true;

        } catch (err) {
            console.error("❌ Backend error:", err);
            this.showNotification("Server error. Try again later.");
            return false;
        }
    }

    // ===== ADD TO CART =====
    async addToCart(id, name, price) {
        const item = { id, name, price };

        const allowed = await this.sendToBackend("POST", "add_to_cart", item);
        if (!allowed) return;

        const existingItem = this.cart.find(i => i.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: id,
                name: name,
                price: parseFloat(price),
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification(`${name} added to cart!`);
    }

    // ===== REMOVE =====
    async removeFromCart(id) {
        const allowed = await this.sendToBackend("DELETE", "remove_item", { id });
        if (!allowed) return;

        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        location.reload();
    }

    // ===== UPDATE =====
    async updateQuantity(id, quantity) {
        const allowed = await this.sendToBackend("PUT", "update_quantity", { id, quantity });
        if (!allowed) return;

        const item = this.cart.find(item => item.id === id);

        if (item) {
            const qty = parseInt(quantity);
            item.quantity = isNaN(qty) ? 1 : Math.max(1, qty);
            this.saveCart();
        }
    }

    getCart() {
        return this.cart;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getTotalPrice() {
        return this.cart.reduce((t, i) => t + (i.price * i.quantity), 0);
    }

    getTotalItems() {
        return this.cart.reduce((t, i) => t + i.quantity, 0);
    }

    // ✅ FIXED EVENT LISTENER
    attachEventListeners() {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-to-cart")) {
                const btn = e.target;

                const id = btn.dataset.id;
                const name = btn.dataset.name;
                const price = btn.dataset.price;

                this.addToCart(id, name, price);
            }
        });
    }

    updateCartCount() {
        const el = document.querySelector('.cart-count');
        if (el) el.textContent = this.getTotalItems();
    }

    showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const n = document.createElement('div');
        n.className = 'notification';
        n.textContent = message;

        n.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
        `;

        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }
}

// ===== INIT =====
const cartManager = new CartManager();

// ===== CHECKOUT =====
function initCheckoutPage() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const allowed = await cartManager.sendToBackend("POST", "checkout");
        if (!allowed) return;

        cartManager.showNotification('Processing...');

        setTimeout(() => {
            cartManager.clearCart();
            cartManager.showNotification('Order placed!');
            setTimeout(() => location.href = 'index.html', 2000);
        }, 1500);
    });
}

// ===== PAGE INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});
