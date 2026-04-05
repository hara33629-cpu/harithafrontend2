const API_BASE = "https://dos-backend-ly3a.onrender.com";

function generateUserId() {
    const id = "user-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("user_id", id);
    return id;
}

// ===== Cart Management =====
const STORAGE_KEY = 'shophub_cart';

class CartManager {
    constructor() {
        this.API_BASE = API_BASE; // change if deployed
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

    // 🔥 NEW: Send request to backend (DoS detection)
    async sendToBackend(methodType, action) {
        try {
            const res = await fetch(`${this.API_BASE}/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ip: localStorage.getItem("user_id") || generateUserId(),
                    method: methodType,
                    user_agent: navigator.userAgent,
                    request_size: JSON.stringify({ methodType, action }).length,
                    timestamp: Date.now() / 1000
                })
            });

            const result = await res.json();

            // 🚨 If blocked
            if (result.decision === "BLOCK") {
                this.showNotification("⚠️ Too many requests! You are temporarily blocked.");
                return false;
            }

            return true;

        } catch (err) {
            console.error("Backend error:", err);
            this.showNotification("server error. Try again Later");
            return false; // allow UI if backend fails
        }
    }

    // ===== UPDATED FUNCTIONS =====

    async addToCart(id, name, price) {

        const allowed = await this.sendToBackend("POST", "add_to_cart");
        if (!allowed) return;

        const existingItem = this.cart.find(item => item.id === id);

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

    async removeFromCart(id) {

        const allowed = await this.sendToBackend("DELETE", "remove_item");
        if (!allowed) return;

        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        location.reload();
    }

    async updateQuantity(id, quantity) {

        const allowed = await this.sendToBackend("PUT", "update_quantity");
        if (!allowed) return;

        const item = this.cart.find(item => item.id === id);

        if (item) {
            const qty = parseInt(quantity);
            item.quantity = isNaN(qty) ? 1 : Math.max(1, qty);
            this.saveCart();
        }
    }

    // ===== REMAINING SAME =====

    getCart() {
        return this.cart;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    attachEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const name = btn.dataset.name;
                const price = btn.dataset.price;
                this.addToCart(id, name, price);
            });
        });
    }

    updateCartCount() {
        const cartCountEl = document.querySelector('.cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = this.getTotalItems();
        }
    }

    showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
}

// ===== Initialize Cart Manager =====
const cartManager = new CartManager();

// ===== Smooth Scroll Behavior =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== Newsletter Form =====
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
        cartManager.showNotification(`Thank you! Subscribed with ${email}`);
        e.target.reset();
    }
});

// ===== Active Link Highlighting =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// ===== Add CSS for animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===== Page-specific functions =====

// Cart Page
function initCartPage() {
    const cart = cartManager.getCart();
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <h2>Your Cart is Empty</h2>
                <p>Start shopping and add items to your cart!</p>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }

    let cartHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
        const total = (item.price * item.quantity).toFixed(2);
        cartHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" class="quantity-input" 
                           onchange="cartManager.updateQuantity('${item.id}', this.value)">
                </td>
                <td>$${total}</td>
                <td>
                    <a href="#" class="remove-btn" onclick="cartManager.removeFromCart('${item.id}'); return false;">Remove</a>
                </td>
            </tr>
        `;
    });

    cartHTML += `
            </tbody>
        </table>
    `;

    cartContainer.innerHTML = cartHTML;

    const total = cartManager.getTotalPrice().toFixed(2);
    const subtotal = cartManager.getTotalPrice().toFixed(2);
    const shipping = subtotal > 50 ? '0.00' : '10.00';
    const tax = (subtotal * 0.1).toFixed(2);
    const finalTotal = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

    cartSummary.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>$${shipping}</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%):</span>
            <span>$${tax}</span>
        </div>
        <div class="summary-row total">
            <span>Total:</span>
            <span>$${finalTotal}</span>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top: 20px;">Proceed to Checkout</button>
    `;
}

// Products Page
function initProductsPage() {
    const filterCategory = document.getElementById('filter-category');
    const filterPrice = document.getElementById('filter-price');
    const searchInput = document.getElementById('search-input');

    const products = [
        { id: 1, name: 'Premium Headphones', price: 149.99, category: 'Electronics' },
        { id: 2, name: 'Elegant Silk Scarf', price: 45.99, category: 'Fashion' },
        { id: 3, name: 'Smart Watch Pro', price: 299.99, category: 'Electronics' },
        { id: 4, name: 'Designer Sunglasses', price: 129.99, category: 'Fashion' },
        { id: 5, name: 'Premium Leather Bag', price: 199.99, category: 'Accessories' },
        { id: 6, name: 'Premium Running Shoes', price: 89.99, category: 'Footwear' },
        { id: 7, name: 'Wireless Charger', price: 34.99, category: 'Electronics' },
        { id: 8, name: 'Cotton T-Shirt', price: 29.99, category: 'Fashion' },
        { id: 9, name: 'Sports Backpack', price: 64.99, category: 'Accessories' },
        { id: 10, name: 'Casual Sneakers', price: 79.99, category: 'Footwear' },
        { id: 11, name: 'Winter Jacket', price: 159.99, category: 'Fashion' },
        { id: 12, name: 'Portable Speaker', price: 49.99, category: 'Electronics' }
    ];

    function renderProducts(productsToShow) {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;

        grid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <div class="image-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <span>${product.name}</span>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <div class="rating">
                        <span class="stars">★★★★★</span>
                        <span class="reviews">(${Math.floor(Math.random() * 300) + 50})</span>
                    </div>
                    <div class="product-price">
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary btn-block add-to-cart" 
                            data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-price="${product.price}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        // Re-attach event listeners
        cartManager.attachEventListeners();
    }

    function filterProducts() {
        const category = filterCategory?.value || '';
        const maxPrice = filterPrice?.value || 500;
        const searchTerm = searchInput?.value.toLowerCase() || '';

        let filtered = products.filter(product => {
            const matchCategory = !category || product.category === category;
            const matchPrice = product.price <= maxPrice;
            const matchSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm);
            return matchCategory && matchPrice && matchSearch;
        });

        renderProducts(filtered);
    }

    // Initial render
    renderProducts(products);

    // Event listeners for filters
    filterCategory?.addEventListener('change', filterProducts);
    filterPrice?.addEventListener('change', filterProducts);
    searchInput?.addEventListener('input', filterProducts);
}

// ===== Checkout Page =====
function initCheckoutPage() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(checkoutForm);
        const data = Object.fromEntries(formData);

        // ✅ Validate form
        if (!data.firstName || !data.email || !data.address) {
            cartManager.showNotification('Please fill in all required fields');
            return;
        }

        // 🔥 SEND TO BACKEND (DoS detection)
        const allowed = await cartManager.sendToBackend("POST", "checkout");

        if (!allowed) {
            cartManager.showNotification("⚠️ Too many checkout attempts! Try again later.");
            return;
        }

        // ✅ Simulate order processing
        cartManager.showNotification('Processing your order...');

        setTimeout(() => {
            cartManager.clearCart();
            cartManager.showNotification('Order placed successfully!');

            setTimeout(() => {
                location.href = 'index.html';
            }, 3000);

        }, 2000);
    });
}
// ===== Initialize pages on load =====
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        initCartPage();
    }
    if (document.querySelector('.products-grid') && document.getElementById('filter-category')) {
        initProductsPage();
    }
    if (document.getElementById('checkout-form')) {
        initCheckoutPage();
    }
});

// ===== Utility: Scroll animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});

// ===== Prevent multiple subscriptions =====
const subscriptionEmails = new Set();

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== Export for testing =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { cartManager };
}
