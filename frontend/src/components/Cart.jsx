import { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    totalItems,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        { cart, total: totalPrice }, // ✅ match Checkout.jsx payload
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Order placed successfully!");
      clearCart();
      navigate("/checkout"); // redirect to checkout page
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert(`❌ ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center mb-4 border-b pb-2"
            >
              <div className="flex items-center gap-4">
                {item.image && (
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `http://localhost:5000${item.image}`
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200"
                  >
                    -
                  </button>
                  <div className="px-4">{item.qty}</div>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <div className="w-28 text-right font-semibold">
                  ₹{(item.price * item.qty).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-lg">Items: {totalItems}</p>
              <p className="text-2xl font-bold">
                Total: ₹{totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>

              <button
                onClick={()=>navigate("/checkout")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
