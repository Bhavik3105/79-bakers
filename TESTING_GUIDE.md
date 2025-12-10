# 79 Baker's - Complete Testing Guide

## 🧪 Testing Checklist

Use this checklist to verify all features work correctly before deployment.

---

## 1. Homepage Testing

### Basic Display
- [ ] Page loads without errors
- [ ] Slideshow banner displays and auto-rotates
- [ ] "Our Delicious Cakes" section visible
- [ ] Filter bar loads (Search, Category, Price, Rating)
- [ ] Products grid displays cakes from database
- [ ] "Best Sellers" section shows products
- [ ] Footer displays contact info

### Product Cards
- [ ] Product images load correctly
- [ ] Product names visible
- [ ] Prices display (₹)
- [ ] "View Details" button works
- [ ] "Add to Cart" button works
- [ ] Hover effects work smoothly

### Filters
- [ ] Search by name works
- [ ] Category filter (Chocolate, Fruit, etc.)
- [ ] Price filter (Low, Medium, High)
- [ ] Rating filter works
- [ ] Filters can be combined

---

## 2. Product Detail Page

### Navigation
- [ ] Clicking product card opens detail page
- [ ] URL changes to `/product/[id]`
- [ ] Back button returns to previous page

### Product Information
- [ ] Product image displays correctly
- [ ] Product name shows
- [ ] Category badge visible
- [ ] Price displays prominently
- [ ] Description text visible
- [ ] Features section shows (Fresh Baked, Safe Delivery, etc.)

### Interactions
- [ ] Quantity selector works (+/-)
- [ ] "Add to Cart" button adds item
- [ ] "Buy Now" button goes to checkout
- [ ] Toast notification shows on add
- [ ] "Add to Wishlist" button toggles
- [ ] Share button works

### Related Products
- [ ] "You May Also Like" section shows
- [ ] Related products load correctly
- [ ] Clicking related product navigates correctly

---

## 3. Shopping Cart

### Cart Sidebar
- [ ] Cart icon shows item count
- [ ] Clicking cart icon opens sidebar
- [ ] Cart items display with images
- [ ] Quantity controls work (+/-)
- [ ] Remove item works (trash icon)
- [ ] Total price calculates correctly
- [ ] "Checkout" button visible
- [ ] Empty cart shows "Your cart is empty"

### Cart Calculations
- [ ] Subtotal updates when quantity changes
- [ ] Free delivery above ₹1000
- [ ] Delivery fee (₹50) shows if under ₹1000
- [ ] Total = Subtotal + Delivery fee

---

## 4. Authentication

### Registration
- [ ] Navigate to `/auth/register`
- [ ] Form fields: Name, Email, Phone, Password
- [ ] Validation shows errors
- [ ] Successful registration redirects
- [ ] User appears in navbar
- [ ] Toast notification shows

### Login
- [ ] Navigate to `/auth/login`
- [ ] Email and password fields work
- [ ] "Forgot password" link visible
- [ ] Successful login redirects
- [ ] Invalid credentials show error
- [ ] User menu appears in navbar

### User Menu
- [ ] User avatar shows first letter
- [ ] Dropdown opens on hover/click
- [ ] "My Profile" link visible
- [ ] "My Orders" link visible
- [ ] "Logout" button works
- [ ] Admin sees "Admin Panel" (if admin)

---

## 5. Checkout Process

### Step 1: Delivery Details
- [ ] Customer info section (Name, Email, Phone)
- [ ] Delivery address fields
- [ ] City and Pincode validation
- [ ] Delivery date picker (minimum tomorrow)
- [ ] Delivery time slots (Morning/Afternoon/Evening)
- [ ] Cake message field (optional)
- [ ] Special instructions (optional)
- [ ] All required field validation
- [ ] "Continue to Payment" button

### Step 2: Payment Method
- [ ] Cash on Delivery option
- [ ] Online Payment (Coming Soon badge)
- [ ] Order summary shows items
- [ ] Subtotal, delivery, total display
- [ ] "Back" button returns to step 1
- [ ] "Place Order" button works

