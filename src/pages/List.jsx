import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import Header from "../components/header/Header";
import { useCart } from "../context/CartContext";
import { Input } from "../components/ui/Input";
import ViewStockModal from "../components/productList/ViewStockModal";

const List = () => {
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const url = `${baseURL}/tickers?skip=${skip}&limit=${limit}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result.tickers_with_dates || []);
      setFilteredData(result.tickers_with_dates || []);
      setTotal(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData, startDate, endDate]);

  useEffect(() => {
    setFilteredData(
      data.filter(({ ticker }) =>
        ticker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data]);

  const handleCart = useCallback((item) => {
    addToCart(item);
  }, []);

  const handleNextPage = () => {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  };

  const handlePrevPage = () => {
    if (skip - limit >= 0) {
      setSkip(skip - limit);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (endDate && newStartDate > endDate) {
      alert("Start date cannot be greater than End date!");
      return;
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;

    setEndDate(newEndDate);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleRowClick = (item) => {
    navigate(`/ticker/${item.id}`);
  };

  const handleStockClick = (item) => {
    setIsStockOpen(true);
    setSelectedStock(item);
  };

  return (
    <>
      <Header />
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-4 mb-2 w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 p-2 !w-1/2"
            variant="outline"
          />
          <div className="flex w-7/12 gap-4">
            <Input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="p-2 border rounded !bg-[#151515]"
            />
            <Input
              type="date"
              value={endDate}
              min={startDate}
              onChange={handleEndDateChange}
              className="p-2 border rounded !bg-[#151515]"
            />
            <button onClick={handleReset}> Reset</button>
          </div>
        </div>
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center ">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          )}
          <table className="w-full border-collapse border">
            <thead>
              <tr className="">
                {[
                  "TICKER",
                  "SELL QTY",
                  "SELL PRICE",
                  "LTP",
                  "Dates",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="border p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  {[
                    item.ticker,
                    item.sellqty,
                    item.sellprice,
                    item.ltp,
                    item.dates,
                  ].map((value, index) => (
                    <td key={index} className="border p-2">
                      {value}
                    </td>
                  ))}
                  <td className="border p-2 flex justify-between">
                    {cart.some((cartItem) => cartItem.id === item.id) ? (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => navigate("/cart")}
                      >
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => handleCart(item)}
                      >
                        Add to Cart
                      </button>
                    )}

                    <button onClick={() => handleRowClick(item)}>
                      view history
                    </button>
                    <button onClick={() => handleStockClick(item)}>OHL</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={skip === 0}
            className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {Math.ceil(skip / limit) + 1} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={skip + limit >= total}
            className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <ViewStockModal
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        stock={selectedStock}
      />
    </>
  );
};

export default List;
