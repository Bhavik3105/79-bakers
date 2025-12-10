# 🚀 Vercel Deployment Guide for 79 Baker's

## ✅ Prerequisites Completed
- [x] Code pushed to GitHub
- [ ] MongoDB Atlas account (production database)
- [ ] Secure JWT secret generated

---

## Step 1: Set Up MongoDB Atlas (10 minutes)

### 1.1 Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email

### 1.2 Create Cluster
1. Click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select your preferred **Cloud Provider & Region** (choose closest to you)
4. Name your cluster: `79bakers-cluster`
5. Click **"Create"**

### 1.3 Create Database User
1. In "Security" → "Database Access"
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `79bakers-admin`
5. Password: **Generate a secure password** (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.4 Allow Network Access
1. In "Security" → "Network Access"
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed for Vercel's serverless functions
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://79bakers-admin:<password>@79bakers-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name after `.net/`: 
   ```
   mongodb+srv://79bakers-admin:YOUR_PASSWORD@79bakers-cluster.xxxxx.mongodb.net/79bakers?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for Vercel.

---

## Step 2: Generate Secure JWT Secret (2 minutes)

### Option A: PowerShell (Windows)
Run this in your project folder:
```powershell
.\scripts\generateJWTSecret.ps1
```

### Option B: Manual Generation
Visit [RandomKeygen](https://randomkeygen.com/) and copy a "Fort Knox Password"

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Save this secret!** You'll need it for Vercel.

---

## Step 3: Deploy to Vercel (5 minutes)

### 3.1 Sign Up / Login to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 3.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find **"79-bakers"** repository
3. Click **"Import"**

### 3.3 Configure Project
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (leave default)
3. **Build Command**: `next build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your generated JWT secret |
| `NEXT_PUBLIC_SITE_URL` | Leave empty for now (will update after deployment) |

**Example:**
```
MONGODB_URI: mongodb+srv://79bakers-admin:MyPassword123@79bakers-cluster.xxxxx.mongodb.net/79bakers?retryWrites=true&w=majority

JWT_SECRET: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

NEXT_PUBLIC_SITE_URL: (leave empty)
```

### 3.5 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. 🎉 Your site is live!

---

## Step 4: Update Site URL & Redeploy (2 minutes)

### 4.1 Get Your Vercel URL
After deployment, you'll see something like:
```
https://79-bakers.vercel.app
```
or
```
https://79-bakers-bhavik3105.vercel.app
```

### 4.2 Update Environment Variable
1. Go to Project **Settings** → **Environment Variables**
2. Click **Edit** on `NEXT_PUBLIC_SITE_URL`
3. Enter your Vercel URL (e.g., `https://79-bakers.vercel.app`)
4. Click **Save**

### 4.3 Redeploy
1. Go to **Deployments** tab
2. Click **...** on the latest deployment
3. Click **Redeploy**
4. Wait for redeployment (1-2 minutes)

---

## Step 5: Seed Production Database (5 minutes)

### 5.1 Clone Your Repo (if not already local)
```bash
git clone https://github.com/Bhavik3105/79-bakers.git
cd 79-bakers
npm install
```

### 5.2 Create Production .env.local
Create `.env.local` with your PRODUCTION values:
```env
MONGODB_URI=mongodb+srv://79bakers-admin:YOUR_PASSWORD@79bakers-cluster.xxxxx.mongodb.net/79bakers?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_SITE_URL=https://79-bakers.vercel.app
```

### 5.3 Run Seed Scripts
```bash
# Seed products
node scripts/seedProducts.js

# Create admin user
node scripts/createAdmin.js
```

You should see:
```
✅ MongoDB connected
✅ 9 products seeded successfully
✅ Admin user created: admin@79bakers.com
```

---

## Step 6: Test Your Live Site! 🎉

### 6.1 Visit Your Site
Open your Vercel URL: `https://79-bakers.vercel.app`

### 6.2 Test Customer Flow
1. ✅ Homepage loads with products
2. ✅ Click a product → View details
3. ✅ Add to cart
4. ✅ Register new account
5. ✅ Complete checkout
6. ✅ View "My Orders"

### 6.3 Test Admin Panel
1. ✅ Login with: `admin@79bakers.com` / `admin123`
2. ✅ Access Admin Panel
3. ✅ Add a new product
4. ✅ View orders
5. ✅ Update order status

---

## 🎯 Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Products display correctly
- [ ] Shopping cart works
- [ ] User registration/login works
- [ ] Checkout creates orders
- [ ] Admin panel accessible
- [ ] All images load
- [ ] Mobile responsive works

---

## 🔧 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: 
- Check MongoDB Atlas connection string is correct
- Verify IP whitelist includes `0.0.0.0/0`
- Ensure database user password is correct

### Issue: "Products not showing"
**Solution**:
- Run seed scripts: `node scripts/seedProducts.js`
- Check MongoDB Atlas → Collections → products exists

### Issue: "Login not working"
**Solution**:
- Verify `JWT_SECRET` is set in Vercel environment variables
- Check browser allows cookies
- Try clearing browser cache

### Issue: "Images not loading"
**Solution**:
- Verify images exist in `/public/images/cakes/`
- Check image URLs in database match file names
- Ensure files were committed to GitHub

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain
1. Buy a domain from Namecheap, GoDaddy, etc.
2. In Vercel → Project Settings → Domains
3. Add your domain (e.g., `79bakers.com`)
4. Update DNS records as instructed
5. Wait for DNS propagation (up to 48 hours)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)
- Go to your project → **Analytics**
- See page views, visitors, performance

### MongoDB Atlas Monitoring
- Go to Atlas → Cluster → **Metrics**
- Monitor database performance
- Set up alerts for downtime

---

## 🔄 Future Updates

### Update Your Site
1. Make changes locally
2. Commit to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. Vercel auto-deploys on push! 🚀

### Rollback if Needed
1. Go to Vercel → **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**

---

## 💰 Costs

### Current Setup (FREE)
- ✅ **Vercel**: Free (Hobby plan)
- ✅ **MongoDB Atlas**: Free (M0 tier, 512MB)
- ✅ **GitHub**: Free
- **Total Monthly Cost: $0**

### When to Upgrade
- More than 100GB bandwidth/month → Vercel Pro ($20/mo)
- Database > 512MB → MongoDB Atlas ($9/mo)
- Need team collaboration → Vercel Team plans

---

## 🎉 Congratulations!

Your 79 Baker's e-commerce site is now **LIVE** on the internet! 

**Your URLs:**
- **Website**: https://79-bakers.vercel.app
- **Admin**: https://79-bakers.vercel.app/admin
- **GitHub**: https://github.com/Bhavik3105/79-bakers

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Docs**: https://nextjs.org/docs

---

**Built with ❤️ and deployed successfully! 🚀**
