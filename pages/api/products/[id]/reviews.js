// pages/api/products/[id]/reviews.js
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query; // Product ID

  // GET - Get all reviews for a product
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

      // Verify product exists
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const skip = (Number(page) - 1) * Number(limit);

      const reviews = await Review.find({ product: id })
        .populate('user', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      const total = await Review.countDocuments({ product: id });

      // Calculate rating distribution
      const ratingStats = await Review.aggregate([
        { $match: { product: product._id } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } }
      ]);

      const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      };

      ratingStats.forEach(stat => {
        ratingDistribution[stat._id] = stat.count;
      });

      return res.status(200).json({
        success: true,
        count: reviews.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        averageRating: product.rating,
        ratingDistribution,
        reviews
      });

    } catch (error) {
      console.error('❌ Get reviews error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch reviews',
        message: error.message 
      });
    }
  }

  // POST - Create a review
  else if (req.method === 'POST') {
    try {
      const { rating, comment, userName, userEmail, images } = req.body;

      // Validation
      if (!rating || !comment || !userName || !userEmail) {
        return res.status(400).json({ 
          error: 'Please provide rating, comment, name, and email' 
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          error: 'Rating must be between 1 and 5' 
        });
      }

      // Verify product exists
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if user already reviewed (by email)
      const existingReview = await Review.findOne({ 
        product: id, 
        userEmail 
      });

      if (existingReview) {
        return res.status(400).json({ 
          error: 'You have already reviewed this product' 
        });
      }

      // Create review
      const review = await Review.create({
        product: id,
        userName,
        userEmail,
        rating,
        comment,
        images: images || [],
        verifiedPurchase: false // Set to true if you verify order
      });

      console.log(`✅ Review created for product: ${product.name}`);

      // Populate user data before sending response
      await review.populate('product', 'name image');

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        review
      });

    } catch (error) {
      console.error('❌ Create review error:', error);
      return res.status(500).json({ 
        error: 'Failed to submit review',
        message: error.message 
      });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
