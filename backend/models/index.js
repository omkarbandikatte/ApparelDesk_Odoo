/**
 * Models Index
 * Defines all model relationships
 * 
 * DATA FLOW:
 * - Cart → Sale Order (website orders create Sale Order with Payment Term = Immediate Payment)
 * - Sale Order → Customer Invoice (generate invoice from confirmed sale order)
 * - Customer Invoice → Payment (register payment against invoice)
 * - Purchase Order → Vendor Bill (convert purchase order to vendor bill)
 * - Vendor Bill → Payment (register payment against bill)
 * - Stock increases on vendor bill confirmation
 * - Stock decreases on customer invoice confirmation
 */

const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Contact = require('./Contact');
const Product = require('./Product');
const PaymentTerm = require('./PaymentTerm');
const DiscountOffer = require('./DiscountOffer');
const CouponCode = require('./CouponCode');
const SaleOrder = require('./SaleOrder');
const SaleOrderLine = require('./SaleOrderLine');
const PurchaseOrder = require('./PurchaseOrder');
const PurchaseOrderLine = require('./PurchaseOrderLine');
const CustomerInvoice = require('./CustomerInvoice');
const VendorBill = require('./VendorBill');
const Payment = require('./Payment');

// Define relationships

// User - Contact (one-to-one)
User.hasOne(Contact, { foreignKey: 'userId', as: 'contact' });
Contact.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Contact - Payment (one-to-many)
Contact.hasMany(Payment, { foreignKey: 'contactId', as: 'payments' });
Payment.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// Contact - SaleOrder (one-to-many)
Contact.hasMany(SaleOrder, { foreignKey: 'contactId', as: 'saleOrders' });
SaleOrder.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// Contact - PurchaseOrder (one-to-many)
Contact.hasMany(PurchaseOrder, { foreignKey: 'contactId', as: 'purchaseOrders' });
PurchaseOrder.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// Contact - CustomerInvoice (one-to-many)
Contact.hasMany(CustomerInvoice, { foreignKey: 'contactId', as: 'customerInvoices' });
CustomerInvoice.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// CustomerInvoice - CustomerInvoiceItem (one-to-many) - Note: Using SaleOrderLine for items

// Contact - VendorBill (one-to-many)
Contact.hasMany(VendorBill, { foreignKey: 'contactId', as: 'vendorBills' });
VendorBill.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// Contact - CouponCode (one-to-many)
Contact.hasMany(CouponCode, { foreignKey: 'contactId', as: 'couponCodes' });
CouponCode.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

// PaymentTerm - SaleOrder (one-to-many)
PaymentTerm.hasMany(SaleOrder, { foreignKey: 'paymentTermId', as: 'saleOrders' });
SaleOrder.belongsTo(PaymentTerm, { foreignKey: 'paymentTermId', as: 'paymentTerm' });

// PaymentTerm - CustomerInvoice (one-to-many)
PaymentTerm.hasMany(CustomerInvoice, { foreignKey: 'paymentTermId', as: 'customerInvoices' });
CustomerInvoice.belongsTo(PaymentTerm, { foreignKey: 'paymentTermId', as: 'paymentTerm' });

// DiscountOffer - CouponCode (one-to-many)
DiscountOffer.hasMany(CouponCode, { foreignKey: 'discountOfferId', as: 'couponCodes' });
CouponCode.belongsTo(DiscountOffer, { foreignKey: 'discountOfferId', as: 'discountOffer' });

// CouponCode - SaleOrder (one-to-many)
CouponCode.hasMany(SaleOrder, { foreignKey: 'couponCodeId', as: 'saleOrders' });
SaleOrder.belongsTo(CouponCode, { foreignKey: 'couponCodeId', as: 'couponCode' });

// SaleOrder - SaleOrderLine (one-to-many)
SaleOrder.hasMany(SaleOrderLine, { foreignKey: 'saleOrderId', as: 'lines' });
SaleOrderLine.belongsTo(SaleOrder, { foreignKey: 'saleOrderId', as: 'saleOrder' });

// Product - SaleOrderLine (one-to-many)
Product.hasMany(SaleOrderLine, { foreignKey: 'productId', as: 'saleOrderLines' });
SaleOrderLine.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// PurchaseOrder - PurchaseOrderLine (one-to-many)
PurchaseOrder.hasMany(PurchaseOrderLine, { foreignKey: 'purchaseOrderId', as: 'lines' });
PurchaseOrderLine.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

// Product - PurchaseOrderLine (one-to-many)
Product.hasMany(PurchaseOrderLine, { foreignKey: 'productId', as: 'purchaseOrderLines' });
PurchaseOrderLine.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// PurchaseOrder - VendorBill (one-to-one)
PurchaseOrder.hasOne(VendorBill, { foreignKey: 'purchaseOrderId', as: 'bill' });
VendorBill.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId', as: 'purchaseOrder' });

// SaleOrder - CustomerInvoice (one-to-one)
SaleOrder.hasOne(CustomerInvoice, { foreignKey: 'saleOrderId', as: 'invoice' });
CustomerInvoice.belongsTo(SaleOrder, { foreignKey: 'saleOrderId', as: 'saleOrder' });

// CustomerInvoice - Payment (one-to-many)
CustomerInvoice.hasMany(Payment, { foreignKey: 'customerInvoiceId', as: 'payments' });
Payment.belongsTo(CustomerInvoice, { foreignKey: 'customerInvoiceId', as: 'customerInvoice' });

// VendorBill - Payment (one-to-many)
VendorBill.hasMany(Payment, { foreignKey: 'vendorBillId', as: 'payments' });
Payment.belongsTo(VendorBill, { foreignKey: 'vendorBillId', as: 'vendorBill' });

// Product - CustomerInvoice (through SaleOrderLine)
// Product - VendorBill (through PurchaseOrderLine)

module.exports = {
  sequelize,
  User,
  Contact,
  Product,
  PaymentTerm,
  DiscountOffer,
  CouponCode,
  SaleOrder,
  SaleOrderLine,
  PurchaseOrder,
  PurchaseOrderLine,
  CustomerInvoice,
  VendorBill,
  Payment,
};

