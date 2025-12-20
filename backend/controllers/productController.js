const { Product } = require('../models');
const { Op } = require('sequelize');

// Get all products (with optional filter for published)
const getProducts = async (req, res) => {
  try {
    const { published } = req.query;
    const where = {};

    if (published === 'true') {
      where.published = true;
    }

    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      productName: product.name,
      productCategory: product.category,
      productType: product.type,
      material: product.material,
      colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
      currentStock: product.stockQuantity,
      salesPrice: parseFloat(product.salesPrice),
      salesTax: parseFloat(product.taxRate),
      purchasePrice: parseFloat(product.purchasePrice),
      purchaseTax: parseFloat(product.taxRate),
      published: product.published,
      images: product.imageUrl ? [product.imageUrl] : [],
      imageUrl: product.imageUrl,
      // Frontend compatibility
      category: product.category,
      type: product.type,
      taxRate: parseFloat(product.taxRate),
      stockQuantity: product.stockQuantity,
    }));

    res.json({ success: true, products: transformedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      productName: product.name,
      productCategory: product.category,
      productType: product.type,
      material: product.material,
      colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
      currentStock: product.stockQuantity,
      salesPrice: parseFloat(product.salesPrice),
      salesTax: parseFloat(product.taxRate),
      purchasePrice: parseFloat(product.purchasePrice),
      purchaseTax: parseFloat(product.taxRate),
      published: product.published,
      images: product.imageUrl ? [product.imageUrl] : [],
      imageUrl: product.imageUrl,
      category: product.category,
      type: product.type,
      taxRate: parseFloat(product.taxRate),
      stockQuantity: product.stockQuantity,
    };

    res.json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
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
      images,
    } = req.body;

    if (!name || !salesPrice) {
      return res.status(400).json({ success: false, error: 'Name and sales price are required' });
    }

    const product = await Product.create({
      name,
      category: productCategory,
      type: productType,
      material: material || null,
      colors: Array.isArray(colors) ? colors.join(',') : colors,
      stockQuantity: currentStock || 0,
      salesPrice,
      taxRate: salesTax || 0,
      purchasePrice: purchasePrice || 0,
      published: published || false,
      imageUrl: Array.isArray(images) && images.length > 0 ? images[0] : (images || null),
    });

    const transformedProduct = {
      id: product.id,
      name: product.name,
      productName: product.name,
      productCategory: product.category,
      productType: product.type,
      material: product.material,
      colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
      currentStock: product.stockQuantity,
      salesPrice: parseFloat(product.salesPrice),
      salesTax: parseFloat(product.taxRate),
      purchasePrice: parseFloat(product.purchasePrice),
      purchaseTax: parseFloat(product.taxRate),
      published: product.published,
      images: product.imageUrl ? [product.imageUrl] : [],
      imageUrl: product.imageUrl,
    };

    res.status(201).json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
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
      images,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.update({
      name: name || product.name,
      category: productCategory !== undefined ? productCategory : product.category,
      type: productType !== undefined ? productType : product.type,
      material: material !== undefined ? material : product.material,
      colors: colors !== undefined ? (Array.isArray(colors) ? colors.join(',') : colors) : product.colors,
      stockQuantity: currentStock !== undefined ? currentStock : product.stockQuantity,
      salesPrice: salesPrice !== undefined ? salesPrice : product.salesPrice,
      taxRate: salesTax !== undefined ? salesTax : product.taxRate,
      purchasePrice: purchasePrice !== undefined ? purchasePrice : product.purchasePrice,
      published: published !== undefined ? published : product.published,
      imageUrl: images !== undefined ? (Array.isArray(images) && images.length > 0 ? images[0] : images) : product.imageUrl,
    });

    await product.reload();

    const transformedProduct = {
      id: product.id,
      name: product.name,
      productName: product.name,
      productCategory: product.category,
      productType: product.type,
      material: product.material,
      colors: product.colors ? product.colors.split(',').map(c => c.trim()) : [],
      currentStock: product.stockQuantity,
      salesPrice: parseFloat(product.salesPrice),
      salesTax: parseFloat(product.taxRate),
      purchasePrice: parseFloat(product.purchasePrice),
      purchaseTax: parseFloat(product.taxRate),
      published: product.published,
      images: product.imageUrl ? [product.imageUrl] : [],
      imageUrl: product.imageUrl,
    };

    res.json({ success: true, product: transformedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

