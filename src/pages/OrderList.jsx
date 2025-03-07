import React, { useState, useEffect, useCallback } from "react";
import Table from "../components/ui/Table";
import { useParams } from "react-router";
import Header from "../components/header/Header";
import { Input } from "../components/ui/Input";

const OrderList = () => {
  const columns = [
    { key: "ltp", label: "LTP" },
    { key: "sellprice", label: "SELL PRICE" },
    { key: "sellqty", label: "SELL QTY" },
    { key: "ltq", label: "LTQ" },
    { key: "date", label: "Dates" },
    { key: "time", label: "Time" },
  ];

  const { id } = useParams(); // Get the tick_id from the URL
  const [total, setTotal] = useState(0);
  const [interval, setInterval] = useState("");
  const [data, setData] = useState(""); // Ticker name
  const [tickerData, setTickerData] = useState([]); // Orders list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [noDataFound, setNoDataFound] = useState(false); // New state to track "no data" case
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchData = useCallback(
    async ({ skip, limit }) => {
      setLoading(true);
      setError(null);
      setNoDataFound(false); // Reset no data found state
      try {
        const baseUrl = `${baseURL}/tickers/${id}?skip=${skip}&limit=${limit}`;
        const url = interval ? `${baseUrl}&interval=${interval}` : baseUrl;
        console.log("Fetching orders from:", url);
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            // Treat 404 as "no data found" instead of an error
            setTotal(0);
            setData("");
            setTickerData([]);
            setNoDataFound(true);
            return [];
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API response:", result);
        setTotal(result.total || 0);
        setData(result.ticker || "");
        const orders = result.orders || [];
        setTickerData(orders);
        setNoDataFound(orders.length === 0); // Set no data found if orders array is empty
        return orders;
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setTickerData([]);
        setNoDataFound(false);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [id, interval, baseURL]
  );

  // Fetch data only once on mount or when `id` or `fetchData` changes
  useEffect(() => {
    console.log("Running useEffect to fetch data");
    fetchData({ skip: 0, limit: 10 });
  }, [id, fetchData]); // Depend on `id` and `fetchData` to refetch when the ticker or interval changes

  const handleNextPage = () => {
    if (skip + limit < total) {
      const newSkip = skip + limit;
      setSkip(newSkip);
      fetchData({ skip: newSkip, limit });
    }
  };

  const handlePrevPage = () => {
    if (skip - limit >= 0) {
      const newSkip = skip - limit;
      setSkip(newSkip);
      fetchData({ skip: newSkip, limit });
    }
  };

  const resetFilter = () => {
    setInterval("");
    setSkip(0);
    fetchData({ skip: 0, limit: 10 });
  };

  return (
    <div>
      <Header />
      <div className="px-10 bg-[#151515]">
        <div className="py-4 flex justify-center">
          <div className="text-3xl font-bold mb-4 w-[55%] flex justify-between">
            <h1>{data}</h1>
            <h1>History</h1>
          </div>
          <div className="flex items-center justify-end w-[45%]">
            <span className="font-semibold mr-4">Interval:</span>
            <Input
              type="number"
              value={interval}
              onChange={(e) =>
                setInterval(
                  e.target.value
                    ? Math.min(1000, Math.max(1, Number(e.target.value)))
                    : ""
                )
              }
              className="!w-full"
              variant="outline"
              min="1"
              max="1000"
            />
            <span className="">/min</span>
            <button
              onClick={resetFilter}
              className="ml-2 p-2 bg-red-500 text-white rounded"
            >
              Reset
            </button>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}
        {!loading && !error && noDataFound && (
          <div className="text-white text-center mb-4">
            No Data Found
          </div>
        )}
        {!loading && !error && !noDataFound && (
          <>
            <Table
              data={tickerData} // Pass the fetched orders directly
              columns={columns}
              itemsPerPage={limit}
              searchable={false}
              selectable={false}
              exportable={false}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevPage}
                disabled={skip === 0}
                className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {Math.ceil(skip / limit) + 1} of{" "}
                {Math.ceil(total / limit)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={skip + limit >= total}
                className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;