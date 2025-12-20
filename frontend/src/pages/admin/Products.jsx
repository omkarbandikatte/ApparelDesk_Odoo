import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    salesPrice: '',
    purchasePrice: '',
    taxRate: '',
    material: '',
    color: '',
    stockQuantity: '',
    images: '',
    published: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && currentIndex >= 0 && currentIndex < products.length) {
      loadProduct(products[currentIndex]);
    }
  }, [currentIndex, products]);

  const fetchProducts = () => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        setProducts(parsed.filter(p => !p.archived));
      } else {
        const defaultProducts = [
          {
            id: 1,
            name: 'Classic T-Shirt',
            type: 'T-Shirt',
            salesPrice: 29.99,
            purchasePrice: 15.00,
            taxRate: 18,
            material: 'Cotton',
            color: 'Red,Blue,Green',
            stockQuantity: 50,
            images: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            published: true,
          },
          {
            id: 2,
            name: 'Denim Jeans',
            type: 'Jeans',
            salesPrice: 79.99,
            purchasePrice: 40.00,
            taxRate: 18,
            material: 'Denim',
            color: 'Blue,Black',
            stockQuantity: 30,
            images: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
            published: true,
          },
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProduct = (product) => {
    setFormData({
      name: product.name || '',
      type: product.type || '',
      salesPrice: product.salesPrice || '',
      purchasePrice: product.purchasePrice || '',
      taxRate: product.taxRate || '',
      material: product.material || '',
      color: product.color || product.colors || '',
      stockQuantity: product.stockQuantity || '',
      images: product.images || product.imageUrl || '',
      published: product.published || false,
    });
  };

  const handleNew = () => {
    setFormData({
      name: '',
      type: '',
      salesPrice: '',
      purchasePrice: '',
      taxRate: '',
      material: '',
      color: '',
      stockQuantity: '',
      images: '',
      published: false,
    });
    setCurrentIndex(-1); // -1 indicates new product
  };

  const handleSave = () => {
    const storedProducts = localStorage.getItem('products');
    let allProducts = storedProducts ? JSON.parse(storedProducts) : [];

    if (currentIndex === -1) {
      // Create new product
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        salesPrice: parseFloat(formData.salesPrice) || 0,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        taxRate: parseFloat(formData.taxRate) || 0,
        material: formData.material,
        color: formData.color,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        images: formData.images,
        imageUrl: formData.images,
        published: formData.published,
      };
      allProducts.push(newProduct);
      localStorage.setItem('products', JSON.stringify(allProducts));
      setProducts([...allProducts]);
      setCurrentIndex(allProducts.length - 1);
    } else {
      // Update existing product
      const updatedProducts = allProducts.map((p, index) =>
        index === currentIndex
          ? {
              ...p,
              name: formData.name,
              type: formData.type,
              salesPrice: parseFloat(formData.salesPrice) || 0,
              purchasePrice: parseFloat(formData.purchasePrice) || 0,
              taxRate: parseFloat(formData.taxRate) || 0,
              material: formData.material,
              color: formData.color,
              stockQuantity: parseInt(formData.stockQuantity) || 0,
              images: formData.images,
              imageUrl: formData.images,
              published: formData.published,
            }
          : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts.filter(p => !p.archived));
    }
  };

  const handleArchive = () => {
    if (currentIndex === -1 || currentIndex >= products.length) return;

    const storedProducts = localStorage.getItem('products');
    let allProducts = storedProducts ? JSON.parse(storedProducts) : [];
    
    const currentProduct = products[currentIndex];
    allProducts = allProducts.map(p =>
      p.id === currentProduct.id ? { ...p, archived: true } : p
    );
    
    localStorage.setItem('products', JSON.stringify(allProducts));
    const filtered = allProducts.filter(p => !p.archived);
    setProducts(filtered);
    
    if (currentIndex >= filtered.length && filtered.length > 0) {
      setCurrentIndex(filtered.length - 1);
    } else if (filtered.length === 0) {
      setCurrentIndex(-1);
      handleNew();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentProduct = currentIndex >= 0 && currentIndex < products.length ? products[currentIndex] : null;
  const isNew = currentIndex === -1;

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div className="text-center py-12">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container px-6 py-8">
        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={handleNew} variant="outline">
              New
            </Button>
            <Button onClick={handleSave} disabled={!formData.name}>
              {isNew ? 'Save' : 'Confirm'}
            </Button>
            {!isNew && (
              <Button onClick={handleArchive} variant="destructive">
                Archive
              </Button>
            )}
          </div>

          {/* Navigation Arrows */}
          {products.length > 0 && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentIndex <= 0}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                {isNew ? 'New Product' : `${currentIndex + 1} / ${products.length}`}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= products.length - 1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        {/* Product Form */}
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Type</label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., T-Shirt, Jeans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sales Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.salesPrice}
                  onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Rate (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., Cotton, Denim"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g., Red, Blue, Green"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Stock</label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Images (URL)</label>
                <Input
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images && (
                  <img
                    src={formData.images}
                    alt="Product preview"
                    className="mt-2 w-full h-48 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Published (if yes, display on website)
                </label>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Products;
