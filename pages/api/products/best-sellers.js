import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get the limit from query params (default to 6 for best sellers section)
    const limit = parseInt(req.query.limit) || 6;

    // Aggregate orders to find products that have been ordered the most
    const bestSellingProducts = await Order.aggregate([
      // Only include completed/delivered orders
      {
        $match: {
          status: { $in: ['delivered', 'processing', 'confirmed', 'out_for_delivery'] }
        }
      },
      // Unwind the items array to process each item separately
      { $unwind: '$items' },
      // Group by product name and sum quantities
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] } 
          }
        }
      },
      // Sort by total quantity sold (descending)
      { $sort: { totalQuantity: -1 } },
      // Limit to top sellers
      { $limit: limit }
    ]);

    // Get the product names from the aggregation
    const productNames = bestSellingProducts.map(item => item._id);

    // Fetch full product details from Product collection
    const products = await Product.find({
      name: { $in: productNames }
    }).lean();

    // Combine product data with sales stats
    const bestSellers = products.map(product => {
      const salesData = bestSellingProducts.find(
        item => item._id === product.name
      );
      return {
        _id: product._id,
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        totalSold: salesData?.totalQuantity || 0,
        totalRevenue: salesData?.totalRevenue || 0
      };
    });

    // Sort by total sold to maintain order
    bestSellers.sort((a, b) => b.totalSold - a.totalSold);

    // If we don't have enough best sellers from orders, fill with popular products
    if (bestSellers.length < limit) {
      const additionalProducts = await Product.find({
        _id: { $nin: bestSellers.map(p => p._id) },
        inStock: true
      })
        .sort({ createdAt: -1 }) // Get newest products
        .limit(limit - bestSellers.length)
        .lean();

      additionalProducts.forEach(product => {
        bestSellers.push({
          _id: product._id,
          id: product._id.toString(),
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          totalSold: 0,
          totalRevenue: 0
        });
      });
    }

    res.status(200).json({
      success: true,
      count: bestSellers.length,
      data: bestSellers
    });

  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching best sellers',
      error: error.message 
    });
  }
}
