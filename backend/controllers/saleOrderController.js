const { SaleOrder, SaleOrderLine, Product, Contact, PaymentTerm, CouponCode } = require('../models');
const { Op } = require('sequelize');

// Generate order number
const generateOrderNumber = async () => {
  const count = await SaleOrder.count();
  return `SO-${String(count + 1).padStart(6, '0')}`;
};

// Get all sale orders
const getSaleOrders = async (req, res) => {
  try {
    const { myOrders } = req.query;
    let where = {};

    // If myOrders is true, filter by user's contact
    if (myOrders === 'true' && req.user) {
      const contact = await Contact.findOne({ where: { userId: req.user.id } });
      if (contact) {
        where.contactId = contact.id;
      } else {
        return res.json({ success: true, orders: [] });
      }
    }

    const orders = await SaleOrder.findAll({
      where,
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: PaymentTerm,
          as: 'paymentTerm',
          attributes: ['id', 'name'],
        },
        {
          model: CouponCode,
          as: 'couponCode',
          attributes: ['id', 'code'],
        },
        {
          model: SaleOrderLine,
          as: 'lines',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'imageUrl'],
          }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.contactId,
      customer: order.contact ? {
        id: order.contact.id,
        name: order.contact.name,
        email: order.contact.email,
      } : null,
      paymentTermId: order.paymentTermId,
      paymentTerm: order.paymentTerm ? order.paymentTerm.name : null,
      couponCodeId: order.couponCodeId,
      couponCode: order.couponCode ? order.couponCode.code : null,
      orderDate: order.createdAt,
      status: order.status,
      subtotal: parseFloat(order.subtotal),
      taxAmount: parseFloat(order.taxAmount),
      discountAmount: parseFloat(order.discountAmount),
      total: parseFloat(order.total),
      items: order.lines ? order.lines.map(line => ({
        id: line.id,
        productId: line.productId,
        product: line.product ? {
          id: line.product.id,
          name: line.product.name,
          imageUrl: line.product.imageUrl,
        } : null,
        quantity: line.quantity,
        unitPrice: parseFloat(line.unitPrice),
        taxRate: parseFloat(line.taxRate),
        lineTotal: parseFloat(line.lineTotal),
        taxAmount: parseFloat(line.taxAmount),
      })) : [],
    }));

    res.json({ success: true, orders: transformedOrders });
  } catch (error) {
    console.error('Get sale orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sale orders' });
  }
};

// Get single sale order
const getSaleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await SaleOrder.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email', 'mobile', 'address'],
        },
        {
          model: PaymentTerm,
          as: 'paymentTerm',
          attributes: ['id', 'name'],
        },
        {
          model: CouponCode,
          as: 'couponCode',
          attributes: ['id', 'code'],
        },
        {
          model: SaleOrderLine,
          as: 'lines',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'imageUrl', 'salesPrice'],
          }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Sale order not found' });
    }

    // Check if user has access (admin or owner)
    if (!req.user.isAdmin) {
      const contact = await Contact.findOne({ where: { userId: req.user.id } });
      if (!contact || order.contactId !== contact.id) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
    }

    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerId: order.contactId,
        customer: order.contact ? {
          id: order.contact.id,
          name: order.contact.name,
          email: order.contact.email,
          mobile: order.contact.mobile,
          address: order.contact.address,
        } : null,
        paymentTermId: order.paymentTermId,
        paymentTerm: order.paymentTerm ? order.paymentTerm.name : null,
        couponCodeId: order.couponCodeId,
        couponCode: order.couponCode ? order.couponCode.code : null,
        orderDate: order.createdAt,
        status: order.status,
        subtotal: parseFloat(order.subtotal),
        taxAmount: parseFloat(order.taxAmount),
        discountAmount: parseFloat(order.discountAmount),
        total: parseFloat(order.total),
        items: order.lines ? order.lines.map(line => ({
          id: line.id,
          productId: line.productId,
          product: line.product ? {
            id: line.product.id,
            name: line.product.name,
            imageUrl: line.product.imageUrl,
            salesPrice: parseFloat(line.product.salesPrice),
          } : null,
          quantity: line.quantity,
          unitPrice: parseFloat(line.unitPrice),
          taxRate: parseFloat(line.taxRate),
          lineTotal: parseFloat(line.lineTotal),
          taxAmount: parseFloat(line.taxAmount),
        })) : [],
      },
    });
  } catch (error) {
    console.error('Get sale order error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sale order' });
  }
};

