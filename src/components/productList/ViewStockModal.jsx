import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import axios from "axios";

const ViewStockModal = ({ isOpen, onClose, stock }) => {
  const [loading, setLoading] = useState(false);
  const [stockDetail, setStockDetail] = useState([]);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const url = `${baseURL}/ohlc?ticker=${stock.ticker}`;
      const res = await axios.get(url);
      setStockDetail(res?.data);
    } catch (error) {
      setError(error || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && stock?.ticker) {
      fetchStockData();
    }
  }, [isOpen, stock?.ticker]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : stockDetail.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold">Stock Detail</h2>
            <ul className="mt-2">
              {Object.entries(stockDetail[0]).map(([key, value]) => (
                <li key={key} className="border-b py-1">
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>No data available</div>
        )}
      </Modal>
    </>
  );
};

export default ViewStockModal;
