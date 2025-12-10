// pages/api/auth/me.js
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }

    await connectDB();

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Get user error:', error);
    return res.status(500).json({ 
      error: 'Failed to get user',
      message: error.message 
    });
  }
}
