const { Product } = require('../models');
const { Op } = require('sequelize');
const path = require('path');

// Get all products (optional ?published=true)
const getProducts = async (req, res) => {
  try {
    const { published } = req.query;
    const where = {};

    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    const products = await Product.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    const transformedProducts = products.map((product) => ({
      id: product.id,
      productName: product.product_name,
      productCategory: product.product_category,
      productType: product.product_type,
      material: product.material,
      colors: product.colors || [],
      currentStock: product.current_stock,
      salesPrice: parseFloat(product.sales_price),
      salesTax: parseFloat(product.sales_tax),
      purchasePrice: product.purchase_price != null
        ? parseFloat(product.purchase_price)
        : null,
      purchaseTax: parseFloat(product.purchase_tax),
      published: product.published,
      images: product.images || [],

      // Backwards-compatible fields
      name: product.product_name,
      category: product.product_category,
      type: product.product_type,
      stockQuantity: product.current_stock,
      taxRate: parseFloat(product.sales_tax),
      imageUrl: product.images && product.images.length > 0
        ? product.images[0]
        : null,
    }));

    res.json({ success: true, products: transformedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch products' });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Product not found' });
    }

    const transformedProduct = {
      id: product.id,
      productName: product.product_name,
      productCategory: product.product_category,
      productType: product.product_type,
      material: product.material,
      colors: product.colors || [],
      currentStock: product.current_stock,
      salesPrice: parseFloat(product.sales_price),
      salesTax: parseFloat(product.sales_tax),
      purchasePrice: product.purchase_price != null
        ? parseFloat(product.purchase_price)
        : null,
      purchaseTax: parseFloat(product.purchase_tax),
      published: product.published,
      images: product.images || [],
      name: product.product_name,
      category: product.product_category,
      type: product.product_type,
      stockQuantity: product.current_stock,
      taxRate: parseFloat(product.sales_tax),
      imageUrl: product.images && product.images.length > 0
        ? product.images[0]
        : null,
    };

    res.json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error('Get product error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch product' });
  }
};

// Create product (admin only) with image upload
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productCategory,
      productType,
      material,
      colors,
      currentStock,
      salesPrice,
      salesTax,
      purchasePrice,
      purchaseTax,
      published,
    } = req.body;

    // Basic validation
    if (!productName || !productCategory || !productType) {
      return res.status(400).json({
        success: false,
        error: 'productName, productCategory and productType are required',
      });
    }

    if (salesPrice == null || isNaN(Number(salesPrice))) {
      return res.status(400).json({
        success: false,
        error: 'Valid salesPrice is required',
      });
    }

    // Handle uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/products/${file.filename}`);
      });
    }

    // Normalize colors from JSON string or array
    let normalizedColors = [];
    if (colors) {
      try {
        normalizedColors = Array.isArray(colors)
          ? colors
          : JSON.parse(colors);
      } catch (e) {
        // If JSON parse fails, treat as comma-separated
        normalizedColors = String(colors)
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
      }
    }

    const product = await Product.create({
      product_name: productName,
      product_category: productCategory,
      product_type: productType,
      material: material || null,
      colors: normalizedColors,
      current_stock: Number(currentStock) || 0,
      sales_price: Number(salesPrice),
      sales_tax: Number(salesTax) || 0,
      purchase_price: purchasePrice ? Number(purchasePrice) : null,
      purchase_tax: Number(purchaseTax) || 0,
      published: published === 'true' || published === true,
      images,
    });

    const transformedProduct = {
      id: product.id,
      productName: product.product_name,
      productCategory: product.product_category,
      productType: product.product_type,
      material: product.material,
      colors: product.colors || [],
      currentStock: product.current_stock,
      salesPrice: parseFloat(product.sales_price),
      salesTax: parseFloat(product.sales_tax),
      purchasePrice: product.purchase_price != null
        ? parseFloat(product.purchase_price)
        : null,
      purchaseTax: parseFloat(product.purchase_tax),
      published: product.published,
      images: product.images || [],
      name: product.product_name,
      category: product.product_category,
      type: product.product_type,
      stockQuantity: product.current_stock,
      taxRate: parseFloat(product.sales_tax),
      imageUrl: product.images && product.images.length > 0
        ? product.images[0]
        : null,
    };

    res.status(201).json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle Multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Max size: 5MB',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Max: 5 images',
      });
    }

    res
      .status(500)
      .json({ success: false, error: 'Failed to create product' });
  }
};

// Update product (admin only) with optional image upload
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productCategory,
      productType,
      material,
      colors,
      currentStock,
      salesPrice,
      salesTax,
      purchasePrice,
      purchaseTax,
      published,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Product not found' });
    }

    // Handle new uploaded images (append to existing)
    const newImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        newImages.push(`/uploads/products/${file.filename}`);
      });
    }

    // Get existing images
    const existingImages = product.images || [];
    const updatedImages = newImages.length > 0 
      ? [...existingImages, ...newImages] 
      : existingImages;

    // Normalize colors
    let normalizedColors;
    if (colors !== undefined) {
      try {
        normalizedColors = Array.isArray(colors)
          ? colors
          : JSON.parse(colors);
      } catch (e) {
        normalizedColors = String(colors)
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
      }
    }

    await product.update({
      product_name: productName !== undefined ? productName : product.product_name,
      product_category: productCategory !== undefined ? productCategory : product.product_category,
      product_type: productType !== undefined ? productType : product.product_type,
      material: material !== undefined ? material : product.material,
      colors: normalizedColors !== undefined ? normalizedColors : product.colors,
      current_stock: currentStock !== undefined ? Number(currentStock) : product.current_stock,
      sales_price: salesPrice !== undefined ? Number(salesPrice) : product.sales_price,
      sales_tax: salesTax !== undefined ? Number(salesTax) : product.sales_tax,
      purchase_price: purchasePrice !== undefined ? Number(purchasePrice) : product.purchase_price,
      purchase_tax: purchaseTax !== undefined ? Number(purchaseTax) : product.purchase_tax,
      published: published !== undefined ? !!published : product.published,
      images: updatedImages,
    });

    await product.reload();

    const transformedProduct = {
      id: product.id,
      productName: product.product_name,
      productCategory: product.product_category,
      productType: product.product_type,
      material: product.material,
      colors: product.colors || [],
      currentStock: product.current_stock,
      salesPrice: parseFloat(product.sales_price),
      salesTax: parseFloat(product.sales_tax),
      purchasePrice: product.purchase_price != null
        ? parseFloat(product.purchase_price)
        : null,
      purchaseTax: parseFloat(product.purchase_tax),
      published: product.published,
      images: product.images || [],
      name: product.product_name,
      category: product.product_category,
      type: product.product_type,
      stockQuantity: product.current_stock,
      taxRate: parseFloat(product.sales_tax),
      imageUrl: product.images && product.images.length > 0
        ? product.images[0]
        : null,
    };

    res.json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    
    // Handle Multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Max size: 5MB',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Max: 5 images',
      });
    }

    res
      .status(500)
      .json({ success: false, error: 'Failed to update product' });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Product not found' });
    }

    await product.destroy();
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
