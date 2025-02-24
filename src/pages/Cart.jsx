import { useState } from "react";
import ConfirmationModal from "../components/cart/ConfirmationModal";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [cartDetails, setCartDetails] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.sellprice * item.quantity,
    0
  );

  const handleProceedClick = () => {
    if (!token) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    const details = cart.map(({ id, quantity }) => ({
      id,
      quantity,
      totalPrice: totalAmount,
    }));

    setCartDetails(details);
    setIsOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="min-w-full border-collapse border">
            <thead>
              <tr>
                {[
                  "Ticker",
                  "Quantity",
                  "Selling Price",
                  "Total Price",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="border p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cart.map(({ id, ticker, quantity, sellprice }) => (
                <tr key={id}>
                  <td className="border p-2">{ticker}</td>
                  <td className="border p-2 flex items-center">
                    <button
                      className="px-2 py-1 bg-gray-300 rounded-l"
                      onClick={() =>
                        updateQuantity(id, Math.max(1, quantity - 1))
                      }
                    >
                      -
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-300 rounded-r"
                      onClick={() => updateQuantity(id, quantity + 1)}
                    >
                      +
                    </button>
                  </td>
                  <td className="border p-2">{sellprice}</td>
                  <td className="border p-2">{sellprice * quantity}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removeFromCart(id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Amount and Proceed to Payment Button */}
          <div className="mt-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Total Amount: ₹{totalAmount}
            </h3>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleProceedClick}
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        cartDetails={cartDetails}
      />
    </div>
  );
};

export default Cart;
