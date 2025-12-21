import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useEffect, useState } from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        {/* Hero Section */}
<section className="py-24 sm:py-32">
  <div className="mx-auto max-w-screen-xl px-4">
    <div className="grid items-center gap-12 lg:grid-cols-2">

      {/* LEFT: TEXT (same as now, just left-aligned) */}
      <div className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
          Welcome to <br />
          ApparelDesk
        </h1>

        <p className="max-w-xl text-xl text-muted-foreground sm:text-2xl">
          Your one-stop shop for quality apparel. Discover style, comfort, and elegance.
        </p>

        <div className="flex gap-4 pt-4">
          <Button size="lg" asChild>
            <Link to="/shop">Shop Now</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="hidden lg:flex justify-center">
        <img
          src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg"
          alt="Clothing"
          className="h-[420px] w-[520px] object-cover rounded-lg"
        />
      </div>

    </div>
  </div>
</section>
      </main>
    </div>
  );
};

export default Home;