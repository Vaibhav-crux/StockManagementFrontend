import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";

const ConfirmationModal = ({ isOpen, onClose, cartDetails }) => {
  const { token } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!isOpen) {
      setStatus(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const formattedData = cartDetails?.map(
        ({ id, quantity, totalPrice }) => ({
          tick_id: id,
          purchase_price: totalPrice,
          purchase_qty: quantity,
        })
      );

      const response = await axios.post(
        `${baseURL}/place-order`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStatus("success");
        clearCart();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Payment request failed:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {status === "success" ? (
          <>
            <p className="text-lg font-semibold text-green-600">
              Purchase done successfully!
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              onClick={() => navigate("/")}
            >
              Go Back to Products
            </button>
          </>
        ) : status === "error" ? (
          <>
            <p className="text-lg font-semibold text-red-600">
              Got an error! Please try again.
            </p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">Confirm your order?</p>

            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={onClose}
                disabled={loading}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : "Yes"}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ConfirmationModal;