// Create sale order (from checkout or admin)
const createSaleOrder = async (req, res) => {
  try {
    const { items, couponCode, paymentTerm } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items are required' });
    }

    // Get user's contact
    let contact;
    if (req.user.isAdmin) {
      // Admin creating order - need customerId in body
      const { customerId } = req.body;
      if (!customerId) {
        return res.status(400).json({ success: false, error: 'Customer ID is required for admin orders' });
      }
      contact = await Contact.findByPk(customerId);
    } else {
      // Customer creating order from checkout
      contact = await Contact.findOne({ where: { userId: req.user.id } });
      if (!contact) {
        return res.status(400).json({ success: false, error: 'Contact not found. Please update your profile.' });
      }
    }

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    // Get payment term (default to "Immediate Payment" for website orders)
    let paymentTermRecord;
    if (paymentTerm) {
      paymentTermRecord = await PaymentTerm.findOne({ where: { name: paymentTerm } });
    }
    if (!paymentTermRecord) {
      paymentTermRecord = await PaymentTerm.findOne({ where: { name: 'Immediate Payment' } });
    }
    if (!paymentTermRecord) {
      // Create default if doesn't exist
      paymentTermRecord = await PaymentTerm.create({
        name: 'Immediate Payment',
        days: 0,
        earlyPaymentDiscount: 0,
        discountDays: 0,
        discountComputation: 'base',
      });
    }

    // Validate coupon code if provided
    let couponCodeRecord = null;
    if (couponCode) {
      couponCodeRecord = await CouponCode.findOne({
        where: {
          code: couponCode,
          used: false,
        },
        include: [{
          model: require('../models').DiscountOffer,
          as: 'discountOffer',
        }],
      });

      if (couponCodeRecord) {
        const discountOffer = couponCodeRecord.discountOffer;
        const now = new Date();
        if (discountOffer && (
          new Date(discountOffer.validFrom) > now ||
          new Date(discountOffer.validTo) < now ||
          !discountOffer.isActive ||
          !discountOffer.availableOnWebsite
        )) {
          couponCodeRecord = null;
        }
      }
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;
    const orderLines = [];

    for (const item of items) {
      const product = await Product.findByPk(item.id);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.id} not found` });
      }

      const quantity = item.quantity || 1;
      const unitPrice = parseFloat(product.salesPrice);
      const taxRate = parseFloat(product.taxRate);
      const lineTotal = unitPrice * quantity;
      const lineTax = lineTotal * (taxRate / 100);

      subtotal += lineTotal;
      taxAmount += lineTax;

      orderLines.push({
        productId: product.id,
        quantity,
        unitPrice,
        taxRate,
        lineTotal,
        taxAmount: lineTax,
      });
    }

    // Apply discount if coupon is valid
    if (couponCodeRecord && couponCodeRecord.discountOffer) {
      const discountPercentage = parseFloat(couponCodeRecord.discountOffer.discountPercentage);
      discountAmount = subtotal * (discountPercentage / 100);
    }

    const total = subtotal + taxAmount - discountAmount;

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create sale order
    const order = await SaleOrder.create({
      orderNumber,
      contactId: contact.id,
      paymentTermId: paymentTermRecord.id,
      couponCodeId: couponCodeRecord ? couponCodeRecord.id : null,
      discountPercentage: couponCodeRecord ? parseFloat(couponCodeRecord.discountOffer.discountPercentage) : 0,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      status: 'draft',
      source: req.user.isAdmin ? 'manual' : 'website',
    });

    // Create order lines
    for (const line of orderLines) {
      await SaleOrderLine.create({
        saleOrderId: order.id,
        ...line,
      });
    }

    // Mark coupon as used if applied
    if (couponCodeRecord) {
      await couponCodeRecord.update({
        used: true,
        usedAt: new Date(),
      });
    }

    // Auto-confirm website orders
    if (!req.user.isAdmin) {
      await order.update({ status: 'confirmed' });
    }

    // Reload with relations
    await order.reload({
      include: [
        {
          model: Contact,
          as: 'contact',
        },
        {
          model: PaymentTerm,
          as: 'paymentTerm',
        },
        {
          model: SaleOrderLine,
          as: 'lines',
          include: [{
            model: Product,
            as: 'product',
          }],
        },
      ],
    });

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: parseFloat(order.total),
      },
    });
  } catch (error) {
    console.error('Create sale order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create sale order' });
  }
};

// Update sale order status (admin only)
const updateSaleOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const order = await SaleOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Sale order not found' });
    }

    await order.update({ status });
    res.json({ success: true, order: { id: order.id, status: order.status } });
  } catch (error) {
    console.error('Update sale order status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update sale order' });
  }
};

module.exports = {
  getSaleOrders,
  getSaleOrder,
  createSaleOrder,
  updateSaleOrderStatus,
};

