import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext); // ✅ Access addToCart from context

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{ border: "1px solid #ccc", padding: "10px" }}
          >
            <img
              src={`http://localhost:5000/uploads/${product.image}`} // ✅ fixed path
              alt={product.name}
              width="150"
            />
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Color: {product.color}</p>
            <p>Discount: {product.discount}%</p>

            {/* ✅ Add to Cart button */}
            <button
              onClick={() => addToCart(product)}
              style={{
                background: "green",
                color: "white",
                padding: "5px 10px",
                marginTop: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
