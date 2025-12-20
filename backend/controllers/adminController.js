const {
  SaleOrder,
  CustomerInvoice,
  PurchaseOrder,
  VendorBill,
  Payment,
  Product,
  Contact,
  PaymentTerm,
  DiscountOffer,
  CouponCode,
  SaleOrderLine,
  PurchaseOrderLine,
} = require('../models');
const { Op } = require('sequelize');

// Dashboard KPIs
const getDashboardKPIs = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total Sales (confirmed sale orders)
    const totalSales = await SaleOrder.sum('total', {
      where: {
        status: 'confirmed',
        createdAt: { [Op.gte]: startOfMonth },
      },
    });

    // Total Revenue (paid invoices)
    const totalRevenue = await CustomerInvoice.sum('paidAmount', {
      where: {
        status: 'paid',
        createdAt: { [Op.gte]: startOfMonth },
      },
    });

    // Pending Orders
    const pendingOrders = await SaleOrder.count({
      where: {
        status: 'draft',
      },
    });

    // Low Stock Products
    const lowStockProducts = await Product.count({
      where: {
        stockQuantity: { [Op.lt]: 10 },
        published: true,
      },
    });

    // Total Customers
    const totalCustomers = await Contact.count({
      where: {
        contactType: { [Op.in]: ['customer', 'both'] },
      },
    });

    // Total Products
    const totalProducts = await Product.count();

    res.json({
      success: true,
      kpis: {
        totalSales: parseFloat(totalSales || 0),
        totalRevenue: parseFloat(totalRevenue || 0),
        pendingOrders,
        lowStockProducts,
        totalCustomers,
        totalProducts,
      },
    });
  } catch (error) {
    console.error('Get dashboard KPIs error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard KPIs' });
  }
};

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: CustomerInvoice,
          as: 'customerInvoice',
          include: [{
            model: Contact,
            as: 'contact',
            attributes: ['id', 'name', 'email'],
          }],
        },
        {
          model: VendorBill,
          as: 'vendorBill',
          include: [{
            model: Contact,
            as: 'contact',
            attributes: ['id', 'name', 'email'],
          }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      paymentNumber: payment.paymentNumber,
      paymentDate: payment.paymentDate,
      amount: parseFloat(payment.amount),
      paymentMethod: payment.paymentMethod,
      notes: payment.notes,
      customerInvoiceId: payment.customerInvoiceId,
      vendorBillId: payment.vendorBillId,
      customer: payment.customerInvoice && payment.customerInvoice.contact ? {
        id: payment.customerInvoice.contact.id,
        name: payment.customerInvoice.contact.name,
        email: payment.customerInvoice.contact.email,
      } : null,
      vendor: payment.vendorBill && payment.vendorBill.contact ? {
        id: payment.vendorBill.contact.id,
        name: payment.vendorBill.contact.name,
        email: payment.vendorBill.contact.email,
      } : null,
      type: payment.customerInvoiceId ? 'customer_payment' : 'vendor_payment',
    }));

    res.json({ success: true, payments: transformedPayments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch payments' });
  }
};

// Get all purchase orders
const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.findAll({
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: PurchaseOrderLine,
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
      vendorId: order.contactId,
      vendor: order.contact ? {
        id: order.contact.id,
        name: order.contact.name,
        email: order.contact.email,
      } : null,
      orderDate: order.createdAt,
      status: order.status,
      subtotal: parseFloat(order.subtotal),
      taxAmount: parseFloat(order.taxAmount),
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
    console.error('Get purchase orders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch purchase orders' });
  }
};

