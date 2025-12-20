import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    material: '',
    color: '',
    minPrice: '',
    maxPrice: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - replace with actual API
    // Show only published products
    const fetchProducts = async () => {
      try {
        // const response = await api.get('/products?published=true');
        // setProducts(response.data);
        
        // Get products from localStorage (shared with admin)
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          // Filter to show only published products
          const publishedProducts = allProducts.filter((p) => p.published === true);
          setProducts(publishedProducts);
          setFilteredProducts(publishedProducts);
        } else {
          // If no products in storage, show empty or default
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.size) {
      filtered = filtered.filter((p) => p.sizes?.includes(filters.size));
    }
    if (filters.material) {
      filtered = filtered.filter((p) => p.material === filters.material);
    }
    if (filters.color) {
      filtered = filtered.filter((p) => p.colors?.includes(filters.color));
    }
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.salesPrice >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.salesPrice <= parseFloat(filters.maxPrice));
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.salesPrice - b.salesPrice;
      if (sortBy === 'price-desc') return b.salesPrice - a.salesPrice;
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, filters, searchTerm, sortBy]);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const sizes = [...new Set(products.flatMap((p) => p.sizes?.split(',') || []).map((s) => s.trim()))];
  const materials = [...new Set(products.map((p) => p.material).filter(Boolean))];
  const colors = [...new Set(products.flatMap((p) => p.colors?.split(',') || []).map((c) => c.trim()))];

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span>All Products</span>
        </nav>

        <div className="flex gap-8">
          {/* Left Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.size}
                  onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                >
                  <option value="">All Sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.material}
                  onChange={(e) => setFilters({ ...filters, material: e.target.value })}
                >
                  <option value="">All Materials</option>
                  {materials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.color}
                  onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                >
                  <option value="">All Colors</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-lg">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ml-4">
                <select
                  className="border border-gray-300 rounded-md px-4 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No products found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-primary-600 font-bold text-xl mb-2">
                        ${product.salesPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.stockQuantity > 0 ? (
                          <span className="text-green-600">In Stock</span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;

