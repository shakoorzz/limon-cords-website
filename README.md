# limon-cords-website
# Limon Cords LLC - E-Commerce Website

Professional-grade bungee cord e-commerce website with complete backend integration and admin panel.

## 🌟 Features

- **Professional Design**: High-converting e-commerce layout optimized for sales
- **Product Catalog**: Complete product management with filtering and search
- **Shopping Cart**: Full cart functionality with session persistence
- **Payment Processing**: Stripe integration for secure payments
- **Admin Panel**: Hidden inventory management system
- **Custom Orders**: Contact forms for bulk and custom orders
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Backend Integration**: Supabase for database and authentication

## 🚀 Quick Deployment

### Option 1: Netlify (Recommended)
1. Upload all files to a GitHub repository
2. Connect Netlify to your GitHub repo
3. Set environment variables in Netlify dashboard
4. Deploy automatically

### Option 2: Direct Upload
1. Drag the entire project folder to Netlify
2. Configure environment variables
3. Set up custom domain

## 🔧 Setup Instructions

### 1. Environment Variables
Create these environment variables in your hosting platform:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Supabase Database Setup

#### Create Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  length INTEGER NOT NULL,
  capacity VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  product_id INTEGER REFERENCES products(id),
  color VARCHAR(50) NOT NULL,
  length INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact requests table
CREATE TABLE contact_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  order_type VARCHAR(100),
  custom_length INTEGER,
  custom_color VARCHAR(50),
  quantity INTEGER,
  timeline VARCHAR(50),
  application VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Insert Sample Products
```sql
INSERT INTO products (name, type, color, length, capacity, price, original_price, description, image_url) VALUES
('Professional-Grade Diamond Weave Bungee Cord', 'diamond-weave', 'black', 17, '261 lbs', 3.00, 5.00, 'Heavy-duty diamond weave shock cord designed for securing cargo and trailers.', 'https://via.placeholder.com/300x250/000000/FFFFFF?text=Black+Diamond+Weave'),
('Professional-Grade Half-Inch Bungee Cord', 'standard', 'black', 17, '555 lbs', 3.00, 5.00, 'Ultra-strong half-inch cord with maximum weight capacity for commercial use.', 'https://via.placeholder.com/300x250/000000/FFFFFF?text=Black+Half+Inch'),
('Professional-Grade Standard Bungee Cord', 'standard', 'white', 17, '200 lbs', 2.50, 4.00, 'Versatile standard bungee cord available in multiple colors and lengths.', 'https://via.placeholder.com/300x250/FFFFFF/000000?text=White+Cord'),
('Professional-Grade Standard Bungee Cord', 'standard', 'purple', 17, '200 lbs', 2.50, 4.00, 'Versatile standard bungee cord available in multiple colors and lengths.', 'https://via.placeholder.com/300x250/800080/FFFFFF?text=Purple+Cord'),
('Professional-Grade Standard Bungee Cord', 'standard', 'beige', 17, '200 lbs', 2.50, 4.00, 'Versatile standard bungee cord available in multiple colors and lengths.', 'https://ik.imagekit.io/ujadxty3d/singleBaigeBungeeCord.png?updatedAt=1749432962875');
```

### 3. Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your publishable and secret keys from the dashboard
3. Add webhook endpoint for order processing
4. Configure payment methods and currencies

## 🔐 Admin Panel Access

### URL: `yoursite.com/admin-manager-2024.html`
### Password: `bungee2024admin`

**Admin Features:**
- Product inventory management
- Pricing controls
- Order processing
- Contact request management
- Website analytics
- System settings

**Security Features:**
- Hidden URL (not linked anywhere on public site)
- Password protection
- Session timeout (30 minutes)
- No search engine indexing

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full layout with all features)
- **Laptop**: 1024px-1199px (Optimized layout)
- **Tablet**: 768px-1023px (Touch-friendly interface)
- **Mobile**: 320px-767px (Mobile-first design)

## 🛒 E-Commerce Features

### Shopping Cart
- Add/remove items
- Quantity adjustments
- Session persistence
- Tax calculations
- Secure checkout

### Product Management
- Multiple variants (color, length, type)
- Dynamic pricing
- Inventory tracking
- Image galleries
- Detailed specifications

### Payment Processing
- Stripe integration
- Multiple payment methods
- Secure transactions
- Order confirmations
- Email receipts

## 📧 Contact & Custom Orders

The contact system handles:
- Custom length requests
- Bulk order inquiries
- Industrial solutions
- Color customization
- Technical consultations

## 🎨 Customization

### Colors
Update the color scheme in `assets/css/styles.css`:
```css
:root {
  --primary-color: #3498db;
  --secondary-color: #f39c12;
  --accent-color: #e74c3c;
  --text-color: #2c3e50;
}
```

### Products
Add new products by updating the products array in `assets/js/app.js` or through the admin panel.

### Images
Replace placeholder images with actual product photos. Update URLs in the database or JavaScript configuration.

## 🔍 SEO Optimization

The website includes:
- Semantic HTML structure
- Meta descriptions and keywords
- Open Graph tags
- Structured data markup
- Fast loading times
- Mobile-friendly design

## 📊 Analytics Integration

Ready for:
- Google Analytics 4
- Facebook Pixel
- Custom event tracking
- Conversion monitoring
- Performance metrics

## 🛠️ Development

### File Structure
```
limon-cords-website/
├── index.html              # Homepage
├── shop.html               # Product catalog
├── contact.html            # Contact/custom orders
├── admin-manager-2024.html # Hidden admin panel
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── app.js          # Main JavaScript
│   └── images/             # Image assets
├── README.md               # This file
├── .env.example            # Environment variables template
└── package.json            # Project configuration
```

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. For full functionality, serve via local server (Live Server extension in VS Code)

### Making Changes
1. Edit HTML files for content updates
2. Modify `assets/css/styles.css` for styling
3. Update `assets/js/app.js` for functionality
4. Test all changes locally before deployment

## 🚨 Troubleshooting

### Common Issues

**Admin panel not accessible:**
- Ensure URL includes the full filename: `/admin-manager-2024.html`
- Check password: `bungee2024admin`
- Clear browser cache and cookies

**Payment processing not working:**
- Verify Stripe keys are correctly set
- Check webhook configuration
- Ensure HTTPS is enabled

**Products not loading:**
- Check Supabase connection
- Verify environment variables
- Check browser console for errors

**Images not displaying:**
- Verify image URLs are accessible
- Check for CORS issues
- Update placeholder URLs with actual images

## 📞 Support

For technical support or customization requests, contact the development team.

## 📄 License

Copyright © 2024 Limon Cords LLC. All rights reserved.
