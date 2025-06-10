# Limon Cords LLC - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended for beginners)

#### Method A: Direct Upload
1. **Zip the entire project folder**
2. **Go to** [netlify.com](https://netlify.com) and create account
3. **Drag and drop** the zip file to Netlify dashboard
4. **Configure environment variables** (see below)
5. **Set up custom domain** (optional)

#### Method B: GitHub + Netlify (Professional workflow)
1. **Create GitHub repository**
2. **Upload all project files** to the repository
3. **Connect Netlify to GitHub** repository
4. **Auto-deploy** on every change
5. **Configure environment variables**

### Option 2: Vercel
1. **Upload to GitHub** repository
2. **Connect** [vercel.com](https://vercel.com) to GitHub
3. **Deploy** with one click
4. **Configure environment variables**

### Option 3: Traditional Web Hosting
1. **Upload all files** via FTP/cPanel
2. **Ensure** all files maintain folder structure
3. **Configure** environment variables through hosting panel

## ⚙️ Environment Variables Configuration

### Required Variables
Add these in your hosting platform's environment variables section:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
STRIPE_SECRET_KEY=sk_live_or_test_key
```

### Platform-Specific Setup

#### Netlify Environment Variables
1. Go to **Site settings** → **Environment variables**
2. Click **Add variable** for each required variable
3. **Deploy** the site after adding variables

#### Vercel Environment Variables
1. Go to **Project settings** → **Environment Variables**
2. Add each variable with appropriate environment (Production/Preview)
3. **Redeploy** after adding variables

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. **Create new project**
3. **Note down** your project URL and anon key

### 2. Run Database Schema
Copy and paste this SQL in Supabase SQL Editor:

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

-- Insert sample products
INSERT INTO products (name, type, color, length, capacity, price, original_price, description, image_url) VALUES
('Professional-Grade Diamond Weave Bungee Cord', 'diamond-weave', 'black', 17, '261 lbs', 3.00, 5.00, 'Heavy-duty diamond weave shock cord designed for securing cargo and trailers.', 'https://via.placeholder.com/300x250/000000/FFFFFF?text=Black+Diamond+Weave'),
('Professional-Grade Half-Inch Bungee Cord', 'standard', 'black', 17, '555 lbs', 3.00, 5.00, 'Ultra-strong half-inch cord with maximum weight capacity for commercial use.', 'https://via.placeholder.com/300x250/000000/FFFFFF?text=Black+Half+Inch'),
('Professional-Grade Standard Bungee Cord', 'standard', 'white', 17, '200 lbs', 2.50, 4.00, 'Versatile standard bungee cord available in multiple colors and lengths.', 'https://via.placeholder.com/300x250/FFFFFF/000000?text=White+Cord'),
('Professional-Grade Standard Bungee Cord', 'standard', 'purple', 17, '200 lbs', 2.50, 4.00, 'Versatile standard bungee cord available in multiple colors and lengths.', 'https://via.placeholder.com/300x250/800080/FFFFFF?text=Purple+Cord'),
('Professional-Grade Standard Bungee Cord', 'standard', 'beige', 17, '200 lbs', 2.50, 4.00, 'Versatile standard bungee cord available in multiple colors and lengths.', 'https://ik.imagekit.io/ujadxty3d/singleBaigeBungeeCord.png?updatedAt=1749432962875');
```

## 💳 Payment Setup (Stripe)

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. **Complete account setup**
3. **Get API keys** from Dashboard → Developers → API keys

### 2. Configure Webhooks
1. Go to **Developers** → **Webhooks**
2. **Add endpoint**: `https://your-domain.com/api/webhook`
3. **Select events**: `checkout.session.completed`, `payment_intent.succeeded`
4. **Copy webhook secret** and add to environment variables

### 3. Test Payments
Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002

## 🔐 Admin Panel Access

### URL Structure
```
https://your-domain.com/admin-manager-2024.html
```

### Login Credentials
- **Password**: `bungee2024admin`
- **Session**: 30 minutes timeout

### Security Features
- Hidden from search engines
- No public links
- Password protection
- Session management

## 📱 Testing Checklist

### Pre-Launch Testing
- [ ] Homepage loads correctly
- [ ] Product filtering works
- [ ] Shopping cart functions
- [ ] Contact form submits
- [ ] Admin panel accessible
- [ ] Mobile responsive design
- [ ] All images display
- [ ] Links work correctly

### Post-Launch Testing
- [ ] SSL certificate active
- [ ] Custom domain working
- [ ] Database connections
- [ ] Payment processing
- [ ] Email notifications
- [ ] Form submissions
- [ ] Search engine indexing

## 🔧 Troubleshooting

### Common Issues

**Site won't load:**
- Check file structure is maintained
- Verify index.html is in root directory
- Check for JavaScript errors in browser console

**Admin panel not working:**
- Ensure URL includes full filename: `/admin-manager-2024.html`
- Check password: `bungee2024admin`
- Clear browser cache

**Database not connecting:**
- Verify Supabase URL and key
- Check environment variables
- Ensure database tables are created

**Payments not processing:**
- Verify Stripe keys are correct
- Check webhook configuration
- Ensure SSL is enabled

### Getting Help
1. Check browser console for errors
2. Verify all environment variables
3. Test on different browsers/devices
4. Check hosting platform logs

## 📊 Performance Optimization

### Image Optimization
- Compress images before upload
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading
- Optimize for different screen sizes

### Speed Improvements
- Enable gzip compression
- Set up CDN (Cloudflare)
- Minify CSS/JavaScript
- Optimize font loading

### SEO Setup
- Submit sitemap to Google Search Console
- Set up Google Analytics
- Configure Facebook Pixel
- Add structured data markup

## 🚀 Go Live Checklist

### Final Steps
- [ ] Test all functionality
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure DNS settings
- [ ] Test payment processing
- [ ] Verify admin panel access
- [ ] Set up monitoring alerts
- [ ] Create backup procedures

### Post-Launch
- [ ] Monitor site performance
- [ ] Check error logs
- [ ] Test mobile experience
- [ ] Verify SEO indexing
- [ ] Monitor payment processing
- [ ] Review admin panel functionality

## 📞 Support

For deployment assistance or technical issues, refer to:
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)

Your website is now ready for professional deployment! 🎉
