import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import { motion } from "framer-motion"
import { FiShoppingCart } from "react-icons/fi"; 

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("role") === "admin";
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      setFlashMessage("Product removed successfully!");
      setTimeout(() => setFlashMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative font-sans">
      {/* Flash Message */}
      {flashMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {flashMessage}
        </motion.div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-blue-600">ShopEasy</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-300"
            />
          
        <div
    onClick={() => navigate("/cart")}
    className="cursor-pointer ml-4 text-gray-700 hover:text-blue-600 transition duration-300"
  >
    <FiShoppingCart size={28} />
  </div>

            
            {(
              <button
                onClick={() => navigate("/add-product")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md transition-all duration-300 flex items-center gap-2"
              >
                ➕ Add Product
              </button>
              
            )}
              <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md transition-all duration-300"
            >
              Logout
              </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-32 text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1350&q=80"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            Welcome to ShopEasy!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl drop-shadow-md"
          >
            Discover amazing products at unbeatable prices
          </motion.p>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto py-12">
        <h3 className="text-3xl font-bold mb-8 text-gray-800">Featured Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="w-full h-52 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h4 className="font-semibold text-lg">{product.name}</h4>
              <p className="text-gray-500 text-sm mb-1">Color: {product.color}</p>
              {product.discount > 0 && (
                <p className="text-red-500 font-semibold mb-1">-{product.discount}% OFF</p>
              )}
              <p className="text-blue-600 font-bold text-lg mb-4">
                ₹{product.price - (product.price * product.discount) / 100}
              </p>
              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-blue-500 shadow-lg transition-all duration-300 font-semibold"
                >
                  Add to Cart
                </button>
                { (
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg hover:from-pink-500 hover:to-red-500 shadow-lg transition-all duration-300 font-semibold"
                  >
                    Delete Product
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 shadow-inner py-6 mt-12">
        <p className="text-center text-gray-600">&copy; 2025 ShopEasy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
