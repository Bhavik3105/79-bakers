// pages/api/orders/index.js
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectDB();

  // POST - Create order
  if (req.method === 'POST') {
    try {
      const {
        items,
        customerInfo,
        deliveryAddress,
        deliveryDate,
        deliveryTime,
        specialInstructions,
        cakeMessage,
        paymentMethod
      } = req.body;

      // Validation
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'No items in order' });
      }

      if (!customerInfo || !deliveryAddress || !deliveryDate || !deliveryTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Calculate totals and validate products
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.id || item.product);
        
        if (!product) {
          return res.status(404).json({ 
            error: `Product not found: ${item.name}` 
          });
        }

        if (!product.inStock) {
          return res.status(400).json({ 
            error: `Product out of stock: ${product.name}` 
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          customization: item.customization || ''
        });
      }

      // Calculate delivery fee
      const deliveryFee = subtotal >= 1000 ? 0 : 50;
      const totalAmount = subtotal + deliveryFee;

      // Generate order number
      const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Create order
      const order = await Order.create({
        orderNumber,
        items: orderItems,
        customerInfo,
        deliveryAddress,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        specialInstructions,
        cakeMessage,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod,
        orderStatus: 'pending',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
      });

      console.log('✅ Order created:', order.orderNumber);

      // TODO: Send confirmation email
      // await sendOrderConfirmationEmail(order);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus
        }
      });

    } catch (error) {
      console.error('❌ Create order error:', error);
      return res.status(500).json({ 
        error: 'Failed to create order',
        message: error.message 
      });
    }
  }

  // GET - Get all orders (with filters)
  else if (req.method === 'GET') {
    try {
      const { 
        status, 
        email,
        orderNumber,
        page = 1,
        limit = 20
      } = req.query;

      const query = {};

      if (status) {
        query.orderStatus = status;
      }

      if (email) {
        query['customerInfo.email'] = email;
      }

      if (orderNumber) {
        query.orderNumber = orderNumber;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const orders = await Order.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .populate('items.product', 'name image');

      const total = await Order.countDocuments(query);

      return res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        orders
      });

    } catch (error) {
      console.error('❌ Get orders error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch orders',
        message: error.message 
      });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
