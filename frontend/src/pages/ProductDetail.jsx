import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = () => {
      try {
        // Get product from localStorage
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          const foundProduct = allProducts.find(p => p.id === parseInt(id));
          if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.colors) {
              const colorList = typeof foundProduct.colors === 'string' 
                ? foundProduct.colors.split(',').map(c => c.trim())
                : foundProduct.colors;
              if (colorList.length > 0) {
                setSelectedColor(colorList[0]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stockQuantity > 0) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="text-center py-12">Product not found</div>
      </div>
    );
  }

  const colors = product.colors 
    ? (typeof product.colors === 'string' 
        ? product.colors.split(',').map((c) => c.trim())
        : product.colors)
    : [];
  const sizes = product.sizes 
    ? (typeof product.sizes === 'string'
        ? product.sizes.split(',').map((s) => s.trim())
        : product.sizes)
    : [];
  const taxAmount = (product.salesPrice * quantity * product.taxRate) / 100;
  const total = product.salesPrice * quantity + taxAmount;

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary-600">All Products</Link>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category}`} className="hover:text-primary-600">
                {product.category}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full rounded-lg border border-gray-200"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="space-y-4 mb-6">
              <div>
                <span className="font-semibold">Category:</span> {product.category}
              </div>
              {product.type && (
                <div>
                  <span className="font-semibold">Type:</span> {product.type}
                </div>
              )}
              {product.material && (
                <div>
                  <span className="font-semibold">Material:</span> {product.material}
                </div>
              )}
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedColor === color
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                ₹{product.salesPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                Base: ₹{product.salesPrice.toFixed(2)} + Tax ({product.taxRate}%): ₹{taxAmount.toFixed(2)}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="mb-6">
              {product.stockQuantity > 0 ? (
                <span className="text-green-600 font-semibold">In Stock ({product.stockQuantity} available)</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stockQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-24"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-700"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;