// Create purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    const { vendorId, items } = req.body;

    if (!vendorId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Vendor ID and items are required' });
    }

    const vendor = await Contact.findByPk(vendorId);
    if (!vendor || !['vendor', 'both'].includes(vendor.contactType)) {
      return res.status(400).json({ success: false, error: 'Invalid vendor' });
    }

    // Generate order number
    const count = await PurchaseOrder.count();
    const orderNumber = `PO-${String(count + 1).padStart(6, '0')}`;

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    const orderLines = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
      }

      const quantity = item.quantity || 1;
      const unitPrice = parseFloat(item.unitPrice || product.purchasePrice);
      const taxRate = parseFloat(item.taxRate || product.taxRate);
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

    const total = subtotal + taxAmount;

    // Create purchase order
    const order = await PurchaseOrder.create({
      orderNumber,
      contactId: vendorId,
      subtotal,
      taxAmount,
      total,
      status: 'draft',
    });

    // Create order lines
    for (const line of orderLines) {
      await PurchaseOrderLine.create({
        purchaseOrderId: order.id,
        ...line,
      });
    }

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
    console.error('Create purchase order error:', error);
    res.status(500).json({ success: false, error: 'Failed to create purchase order' });
  }
};

// Update purchase order status
const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const order = await PurchaseOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Purchase order not found' });
    }

    await order.update({ status });
    res.json({ success: true, order: { id: order.id, status: order.status } });
  } catch (error) {
    console.error('Update purchase order status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update purchase order' });
  }
};

// Get all vendor bills
const getVendorBills = async (req, res) => {
  try {
    const bills = await VendorBill.findAll({
      include: [
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['id', 'orderNumber'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const transformedBills = bills.map(bill => ({
      id: bill.id,
      invoiceNumber: bill.billNumber,
      vendorId: bill.contactId,
      vendor: bill.contact ? {
        id: bill.contact.id,
        name: bill.contact.name,
        email: bill.contact.email,
      } : null,
      purchaseOrderId: bill.purchaseOrderId,
      purchaseOrder: bill.purchaseOrder ? {
        id: bill.purchaseOrder.id,
        orderNumber: bill.purchaseOrder.orderNumber,
      } : null,
      invoiceDate: bill.billDate,
      dueDate: bill.dueDate,
      status: bill.status,
      subtotal: parseFloat(bill.subtotal),
      taxAmount: parseFloat(bill.taxAmount),
      total: parseFloat(bill.total),
      paidAmount: parseFloat(bill.paidAmount),
    }));

    res.json({ success: true, bills: transformedBills });
  } catch (error) {
    console.error('Get vendor bills error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch vendor bills' });
  }
};

// Generate vendor bill from purchase order
const generateVendorBill = async (req, res) => {
  try {
    const { purchaseOrderId } = req.body;

    if (!purchaseOrderId) {
      return res.status(400).json({ success: false, error: 'Purchase order ID is required' });
    }

    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId, {
      include: [
        {
          model: Contact,
          as: 'contact',
        },
        {
          model: PurchaseOrderLine,
          as: 'lines',
        },
      ],
    });

    if (!purchaseOrder) {
      return res.status(404).json({ success: false, error: 'Purchase order not found' });
    }

    if (purchaseOrder.status !== 'confirmed') {
      return res.status(400).json({ success: false, error: 'Purchase order must be confirmed' });
    }

    // Generate bill number
    const count = await VendorBill.count();
    const billNumber = `VB-${String(count + 1).padStart(6, '0')}`;

    // Calculate due date (30 days default)
    const billDate = new Date();
    const dueDate = new Date(billDate);
    dueDate.setDate(dueDate.getDate() + 30);

    // Create vendor bill
    const bill = await VendorBill.create({
      billNumber,
      purchaseOrderId: purchaseOrder.id,
      contactId: purchaseOrder.contactId,
      billDate,
      dueDate,
      subtotal: purchaseOrder.subtotal,
      taxAmount: purchaseOrder.taxAmount,
      total: purchaseOrder.total,
      paidAmount: 0,
      status: 'draft',
    });

    res.status(201).json({
      success: true,
      bill: {
        id: bill.id,
        invoiceNumber: bill.billNumber,
        status: bill.status,
      },
    });
  } catch (error) {
    console.error('Generate vendor bill error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate vendor bill' });
  }
};

// Confirm vendor bill (increases stock)
const confirmVendorBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await VendorBill.findByPk(id, {
      include: [{
        model: PurchaseOrder,
        as: 'purchaseOrder',
        include: [{
          model: PurchaseOrderLine,
          as: 'lines',
          include: [{
            model: Product,
            as: 'product',
          }],
        }],
      }],
    });

    if (!bill) {
      return res.status(404).json({ success: false, error: 'Vendor bill not found' });
    }

    if (bill.status !== 'draft') {
      return res.status(400).json({ success: false, error: 'Bill is not in draft status' });
    }

    // Increase stock for each product
    if (bill.purchaseOrder && bill.purchaseOrder.lines) {
      for (const line of bill.purchaseOrder.lines) {
        const product = line.product;
        if (product) {
          const newStock = product.stockQuantity + line.quantity;
          await product.update({ stockQuantity: newStock });
        }
      }
    }

    await bill.update({ status: 'posted' });
    res.json({ success: true, bill: { id: bill.id, status: bill.status } });
  } catch (error) {
    console.error('Confirm vendor bill error:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm vendor bill' });
  }
};

