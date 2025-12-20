import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome to ApparelDesk
              </h1>
              <p className="text-xl text-muted-foreground sm:text-2xl">
                Your one-stop shop for quality apparel. Discover style, comfort, and elegance.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/shop">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Us</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Experience the best in quality, service, and style
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="p-8 text-center border-2 hover:border-primary/50 transition-colors">
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Quick and reliable shipping to your doorstep</p>
              </Card>
              <Card className="p-8 text-center border-2 hover:border-primary/50 transition-colors">
                <div className="text-5xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-muted-foreground">Safe and secure transactions guaranteed</p>
              </Card>
              <Card className="p-8 text-center border-2 hover:border-primary/50 transition-colors">
                <div className="text-5xl mb-4">↩️</div>
                <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                <p className="text-muted-foreground">Hassle-free return policy for your peace of mind</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