### Step 3: Order Confirmation
- [ ] Green checkmark animation
- [ ] "Order Confirmed!" message
- [ ] Order number displays
- [ ] Delivery details shown
- [ ] Confirmation email message
- [ ] Payment method shown
- [ ] "Continue Shopping" button
- [ ] "View Order Details" button

### Database Verification
- [ ] Order saved in MongoDB
- [ ] Order has correct customer info
- [ ] Order has correct items
- [ ] Order status is "pending"
- [ ] Order number is unique

---

## 6. User Orders Page (`/orders`)

### Access
- [ ] Navigate via "My Orders" in user menu
- [ ] Redirects to login if not authenticated
- [ ] Only shows current user's orders

### Order List
- [ ] All user orders display
- [ ] Order number visible
- [ ] Order date shows
- [ ] Order status badge (color-coded)
- [ ] Total amount displays
- [ ] Order items show with images

### Filters
- [ ] Search by order number works
- [ ] Status filter works (All, Pending, Confirmed, etc.)
- [ ] Empty state shows if no orders

### Order Cards
- [ ] Delivery address visible
- [ ] Delivery schedule shown
- [ ] Cake message displays (if provided)
- [ ] Special instructions show (if provided)
- [ ] "View Details" button works

---

## 7. Order Detail Page (`/orders/[id]`)

### Access
- [ ] Clicking "View Details" opens page
- [ ] URL is `/orders/[orderId]`
- [ ] Only order owner can access
- [ ] Admin can access all orders

### Order Progress Tracker
- [ ] Progress bar shows (desktop)
- [ ] Status icons show (pending → delivered)
- [ ] Current status highlighted
- [ ] Steps list on mobile

### Order Information
- [ ] Order number in header
- [ ] Order date and time
- [ ] Current status badge
- [ ] Total amount prominent

### Order Items
- [ ] All items listed with images
- [ ] Item names and quantities
- [ ] Individual prices
- [ ] Subtotals calculated

### Delivery Info
- [ ] Complete delivery address
- [ ] Delivery date and time slot
- [ ] Cake message (if any)
- [ ] Special instructions (if any)

### Customer Info
- [ ] Customer name, email, phone
- [ ] Payment method
- [ ] Payment status

### Order Summary
- [ ] Subtotal
- [ ] Delivery fee
- [ ] Total amount
- [ ] "Contact Support" button

---

## 8. Admin Panel

### Access
- [ ] Login as admin (admin@79bakers.com)
- [ ] "Admin Panel" link in user menu
- [ ] Non-admins cannot access

### Admin Dashboard (`/admin`)
- [ ] Total Products count
- [ ] Total Orders count
- [ ] Total Revenue (₹)
- [ ] Pending Orders count
- [ ] Quick action buttons
- [ ] Recent orders list

### Products Management (`/admin/products`)
- [ ] All products list in table
- [ ] Search by product name
- [ ] **Floating "Add Product" button** (bottom-right pink circle)
- [ ] Edit button on each row
- [ ] Delete button on each row

#### Add Product
- [ ] Click floating button → modal opens
- [ ] Form fields: Name, Description, Price, Category, Image URL
- [ ] In Stock toggle
- [ ] "Save Product" button creates product
- [ ] Modal closes on success
- [ ] Product appears in list
- [ ] Toast notification shows

#### Edit Product
- [ ] Click edit icon → modal opens with data
- [ ] Can modify all fields
- [ ] "Update Product" button saves changes
- [ ] Changes reflect in table
- [ ] Toast notification shows

#### Delete Product
- [ ] Click delete icon → confirmation prompt
- [ ] Confirm → product removed
- [ ] Product disappears from list
- [ ] Toast notification shows

### Orders Management (`/admin/orders`)
- [ ] All orders display in table
- [ ] Order number, customer, total visible
- [ ] Status filter works
- [ ] Search by customer email/order number
- [ ] Status dropdown on each row
- [ ] Changing status updates immediately
- [ ] Toast notification shows

