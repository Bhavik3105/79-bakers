// lib/auth.js
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Set auth cookie
export const setAuthCookie = (res, token) => {
  const cookie = serialize('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
  
  res.setHeader('Set-Cookie', cookie);
};

// Clear auth cookie
export const clearAuthCookie = (res) => {
  const cookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/'
  });
  
  res.setHeader('Set-Cookie', cookie);
};

// Get token from request
export const getTokenFromRequest = (req) => {
  const cookies = parse(req.headers.cookie || '');
  return cookies['auth-token'];
};

// Middleware to protect routes
export const protect = async (handler) => {
  return async (req, res) => {
    try {
      const token = getTokenFromRequest(req);
      
      if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
      }
      
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ error: 'Not authorized, invalid token' });
      }
      
      req.userId = decoded.userId;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized' });
    }
  };
};

// Middleware to check admin role
export const adminOnly = async (handler) => {
  return protect(async (req, res) => {
    try {
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(req.userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
      }
      
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ error: 'Access denied' });
    }
  });
};
