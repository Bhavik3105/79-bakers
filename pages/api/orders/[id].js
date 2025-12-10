// pages/api/orders/[id].js
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // GET - Get single order
  if (req.method === 'GET') {
    try {
      const order = await Order.findById(id)
        .populate('items.product', 'name image category');

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json({
        success: true,
        order
      });

    } catch (error) {
      console.error('❌ Get order error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch order',
        message: error.message 
      });
    }
  }

  // PATCH - Update order status
  else if (req.method === 'PATCH') {
    try {
      const { orderStatus, paymentStatus, trackingNumber } = req.body;

      const updateData = {};

      if (orderStatus) {
        updateData.orderStatus = orderStatus;
      }

      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      const order = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('items.product', 'name image');

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      console.log(`✅ Order ${order.orderNumber} updated:`, orderStatus || paymentStatus);

      // TODO: Send status update email
      // if (orderStatus) {
      //   await sendOrderStatusEmail(order);
      // }

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        order
      });

    } catch (error) {
      console.error('❌ Update order error:', error);
      return res.status(500).json({ 
        error: 'Failed to update order',
        message: error.message 
      });
    }
  }

  // DELETE - Cancel order
  else if (req.method === 'DELETE') {
    try {
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Only allow cancellation of pending/confirmed orders
      if (['processing', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
        return res.status(400).json({ 
          error: 'Cannot cancel order in current status',
          currentStatus: order.orderStatus
        });
      }

      order.orderStatus = 'cancelled';
      await order.save();

      console.log(`✅ Order ${order.orderNumber} cancelled`);

      // TODO: Send cancellation email
      // await sendOrderCancellationEmail(order);

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        order
      });

    } catch (error) {
      console.error('❌ Cancel order error:', error);
      return res.status(500).json({ 
        error: 'Failed to cancel order',
        message: error.message 
      });
    }
  }

  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