// Record payment for vendor bill
const recordVendorBillPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid payment amount is required' });
    }

    const bill = await VendorBill.findByPk(id);
    if (!bill) {
      return res.status(404).json({ success: false, error: 'Vendor bill not found' });
    }

    const newPaidAmount = parseFloat(bill.paidAmount) + parseFloat(amount);
    const total = parseFloat(bill.total);

    if (newPaidAmount > total) {
      return res.status(400).json({ success: false, error: 'Payment amount exceeds bill total' });
    }

    // Create payment record
    const paymentCount = await Payment.count();
    const paymentNumber = `PAY-${String(paymentCount + 1).padStart(6, '0')}`;

    await Payment.create({
      paymentNumber,
      contactId: bill.contactId,
      vendorBillId: bill.id,
      amount: parseFloat(amount),
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'cash',
      notes: notes || null,
    });

    const updatedStatus = newPaidAmount >= total ? 'paid' : bill.status;
    await bill.update({
      paidAmount: newPaidAmount,
      status: updatedStatus,
    });

    res.json({
      success: true,
      bill: {
        id: bill.id,
        paidAmount: newPaidAmount,
        status: updatedStatus,
      },
    });
  } catch (error) {
    console.error('Record vendor bill payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to record payment' });
  }
};

// Get all payment terms
const getPaymentTerms = async (req, res) => {
  try {
    const terms = await PaymentTerm.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, terms });
  } catch (error) {
    console.error('Get payment terms error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch payment terms' });
  }
};

// Create payment term
const createPaymentTerm = async (req, res) => {
  try {
    const { name, description, days, earlyPaymentDiscount, discountDays, discountComputation } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const term = await PaymentTerm.create({
      name,
      description: description || null,
      days: days || 0,
      earlyPaymentDiscount: earlyPaymentDiscount || 0,
      discountDays: discountDays || 0,
      discountComputation: discountComputation || 'base',
    });

    res.status(201).json({ success: true, term });
  } catch (error) {
    console.error('Create payment term error:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment term' });
  }
};

// Update payment term
const updatePaymentTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, days, earlyPaymentDiscount, discountDays, discountComputation } = req.body;

    const term = await PaymentTerm.findByPk(id);
    if (!term) {
      return res.status(404).json({ success: false, error: 'Payment term not found' });
    }

    await term.update({
      name: name || term.name,
      description: description !== undefined ? description : term.description,
      days: days !== undefined ? days : term.days,
      earlyPaymentDiscount: earlyPaymentDiscount !== undefined ? earlyPaymentDiscount : term.earlyPaymentDiscount,
      discountDays: discountDays !== undefined ? discountDays : term.discountDays,
      discountComputation: discountComputation || term.discountComputation,
    });

    res.json({ success: true, term });
  } catch (error) {
    console.error('Update payment term error:', error);
    res.status(500).json({ success: false, error: 'Failed to update payment term' });
  }
};

