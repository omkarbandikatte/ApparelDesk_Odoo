import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartSubtotal, getCartTax, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <svg className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart to get started</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const discount = 0; // Will be applied at checkout
  const total = getCartTotal() - discount;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title>Cart Items ({cart.length})</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {cart.map((item) => {
                    const itemSubtotal = item.salesPrice * item.quantity;
                    const itemTax = itemSubtotal * (item.taxRate / 100);
                    const itemTotal = itemSubtotal + itemTax;
                    
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <img
                          src={item.imageUrl || item.images || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Tax: {item.taxRate}%</p>
                          <p className="text-primary font-semibold mt-1">₹{item.salesPrice.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-muted-foreground">Qty:</label>
                            <Input
                              type="number"
                              min="1"
                              max={item.stockQuantity || 999}
                              value={item.quantity}
                              onChange={(e) => {
                                const qty = parseInt(e.target.value) || 1;
                                updateQuantity(item.id, qty);
                              }}
                              className="w-20"
                            />
                          </div>
                          <div className="text-right min-w-[100px]">
                            <p className="font-semibold">₹{itemTotal.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{itemSubtotal.toFixed(2)} + ₹{itemTax.toFixed(2)} tax
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <Card.Header>
                <Card.Title>Order Summary</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" asChild className="w-full mt-3">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </Card.Content>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;

