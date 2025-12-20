// Initialize dummy data in localStorage
export const initializeDummyData = () => {
  // Initialize products if they don't exist
  if (!localStorage.getItem('products')) {
    const defaultProducts = [
      {
        id: 1,
        name: 'Classic T-Shirt',
        category: 'Shirts',
        salesPrice: 29.99,
        purchasePrice: 15.00,
        taxRate: 18,
        stockQuantity: 50,
        published: true,
        description: 'A comfortable and stylish classic t-shirt made from premium cotton.',
        type: 'T-Shirt',
        material: 'Cotton',
        colors: 'Red,Blue,Green',
        sizes: 'S,M,L,XL',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      },
      {
        id: 2,
        name: 'Denim Jeans',
        category: 'Pants',
        salesPrice: 79.99,
        purchasePrice: 40.00,
        taxRate: 18,
        stockQuantity: 30,
        published: true,
        description: 'Classic denim jeans with perfect fit and comfort.',
        type: 'Jeans',
        material: 'Denim',
        colors: 'Blue,Black',
        sizes: 'S,M,L,XL',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      },
      {
        id: 3,
        name: 'Cotton Hoodie',
        category: 'Shirts',
        salesPrice: 59.99,
        purchasePrice: 30.00,
        taxRate: 18,
        stockQuantity: 25,
        published: true,
        description: 'Warm and cozy cotton hoodie for casual wear.',
        type: 'Hoodie',
        material: 'Cotton',
        colors: 'Gray,Black,White',
        sizes: 'M,L,XL',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
      },
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }

  // Initialize users if they don't exist
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: 1,
        name: 'John Customer',
        email: 'customer@demo.com',
        password: 'customer123',
        mobile: '123-456-7890',
        address: '123 Customer St, City, State',
        isAdmin: false,
        role: 'customer',
      },
      {
        id: 2,
        name: 'Jane Seller',
        email: 'seller@demo.com',
        password: 'seller123',
        mobile: '987-654-3210',
        address: '456 Seller Ave, City, State',
        isAdmin: true,
        role: 'seller',
      },
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
};

