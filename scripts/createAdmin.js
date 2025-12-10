// scripts/createAdmin.js
// Run this script with: node scripts/createAdmin.js

import mongoose from 'mongoose';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manual env loading
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    console.log('👤 Creating admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@79bakers.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: '79 Bakers Admin',
      email: adminEmail,
      password: adminPassword,
      phone: '9876543210',
      role: 'admin',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      }
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', adminPassword);
    console.log('👑 Role:', admin.role);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

// Run script
connectDB().then(() => createAdmin());
