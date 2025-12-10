// scripts/seedProducts.js
// Run this script with: node scripts/seedProducts.js

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample cake data
const cakes = [
    {
        name: 'Chocolate Truffle Cake',
        description: 'Rich chocolate cake with truffle cream',
        price: 699,
        image: '/images/cakes/chocolate-truffle.jpg',
        category: 'Chocolate',
        inStock: true
    },
    {
        name: 'Red Velvet Cake',
        description: 'Classic red velvet with cream cheese frosting',
        price: 799,
        image: '/images/cakes/red-velvet.jpg',
        category: 'Eggless',
        inStock: true
    },
    {
        name: 'Butterscotch Delight',
        description: 'Butterscotch cake with caramel frosting',
        price: 649,
        image: '/images/cakes/butterscotch.jpg',
        category: 'Fruit',
        inStock: true
    },
    {
        name: 'Dark Chocolate',
        description: 'Intense dark chocolate cake',
        price: 500,
        image: '/images/cakes/dark-chocolate.jpeg',
        category: 'Chocolate',
        inStock: true
    },
    {
        name: 'Dutch Truffle',
        description: 'Dutch chocolate truffle cake',
        price: 550,
        image: '/images/cakes/dutch-truffle.jpeg',
        category: 'Chocolate',
        inStock: true
    },
    {
        name: 'Message Cake',
        description: 'Customizable cake with your message',
        price: 600,
        image: '/images/cakes/message-cake.jpeg',
        category: 'Eggless',
        inStock: true
    },
    {
        name: 'Theme Cake',
        description: 'Custom themed cake for any occasion',
        price: 750,
        image: '/images/cakes/theme-cake.jpeg',
        category: 'Customize',
        inStock: true
    },
    {
        name: 'Customize Cake',
        description: 'Fully customizable novelty cake',
        price: 850,
        image: '/images/cakes/customize-cake-novelty.jpeg',
        category: 'Customize',
        inStock: true
    },
    {
        name: 'Choco Chip Cake',
        description: 'Chocolate chip studded cake',
        price: 599,
        image: '/images/cakes/choco-chip-banner.jpeg',
        category: 'Chocolate',
        inStock: true
    }
];

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

const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Transform and enhance cake data for database
    const productsToSeed = cakes.map(cake => ({
      name: cake.name,
      description: cake.description || `Delicious ${cake.name} made with premium ingredients`,
      price: cake.price,
      image: cake.image,
      images: [cake.image], // Add more images in production
      category: cake.category,
      sizes: cake.sizes || [
        { size: '1 kg', price: cake.price },
        { size: '2 kg', price: cake.price * 1.8 },
        { size: '3 kg', price: cake.price * 2.5 }
      ],
      ingredients: cake.ingredients || [
        'Premium flour',
        'Fresh eggs',
        'Pure butter',
        'Sugar',
        'Vanilla extract'
      ],
      allergens: cake.allergens || ['Gluten', 'Eggs', 'Dairy'],
      rating: cake.rating || Math.floor(Math.random() * 2) + 4, // 4-5 rating
      reviewCount: cake.reviewCount || Math.floor(Math.random() * 50) + 10,
      isBestseller: cake.bestseller || false,
      inStock: true,
      preparationTime: '24 hours',
      customizationOptions: [
        'Custom message on cake',
        'Add photo print (+₹200)',
        'Extra layers (+₹150)',
        'Sugar-free option',
        'Eggless option'
      ],
      nutritionalInfo: {
        calories: Math.floor(Math.random() * 100) + 350,
        protein: Math.floor(Math.random() * 5) + 3,
        carbs: Math.floor(Math.random() * 20) + 40,
        fat: Math.floor(Math.random() * 10) + 10
      }
    }));

    // Insert products
    const products = await Product.insertMany(productsToSeed);
    console.log(`✅ Seeded ${products.length} products`);

    // Display seeded products
    console.log('\n📦 Products seeded:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.category})`);
    });

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => seedProducts());
