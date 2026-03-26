# ShopHub - Premium Ecommerce Website

A beautiful, elegant, and fully functional ecommerce website built with pure HTML, CSS, and JavaScript. No frameworks or external libraries required!

## 🚀 Features

### ✨ Design Features
- **Beautiful Modern UI** - Gradient backgrounds, smooth animations, and elegant color schemes
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations** - Floating elements, fade-in effects, hover animations
- **Professional Layout** - Well-organized sections with proper spacing and typography

### 🛍️ Ecommerce Features
- **Product Catalog** - Browse 12+ products with detailed information
- **Shopping Cart** - Add, remove, and update product quantities
- **Cart Persistence** - Cart data saved in browser's local storage
- **Product Filtering** - Filter by category, price range, and search by name
- **Checkout System** - Complete checkout form with shipping and payment options
- **Price Calculations** - Automatic tax and shipping cost calculations
- **Order Management** - Order summary with itemized breakdown

### 📱 User Interface
- **Navigation Bar** - Sticky navbar with cart icon showing item count
- **Product Cards** - Display products with images, ratings, prices, and badges
- **Badges System** - Sale, New, and Hot badges for product highlights
- **Star Ratings** - Visual star ratings with review counts
- **Newsletter** - Email subscription form with validation

## 📁 File Structure

```
haritha ecommerece/
├── index.html           # Home page with featured products
├── products.html        # Products listing with filters
├── cart.html           # Shopping cart page
├── checkout.html       # Checkout form
├── style.css           # All styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Color Scheme

- **Primary**: #667eea (Purple Blue)
- **Secondary**: #764ba2 (Deep Purple)
- **Accent**: #f093fb (Pink)
- **Text Dark**: #2d3436
- **Light Background**: #f5f6fa
- **White**: #ffffff

## 🚀 Getting Started

### 1. Open the Website
Simply open `index.html` in your web browser. No server or installation required!

```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### 2. Navigate Pages
- **Home** - Browse featured products on the landing page
- **Shop** - View all products with filtering options
- **Cart** - Review and manage your shopping cart
- **Checkout** - Complete your purchase

## 🛒 How to Use

### Adding Products to Cart
1. Click "Add to Cart" on any product
2. A notification will appear confirming the addition
3. Cart count in navbar updates automatically

### Filtering Products
1. Go to the Shop page
2. Use filters to:
   - **Search** - Find products by name
   - **Category** - Filter by Electronics, Fashion, Accessories, etc.
   - **Price** - Set maximum price with slider

### Managing Cart
1. View your cart from the navbar (🛒)
2. Change quantities using the input field
3. Remove items with the Remove button
4. See auto-calculated totals including tax and shipping

### Checkout
1. Fill in billing and shipping information
2. Select shipping method (Standard, Express, Overnight)
3. Choose payment method (Credit Card, PayPal, Apple Pay)
4. Accept terms and complete purchase

## 💾 Data Storage

- Cart data is automatically saved to browser's **localStorage**
- Persists across browser sessions
- Clear by using browser developer tools (F12 > Application > Local Storage)

## 🎯 Product Details

Default products included:
- Premium Headphones - $149.99
- Elegant Silk Scarf - $45.99
- Smart Watch Pro - $299.99
- Designer Sunglasses - $129.99
- Premium Leather Bag - $199.99
- Premium Running Shoes - $89.99
- Wireless Charger - $34.99
- Cotton T-Shirt - $29.99
- Sports Backpack - $64.99
- Casual Sneakers - $79.99
- Winter Jacket - $159.99
- Portable Speaker - $49.99

## 🔧 Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    /* ... more colors */
}
```

### Add More Products
Edit `script.js` in `initProductsPage()` function:
```javascript
const products = [
    { id: 13, name: 'Your Product', price: 99.99, category: 'Category' },
    // ... add more
];
```

### Modify Store Information
- Update logo text in navbar
- Change footer content
- Modify newsletter section
- Edit product descriptions

## 📊 Features Explained

### Cart Manager Class
Handles all cart operations:
- `addToCart()` - Add products to cart
- `removeFromCart()` - Remove items
- `updateQuantity()` - Change item quantities
- `getTotalPrice()` - Calculate cart total
- Persistent storage using localStorage

### Responsive Grid System
- Products display in auto-fit grid
- Adapts from 4 columns (desktop) to 1 column (mobile)
- Maintains aspect ratios and alignment

### Smooth Animations
- Float animation on hero image
- Fade-in animation on product cards
- Hover effects with scale transforms
- Slide-in notifications

## 🌐 Browser Support

Works on all modern browsers:
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎓 Learning Resources

This project demonstrates:
- Semantic HTML5 structure
- CSS Grid and Flexbox layouts
- CSS custom properties (variables)
- CSS animations and transitions
- Vanilla JavaScript ES6+
- LocalStorage API
- Event handling and delegation
- Form validation
- Responsive design techniques

## 📝 Notes

- No backend server required
- Data is stored locally in browser
- Orders are simulated (not actually processed)
- Payment methods are for demonstration
- All products are example data

## 🚀 Deployment

To deploy this website:
1. Upload all files to a web hosting service
2. Ensure the folder structure is maintained
3. No build process or dependencies needed
4. Works on any static hosting (GitHub Pages, Netlify, Vercel, etc.)

## 📄 License

This project is free to use and modify for personal and commercial projects.

## 🎉 Enjoy Your Ecommerce Website!

Start customizing and adding your own products. Happy selling! 🛍️
