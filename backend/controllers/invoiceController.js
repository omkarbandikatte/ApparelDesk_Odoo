const { CustomerInvoice, SaleOrder, Contact, PaymentTerm, Product, SaleOrderLine } = require('../models');
const { Op } = require('sequelize');

// Generate invoice number
const generateInvoiceNumber = async () => {
  const count = await CustomerInvoice.count();
  return `INV-${String(count + 1).padStart(6, '0')}`;
};

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const { myInvoices } = req.query;
    let where = {};

    // If myInvoices is true, filter by user's contact
    if (myInvoices === 'true' && req.user) {
      const contact = await Contact.findOne({ where: { userId: req.user.id } });
      if (contact) {
        where.contactId = contact.id;
      } else {
        return res.json({ success: true, invoices: [] });
      }
    }

    const invoices = await CustomerInvoice.findAll({
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
          model: SaleOrder,
          as: 'saleOrder',
          attributes: ['id', 'orderNumber'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const transformedInvoices = invoices.map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.contactId,
      customer: invoice.contact ? {
        id: invoice.contact.id,
        name: invoice.contact.name,
        email: invoice.contact.email,
      } : null,
      saleOrderId: invoice.saleOrderId,
      saleOrder: invoice.saleOrder ? {
        id: invoice.saleOrder.id,
        orderNumber: invoice.saleOrder.orderNumber,
      } : null,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      subtotal: parseFloat(invoice.subtotal),
      taxAmount: parseFloat(invoice.taxAmount),
      discountAmount: parseFloat(invoice.discountAmount),
      total: parseFloat(invoice.total),
      paidAmount: parseFloat(invoice.paidAmount),
    }));

    res.json({ success: true, invoices: transformedInvoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch invoices' });
  }
};

// Get single invoice
const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await CustomerInvoice.findByPk(id, {
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
          model: SaleOrder,
          as: 'saleOrder',
          include: [{
            model: SaleOrderLine,
            as: 'lines',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'imageUrl', 'salesPrice'],
            }],
          }],
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    // Check if user has access (admin or owner)
    if (!req.user.isAdmin) {
      const contact = await Contact.findOne({ where: { userId: req.user.id } });
      if (!contact || invoice.contactId !== contact.id) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
    }

    const items = invoice.saleOrder && invoice.saleOrder.lines ? invoice.saleOrder.lines.map(line => ({
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
    })) : [];

    res.json({
      success: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.contactId,
        customer: invoice.contact ? {
          id: invoice.contact.id,
          name: invoice.contact.name,
          email: invoice.contact.email,
          mobile: invoice.contact.mobile,
          address: invoice.contact.address,
        } : null,
        saleOrderId: invoice.saleOrderId,
        saleOrder: invoice.saleOrder ? {
          id: invoice.saleOrder.id,
          orderNumber: invoice.saleOrder.orderNumber,
        } : null,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        subtotal: parseFloat(invoice.subtotal),
        taxAmount: parseFloat(invoice.taxAmount),
        discountAmount: parseFloat(invoice.discountAmount),
        total: parseFloat(invoice.total),
        paidAmount: parseFloat(invoice.paidAmount),
        items,
      },
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch invoice' });
  }
};

// Generate invoice from sale order (admin only)
const generateInvoice = async (req, res) => {
  try {
    const { saleOrderId } = req.body;

    if (!saleOrderId) {
      return res.status(400).json({ success: false, error: 'Sale order ID is required' });
    }

    // Check if invoice already exists
    const existingInvoice = await CustomerInvoice.findOne({ where: { saleOrderId } });
    if (existingInvoice) {
      return res.status(400).json({ success: false, error: 'Invoice already exists for this sale order' });
    }

    const saleOrder = await SaleOrder.findByPk(saleOrderId, {
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

    if (!saleOrder) {
      return res.status(404).json({ success: false, error: 'Sale order not found' });
    }

    if (saleOrder.status !== 'confirmed') {
      return res.status(400).json({ success: false, error: 'Sale order must be confirmed to generate invoice' });
    }

    // Calculate due date based on payment term
    const paymentTerm = saleOrder.paymentTerm;
    const invoiceDate = new Date();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + (paymentTerm ? paymentTerm.days : 0));

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Create invoice
    const invoice = await CustomerInvoice.create({
      invoiceNumber,
      saleOrderId: saleOrder.id,
      contactId: saleOrder.contactId,
      paymentTermId: saleOrder.paymentTermId,
      invoiceDate,
      dueDate,
      subtotal: saleOrder.subtotal,
      taxAmount: saleOrder.taxAmount,
      discountAmount: saleOrder.discountAmount,
      total: saleOrder.total,
      paidAmount: 0,
      status: 'draft',
    });

    res.status(201).json({
      success: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
      },
    });
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate invoice' });
  }
};

// Confirm invoice (admin only) - reduces stock
const confirmInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await CustomerInvoice.findByPk(id, {
      include: [{
        model: SaleOrder,
        as: 'saleOrder',
        include: [{
          model: SaleOrderLine,
          as: 'lines',
          include: [{
            model: Product,
            as: 'product',
          }],
        }],
      }],
    });

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({ success: false, error: 'Invoice is not in draft status' });
    }

    // Reduce stock for each product
    if (invoice.saleOrder && invoice.saleOrder.lines) {
      for (const line of invoice.saleOrder.lines) {
        const product = line.product;
        if (product) {
          const newStock = product.stockQuantity - line.quantity;
          if (newStock < 0) {
            return res.status(400).json({
              success: false,
              error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Required: ${line.quantity}`,
            });
          }
          await product.update({ stockQuantity: newStock });
        }
      }
    }

    // Update invoice status
    await invoice.update({
      status: 'confirmed',
      stockReduced: true,
    });

    res.json({
      success: true,
      invoice: {
        id: invoice.id,
        status: invoice.status,
      },
    });
  } catch (error) {
    console.error('Confirm invoice error:', error);
    res.status(500).json({ success: false, error: 'Failed to confirm invoice' });
  }
};

// Record payment against invoice
const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid payment amount is required' });
    }

    const invoice = await CustomerInvoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    if (invoice.status === 'cancelled') {
      return res.status(400).json({ success: false, error: 'Cannot record payment for cancelled invoice' });
    }

    const newPaidAmount = parseFloat(invoice.paidAmount) + parseFloat(amount);
    const total = parseFloat(invoice.total);

    if (newPaidAmount > total) {
      return res.status(400).json({ success: false, error: 'Payment amount exceeds invoice total' });
    }

    // Create payment record
    const { Payment } = require('../models');
    const paymentCount = await Payment.count();
    const paymentNumber = `PAY-${String(paymentCount + 1).padStart(6, '0')}`;

    await Payment.create({
      paymentNumber,
      contactId: invoice.contactId,
      customerInvoiceId: invoice.id,
      amount: parseFloat(amount),
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'cash',
      notes: notes || null,
    });

    // Update invoice paid amount
    const updatedStatus = newPaidAmount >= total ? 'paid' : invoice.status;
    await invoice.update({
      paidAmount: newPaidAmount,
      status: updatedStatus,
    });

    res.json({
      success: true,
      invoice: {
        id: invoice.id,
        paidAmount: newPaidAmount,
        status: updatedStatus,
      },
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to record payment' });
  }
};

module.exports = {
  getInvoices,
  getInvoice,
  generateInvoice,
  confirmInvoice,
  recordPayment,
};