---

## 9. Best Sellers Feature

### Dynamic Best Sellers
- [ ] Homepage "Best Sellers" section
- [ ] Shows products with most orders
- [ ] Displays "X sold" badge on products
- [ ] Updates when new orders placed
- [ ] Shows newest products if no orders yet
- [ ] Trending icon visible

---

## 10. Contact & Info Pages

### Contact Page (`/contact`)
- [ ] Form displays correctly
- [ ] Name, Email, Phone, Message fields
- [ ] Submit button works
- [ ] Validation on required fields
- [ ] Success message after submit
- [ ] Contact saved in database

### About Page (`/about`)
- [ ] Page loads
- [ ] Content displays
- [ ] Images load

### Policy Pages
- [ ] Refund Policy page loads
- [ ] Return Policy page loads
- [ ] Content is readable

---

## 11. Performance Testing

### Page Load Speed
- [ ] Homepage loads < 3 seconds
- [ ] Product pages load quickly
- [ ] Images load progressively
- [ ] No console errors

### Responsiveness
- [ ] Mobile view (< 768px) works
- [ ] Tablet view (768px - 1024px) works
- [ ] Desktop view (> 1024px) works
- [ ] Touch interactions work on mobile

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 12. Database Verification

### Products
- [ ] 9 seeded products exist
- [ ] Products have all required fields
- [ ] Images paths are correct
- [ ] Categories are correct

### Users
- [ ] Admin user exists
- [ ] Can login as admin
- [ ] New registered users saved
- [ ] Passwords are hashed

### Orders
- [ ] Orders save correctly
- [ ] All fields populated
- [ ] Related to correct user
- [ ] Items array populated

---

## 13. Security Testing

### Authentication
- [ ] JWT tokens work
- [ ] Tokens stored in httpOnly cookies
- [ ] Protected routes redirect to login
- [ ] Admin routes check role

### Authorization
- [ ] Users can't access other users' orders
- [ ] Only admins can access admin panel
- [ ] Only admins can manage products
- [ ] API endpoints validate user role

### Input Validation
- [ ] Email format validated
- [ ] Phone number (10 digits) validated
- [ ] Pincode (6 digits) validated
- [ ] SQL injection prevented (Mongoose)
- [ ] XSS prevention (React escaping)

---

## 14. Error Handling

### User-Facing Errors
- [ ] 404 page for invalid routes
- [ ] Error messages are user-friendly
- [ ] Toast notifications show errors
- [ ] Form validation errors clear

### API Errors
- [ ] Invalid product ID returns error
- [ ] Invalid order returns 404
- [ ] Network errors handled gracefully
- [ ] Database errors logged

---

## 🎯 Priority Testing Order

1. **CRITICAL** (Must work before deployment):
   - [ ] Product display (homepage & detail)
   - [ ] Add to cart
   - [ ] Checkout → Order creation
   - [ ] Order viewing (user orders page)
   - [ ] Admin product management

2. **HIGH** (Should work before deployment):
   - [ ] Authentication (login/register)
   - [ ] Order tracking
   - [ ] Best sellers
   - [ ] Admin orders management

3. **MEDIUM** (Can fix after deployment):
   - [ ] Contact form
   - [ ] Filters and search
   - [ ] User profile
   - [ ] About/Policy pages

---

## 📊 Testing Results Template

```
=== TESTING RESULTS ===
Date: [DATE]
Tester: [NAME]

Homepage: ✅ / ❌
Product Details: ✅ / ❌
Cart: ✅ / ❌
Checkout: ✅ / ❌
Orders: ✅ / ❌
Admin Panel: ✅ / ❌
Authentication: ✅ / ❌

Critical Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]
```

---

## 🚀 Ready for Deployment?

**All tests passed?** → YES, deploy! 🎉
**Some tests failed?** → Fix critical issues first

---

Good luck with testing! 🧪✨
