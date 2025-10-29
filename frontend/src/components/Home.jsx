// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/CartContext"; // adjust path if needed
import { motion } from "framer-motion";
import { FiShoppingCart, FiMenu, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const categoriesList = [
  { id: "electronics", title: "Electronics", subtitle: "Gadgets & Accessories" },
  { id: "fashion", title: "Fashion", subtitle: "Clothes & Shoes" },
  { id: "home", title: "Home", subtitle: "Decor & Kitchen" },
  { id: "toys", title: "Toys", subtitle: "Toys & Games" },
];

const testimonials = [
  {
    name: "Riya S.",
    quote: "Amazing deals and fast delivery. ShopEasy saved me time and money!",
  },
  {
    name: "Amit K.",
    quote: "Loved the UI and simple flow. The cart works flawlessly.",
  },
  {
    name: "Priya M.",
    quote: "Customer support is really helpful. Highly recommended.",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin";
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setFlashMessage("Failed to load products. Try again later.");
      setTimeout(() => setFlashMessage(""), 3500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchProducts();

  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  setDarkMode(isDark);

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [token]);


  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p?.name?.toLowerCase()?.includes(search.toLowerCase())
  );

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  
  const handleAddToCart = (product) => {
    addToCart(product);
    setFlashMessage(`${product.name} added to cart!`);
    setTimeout(() => setFlashMessage(""), 3000);
  };

  
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFlashMessage("Product removed successfully!");
      setTimeout(() => setFlashMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setFlashMessage("Failed to delete product.");
      setTimeout(() => setFlashMessage(""), 3000);
    }
  };

  
  const toggleDarkMode = () => {
    const nowDark = !darkMode;
    setDarkMode(nowDark);
    if (nowDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen font-sans bg-gray-100 dark:bg-gray-900 transition-colors`}>
      
      {flashMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {flashMessage}
        </motion.div>
      )}

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              SS
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600 dark:text-white">Shopsy</h1>
              <p className="text-xs text-gray-500 dark:text-gray-300 -mt-1">Shop smarter</p>
            </div>
          </div>

          {/* Middle: Search (hidden on small screens) */}
          <div className="hidden md:flex flex-1 mx-6 items-center">
            <div className="flex items-center w-full bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2 shadow-sm">
              <FiSearch className="text-gray-500 dark:text-gray-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories, brands..."
                className="bg-transparent ml-3 outline-none w-full text-sm dark:text-gray-100"
              />
              <button
                onClick={() => {}}
                className="hidden md:inline-block ml-3 text-sm font-semibold text-blue-600 dark:text-blue-400"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FiMoon size={18} className="text-yellow-300" /> : <FiSun size={18} className="text-gray-700" />}
            </button>

            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              title="View cart"
            >
              <FiShoppingCart size={24} />
              {/* optional cart count bubble */}
              {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span> */}
            </div>

            <div className="hidden md:block">
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Open menu"
            >
              <FiMenu size={20} className="text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown (small) */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t">
            <div className="p-3 space-y-2">
              <button onClick={() => navigate("/login")} className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Register
              </button>
              <button onClick={() => navigate("/cart")} className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                Cart
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1350&q=80"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <div className="container mx-auto relative z-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold leading-tight"
              >
                Discover amazing products, <span className="text-yellow-300">every day</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-lg md:text-xl text-blue-100 max-w-xl"
              >
                ShopEasy brings you exclusive deals across categories — fast delivery, secure payments, and a delightful shopping experience.
              </motion.p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate("/home")}
                  className="px-5 py-3 bg-white text-blue-600 rounded-full font-semibold shadow hover:scale-105 transition"
                >
                  Shop Now
                </button>
               
              </div>
            </div>

            <div className="hidden md:block">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
                <div className="bg-white/10 rounded-2xl p-4 shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80" alt="product" className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900">Wireless Headphones</h4>
                        <p className="text-xs text-gray-600">Now at ₹1,499</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <img src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="product" className="w-full h-40 object-cover" />
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900">Stylish Sneakers</h4>
                        <p className="text-xs text-gray-600">From ₹999</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Featured Products</h3>
          <div>
            <button onClick={() => setSearch("")} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Clear Search</button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-300 py-12">
                No products found. Try adjusting your search or browse categories.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ translateY: -6 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={product.image ? `http://localhost:5000${product.image}` : "https://via.placeholder.com/600x400?text=Product"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">-{product.discount}%</div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{product.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.color || "Various colors"}</p>

                    <div className="mt-3 flex items-center gap-2">
                      {/* Rating: simple visual */}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((i) =>
                          i <= Math.round(product.rating || 4) ? (
                            <AiFillStar key={i} className="text-yellow-400" />
                          ) : (
                            <AiOutlineStar key={i} className="text-gray-300" />
                          )
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">({product.reviews || 10})</div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-blue-600 font-bold text-lg">
                          ₹{product.price - (product.price * (product.discount || 0)) / 100}
                        </div>
                        {product.discount > 0 && (
                          <div className="text-xs line-through text-gray-400">₹{product.price}</div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 w-40">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
                        >
                          Add to Cart
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">What our customers say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
              >
                <p className="text-gray-600 dark:text-gray-300 italic">"{t.quote}"</p>
                <h4 className="mt-4 font-semibold text-blue-600 dark:text-blue-400">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Join our community</h3>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto">Sign up to receive exclusive offers and early access to new arrivals.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate("/register")} className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold">Create account</button>
            <button onClick={() => navigate("/offers")} className="px-6 py-3 border border-white text-white rounded-full font-semibold">View offers</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">SE</div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">ShopEasy</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shop smarter, faster, easier.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Customer care: support@shopeasy.example</p>
          </div>

          <div>
            <h5 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Quick Links</h5>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => navigate("/")} className="hover:underline">Home</button></li>
              <li><button onClick={() => navigate("/products")} className="hover:underline">Products</button></li>
              <li><button onClick={() => navigate("/contact")} className="hover:underline">Contact</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Stay in touch</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Subscribe to our newsletter for updates and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="px-3 py-2 rounded-l-md border border-r-0 w-full text-sm dark:bg-gray-800 dark:text-gray-100" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} ShopEasy. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
