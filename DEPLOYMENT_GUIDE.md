# 🚀 Electrolux EMS Deployment Guide

## 📋 Table of Contents
1. [Cleanup Before Deployment](#cleanup)
2. [Deployment Strategy](#strategy)
3. [Vercel + PlanetScale Setup](#vercel-setup)
4. [Azure Setup (Student Credits)](#azure-setup)
5. [Auto-Deployment Setup](#auto-deployment)

---

## 🧹 Cleanup Before Deployment {#cleanup}

### Step 1: Remove Test Files
```bash
# Delete all test and documentation files
rm -f *.md *.sql *.js
# Keep only essential files
git add .
git commit -m "Clean up test files before deployment"
```

**Files to DELETE:**
- All `.md` files except `README.md`
- All `.sql` backup files
- All test `.js` files in root
- Backup files

### Step 2: Update .gitignore
Already configured! ✅

### Step 3: Verify No Secrets Committed
```bash
# Make sure .env.local is NOT committed
git ls-files | grep .env
# Should return nothing!
```

---

## 🎯 Deployment Strategy {#strategy}

### **Option A: FREE Forever (Recommended)**
```
Vercel (Frontend + API) - FREE
    └── Next.js App

PlanetScale (MySQL) - FREE Tier
    └── Database (5GB, 1B rows)
```

**Cost:** $0/month forever ✅

### **Option B: Azure (While Student)**
```
Azure App Service - FREE with credits
Azure MySQL - FREE with credits
```

**Cost:** $0 for 2 years, then $28-38/month

### **Recommended Path:**
1. **Use Azure while student** (learn cloud platform)
2. **Migrate to Vercel + PlanetScale** when credits expire
3. **Zero cost forever!**

---

## 🚀 Option 1: Vercel + PlanetScale (FREE Forever) {#vercel-setup}

### Step 1: Create PlanetScale Database

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create new database: `electrolux-ems`
4. Get connection string:
   ```
   mysql://user:pass@aws.connect.psdb.cloud/electrolux-ems?sslaccept=strict
   ```

### Step 2: Prepare Project

Create `.env.production`:
```bash
# Database
DB_HOST=aws.connect.psdb.cloud
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=electrolux-ems

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate_new_secret_here

# JWT
JWT_SECRET=generate_new_jwt_secret

# API
NEXT_PUBLIC_API_URL=https://your-app.vercel.app

# Admin
ADMIN_SECRET_KEY=ElectroluxDBMS2025Admin!
```

### Step 3: Update Database Config for Production

Update `src/lib/drizzle/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined,
});

export const db = drizzle(pool);
```

### Step 4: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables via Vercel Dashboard
# Settings → Environment Variables
```

### Step 5: Run Database Migrations

```bash
# Push schema to PlanetScale
npx drizzle-kit push:mysql

# Or generate migration
npx drizzle-kit generate:mysql
npx drizzle-kit migrate
```

### Step 6: Seed Database (Optional)

```bash
# Run seed script on production database
node src/lib/drizzle/seed.ts
```

---

## ☁️ Option 2: Azure Deployment (Student Credits) {#azure-setup}

### Step 1: Create Azure MySQL Database

```bash
# Install Azure CLI
# Download from: https://aka.ms/installazurecliwindows

# Login
az login

# Create resource group
az group create --name electrolux-rg --location eastus

# Create MySQL server
az mysql flexible-server create \
  --resource-group electrolux-rg \
  --name electrolux-mysql \
  --location eastus \
  --admin-user adminuser \
  --admin-password YourSecurePassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 20

# Create database
az mysql flexible-server db create \
  --resource-group electrolux-rg \
  --server-name electrolux-mysql \
  --database-name electricity_ems

# Configure firewall
az mysql flexible-server firewall-rule create \
  --resource-group electrolux-rg \
  --name electrolux-mysql \
  --rule-name AllowAll \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

### Step 2: Create App Service

```bash
# Create App Service plan
az appservice plan create \
  --name electrolux-plan \
  --resource-group electrolux-rg \
  --sku F1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group electrolux-rg \
  --plan electrolux-plan \
  --name electrolux-ems \
  --runtime "NODE|18-lts"
```

### Step 3: Configure Environment Variables

```bash
az webapp config appsettings set \
  --resource-group electrolux-rg \
  --name electrolux-ems \
  --settings \
  DB_HOST=electrolux-mysql.mysql.database.azure.com \
  DB_USER=adminuser \
  DB_PASSWORD=YourSecurePassword123! \
  DB_NAME=electricity_ems \
  NEXTAUTH_URL=https://electrolux-ems.azurewebsites.net \
  NEXTAUTH_SECRET=your_secret \
  JWT_SECRET=your_jwt_secret
```

### Step 4: Deploy from GitHub

```bash
# Configure deployment
az webapp deployment source config \
  --name electrolux-ems \
  --resource-group electrolux-rg \
  --repo-url https://github.com/yourusername/electrolux-ems \
  --branch main \
  --manual-integration
```

---

## 🔄 Auto-Deployment Setup {#auto-deployment}

### Vercel Auto-Deployment

1. Connect GitHub repo to Vercel
2. Every `git push` to main → Auto deploys
3. Preview deployments for branches
4. Rollback with one click

### Azure Auto-Deployment

1. Enable GitHub Actions in Azure Portal
2. Azure creates `.github/workflows/azure-deploy.yml`
3. Every push → Auto builds and deploys

---

## 🎓 Cost Breakdown

### FREE Forever Option:
- **Vercel**: FREE (Hobby)
- **PlanetScale**: FREE (5GB)
- **Total**: $0/month ✅

### Azure Student Option:
- **Year 1-2**: FREE ($100/month credits)
- **After graduation**: $28-38/month
- **Migration**: Switch to Vercel + PlanetScale

---

## 📝 Quick Commands Reference

### Deploy to Vercel:
```bash
vercel --prod
```

### Check deployment status:
```bash
vercel ls
```

### View logs:
```bash
vercel logs
```

### Azure deployment:
```bash
az webapp log tail --name electrolux-ems --resource-group electrolux-rg
```

---

## ✅ Post-Deployment Checklist

- [ ] Database connected and accessible
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Seed data added (if needed)
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] Login works (test admin, employee, customer)
- [ ] All features working
- [ ] Error tracking setup (Sentry optional)

---

## 🎯 Recommended Timeline

**For University Project (Next 2 Years):**
1. ✅ Deploy to **Azure** (use student credits)
2. ✅ Learn cloud platform
3. ✅ Add to resume/portfolio

**After Graduation:**
1. ✅ Migrate to **Vercel + PlanetScale**
2. ✅ FREE forever
3. ✅ Keep project live

---

## 🆘 Troubleshooting

### Database connection fails:
```bash
# Test connection
mysql -h your-host -u user -p database

# Check firewall rules
# Azure: Allow all IPs (0.0.0.0 - 255.255.255.255)
# PlanetScale: No firewall needed
```

### Build fails:
```bash
# Test locally
npm run build

# Check logs
vercel logs
# or
az webapp log tail
```

### Environment variables not working:
```bash
# Restart app
vercel --prod
# or
az webapp restart --name electrolux-ems --resource-group electrolux-rg
```

---

**Created:** 2025-11-08
**Project:** Electrolux EMS - Electricity Management System
