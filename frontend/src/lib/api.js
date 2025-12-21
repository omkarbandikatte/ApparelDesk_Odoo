import { BASE_URL } from "../utils/base";
const API_BASE_URL =  BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// API methods
const api = {
  // Auth
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (userData) =>
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () => apiRequest('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProduct: (id) => apiRequest(`/products/${id}`),

  createProduct: (productData) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id, productData) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Contacts
  getContacts: () => apiRequest('/contacts'),

  getContact: (id) => apiRequest(`/contacts/${id}`),

  createContact: (contactData) =>
    apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),

  updateContact: (id, contactData) =>
    apiRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    }),

  deleteContact: (id) =>
    apiRequest(`/contacts/${id}`, {
      method: 'DELETE',
    }),

  // Sale Orders
  getSaleOrders: (myOrders = false) =>
    apiRequest(`/sale-orders${myOrders ? '/my-orders' : ''}`),

  getSaleOrder: (id) => apiRequest(`/sale-orders/${id}`),

  createSaleOrder: (orderData) =>
    apiRequest('/sale-orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateSaleOrderStatus: (id, status) =>
    apiRequest(`/sale-orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Coupons
  validateCoupon: (code) =>
    apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Invoices
  getInvoices: (myInvoices = false) =>
    apiRequest(`/invoices${myInvoices ? '/my-invoices' : ''}`),

  getInvoice: (id) => apiRequest(`/invoices/${id}`),

  generateInvoice: (saleOrderId) =>
    apiRequest('/invoices/generate', {
      method: 'POST',
      body: JSON.stringify({ saleOrderId }),
    }),

  confirmInvoice: (id) =>
    apiRequest(`/invoices/${id}/confirm`, {
      method: 'POST',
    }),

  recordInvoicePayment: (id, paymentData) =>
    apiRequest(`/invoices/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Admin routes
  getDashboardKPIs: () => apiRequest('/admin/dashboard/kpis'),

  getPayments: () => apiRequest('/admin/payments'),

  getPurchaseOrders: () => apiRequest('/admin/purchase-orders'),

  createPurchaseOrder: (orderData) =>
    apiRequest('/admin/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updatePurchaseOrderStatus: (id, status) =>
    apiRequest(`/admin/purchase-orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getVendorBills: () => apiRequest('/admin/vendor-bills'),

  generateVendorBill: (purchaseOrderId) =>
    apiRequest('/admin/vendor-bills/generate', {
      method: 'POST',
      body: JSON.stringify({ purchaseOrderId }),
    }),

  confirmVendorBill: (id) =>
    apiRequest(`/admin/vendor-bills/${id}/confirm`, {
      method: 'POST',
    }),

  recordVendorBillPayment: (id, paymentData) =>
    apiRequest(`/admin/vendor-bills/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  getPaymentTerms: () => apiRequest('/admin/payment-terms'),

  createPaymentTerm: (termData) =>
    apiRequest('/admin/payment-terms', {
      method: 'POST',
      body: JSON.stringify(termData),
    }),

  updatePaymentTerm: (id, termData) =>
    apiRequest(`/admin/payment-terms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(termData),
    }),

  getDiscountOffers: () => apiRequest('/admin/discount-offers'),

  createDiscountOffer: (offerData) =>
    apiRequest('/admin/discount-offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    }),

  updateDiscountOffer: (id, offerData) =>
    apiRequest(`/admin/discount-offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    }),

  generateCouponCodes: (data) =>
    apiRequest('/admin/discount-offers/generate-coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getReports: (reportType, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/reports/${reportType}${queryString ? `?${queryString}` : ''}`);
  },
};

export default api;

