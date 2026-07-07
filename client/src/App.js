import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider }  from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Navbar  from "./components/Navbar/Navbar";
import Footer  from "./components/Footer/Footer";

// Pages
import Home     from "./pages/Home/Home";
import Shop     from "./pages/Shop/Shop";
import Product  from "./pages/Product/Product";
import Cart     from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Account  from "./pages/Account/Account";
import About    from "./pages/About/About";
import Contact  from "./pages/Contact/Contact";
import Blog     from "./pages/Blog/Blog";
import BlogPost from "./pages/Blog/BlogPost";
import SubmitBlog from "./pages/Blog/SubmitBlog";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          {/* dark: classes apply when <html> has class="dark" */}
          <div className="flex flex-col min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/shop"          element={<Shop />} />
                <Route path="/product/:id"   element={<Product />} />
                <Route path="/cart"          element={<Cart />} />
                <Route path="/checkout"      element={<Checkout />} />
                <Route path="/account"       element={<Account />} />
                <Route path="/about"         element={<About />} />
                <Route path="/contact"       element={<Contact />} />
                <Route path="/blog"          element={<Blog />} />
                <Route path="/blog/submit"   element={<SubmitBlog />} />
                <Route path="/blog/:slug"    element={<BlogPost />} />
                <Route path="/admin"         element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
