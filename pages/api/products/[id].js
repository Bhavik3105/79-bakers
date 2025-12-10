// pages/api/products/[id].js
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // GET - Get single product
  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({
        success: true,
        product
      });

    } catch (error) {
      console.error('❌ Get product error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch product',
        message: error.message 
      });
    }
  }

  // PUT - Update product (admin only)
  else if (req.method === 'PUT') {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product
      });

    } catch (error) {
      console.error('❌ Update product error:', error);
      return res.status(500).json({ 
        error: 'Failed to update product',
        message: error.message 
      });
    }
  }

  // DELETE - Delete product (admin only)
  else if (req.method === 'DELETE') {
    try {
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete product error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete product',
        message: error.message 
      });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
