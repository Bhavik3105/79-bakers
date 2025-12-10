// pages/api/auth/logout.js
import { clearAuthCookie } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    return res.status(500).json({ 
      error: 'Logout failed',
      message: error.message 
    });
  }
}
