// pages/api/reviews/[id].js
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // GET - Get single review
  if (req.method === 'GET') {
    try {
      const review = await Review.findById(id)
        .populate('product', 'name image')
        .populate('user', 'name');

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      return res.status(200).json({
        success: true,
        review
      });

    } catch (error) {
      console.error('❌ Get review error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch review',
        message: error.message 
      });
    }
  }

  // PATCH - Update helpful votes
  else if (req.method === 'PATCH') {
    try {
      const { action } = req.body; // 'upvote' or 'downvote'

      if (!action || !['upvote', 'downvote'].includes(action)) {
        return res.status(400).json({ 
          error: 'Invalid action. Use "upvote" or "downvote"' 
        });
      }

      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (action === 'upvote') {
        review.helpfulVotes += 1;
      } else {
        review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
      }

      await review.save();

      return res.status(200).json({
        success: true,
        message: 'Review updated',
        helpfulVotes: review.helpfulVotes
      });

    } catch (error) {
      console.error('❌ Update review error:', error);
      return res.status(500).json({ 
        error: 'Failed to update review',
        message: error.message 
      });
    }
  }

  // DELETE - Delete review
  else if (req.method === 'DELETE') {
    try {
      const review = await Review.findById(id);

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      await review.deleteOne();

      console.log(`✅ Review deleted: ${id}`);

      return res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete review error:', error);
      return res.status(500).json({ 
        error: 'Failed to delete review',
        message: error.message 
      });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
