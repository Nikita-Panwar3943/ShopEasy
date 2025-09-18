import { useContext, useState } from "react";
import { CartContext } from "../components/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // default = Cash on Delivery
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        { cart, paymentMethod, total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Order placed successfully!");
      clearCart();
      navigate("/"); // redirect to home after order
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {/* Cart Summary */}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b py-2"
            >
              <p>
                {item.name} x {item.qty}
              </p>
              <p>₹{item.price * item.qty}</p>
            </div>
          ))}

          <h3 className="text-xl font-bold mt-4">Total: ₹{total}</h3>

          {/* Payment Options */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Select Payment Method:</h4>
            <div className="flex flex-col space-y-2">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                UPI / Wallet
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Credit / Debit Card
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handleOrder}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