// Get all discount offers
const getDiscountOffers = async (req, res) => {
  try {
    const offers = await DiscountOffer.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, offers });
  } catch (error) {
    console.error('Get discount offers error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch discount offers' });
  }
};

// Create discount offer
const createDiscountOffer = async (req, res) => {
  try {
    const { name, discountPercentage, validFrom, validTo, availableOnSales, availableOnWebsite } = req.body;

    if (!name || !discountPercentage || !validFrom || !validTo) {
      return res.status(400).json({ success: false, error: 'Name, discount percentage, and dates are required' });
    }

    const offer = await DiscountOffer.create({
      name,
      discountPercentage,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      availableOnSales: availableOnSales || false,
      availableOnWebsite: availableOnWebsite || false,
      isActive: true,
    });

    res.status(201).json({ success: true, offer });
  } catch (error) {
    console.error('Create discount offer error:', error);
    res.status(500).json({ success: false, error: 'Failed to create discount offer' });
  }
};

// Update discount offer
const updateDiscountOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, discountPercentage, validFrom, validTo, availableOnSales, availableOnWebsite, isActive } = req.body;

    const offer = await DiscountOffer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Discount offer not found' });
    }

    await offer.update({
      name: name || offer.name,
      discountPercentage: discountPercentage !== undefined ? discountPercentage : offer.discountPercentage,
      validFrom: validFrom ? new Date(validFrom) : offer.validFrom,
      validTo: validTo ? new Date(validTo) : offer.validTo,
      availableOnSales: availableOnSales !== undefined ? availableOnSales : offer.availableOnSales,
      availableOnWebsite: availableOnWebsite !== undefined ? availableOnWebsite : offer.availableOnWebsite,
      isActive: isActive !== undefined ? isActive : offer.isActive,
    });

    res.json({ success: true, offer });
  } catch (error) {
    console.error('Update discount offer error:', error);
    res.status(500).json({ success: false, error: 'Failed to update discount offer' });
  }
};

// Generate coupon codes from discount offer
const generateCouponCodes = async (req, res) => {
  try {
    const { discountOfferId, count, code } = req.body;

    if (!discountOfferId || !count) {
      return res.status(400).json({ success: false, error: 'Discount offer ID and count are required' });
    }

    const offer = await DiscountOffer.findByPk(discountOfferId);
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Discount offer not found' });
    }

    const codes = [];
    for (let i = 0; i < count; i++) {
      const couponCode = code ? `${code}${i + 1}` : `COUPON${Date.now()}${i}`;
      const coupon = await CouponCode.create({
        discountOfferId: offer.id,
        code: couponCode.toUpperCase(),
        used: false,
      });
      codes.push(coupon);
    }

    res.status(201).json({ success: true, codes });
  } catch (error) {
    console.error('Generate coupon codes error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate coupon codes' });
  }
};

// Get reports
const getReports = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    let data = {};

    switch (reportType) {
      case 'sales':
        data.sales = await SaleOrder.findAll({
          where: { ...where, status: 'confirmed' },
          include: [{
            model: Contact,
            as: 'contact',
            attributes: ['name', 'email'],
          }],
          order: [['createdAt', 'DESC']],
        });
        break;
      case 'revenue':
        data.revenue = await CustomerInvoice.findAll({
          where: { ...where, status: 'paid' },
          include: [{
            model: Contact,
            as: 'contact',
            attributes: ['name', 'email'],
          }],
          order: [['createdAt', 'DESC']],
        });
        break;
      case 'products':
        data.products = await Product.findAll({
          where,
          order: [['stockQuantity', 'ASC']],
        });
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid report type' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
};

module.exports = {
  getDashboardKPIs,
  getPayments,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  getVendorBills,
  generateVendorBill,
  confirmVendorBill,
  recordVendorBillPayment,
  getPaymentTerms,
  createPaymentTerm,
  updatePaymentTerm,
  getDiscountOffers,
  createDiscountOffer,
  updateDiscountOffer,
  generateCouponCodes,
  getReports,
};

