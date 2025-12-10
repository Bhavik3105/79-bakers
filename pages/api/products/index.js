// pages/api/products/index.js
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { 
        category, 
        minPrice, 
        maxPrice, 
        minRating,
        bestseller,
        search,
        sort = '-createdAt',
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      const query = { inStock: true };

      if (category) {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (minRating) {
        query.rating = { $gte: Number(minRating) };
      }

      if (bestseller === 'true') {
        query.bestseller = true;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Execute query with pagination
      const skip = (Number(page) - 1) * Number(limit);
      
      const products = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      const total = await Product.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        products
      });

    } catch (error) {
      console.error('❌ Get products error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch products',
        message: error.message 
      });
    }
  }

  // POST - Create product (admin only - will add auth later)
  else if (req.method === 'POST') {
    try {
      const product = await Product.create(req.body);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });

    } catch (error) {
      console.error('❌ Create product error:', error);
      return res.status(500).json({ 
        error: 'Failed to create product',
        message: error.message 
      });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
